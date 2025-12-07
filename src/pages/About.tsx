// src/pages/AboutUs.tsx
import {Navigation} from '../components/Navigation'
import '../styles/About.css'

import AboutUsPhoto from "../assets/AboutUsPhoto.png";
import AboutUsText from "../assets/AboutUsText.png";
import AboutUsInfo from "../assets/AboutUsInfo.png";

export function About() {
  return (
    <Navigation className="contact-page dark-theme">
      <div className="section-photo" style={{ backgroundImage: `url(${AboutUsPhoto})` }}>
        <img src={AboutUsText} alt="about-us-text" className='about-us-text' />
      </div>
      <div className="section-text">
        <img src={AboutUsInfo} alt="about-us-info" className='about-us-photo' />
      </div>
    </Navigation>
  )
}
