import {Navigation} from '../components/Navigation'
import AnimatedSkald from '../assets/AnimatedSkald.png'
import '../styles/Home.css'

export function Home() {

  return (
    <Navigation className="home-page">
      <section className="home-section">
        <img src={AnimatedSkald} alt="Skald" className="home-logo" />
      </section>
    </Navigation>
  )
}
  