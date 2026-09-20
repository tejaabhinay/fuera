import SectionHeading from '../common/SectionHeading'
import LeaderboardTable from './LeaderboardTable'
import { useApiResource } from '../../hooks/useApiResource'

export default function LeaderboardSection() {
  const { data, loading, error } = useApiResource('/api/leaderboard', {
    errorMessage: 'Unable to load the standings.',
  })

  const entries = data?.leaderboard || []

  // The standings only earn their space once there is something to stand on.
  if (loading || error || !entries.length) return null

  return (
    <section className="leaderboard-section section-wrap" id="standings" aria-labelledby="standings-heading">
      <SectionHeading
        index="04"
        eyebrow="Championship"
        id="standings-heading"
        title={<>Points <em>table.</em></>}
        intro="Departments ranked on gold first, then silver, then bronze."
      />
      <LeaderboardTable entries={entries} />
    </section>
  )
}
