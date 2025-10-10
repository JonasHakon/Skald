// src/pages/Contact.tsx
import { ContactForm } from '../components/ContactForm'
import {Navigation} from '../components/Navigation'
import '../styles/Contact.css'

export function Contact() {
  return (
    <Navigation className="contact-page dark-theme">
      <section className="page-section">
        <h1 className="page-title">Get in touch</h1>
        <div className="contact-form">
            <ContactForm></ContactForm>
        </div>
      </section>
    </Navigation>
  )
}
