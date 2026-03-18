import { useCallback, useState, useEffect } from 'react'
import { useVoiceRecorder } from './hooks/useVoiceRecorder'
import { useConversation } from './hooks/useConversation'
import { hasKeys } from './api/keys'
import PushToTalkButton from './components/PushToTalkButton'
import StatusIndicator from './components/StatusIndicator'
import ConversationHistory from './components/ConversationHistory'
import SettingsModal from './components/SettingsModal'

function App() {
  const { isRecording, startRecording, stopRecording } = useVoiceRecorder()
  const { messages, status, error, setStatus, processAudio, clearConversation } =
    useConversation()
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Auto-open settings if no keys configured
  useEffect(() => {
    if (!hasKeys()) setSettingsOpen(true)
  }, [])

  const handlePressStart = useCallback(() => {
    if (!hasKeys()) {
      setSettingsOpen(true)
      return
    }
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
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
        <h1 className="text-lg font-semibold text-slate-200 tracking-tight">
          JARVIS
        </h1>
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={clearConversation}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors px-2 py-1"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-slate-500 hover:text-slate-300 transition-colors"
            aria-label="Settings"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </button>
        </div>
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

      {/* Settings */}
      <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  )
}

export default App
