// src/pages/WorkDetailed.tsx
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {sanity} from '../api/sanityClient'
import type {Work} from '../types'
import {HuisClos} from './works/HuisClos'
import {WesternPlain} from './works/WesternPlain'
import {Navigation} from '../components/Navigation'

const QUERY = `
*[_type == "work" && slug.current == $slug][0]{
  _id,
  name,
  "slug": slug,
  venue,
  author,
  date,
  picture,
  gallery1,
  gallery2,
  description1,
  description2,
  purchaseLink,
  videoLink
}
`;

export function WorkDetailed() {
  const {slug} = useParams()
  const [work, setWork] = useState<Work | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    sanity.fetch<Work>(QUERY, {slug})
      .then((data) => { if (active) setWork(data ?? null) })
      .catch(() => { if (active) setError('Failed to load') })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [slug])

  if (slug === 'huis-clos') {
    return <HuisClos work={work} loading={loading} error={error} />
  }

  if (slug === 'western-plain') {
    return <WesternPlain work={work} loading={loading} error={error} />
  }

  return (
    <Navigation className="work-detailed">
      <div className="page-section">
        {loading && <p className="loading">Loading…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && !work && <p className="error">Work not found</p>}
        {!loading && !error && work && (
          <div>
            <h1>{work.name}</h1>
            <p>This work does not have a custom page yet.</p>
          </div>
        )}
      </div>
    </Navigation>
  )
}
