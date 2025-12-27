// src/pages/WorkDetailed.tsx
import {useEffect, useState} from 'react'
import {useParams} from 'react-router-dom'
import {Navigation} from '../components/Navigation'
import {sanity} from '../api/sanityClient'
import { Gallery } from '../components/Gallery'
import type {Work} from '../types'
import '../styles/WorkDetailed.css';

import huisClosHeader from '../assets/huisClos/huisclosHeader.png';
import castGroupPhoto from '../assets/huisClos/castgroupphoto.png';

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

const TextOne = 'Three strangers are escorted into a strange room by an unsettling hostess. They soon discover that they are locked together with no means of escape. As they confront one another, long buried truths being to surface and their masks begin to slip, revealing guilt, desire and self-deception. \n \n In this existential masterpiece, Jean-Paul Sartre crafts a chilling vision of damnation without flames or torture devices. A hell made entirely of other people. Huis Clos is a tense, unsettling exploration of the human psyche.';
const TextTwo = 'Each character was not merely assigned but fated to a primary colour. Primary colours are irreducible, the foundation of all others, echoing Sartre’s idea that identity is built from fundamental choices. In this space, the characters cannot blend, disguise, or escape the essential truths of who they are. \n \n Where the bronze ornament once stood, we introduced animal portraits. Inspired by Animal Farm, this choice underscores that appearances may shift, but true nature remains. The animals? unwavering gaze reinforces the play’s exploration of judgement, exposure, and the impossibility of hiding one’s authentic self.';

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
    <Navigation className="work-detailed">
      <div className="graphic graphic 1"></div>
      <section className="page-section header-text">
          <img src={huisClosHeader} alt='Huis Clos' />
      </section>
      <section className="page-section gallery-1">
        <Gallery items={work?.gallery1} text={TextOne} reversed={false} />
      </section>
      <section className="page-section cast-list">
        <div className='cast-box'>
          <div className='left-column'>
            <h1>HUIS CLOS</h1>
            <h2>JEAN -PAUL SARTRE</h2>
            <p>&nbsp;</p>
            <h1>CREATIVE TEAM</h1>
            <div className='role-list'>  
              <h3>DIRECTOR</h3>
              <a href="/artists/robert-marlin"><p>Robert Marlin</p></a>
              <h3>MUSIC</h3>
              <p>Diarmuid MacGloinn</p>
              <h3>LIGHTING</h3>
              <p>Cathal Quinn</p>
              <h3>ASSISTANT DIRECTOR</h3>
              <a href="/artists/blaithin-seville"><p>Blaithin Seville</p></a>
              <h3>STAGE ASSISTANT</h3>
              <p>Holly Doyle</p>
              <h3>PHOTOGRAPHER</h3>
              <p>Ben Roth</p>
            </div>
          </div>
          <div className='right-column'>
            <h1>&nbsp;</h1>
            <h2>&nbsp;</h2>
            <p>09.2025</p>
            <h1>CAST</h1>
            <div className='role-list'>  
              <h3>ESTELE</h3>
              <a href="/artists/eimear-minihane"><p>Eimear Minihane</p></a>
              <h3>GARCIN</h3>
              <a href="/artists/lorcan-patrick-dow"><p>Lorcan Patrick Dow</p></a>
              <h3>INEZ</h3>
              <p>Thawab</p>
              <h3>THE VALET</h3>
              <a href="/artists/fiona-perez-carroll "><p>Fiona Perez Carroll</p></a>  
            </div>
          </div>
        </div>
      </section>
      <section className="page-section cast-img">
        <div className="cast-photo">
          <img src={castGroupPhoto} alt="Group photo" />

          <a className="hotspot hs-1" href="/artists/fiona-perez-carroll" aria-label="Fiona Perez Carroll" />
          <a className="hotspot hs-2" href="/artists/eimear-minihane" aria-label="Eimear Minihane" />
          <a className="hotspot hs-3" href="/artists/lorcan-patrick-dow" aria-label="Lorcàn Patrick Dow" />
        </div>
      </section>
      <section className="page-section gallery-2">
        <Gallery items={work?.gallery2} text={TextTwo} reversed={true} />
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
