// src/pages/PeopleDetailed.tsx
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Navigation} from '../components/Navigation'
import {sanity} from '../api/sanityClient'
import {urlFor, isImageRef} from '../api/image'
import type {WorkCard, Artist} from '../types'
import '../styles/Artist.css'
import { WorkCards } from '../components/WorkCards'


// ---- GROQ ---------------------------------------------------------------

const PERSON_QUERY = `
*[_type=="person" && slug.current==$slug][0]{
  _id ,name ,firstName, lastName, description,
  "slug": slug,
  picture{ _type, asset },
  secondPicture{ _type, asset },
  signaturePicture{ _type, asset },
  height, eyeColor, hair
}
`

// Pull works where this person is involved (actor/director/crew)
const WORKS_FOR_PERSON = `
*[_type == "work" && ($id in actors[]._ref || director._ref == $id || $id in crew[]._ref)]
  | order(date desc){
    name,
    description,
    // If author is a reference, resolve to the person's name; if it's already a string, return it as-is
    "author": coalesce(author->name, author),
    slug,
    picture{ _type, asset }
  }
`

// ---- Component ----------------------------------------------------------

export function ArtistDetailed() {
  const {slug} = useParams()
  const [person, setPerson] = useState<Artist | null>(null)
  const [works, setWorks] = useState<WorkCard[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setLoading(true)
        const p = await sanity.fetch<Artist>(PERSON_QUERY, {slug})
        if (!p) throw new Error('Not found')
          if (!active) return
        setPerson(p)

        const w = await sanity.fetch<WorkCard[]>(WORKS_FOR_PERSON, {id: p._id})
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
    <Navigation className='artist-page dark-theme'>
      <section className="page-section">
        {loading && <p className="loading">Loading…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && person && (
          <>
            <header className='page-section'>
              <div className='top-section'>
                <div className='left-cloumn'>
                  <div className='picture-section'>
                    {/* First Picture */}
                    <div className='firs-picture-row'>
                      {isImageRef(person.picture) && (
                        <img src={urlFor(person.picture).width(590).height(470).fit('crop').url()} className='first-picture' alt={person.name} loading="lazy" />
                      )}
                      {/* Quick facts if present */}
                      {(person.height || person.eyeColor || person.hair) && (
                        <dl>
                          <div className='height'>
                            {person.height ? (<><dt>Height</dt><dd>{person.height} cm</dd></>) : null}
                          </div>
                          <div className='hair'>
                            {person.hair ? (<><dt>Hair</dt><dd>{person.hair}</dd></>) : null}
                          </div>
                          <div className='eye-color'>
                            {person.eyeColor ? (<><dt>Eye color</dt><dd>{person.eyeColor}</dd></>) : null}
                          </div>
                        </dl>
                      )}
                    </div>
                    {/* Second picture */}
                    {isImageRef(person.secondPicture) && (
                      <img src={urlFor(person.secondPicture).width(340).height(270).fit('crop').url()} className='second-picture' alt={`${person.name} – second`} loading="lazy"/>
                    )}
                  </div>
                </div>
                <div className='right-column'>
                  {person.description && ( <p>{person.description}</p> )}
                </div>
              </div>
              <div className='artist-name'>
                <h1 className="first-name">{person.firstName}</h1>
              </div>
            </header>
            <div className='portfolio'>
              <h1 className="last-name">{person.lastName}</h1>
            
              {works && (
                <div className="page-section">
                  <WorkCards items={works} />
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </Navigation>
  )
}