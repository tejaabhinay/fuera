import ArrowIcon from '../common/ArrowIcon'

export default function SportSelector({ sports, value, onChange, includeAll = false }) {
  return (
    <div className="sport-selector">
      <label htmlFor="fixture-sport" className="sport-selector__label">Select sport</label>
      <div className="sport-selector__control">
        <select id="fixture-sport" value={value} onChange={(event) => onChange(event.target.value)}>
          {includeAll && <option value="all">All sports</option>}
          {sports.map((sport) => (
            <option value={sport.id} key={sport.id}>{sport.name}</option>
          ))}
        </select>
        <ArrowIcon className="sport-selector__chevron" />
      </div>
    </div>
  )
}
