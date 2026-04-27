export default function SubHeader({ query, count, onBack }) {
  const resultText =
    query
      ? `${count ?? 0} Results for ${query}`
      : count !== null
      ? `${count} Item${count !== 1 ? 's' : ''}`
      : ''

  return (
    <div className="gb-subheader">
      <button className="gb-back-btn" type="button" onClick={onBack}>
        ← HOME
      </button>
      {resultText && <span className="gb-result-text">{resultText}</span>}
    </div>
  )
}
