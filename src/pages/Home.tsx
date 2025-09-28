import {useEffect, useState} from 'react'
import {Layout} from '../components/Layout'
import {sanity} from '../api/sanityClient'
import '../styles/Home.css'

type HomeDoc = {
  text?: string
  cover?: { asset?: { url: string } }
  background?: { asset?: { url: string } }
}

const HOME_QUERY = /* groq */ `
*[_type == "home"][0]{
  text,
  cover{ asset->{ url } },
  background{ asset->{ url } }
}
`

export function Home() {
  const [home, setHome] = useState<HomeDoc | null>(null)

  useEffect(() => {
    let active = true
    sanity.fetch<HomeDoc>(HOME_QUERY).then(doc => active && setHome(doc || null))
    return () => { active = false }
  }, [])

  const coverUrl = home?.cover?.asset?.url
    ? `${home.cover.asset.url}?w=2400&h=2400&fit=crop&auto=format`
    : undefined

  const bgUrl = home?.background?.asset?.url
    ? `${home.background.asset.url}?auto=format`
    : undefined

  return (
    <Layout>
      <section
        className="home-section"
        style={
          bgUrl
            ? {
                backgroundImage: `url(${bgUrl})`,
                backgroundRepeat: 'repeat',
                backgroundPosition: 'center top',
                backgroundSize: '100% auto',
              }
            : { backgroundColor: 'var(--color-black)' }
        }
      >
        {coverUrl && (
          <img
            src={coverUrl}
            alt="Homepage cover"
            className="home-cover"
            loading="eager"
            fetchPriority="high"
          />
        )}
        {home?.text && <p className="home-description">{home.text}</p>}
      </section>
    </Layout>
  )
}
