const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/+$/, '')
const AUTH_TOKEN_KEY = 'fuera_admin_token'

export function getAuthToken() {
  return sessionStorage.getItem(AUTH_TOKEN_KEY)
}

export function setAuthToken(token) {
  sessionStorage.setItem(AUTH_TOKEN_KEY, token)
}

export function clearAuthToken() {
  sessionStorage.removeItem(AUTH_TOKEN_KEY)
}

export function redirectToAdminLogin() {
  clearAuthToken()
  if (window.location.pathname !== '/admin/login') window.location.replace('/admin/login')
}

export async function apiRequest(path, options = {}) {
  const { body, auth = true, ...requestOptions } = options
  const headers = new Headers(requestOptions.headers || {})
  if (body !== undefined) headers.set('Content-Type', 'application/json')

  const token = auth ? getAuthToken() : null
  if (token) headers.set('Authorization', `Bearer ${token}`)

  let response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...requestOptions,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    })
  } catch {
    const error = new Error('Network request failed')
    error.status = 0
    throw error
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    if (response.status === 401 && window.location.pathname.startsWith('/admin')) redirectToAdminLogin()
    const error = new Error(data?.message || 'Request failed')
    error.status = response.status
    throw error
  }

  return data
}

export async function uploadImage(file, folder) {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', folder)

  let response
  try {
    response = await fetch(`${API_BASE_URL}/api/uploads/image`, {
      method: 'POST',
      headers: getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {},
      body: formData,
    })
  } catch {
    const error = new Error('Network request failed')
    error.status = 0
    throw error
  }

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json') ? await response.json() : null
  if (!response.ok) {
    if (response.status === 401 && window.location.pathname.startsWith('/admin')) redirectToAdminLogin()
    const error = new Error(data?.message || 'Request failed')
    error.status = response.status
    throw error
  }
  return data
}

export function getApiErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (error?.status === 401) return 'Your admin session has expired. Please sign in again.'
  if (error?.status === 403) return 'You do not have permission to perform this action.'
  if (error?.status === 404) return 'The requested content could not be found.'
  if (error?.status >= 500 || error?.status === 0) return fallback
  return error?.message || fallback
}
