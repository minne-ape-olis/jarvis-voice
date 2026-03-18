export default function PushToTalkButton({
  isRecording,
  status,
  onPressStart,
  onPressEnd,
}) {
  const disabled = status === 'thinking' || status === 'speaking'

  const bgColor = isRecording
    ? 'bg-cyan-500'
    : disabled
      ? 'bg-slate-600'
      : 'bg-slate-700'

  const ringColor = isRecording ? 'bg-cyan-500/40' : 'bg-transparent'

  return (
    <div className="relative flex items-center justify-center py-6">
      {/* Pulse ring when recording */}
      {isRecording && (
        <div
          className={`absolute w-28 h-28 rounded-full ${ringColor} pulse-ring`}
        />
      )}

      {/* Breathing effect when thinking */}
      <button
        onPointerDown={disabled ? undefined : onPressStart}
        onPointerUp={disabled ? undefined : onPressEnd}
        onPointerLeave={isRecording ? onPressEnd : undefined}
        onContextMenu={(e) => e.preventDefault()}
        disabled={disabled}
        className={`relative z-10 w-24 h-24 rounded-full ${bgColor}
          flex items-center justify-center
          transition-colors duration-200
          active:scale-95 select-none touch-none
          ${status === 'thinking' ? 'breathe' : ''}
          ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        {isRecording ? (
          // Microphone active icon
          <svg
            className="w-10 h-10 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        ) : status === 'thinking' ? (
          // Dots thinking indicator
          <div className="flex space-x-1.5">
            <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:0ms]" />
            <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:150ms]" />
            <div className="w-2.5 h-2.5 bg-amber-400 rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        ) : status === 'speaking' ? (
          // Sound wave icon
          <svg
            className="w-10 h-10 text-emerald-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        ) : (
          // Microphone idle icon
          <svg
            className="w-10 h-10 text-slate-300"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
          </svg>
        )}
      </button>
    </div>
  )
}
