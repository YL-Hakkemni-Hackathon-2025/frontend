// API base URL configuration
// In development, Vite proxy handles /api requests
// In production, we need to use the full backend URL
export const API_BASE_URL = import.meta.env.PROD
  ? 'https://hakkemni-api.internalizable.dev'
  : ''

// Helper function to build API URLs
export function apiUrl(path: string): string {
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${normalizedPath}`
}

