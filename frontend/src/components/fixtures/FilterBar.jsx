/**
 * Filters are plain buttons with aria-pressed rather than a custom listbox, so
 * they are keyboard-operable and screen-reader-legible with no extra wiring.
 */
function FilterGroup({ label, options, value, onChange, scrollable = false }) {
  if (options.length < 2) return null

  return (
    <div className="filter-group">
      <span className="filter-group__label" id={`filter-${label.toLowerCase()}`}>{label}</span>
      <div
        className={`filter-group__options ${scrollable ? 'filter-group__options--scroll' : ''}`.trim()}
        role="group"
        aria-labelledby={`filter-${label.toLowerCase()}`}
      >
        {options.map((option) => {
          const selected = option.id === value
          return (
            <button
              className={`filter-chip ${selected ? 'is-selected' : ''}`.trim()}
              type="button"
              key={option.id}
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
            >
              {option.name}
              {typeof option.count === 'number' && <span className="filter-chip__count">{option.count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function FilterBar({ sports, days, status, filters, onChange, resultCount, totalCount }) {
  const update = (key) => (value) => onChange({ ...filters, [key]: value })
  const isFiltered = filters.sport !== 'all' || filters.status !== 'all' || filters.day !== 'all'

  return (
    <div className="filter-bar">
      <FilterGroup label="Status" options={status} value={filters.status} onChange={update('status')} />
      <FilterGroup label="Sport" options={sports} value={filters.sport} onChange={update('sport')} scrollable />
      <FilterGroup label="Day" options={days} value={filters.day} onChange={update('day')} scrollable />

      <div className="filter-bar__summary" role="status">
        <span>
          {resultCount} of {totalCount} {totalCount === 1 ? 'match' : 'matches'}
        </span>
        {isFiltered && (
          <button
            className="filter-bar__reset"
            type="button"
            onClick={() => onChange({ sport: 'all', status: 'all', day: 'all' })}
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
