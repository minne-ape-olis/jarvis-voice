const STATUS_CONFIG = {
  idle: { label: 'Ready', color: 'text-slate-400' },
  listening: { label: 'Listening...', color: 'text-cyan-400' },
  thinking: { label: 'Thinking...', color: 'text-amber-400' },
  speaking: { label: 'Speaking...', color: 'text-emerald-400' },
}

export default function StatusIndicator({ status }) {
  const { label, color } = STATUS_CONFIG[status] || STATUS_CONFIG.idle

  return (
    <div className={`text-sm font-medium tracking-wide uppercase ${color}`}>
      {status !== 'idle' && (
        <span className="inline-block w-2 h-2 rounded-full bg-current mr-2 animate-pulse" />
      )}
      {label}
    </div>
  )
}
