import { eventContacts } from '../../data/eventContacts'

export default function EventContacts() {
  return (
    <section className="contacts-section section-wrap" id="contact" aria-labelledby="contacts-title">
      <div>
        <h2 id="contacts-title">Overall<br /><em>Student Coordinator</em></h2>
      </div>
      <div className="contacts-list">
        {eventContacts.map((contact) => (
          <div className="contact-item" key={contact.name}>
            <span>{contact.name}</span>
            {contact.phone.includes('X') ? (
              <span className="contact-item__phone is-placeholder" role="status">{contact.phone}</span>
            ) : (
              <a href={`tel:${contact.phone.replace(/\s/g, '')}`}>{contact.phone}</a>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
