import { getKey } from './keys'

export async function transcribeAudio(audioBlob) {
  const formData = new FormData()
  formData.append('audio', audioBlob, 'recording.webm')
  formData.append('model_id', 'scribe_v1')

  const res = await fetch('https://api.elevenlabs.io/v1/speech-to-text', {
    method: 'POST',
    headers: { 'xi-api-key': getKey('VITE_ELEVENLABS_API_KEY') },
    body: formData,
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`STT failed (${res.status}): ${err}`)
  }

  const data = await res.json()
  return data.text
}
