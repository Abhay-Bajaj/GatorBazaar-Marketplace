export async function checkLoggedIn() {
  const response = await fetch('/auth/checkLoggedUser', {
    credentials: 'include',
  })
  if (!response.ok) {
    return { authenticated: false }
  }
  return response.json()
}
