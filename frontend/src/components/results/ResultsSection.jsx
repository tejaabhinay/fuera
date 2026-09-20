import SectionHeading from '../common/SectionHeading'
import ResultCard from './ResultCard'

const HOMEPAGE_LIMIT = 6

export default function ResultsSection({ results }) {
  if (!results.length) return null

  return (
    <section className="results section-wrap" id="results" aria-labelledby="results-heading">
      <SectionHeading
        index="03"
        eyebrow="Scoreboard"
        id="results-heading"
        title={<>Latest <em>results.</em></>}
        action={<a className="text-link" href="/fixtures">All results <span aria-hidden="true">→</span></a>}
      />

      <div className="results__grid">
        {results.slice(0, HOMEPAGE_LIMIT).map((fixture) => (
          <ResultCard fixture={fixture} key={fixture._id} />
        ))}
      </div>
    </section>
  )
}
