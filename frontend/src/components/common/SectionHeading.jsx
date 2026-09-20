import ScrollReveal from './ScrollReveal'

/**
 * The shared editorial heading block: numbered kicker, display headline, and an
 * optional trailing slot for actions. Using one component keeps the rhythm and
 * type scale identical in every section.
 */
export default function SectionHeading({ index, eyebrow, title, id, intro, action, className = '' }) {
  return (
    <div className={`section-heading ${className}`.trim()}>
      <div className="section-heading__main">
        {(index || eyebrow) && (
          <p className="section-heading__kicker">
            {index && <span className="section-heading__index">{index}</span>}
            {eyebrow && <span>{eyebrow}</span>}
          </p>
        )}
        <ScrollReveal as="h2" id={id} className="section-heading__title">
          {title}
        </ScrollReveal>
        {intro && <p className="section-heading__intro">{intro}</p>}
      </div>
      {action && <div className="section-heading__action">{action}</div>}
    </div>
  )
}
