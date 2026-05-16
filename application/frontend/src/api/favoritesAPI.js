export async function addFavorite(listingId) {
    const response = await fetch(`/api/favorites/${listingId}`, {
        method: 'POST',
        credentials: 'include'
    })
    if (!response.ok) {
        throw new Error('Failed to add favorite')
    }
    return response.json()
}

export async function removeFavorite(listingId) {
    const response = await fetch(`/api/favorites/${listingId}`, {
        method: 'DELETE',
        credentials: 'include'
    })

    if (!response.ok) {
        throw new Error('Failed to delete favorite')
    }

    return response.json()
}

export async function getUserFavorites() {
    const response = await fetch(`/api/favorites`, {
        credentials: 'include'
    })

    if (!response.ok) {
        throw new Error('Failed to fetch favorite')
    }

    return response.json()
}