import Cookies from 'js-cookie'

const TOKEN_KEY = 'auth_token'
const TOKEN_HASH_KEY = 'token_hash'

// Generate a simple hash of the token to detect tampering
const generateTokenHash = (token: string): string => {
  let hash = 0
  for (let i = 0; i < token.length; i++) {
    const char = token.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash
  }
  return hash.toString()
}

export const setAuthToken = (token: string): void => {
  const hash = generateTokenHash(token)
  Cookies.set(TOKEN_KEY, token, {
    expires: 7, // 7 days
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
  Cookies.set(TOKEN_HASH_KEY, hash, {
    expires: 7,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  })
}

export const getAuthToken = (): string | null => {
  const token = Cookies.get(TOKEN_KEY)
  const storedHash = Cookies.get(TOKEN_HASH_KEY)

  if (!token || !storedHash) {
    return null
  }

  // Verify token hasn't been tampered with
  const currentHash = generateTokenHash(token)
  if (currentHash !== storedHash) {
    // Token has been modified, clear everything
    removeAuthToken()
    return null
  }

  return token
}

export const removeAuthToken = (): void => {
  Cookies.remove(TOKEN_KEY)
  Cookies.remove(TOKEN_HASH_KEY)
}

export const isTokenValid = (): boolean => {
  return getAuthToken() !== null
}
