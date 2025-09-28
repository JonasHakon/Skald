import {useEffect, useMemo, useState} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import {Layout} from '../components/Layout'
import {sanity} from '../api/sanityClient'
import {urlFor, isImageRef} from '../api/image'
import type {ImageRef, Slug} from '../types'

type PersonCard = {
  _id: string
  name: string
  slug?: Slug
  role?: string
  picture?: ImageRef
}

type RoleFilter = 'all' | 'actor' | 'director' | 'crew'

const ALL_PEOPLE_QUERY = `
*[_type=="person"]|order(name asc){
  _id, name, role, "slug": slug,
  picture{ _type, asset }
}
`

export function PeopleList() {
  const [allPeople, setAllPeople] = useState<PersonCard[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const role = (searchParams.get('role') as RoleFilter) || 'all'
  const q = searchParams.get('q') || ''
  const page = Number(searchParams.get('page') || 1)

  const pageSize = 24

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    sanity.fetch<PersonCard[]>(ALL_PEOPLE_QUERY)
      .then(list => { if (active) setAllPeople(list) })
      .catch(() => active && setError('Failed to load people'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return allPeople.filter(p => {
      const roleOk = role === 'all' || (p.role || '').toLowerCase().includes(role)
      const queryOk = !query || p.name.toLowerCase().includes(query)
      return roleOk && queryOk
    })
  }, [allPeople, role, q])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(Math.max(page, 1), totalPages)
  const offset = (safePage - 1) * pageSize
  const items = filtered.slice(offset, offset + pageSize)

  return (
    <Layout>
      <section className="page-section">
        <header className="page-section">
          <h1 className="page-title">People</h1>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <RoleTabs value={role} onChange={(v) => setSearchParams({role: v, q, page: '1'})} />
            <SearchBox value={q} onChange={(text) => setSearchParams({role, q: text, page: '1'})} />
          </div>
        </header>

        {loading && <p className="loading">Loading…</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-3">
              {items.map(p => <PersonCardItem key={p._id} person={p} />)}
            </div>

            <Pager
              page={safePage}
              totalPages={totalPages}
              onPage={(p) => setSearchParams({role, q, page: String(p)})}
            />
          </>
        )}
      </section>
    </Layout>
  )
}

function RoleTabs({value, onChange}: {value: RoleFilter; onChange: (v: RoleFilter) => void}) {
  const tab = (v: RoleFilter, label: string) => (
    <button
      className={`btn ${value === v ? '' : 'opacity-50'}`}
      onClick={() => onChange(v)}
    >
      {label}
    </button>
  )
  return (
    <div className="flex gap-2">
      {tab('all', 'All')}
      {tab('actor', 'Actors')}
      {tab('director', 'Directors')}
      {tab('crew', 'Crew')}
    </div>
  )
}

function SearchBox({value, onChange}: {value: string; onChange: (v: string) => void}) {
  return (
    <input
      className="input"
      placeholder="Search name…"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

function PersonCardItem({person}: {person: PersonCard}) {
  const img = isImageRef(person.picture)
    ? urlFor(person.picture).width(600).height(400).fit('crop').url() // 3:2 media
    : undefined
  const slug = person.slug?.current
  return (
    <article className="card">
      {img && <img src={img} alt={person.name} className="card-media" loading="lazy" />}
      <div className="card-body">
        <h3 className="card-title">
          {slug ? <Link className="link" to={`/people/${slug}`}>{person.name}</Link> : person.name}
        </h3>
        {person.role && <p className="card-subtitle">{person.role}</p>}
      </div>
    </article>
  )
}

function Pager({page, totalPages, onPage}: {page: number; totalPages: number; onPage: (p: number) => void}) {
  if (totalPages <= 1) return null
  return (
    <div className="flex items-center justify-center gap-2">
      <button className="btn" disabled={page<=1} onClick={() => onPage(page-1)}>Prev</button>
      <span className="text-sm">Page {page} / {totalPages}</span>
      <button className="btn" disabled={page>=totalPages} onClick={() => onPage(page+1)}>Next</button>
    </div>
  )
}