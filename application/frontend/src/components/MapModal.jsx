import { useState } from 'react'

export default function CampusMapModal({
  onClose,
  onSelect,
  initialPin = null,
  readOnly = false
}) {
  const [pin, setPin] = useState(initialPin)
  const [zoom, setZoom] = useState(1.5)

  function handleMapClick(e) {
    if (readOnly) return
    const rect = e.currentTarget.getBoundingClientRect()

    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setPin({ x, y })
  }

  return (
    <div className="modal-backdrop">
      <div className="map-modal">
        {readOnly ? (
          <h2>View Pickup Location</h2>
        ) : (
          <h2>Choose Pickup Location</h2>
        )}

        <div className="map-viewport">
          <div className="map-scroll-area">
            <div
              className="map-zoom-layer"
              style={{ transform: `scale(${zoom})` }}
              onClick={handleMapClick}
            >
              <img
                src="/images/sfsu-campus-map.png"
                alt="Campus map"
                className="campus-map"
              />

              {pin && (
                <span
                  className="map-pin"
                  style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                >
                  📍
                </span>
              )}
            </div>
          </div>

          <div className="map-zoom-controls">
            <button type="button" onClick={() => setZoom(z => Math.max(1, z - 0.5))}>-</button>
            <span>{Math.round(zoom * 100)}%</span>
            <button type="button" onClick={() => setZoom(z => Math.min(5, z + 0.5))}>+</button>
          </div>
        </div>

        {pin && (
          <p>Selected: {pin.x.toFixed(1)}%, {pin.y.toFixed(1)}%</p>
        )}

        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            {readOnly ? 'Close' : 'Cancel'}
          </button>

          {!readOnly && (
            <button
              type="button"
              disabled={!pin}
              onClick={() => onSelect(pin)}
            >
              Use this spot
            </button>
          )}
        </div>
      </div>
    </div>
  )
}