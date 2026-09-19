// EventContacts.jsx

import { eventContacts } from '../../data/eventContacts'
import ScrollReveal from '../common/ScrollReveal'

export default function EventContacts() {
  const primaryContact = eventContacts[0]

  return (
    <section
      className="contacts-section section-wrap"
      id="contact"
      aria-labelledby="contacts-title"
    >
      <div>
        <ScrollReveal as="h2" id="contacts-title">
          ANY QUERIES?
          <br />
          <em>CONTACT</em>
        </ScrollReveal>
      </div>

      <div className="contacts-list">
        <div className="department-contact">
          <span className="department-contact__label">
            <b>FOR FURTHER DETAILS</b>
          </span>
          <span className="department-contact__name">Dr. B. SRIPERIYA</span>
          <span>Department of Physical Education</span>
          <span>Student Activity Centre</span>
          <span>SASTRA DEEMED UNIVERSITY</span>
          <span>Thanjavur – 613401, Tamil Nadu</span>
        </div>

        {primaryContact && (
          <div className="contact-item">
            <span className="contact-item__label">
              REGISTRATION QUERIES
            </span>
            <span className="contact-item__name">{primaryContact.name}</span>

            {primaryContact.phone.includes('X') ? (
              <span
                className="contact-item__phone is-placeholder"
                role="status"
              >
                {primaryContact.phone}
              </span>
            ) : (
              <a
                href={`tel:${primaryContact.phone.replace(/\s/g, '')}`}
              >
                {primaryContact.phone}
              </a>
            )}
          </div>
        )}

        <div className="technical-contact">
          <span className="technical-contact__label">
            WEBSITE TECHNICAL SUPPORT
          </span>

          <span><b>P. Teja Abhinay</b></span>

          <a href="tel:+919949220260">
            +91 9949220260
          </a>
        </div>
      </div>
    </section>
  )
}
