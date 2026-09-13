import { eventContacts } from '../../data/eventContacts'

export default function EventContacts() {
  const primaryContact = eventContacts[0]

  return (
    <section
      className="contacts-section section-wrap"
      id="contact"
      aria-labelledby="contacts-title"
    >
      <div>
        <h2 id="contacts-title">
          ANY QUERIES?<br />
          <em>CONTACT</em>
        </h2>
      </div>

      <div className="contacts-list">
        {/* Main Contact */}
        {primaryContact && (
          <div className="contact-item">
            <span>{primaryContact.name}</span>

            {primaryContact.phone.includes('X') ? (
              <span
                className="contact-item__phone is-placeholder"
                role="status"
              >
                {primaryContact.phone}
              </span>
            ) : (
              <a href={`tel:${primaryContact.phone.replace(/\s/g, '')}`}>
                {primaryContact.phone}
              </a>
            )}
          </div>
        )}

        {/* Physical Education Department */}
        <div className="department-contact">
          <span className="department-contact__label">
            FOR FURTHER DETAILS
          </span>

          <span>Physical Education Department</span>
          <span>Student Activity Centre</span>
          <span>SASTRA DEEMED UNIVERSITY</span>
          <span>Thanjavur – 613401, Tamil Nadu</span>
        </div>

        {/* Website Technical Support */}
        <div className="technical-contact">
          <span className="technical-contact__label">
            WEBSITE TECHNICAL SUPPORT
          </span>

          <span>P. Teja Abhinay</span>

          <a href="tel:+919949220260">
            +91 9949220260
          </a>
        </div>
      </div>
    </section>
  )
}