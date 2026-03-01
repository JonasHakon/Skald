import {urlFor, isImageRef} from '../api/image'
import type {WorkCard} from '../types'

export function WorkCards({ items, artistName }: { items?: WorkCard[] | null, artistName?: string }) {
  if (!items?.length) return null
  return (
    <section className="work-page-section">
      <div>
        {items.map((w, i) => {
          const img = isImageRef(w.picture)
            ? urlFor(w.picture).width(800).fit('max').url()
            : undefined

          const slug = w.slug?.current
          const href = slug ? `/works/${slug}` : undefined
          
          const artistTestimony = artistName && w.testimonies
            ? w.testimonies.find(t => t.name === artistName)
            : null

          return (
            <article key={`${w.name}-${i}`} className="work-card">
              {href && (
                <a href={href}>
                  {img && (
                    <img
                      src={img}
                      alt={w.name}
                      className="work-card-image"
                      loading="lazy"
                    />
                  )}
                </a>
              )}
              {artistTestimony && (
                <div className="work-testimony">
                  <blockquote className="testimony-text">
                    "{artistTestimony.text}"
                  </blockquote>
                </div>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}
