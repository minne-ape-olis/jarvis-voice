import { useCallback } from 'react'
import { useVoiceRecorder } from './hooks/useVoiceRecorder'
import { useConversation } from './hooks/useConversation'
import PushToTalkButton from './components/PushToTalkButton'
import StatusIndicator from './components/StatusIndicator'
import ConversationHistory from './components/ConversationHistory'

function App() {
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder()
  const { messages, status, error, setStatus, processAudio, clearConversation } =
    useConversation()

  const handlePressStart = useCallback(() => {
    setStatus('listening')
    startRecording().then((audioBlob) => {
      if (audioBlob.size > 0) {
        processAudio(audioBlob)
      } else {
        setStatus('idle')
      }
    }).catch((err) => {
      console.error('Recording error:', err)
      setStatus('idle')
    })
  }, [startRecording, processAudio, setStatus])

  const handlePressEnd = useCallback(() => {
    if (isRecording) stopRecording()
  }, [isRecording, stopRecording])

  return (
    <div className="h-full flex flex-col bg-slate-900 safe-area-inset">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <h1 className="text-lg font-semibold text-slate-200 tracking-tight">
          JARVIS
        </h1>
        {messages.length > 0 && (
          <button
            onClick={clearConversation}
            className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
          >
            Clear
          </button>
        )}
      </header>

      {/* Conversation */}
      <ConversationHistory messages={messages} />

      {/* Error display */}
      {error && (
        <div className="mx-4 mb-2 px-3 py-2 bg-red-900/40 border border-red-800/50 rounded-lg text-red-300 text-xs">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="border-t border-slate-800 pb-[env(safe-area-inset-bottom)]">
        <StatusIndicator status={isRecording ? 'listening' : status} />
        <PushToTalkButton
          isRecording={isRecording}
          status={status}
          onPressStart={handlePressStart}
          onPressEnd={handlePressEnd}
        />
      </div>
    </div>
  )
}

export default App
