import { useState, useCallback, useRef } from 'react'
import { transcribeAudio } from '../api/stt'
import { chatCompletion } from '../api/llm'
import { speakText } from '../api/tts'

// status: 'idle' | 'listening' | 'thinking' | 'speaking'

export function useConversation() {
  const [messages, setMessages] = useState([])
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState(null)
  const messagesRef = useRef([])

  const processAudio = useCallback(async (audioBlob) => {
    setError(null)

    try {
      // 1. Transcribe
      setStatus('thinking')
      const userText = await transcribeAudio(audioBlob)

      if (!userText?.trim()) {
        setStatus('idle')
        return
      }

      // Add user message
      const userMsg = { role: 'user', content: userText }
      messagesRef.current = [...messagesRef.current, userMsg]
      setMessages([...messagesRef.current])

      // 2. LLM
      const llmMessages = messagesRef.current.map(({ role, content }) => ({
        role,
        content,
      }))
      const reply = await chatCompletion(llmMessages)

      // Add assistant message
      const assistantMsg = { role: 'assistant', content: reply }
      messagesRef.current = [...messagesRef.current, assistantMsg]
      setMessages([...messagesRef.current])

      // 3. TTS
      await speakText(
        reply,
        () => setStatus('speaking'),
        () => setStatus('idle')
      )
    } catch (err) {
      console.error('Conversation error:', err)
      setError(err.message)
      setStatus('idle')
    }
  }, [])

  const clearConversation = useCallback(() => {
    setMessages([])
    messagesRef.current = []
    setError(null)
  }, [])

  return { messages, status, error, setStatus, processAudio, clearConversation }
}
