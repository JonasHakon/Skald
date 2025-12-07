import {urlFor, isImageRef} from '../api/image'
import type {WorkCard} from '../types'

export function WorkCards({ items }: { items?: WorkCard[] | null }) {
  if (!items?.length) return null
  return (
    <section className="work-page-section">
      <div>
        {items.map((w, i) => {
          const img = isImageRef(w.picture) ? urlFor(w.picture).width(800).fit('max').url() : undefined
          const s = w.slug?.current
          return (
            <article key={`${w.name}-${i}`} className="work-card">
              <a href={s}>
                {img && <img src={img} alt={w.name} className="work-card-image" loading="lazy" />}
              </a>
            </article>
          )
        })}
      </div>
    </section>
  )
}
