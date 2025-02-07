import { useState, useEffect, useRef } from 'react'

export function useAudio(url) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioContextRef = useRef(null)
  const sourceRef = useRef(null)
  const analyserRef = useRef(null)
  const gainNodeRef = useRef(null)
  const bufferRef = useRef(null)
  
  // Add smoothing for each frequency band
  const previousBass = useRef(0)
  const previousMids = useRef(0)
  const previousTreble = useRef(0)
  const smoothingFactor = 0.8 // Adjust this value (0-1) for more/less smoothing

  const startAudio = async () => {
    if (isPlaying || sourceRef.current) return

    try {
      // Create or resume AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }
      
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      // Setup analyzer with better frequency resolution
      if (!analyserRef.current) {
        analyserRef.current = audioContextRef.current.createAnalyser()
        analyserRef.current.fftSize = 2048 // Higher for better frequency resolution
        analyserRef.current.smoothingTimeConstant = 0.8 // Smooth the frequency data
        
        gainNodeRef.current = audioContextRef.current.createGain()
        gainNodeRef.current.gain.value = 1.0 // Adjust volume here
      }

      // Load audio buffer only once
      if (!bufferRef.current) {
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        bufferRef.current = await audioContextRef.current.decodeAudioData(arrayBuffer)
      }

      // Create and setup source node
      sourceRef.current = audioContextRef.current.createBufferSource()
      sourceRef.current.buffer = bufferRef.current
      sourceRef.current.loop = true

      // Connect audio nodes
      sourceRef.current.connect(analyserRef.current)
      analyserRef.current.connect(gainNodeRef.current)
      gainNodeRef.current.connect(audioContextRef.current.destination)

      // Start playback
      sourceRef.current.start(0)
      setIsPlaying(true)

    } catch (error) {
      console.error("Error starting audio:", error)
    }
  }

  const stopAudio = () => {
    if (sourceRef.current) {
      sourceRef.current.stop()
      sourceRef.current.disconnect()
      sourceRef.current = null
    }
    setIsPlaying(false)
  }

  const getAudioData = () => {
    if (!analyserRef.current) return { bass: 0, mids: 0, treble: 0 }

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    // Improved frequency band separation
    const bassRange = dataArray.slice(0, 16)     // ~20-120Hz
    const midsRange = dataArray.slice(16, 64)    // ~120-1000Hz
    const trebleRange = dataArray.slice(64, 128) // ~1000Hz+

    // Calculate current values
    const currentBass = bassRange.reduce((a, b) => a + b, 0) / bassRange.length / 255
    const currentMids = midsRange.reduce((a, b) => a + b, 0) / midsRange.length / 255
    const currentTreble = trebleRange.reduce((a, b) => a + b, 0) / trebleRange.length / 255

    // Apply smoothing
    previousBass.current = previousBass.current * smoothingFactor + 
                          currentBass * (1 - smoothingFactor)
    previousMids.current = previousMids.current * smoothingFactor + 
                          currentMids * (1 - smoothingFactor)
    previousTreble.current = previousTreble.current * smoothingFactor + 
                            currentTreble * (1 - smoothingFactor)

    // Boost and normalize values
    return {
      bass: Math.min(1, previousBass.current * 1.5),     // Boost bass
      mids: Math.min(1, previousMids.current * 1.2),     // Slight boost to mids
      treble: Math.min(1, previousTreble.current * 1.2)  // Slight boost to treble
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    getAudioData,
    startAudio,
    stopAudio,
    isPlaying,
    setVolume: (value) => {
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setValueAtTime(
          value, 
          audioContextRef.current?.currentTime || 0
        )
      }
    }
  }
}