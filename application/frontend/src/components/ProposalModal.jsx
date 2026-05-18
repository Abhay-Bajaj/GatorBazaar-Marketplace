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
    // proposalMode can be 'view' or 'counter', determining whether the user is viewing an existing proposal or creating a new one
    const [proposalMode, setProposalMode] = useState(transaction ? 'view' : 'new')
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
                exchange_time: exchangeTime
            })
            return
        }
        await onUpdate(transaction.transaction_id, {
            action: 'Proposed',
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
                            <input
                                type="text"
                                value={exchangeLocation}
                                disabled={!isEditable}
                                onChange={(event) => setExchangeLocation(event.target.value)}
                                required
                            />
                        </label>

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