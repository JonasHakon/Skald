import {useEffect, useMemo, useState} from 'react'
import {Link, useSearchParams} from 'react-router-dom'
import {Layout} from '../components/Layout'
import {sanity} from '../api/sanityClient'
import {urlFor, isImageRef} from '../api/image'
import type {ImageRef, Slug} from '../types'

type WorkCard = {
  _id: string
  name: string
  slug?: Slug
  date?: string
  venue?: string
  picture?: ImageRef
}

type Status = 'all' | 'upcoming' | 'past'

const QUERY = `
*[
  _type=="work" &&
  (
    $status == "all" ||
    ($status == "upcoming" && date >= now()) ||
    ($status == "past" && date < now())
  )
]|order(date desc)[$offset...$end]{
  _id, name, "slug": slug, date, venue,
  picture{ _type, asset }
}
`

const COUNT_QUERY = `
count(*[
  _type=="work" &&
  (
    $status == "all" ||
    ($status == "upcoming" && date >= now()) ||
    ($status == "past" && date < now())
  )
])
`

export function WorkList() {
  const [items, setItems] = useState<WorkCard[]>([])
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const status = (searchParams.get('status') as Status) || 'all'
  const page = Number(searchParams.get('page') || 1)
  const pageSize = 12
  const offset = useMemo(() => (page - 1) * pageSize, [page])
  const end = offset + pageSize

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(null)
    Promise.all([
      sanity.fetch<WorkCard[]>(QUERY, {status, offset, end}),
      sanity.fetch<number>(COUNT_QUERY, {status}),
    ])
      .then(([list, count]) => {
        if (!active) return
        setItems(list)
        setTotal(count)
      })
      .catch(() => active && setError('Failed to load works'))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [status, offset, end])

  const totalPages = total ? Math.max(1, Math.ceil(total / pageSize)) : 1

  return (
    <Layout>
      <section className="page-section">
        <header className="page-section">
          <h1 className="page-title">Works</h1>
          <StatusTabs value={status} onChange={(v) => {
            setSearchParams({status: v, page: '1'})
          }}/>
        </header>

        {loading && <p className="loading">Loading…</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <>
            <div className="grid grid-3">
              {items.map(w => <WorkCardItem key={w._id} work={w} />)}
            </div>

            <Pager
              page={page}
              totalPages={totalPages}
              onPage={(p) => setSearchParams({status, page: String(p)})}
            />
          </>
        )}
      </section>
    </Layout>
  )
}

function StatusTabs({value, onChange}: {value: Status; onChange: (v: Status) => void}) {
  const tab = (v: Status, label: string) => (
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
      {tab('upcoming', 'Upcoming')}
      {tab('past', 'Past')}
    </div>
  )
}

function WorkCardItem({work}: {work: WorkCard}) {
  const img = isImageRef(work.picture)
    ? urlFor(work.picture).width(900).height(600).fit('crop').url()
    : undefined
  const slug = work.slug?.current
  return (
    <article className="card">
      {img && <img src={img} alt={work.name} className="card-media" loading="lazy" />}
      <div className="card-body">
        <h3 className="card-title">
          {slug ? <Link className="link" to={`/works/${slug}`}>{work.name}</Link> : work.name}
        </h3>
        <p className="card-subtitle">{[work.venue, work.date].filter(Boolean).join(' · ')}</p>
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