import { useRef, useState, useCallback } from 'react'

const SILENCE_THRESHOLD = 0.01
const SILENCE_DURATION = 1500 // ms

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const streamRef = useRef(null)
  const analyserRef = useRef(null)
  const silenceTimerRef = useRef(null)
  const rafRef = useRef(null)
  const resolveRef = useRef(null)

  const haptic = useCallback((pattern) => {
    if (navigator.vibrate) navigator.vibrate(pattern)
  }, [])

  const stopRecording = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current)

    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    streamRef.current?.getTracks().forEach((t) => t.stop())

    setIsRecording(false)
    haptic([30])
  }, [haptic])

  const startRecording = useCallback(() => {
    return new Promise(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        streamRef.current = stream
        chunksRef.current = []
        resolveRef.current = resolve

        const mediaRecorder = new MediaRecorder(stream, {
          mimeType: MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
            ? 'audio/webm;codecs=opus'
            : 'audio/webm',
        })
        mediaRecorderRef.current = mediaRecorder

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunksRef.current.push(e.data)
        }

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
          resolveRef.current?.(blob)
        }

        // Silence detection via AnalyserNode
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)()
        const source = audioCtx.createMediaStreamSource(stream)
        const analyser = audioCtx.createAnalyser()
        analyser.fftSize = 512
        source.connect(analyser)
        analyserRef.current = analyser

        const dataArray = new Float32Array(analyser.fftSize)
        let silenceStart = null

        function checkSilence() {
          analyser.getFloatTimeDomainData(dataArray)
          const rms = Math.sqrt(
            dataArray.reduce((sum, v) => sum + v * v, 0) / dataArray.length
          )

          if (rms < SILENCE_THRESHOLD) {
            if (!silenceStart) silenceStart = Date.now()
            else if (Date.now() - silenceStart > SILENCE_DURATION) {
              audioCtx.close()
              stopRecording()
              return
            }
          } else {
            silenceStart = null
          }

          rafRef.current = requestAnimationFrame(checkSilence)
        }

        mediaRecorder.start(250)
        setIsRecording(true)
        haptic([50])
        checkSilence()
      } catch (err) {
        reject(err)
      }
    })
  }, [stopRecording, haptic])

  return { isRecording, startRecording, stopRecording }
}
