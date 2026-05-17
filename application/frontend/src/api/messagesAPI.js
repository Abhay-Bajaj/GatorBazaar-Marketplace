export async function getConversations() {
  const response = await fetch('/api/conversations', {
    credentials: 'include',
  })
  if (response.status === 401) {
    return { unauthorized: true, conversations: [] }
  }
  if (!response.ok) {
    throw new Error('Failed to load conversations')
  }
  const conversations = await response.json()
  return { unauthorized: false, conversations }
}

export async function startConversation(listingId, body) {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ listingId, body }),
  })
  if (response.status === 401) {
    return { unauthorized: true }
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to send message')
  }
  return response.json()
}

export async function sendMessage(conversationId, body) {
  const response = await fetch(`/api/conversations/${conversationId}/messages`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ body }),
  })
  if (response.status === 401) {
    return { unauthorized: true }
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.error || 'Failed to send message')
  }
  return response.json()
}

export async function markConversationRead(conversationId) {
  await fetch(`/api/conversations/${conversationId}/read`, {
    method: 'PATCH',
    credentials: 'include',
  })
}
