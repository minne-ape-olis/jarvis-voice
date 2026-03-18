export function getKey(name) {
  // Prefer env var (works in local dev with .env), fall back to localStorage
  const envVal = import.meta.env[name]
  if (envVal && envVal !== 'placeholder') return envVal
  return localStorage.getItem(name) || ''
}

export function setKey(name, value) {
  localStorage.setItem(name, value)
}

export function hasKeys() {
  return !!(getKey('VITE_ELEVENLABS_API_KEY') && getKey('VITE_OPENROUTER_API_KEY'))
}
