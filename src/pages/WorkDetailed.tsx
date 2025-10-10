// src/pages/WorkDetailed.tsx
import {useEffect, useState} from 'react'
import {useParams, Link} from 'react-router-dom'
import {Navigation} from '../components/Navigation'
import {sanity} from '../api/sanityClient'
import {urlFor, isImageRef} from '../api/image'
import type {Work, Artist} from '../types'

const QUERY = `
*[_type=="work" && slug.current==$slug][0]{
  _id, name, "slug": slug, description, date, venue, picture,
  purchaseLink, videoLink,
  director->{_id, name, "slug": slug, role, picture, description},
  actors[]->{_id, name, "slug": slug, role, picture, description},
  crew[]->{_id, name, "slug": slug, role, picture, description},
  reviews[]{rating, text, name},
  testimonies[]{text, name}
}`

function toEmbed(url?: string): string | undefined {
  if (!url) return undefined
  try {
    const u = new URL(url)
    if (u.hostname.includes('youtube.com') && u.searchParams.get('v')) {
      return `https://www.youtube.com/embed/${u.searchParams.get('v')}`
    }
    if (u.hostname === 'youtu.be') {
      return `https://www.youtube.com/embed/${u.pathname.replace('/', '')}`
    }
    if (u.hostname.includes('vimeo.com')) {
      const id = u.pathname.split('/').filter(Boolean).pop()
      return id ? `https://player.vimeo.com/video/${id}` : undefined
    }
    return url
  } catch {
    return undefined
  }
}

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

  return (
    <Navigation>
      <section className="page-section">
        {loading && <p className="loading">Loading…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && work && (
          <>
            <header className="page-section">
              <h1 className="page-title">{work.name}</h1>
              <p className="page-subtitle">
                {[work.venue, work.date].filter(Boolean).join(' · ')}
              </p>
            </header>

            {isImageRef(work.picture) && (
              <div className="page-section">
                <img
                  src={urlFor(work.picture).width(1200).fit('max').url()}
                  alt={work.name}
                  className="w-full max-w-4xl rounded-lg"
                  loading="lazy"
                />
              </div>
            )}

            {work.description && <p className="page-section max-w-3xl">{work.description}</p>}

            <PeopleSections work={work} />

            {(work.reviews?.length || work.testimonies?.length) ? (
              <div className="page-section">
                <div className="grid grid-2">
                  {!!work.reviews?.length && (
                    <div>
                      <h2 className="page-title text-xl">Reviews</h2>
                      <ul className="space-y-3">
                        {work.reviews.map((r, i) => (
                          <li key={i} className="card">
                            <p className="font-medium">Rating: {r.rating}/5</p>
                            <p className="italic">"{r.text}"</p>
                            <p className="text-sm opacity-70">— {r.name}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {!!work.testimonies?.length && (
                    <div>
                      <h2 className="page-title text-xl">Testimonies</h2>
                      <ul className="space-y-3">
                        {work.testimonies.map((t, i) => (
                          <li key={i} className="card">
                            <p className="italic">"{t.text}"</p>
                            <p className="text-sm opacity-70">— {t.name}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {toEmbed(work.videoLink) && (
              <div className="page-section">
                <div className="aspect-video max-w-4xl rounded-lg overflow-hidden">
                  <iframe
                    className="w-full h-full"
                    src={toEmbed(work.videoLink)}
                    title="Production video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {work.purchaseLink && (
              <div className="page-section">
                <a className="btn" href={work.purchaseLink} target="_blank" rel="noreferrer">
                  Get tickets
                </a>
              </div>
            )}
          </>
        )}
      </section>
    </Navigation>
  )
}

function PeopleSections({work}: {work: Work}) {
  return (
    <div className="page-section">
      <div className="grid grid-3">
        {work.director && (
          <div>
            <h2 className="page-title text-xl">Director</h2>
            <PersonCard p={work.director} />
          </div>
        )}
        {!!work.actors?.length && (
          <div>
            <h2 className="page-title text-xl">Cast</h2>
            <div className="grid gap-3">
              {work.actors!.map(p => <PersonCard key={p._id} p={p} />)}
            </div>
          </div>
        )}
        {!!work.crew?.length && (
          <div>
            <h2 className="page-title text-xl">Crew</h2>
            <div className="grid gap-3">
              {work.crew!.map(p => <PersonCard key={p._id} p={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function PersonCard({p}: {p: Artist}) {
  const slug = p.slug?.current
  const img = isImageRef(p.picture) ? urlFor(p.picture).width(200).height(200).fit('crop').url() : undefined
  return (
    <article className="card flex items-center gap-3">
      {img && <img src={img} alt={p.name} className="w-16 h-16 object-cover rounded" loading="lazy" />}
      <div>
        {slug ? <Link className="link font-medium" to={`/people/${slug}`}>{p.name}</Link> : <span className="font-medium">{p.name}</span>}
        {p.role && <div className="text-sm opacity-70">{p.role}</div>}
      </div>
    </article>
  )
}
