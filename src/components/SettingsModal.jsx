import { useState } from 'react'
import { getKey, setKey } from '../api/keys'

export default function SettingsModal({ open, onClose }) {
  const [elevenLabs, setElevenLabs] = useState(() => getKey('VITE_ELEVENLABS_API_KEY'))
  const [openRouter, setOpenRouter] = useState(() => getKey('VITE_OPENROUTER_API_KEY'))

  if (!open) return null

  function handleSave() {
    setKey('VITE_ELEVENLABS_API_KEY', elevenLabs.trim())
    setKey('VITE_OPENROUTER_API_KEY', openRouter.trim())
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-slate-200">API Keys</h2>
        <p className="text-xs text-slate-400">
          Keys are stored in your browser only. Never sent anywhere except the respective APIs.
        </p>

        <label className="block">
          <span className="text-xs text-slate-400">ElevenLabs API Key</span>
          <input
            type="password"
            value={elevenLabs}
            onChange={(e) => setElevenLabs(e.target.value)}
            placeholder="xi-..."
            className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </label>

        <label className="block">
          <span className="text-xs text-slate-400">OpenRouter API Key</span>
          <input
            type="password"
            value={openRouter}
            onChange={(e) => setOpenRouter(e.target.value)}
            placeholder="sk-or-..."
            className="mt-1 w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </label>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm text-slate-400 border border-slate-600"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}
