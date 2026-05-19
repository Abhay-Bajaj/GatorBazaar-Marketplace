import { useEffect, useState } from 'react'
import MapModal from './MapModal'

function toDateTimeLocal(value) {
    if (!value) return ''
    const date = new Date(value)
    const offset = date.getTimezoneOffset() * 60000
    return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

export default function ProposalModal({
    isOpen = true,
    onClose,
    onSubmit,
    onUpdate,
    transaction,
}) {
    // proposalMode can be 'view' or 'counter', determining whether the user is viewing an existing proposal or creating a new one
    const [proposalMode, setProposalMode] = useState(transaction ? 'view' : 'new')
    const [mapOpen, setMapOpen] = useState(false)
    const [mapPin, setMapPin] = useState(null)

    const status = transaction?.status
    const isEditable =
        !transaction ||
        proposalMode === 'counter' ||
        proposalMode === 'new'

    const canRespond =
        transaction &&
        Number(transaction.proposed_by_user_id) !== Number(transaction.current_user_id) &&
        transaction.status === 'Proposed'

    const [amount, setAmount] = useState(transaction?.amount || '')
    const [exchangeLocation, setExchangeLocation] = useState(transaction?.exchange_location || '')
    const [exchangeTime, setExchangeTime] = useState(
        transaction?.exchange_time ? toDateTimeLocal(transaction.exchange_time) : ''
    )

    useEffect(() => {
        setAmount(transaction?.amount || '')
        setExchangeLocation(transaction?.exchange_location || '')
        setExchangeTime(transaction?.exchange_time ? toDateTimeLocal(transaction.exchange_time) : '')
    }, [transaction])

    useEffect(() => {
        function handleKey(event) {
            if (event.key === 'Escape') onClose()
        }

        document.addEventListener('keydown', handleKey)
        return () => document.removeEventListener('keydown', handleKey)
    }, [onClose])
    useEffect(() => {
        setProposalMode(transaction ? 'view' : 'new')
    }, [transaction])
    if (!isOpen) return null

    const handleAccept = async () => {
        if (!transaction || !onUpdate || !canRespond) return

        await onUpdate(transaction.transaction_id, {
            action: 'Accepted'
        })
    }

    const handleReject = async () => {
        if (!transaction || !onUpdate || !canRespond) return

        await onUpdate(transaction.transaction_id, {
            action: 'Rejected'
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!onSubmit) return

        if (!transaction) {
            await onSubmit({
                amount,
                exchange_location: exchangeLocation,
                exchange_map_x: mapPin?.x ?? null,
                exchange_map_y: mapPin?.y ?? null,
                exchange_time: exchangeTime,

            })
            return
        }
        await onUpdate(transaction.transaction_id, {
            action: 'Proposed',
            amount,
            exchange_location: exchangeLocation,
            exchange_map_x: mapPin?.x ?? transaction.exchange_map_x,
            exchange_map_y: mapPin?.y ?? transaction.exchange_map_y,
            exchange_time: exchangeTime,

        })
    }
    return (
        <div className="proposal-modal-overlay" onClick={(event) => event.target === event.currentTarget && onClose()}>
            <div className="proposal-modal-box">
                <button
                    type="button"
                    className="proposal-modal-close"
                    aria-label="Close proposal modal"
                    onClick={onClose}
                >
                    ✕
                </button>

                {transaction ? (
                    <form className="proposal-modal-content" onSubmit={handleSubmit}>
                        <h2>Proposal Details</h2>

                        <div className="proposal-field">
                            <span>Status: </span>
                            <strong>{transaction.status}</strong>
                        </div>

                        <label className="proposal-form-field">
                            <span>Amount</span>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                disabled={!isEditable}
                                onChange={(event) => setAmount(event.target.value)}
                                required
                            />
                        </label>

                        <label className="proposal-form-field">
                            <span>Exchange location</span>

                            <div className="proposal-location-row">
                                <input
                                    type="text"
                                    value={exchangeLocation}
                                    disabled={!isEditable}
                                    onChange={(event) => setExchangeLocation(event.target.value)}
                                    required
                                />

                                <button
                                    type="button"
                                    disabled={!isEditable}
                                    onClick={() => setMapOpen(true)}
                                >
                                    Open Map
                                </button>
                            </div>
                        </label>
                        {transaction?.exchange_map_x && transaction?.exchange_map_y && (
                            <button
                                className="view-map-pin-btn"
                                type="button"
                                onClick={() => setMapOpen(true)}
                            >
                                View Map Pin
                            </button>
                        )}

                        <label className="proposal-form-field">
                            <span>Exchange time</span>
                            <input
                                type="datetime-local"
                                value={exchangeTime}
                                disabled={!isEditable}
                                onChange={(event) => setExchangeTime(event.target.value)}
                                required
                            />
                        </label>
                        {(status === 'Rejected' || status === 'Cancelled') && proposalMode === 'view' && (
                            <div className="proposal-actions">
                                <button type="button" onClick={() => setProposalMode('counter')}>
                                    Send New Proposal
                                </button>
                            </div>
                        )}
                        {status === 'Proposed' && canRespond && proposalMode === 'view' && (
                            <div className="proposal-actions">
                                <button type="button" onClick={handleAccept}>
                                    Accept
                                </button>

                                <button type="button" onClick={handleReject}>
                                    Reject
                                </button>

                                <button type="button" onClick={() => setProposalMode('counter')}>
                                    Counter
                                </button>
                            </div>
                        )}
                        {proposalMode === 'counter' && (
                            <div className="proposal-actions">
                                <button type="button" onClick={() => setProposalMode('view')}>
                                    Cancel
                                </button>

                                <button type="submit">
                                    Send Proposal
                                </button>
                            </div>
                        )}
                        {status === 'Proposed' && !canRespond && proposalMode === 'view' && (
                            <p className="proposal-note">
                                Waiting for the other user to respond.
                            </p>
                        )}
                    </form>
                ) : (
                    <form className="proposal-modal-content" onSubmit={handleSubmit}>
                        <h2>Send Proposal</h2>

                        <label className="proposal-form-field">
                            <span>Amount</span>
                            <input
                                type="number"
                                min="0.01"
                                step="0.01"
                                value={amount}
                                onChange={(event) => setAmount(event.target.value)}
                                required
                            />
                        </label>

                        <label className="proposal-form-field">
                            <span>Exchange location</span>

                            <div className="proposal-location-row">
                                <select
                                    value={exchangeLocation}
                                    onChange={(e) => setExchangeLocation(e.target.value)}
                                    required
                                >
                                    <option value="">Choose a campus location</option>
                                    <option value="Cesar Chavez Student Center">Cesar Chavez Student Center</option>
                                    <option value="J. Paul Leonard Library">J. Paul Leonard Library</option>
                                    <option value="Mashouf Wellness Center">Mashouf Wellness Center</option>
                                    <option value="Burk Hall">Burk Hall</option>
                                    <option value="Thornton Hall">Thornton Hall</option>
                                    <option value="Science Building">Science Building</option>
                                    <option value="Creative Arts Building">Creative Arts Building</option>
                                    <option value="Gymnasium">Gymnasium</option>
                                    <option value="Student Services Building">Student Services Building</option>
                                    <option value="Mashouf Wellness Center">Mashouf Wellness Center</option>
                                    <option value="Administration Building">Administration Building</option>
                                    {mapPin && (
                                        <option value="Campus map pin">
                                            Campus map pin
                                        </option>
                                    )}
                                </select>

                                <button
                                    type="button"
                                    onClick={() => setMapOpen(true)}
                                >
                                    Open Map
                                </button>
                            </div>
                        </label>


                        <label className="proposal-form-field">
                            <span>Exchange time</span>
                            <input
                                type="datetime-local"
                                value={exchangeTime}
                                onChange={(event) => setExchangeTime(event.target.value)}
                                required
                            />
                        </label>

                        <button className="proposal-submit-button" type="submit">
                            Send Proposal
                        </button>
                    </form>
                )}
            </div>
            {mapOpen && (
                <MapModal
                    initialPin={
                        transaction?.exchange_map_x && transaction?.exchange_map_y
                            ? {
                                x: Number(transaction.exchange_map_x),
                                y: Number(transaction.exchange_map_y)
                            }
                            : null
                    }

                    readOnly={!isEditable}

                    onClose={() => setMapOpen(false)}

                    onSelect={(pin) => {
                        setMapPin(pin)

                        setExchangeLocation('Campus map pin')

                        setMapOpen(false)
                    }}
                />
            )}
        </div>
    )
}