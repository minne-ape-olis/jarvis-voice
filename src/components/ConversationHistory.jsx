import { useEffect, useRef } from 'react'

export default function ConversationHistory({ messages }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-500 text-sm px-8 text-center">
        Tap and hold the button to talk to Jarvis
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto conversation-scroll px-4 py-3 space-y-3">
      {messages.map((msg, i) => (
        <div
          key={i}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-cyan-900/50 text-cyan-100 rounded-br-sm'
                : 'bg-slate-700/60 text-slate-200 rounded-bl-sm'
            }`}
          >
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
