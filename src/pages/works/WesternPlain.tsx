// src/pages/works/WesternPlain.tsx
import {Navigation} from '../../components/Navigation'
import {Gallery} from '../../components/Gallery'
import type {Work} from '../../types'
import '../../styles/WorkDetailed.css'

const TextOne = `Placeholder text for Western Plain gallery section one.`
const TextTwo = `Placeholder text for Western Plain gallery section two.`

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

export function WesternPlain({ work, loading, error }: { work: Work | null; loading: boolean; error: string | null }) {
  return (
    <Navigation className="work-detailed">
      <div className="graphic graphic 1"></div>
      <section className="page-section header-text">
          <h1>OUT ON THE WESTERN PLAIN</h1>
      </section>
      <section className="page-section gallery-1">
        <Gallery items={work?.gallery1 ?? []} text={TextOne} reversed={false} />
      </section>
      <section className="page-section cast-list">
        <div className='cast-box'>
          <div className='left-column'>
            <h1>WESTERN PLAIN</h1>
            <h2>{work?.author?.toUpperCase() || 'AUTHOR'}</h2>
            <p>&nbsp;</p>
            <h1>CREATIVE TEAM</h1>
            <div className='role-list'>  
              <h3>DIRECTOR</h3>
              <p>TBD</p>
              <h3>MUSIC</h3>
              <p>TBD</p>
              <h3>LIGHTING</h3>
              <p>TBD</p>
            </div>
          </div>
          <div className='right-column'>
            <h1>&nbsp;</h1>
            <h2>&nbsp;</h2>
            <p>{work?.date || 'TBD'}</p>
            <h1>CAST</h1>
            <div className='role-list'>  
              <h3>ROLE 1</h3>
              <p>TBD</p>
              <h3>ROLE 2</h3>
              <p>TBD</p>
            </div>
          </div>
        </div>
      </section>
      <section className="page-section gallery-2">
        <Gallery items={work?.gallery2 ?? []} text={TextTwo} reversed={true} />
      </section>
      <section className="page-section video-section">
        {loading && <p className="loading">Loading…</p>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && work && toEmbed(work.videoLink) && (
          <iframe
            className="video-embed"
            src={toEmbed(work.videoLink)}
            title="Production video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </section>
    </Navigation>
  )
}
