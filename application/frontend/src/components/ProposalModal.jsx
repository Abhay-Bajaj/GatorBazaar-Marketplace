import { useEffect, useState } from 'react'

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
    const canRespond =
        transaction &&
        Number(transaction.proposed_by_user_id) !== Number(transaction.current_user_id)

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

    const handleCounter = async (event) => {
        event.preventDefault()

        if (!transaction || !onUpdate || !canRespond) return

        await onUpdate(transaction.transaction_id, {
            amount,
            exchange_location: exchangeLocation,
            exchange_time: exchangeTime,
            action: 'Proposed'
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (!onSubmit) return

        await onSubmit({
            amount,
            exchange_location: exchangeLocation,
            exchange_time: exchangeTime
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
                    <form className="proposal-modal-content" onSubmit={handleCounter}>
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
                                onChange={(event) => setAmount(event.target.value)}
                                required
                            />
                        </label>

                        <label className="proposal-form-field">
                            <span>Exchange location</span>
                            <input
                                type="text"
                                value={exchangeLocation}
                                onChange={(event) => setExchangeLocation(event.target.value)}
                                required
                            />
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

                        {canRespond && (
                            <div className="proposal-actions">
                                <button type="button" onClick={handleAccept}>
                                    Accept
                                </button>

                                <button type="button" onClick={handleReject}>
                                    Reject
                                </button>

                                <button type="submit">
                                    Counter
                                </button>
                            </div>
                        )}

                        {!canRespond && (
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
                            <input
                                type="text"
                                value={exchangeLocation}
                                onChange={(event) => setExchangeLocation(event.target.value)}
                                required
                            />
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
        </div>
    )
}