// src/pages/PeopleDetailed.tsx
import {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import {Layout} from '../components/Layout'
import {sanity} from '../api/sanityClient'
import {urlFor, isImageRef} from '../api/image'
import type {ImageRef, Slug} from '../types'

// ---- Types ---------------------------------------------------------------

type Person = {
  _id: string
  name: string
  role?: string
  picture?: ImageRef
  description?: string
  slug?: Slug
}

type WorkCard = {
  name: string
  slug?: Slug
  date?: string
  venue?: string
  picture?: ImageRef
}

type WorksForPerson = {
  asActor: WorkCard[]
  asDirector: WorkCard[]
  asCrew: WorkCard[]
}

// ---- GROQ ---------------------------------------------------------------

const PERSON_QUERY = `
*[_type=="person" && slug.current==$slug][0]{
  _id, name, role, description,
  "slug": slug,
  picture{ _type, asset }
}
`

// Pull works where this person is involved (actor/director/crew)
const WORKS_FOR_PERSON = `
{
  "asActor": *[_type=="work" && $id in actors[]._ref]|order(date desc){
    name, "slug": slug, date, venue,
    picture{ _type, asset }
  },
  "asDirector": *[_type=="work" && director._ref==$id]|order(date desc){
    name, "slug": slug, date, venue,
    picture{ _type, asset }
  },
  "asCrew": *[_type=="work" && $id in crew[]._ref]|order(date desc){
    name, "slug": slug, date, venue,
    picture{ _type, asset }
  }
}
`

// ---- Component ----------------------------------------------------------

export function PeopleDetailed() {
  const {slug} = useParams()
  const [person, setPerson] = useState<Person | null>(null)
  const [works, setWorks] = useState<WorksForPerson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const p = await sanity.fetch<Person>(PERSON_QUERY, {slug})
        if (!p) throw new Error('Not found')
        if (!active) return
        setPerson(p)

        const w = await sanity.fetch<WorksForPerson>(WORKS_FOR_PERSON, {id: p._id})
        if (!active) return
        setWorks(w)
      } catch {
        if (active) setError('Failed to load')
      } finally {
        if (active) setLoading(false)
      }
    })()
    return () => { active = false }
  }, [slug])

  return (
    <Layout>
      <section className="page-section">
        {loading && <p className="loading">Loading…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && person && (
          <>
            <header className="page-section">
              <div className="flex items-center gap-6">
                {isImageRef(person.picture) && (
                  <img
                    src={urlFor(person.picture).width(300).height(300).fit('crop').url()}
                    alt={person.name}
                    className="w-32 h-32 object-cover rounded-lg"
                    loading="lazy"
                  />
                )}
                <div>
                  <h1 className="page-title">{person.name}</h1>
                  {person.role && <p className="page-subtitle">{person.role}</p>}
                </div>
              </div>
            </header>

            {person.description && <p className="page-section max-w-3xl">{person.description}</p>}

            {works && (
              <div className="page-section">
                <RoleSection title="As Director" items={works.asDirector} />
                <RoleSection title="As Actor" items={works.asActor} />
                <RoleSection title="As Crew" items={works.asCrew} />
              </div>
            )}
          </>
        )}
      </section>
    </Layout>
  )
}

// ---- Subcomponents ------------------------------------------------------

function RoleSection({title, items}: {title: string; items: WorkCard[]}) {
  if (!items?.length) return null
  return (
    <section className="page-section">
      <h2 className="page-title text-2xl">{title}</h2>
      <div className="grid grid-3">
        {items.map((w, i) => {
          const img = isImageRef(w.picture)
            ? urlFor(w.picture).width(600).fit('max').url()
            : undefined
          const s = w.slug?.current
          return (
            <article key={`${w.name}-${i}`} className="card">
              {img && <img src={img} alt={w.name} className="card-image" loading="lazy" />}
              <h3 className="card-title">
                {s ? <Link className="link" to={`/works/${s}`}>{w.name}</Link> : w.name}
              </h3>
              <p className="card-subtitle">{[w.venue, w.date].filter(Boolean).join(' · ')}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
