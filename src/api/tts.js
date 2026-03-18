const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY
const VOICE_ID = 'JBFqnCBsd6RMkjVDRZzb' // George

export async function speakText(text, onStart, onEnd) {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_turbo_v2_5',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`TTS failed (${res.status}): ${err}`)
  }

  // Stream audio for faster playback
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const arrayBuffer = await res.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

  return new Promise((resolve) => {
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioContext.destination)
    source.onended = () => {
      audioContext.close()
      onEnd?.()
      resolve()
    }
    onStart?.()
    source.start(0)
  })
}
