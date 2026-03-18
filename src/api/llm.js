import { getKey } from './keys'

const SYSTEM_PROMPT = `You are Jarvis, a sharp and capable AI assistant. Direct, dry wit, no filler.
Erik is talking to you hands-free at the gym. Keep responses concise — 1-3 sentences
unless he asks for more detail. You are his personal assistant, trainer advisor,
and thinking partner. Get to the point fast.`

export async function chatCompletion(messages) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getKey('VITE_OPENROUTER_API_KEY')}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'Jarvis Voice',
    },
    body: JSON.stringify({
      model: 'anthropic/claude-sonnet-4-6',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 300,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`LLM failed (${res.status}): ${err}`)
  }

  const data = await res.json()
  return data.choices[0].message.content
}
