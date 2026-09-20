/**
 * One table in the DOM for both layouts. Below 700px CSS re-flows the rows into
 * cards rather than leaving a wide table to scroll sideways, and the explicit
 * ARIA roles put the table semantics back that `display: block` strips away.
 */
export default function LeaderboardTable({ entries }) {
  const leader = entries[0]

  return (
    <div className="leaderboard">
      <table className="leaderboard__table" role="table">
        <caption className="sr-only">Championship standings by department, ranked on gold, then silver, then bronze medals.</caption>
        <thead role="rowgroup">
          <tr role="row">
            <th role="columnheader" scope="col" className="leaderboard__rank-col">Rank</th>
            <th role="columnheader" scope="col">Department</th>
            <th role="columnheader" scope="col" className="leaderboard__medal-col">Gold</th>
            <th role="columnheader" scope="col" className="leaderboard__medal-col">Silver</th>
            <th role="columnheader" scope="col" className="leaderboard__medal-col">Bronze</th>
            <th role="columnheader" scope="col" className="leaderboard__total-col">Total</th>
          </tr>
        </thead>
        <tbody role="rowgroup">
          {entries.map((entry) => (
            <tr
              role="row"
              key={entry._id || entry.department}
              className={entry.department === leader?.department ? 'is-leader' : ''}
            >
              <td role="cell" className="leaderboard__rank" data-label="Rank">
                <span className="leaderboard__rank-value">{String(entry.rank).padStart(2, '0')}</span>
              </td>
              <td role="cell" className="leaderboard__department" data-label="Department">
                {entry.department}
              </td>
              <td role="cell" className="leaderboard__medal leaderboard__medal--gold" data-label="Gold">
                <span className="leaderboard__medal-label" aria-hidden="true">Gold</span>
                {entry.gold}
              </td>
              <td role="cell" className="leaderboard__medal leaderboard__medal--silver" data-label="Silver">
                <span className="leaderboard__medal-label" aria-hidden="true">Silver</span>
                {entry.silver}
              </td>
              <td role="cell" className="leaderboard__medal leaderboard__medal--bronze" data-label="Bronze">
                <span className="leaderboard__medal-label" aria-hidden="true">Bronze</span>
                {entry.bronze}
              </td>
              <td role="cell" className="leaderboard__total" data-label="Total">
                <span className="leaderboard__medal-label" aria-hidden="true">Total</span>
                {entry.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
