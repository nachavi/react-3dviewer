// components/AudioPlayer.jsx
import { useState } from 'react'

export function AudioPlayer({ onStart }) {
  const [started, setStarted] = useState(false)

  if (started) return null

  return (
    <button 
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        padding: '20px 40px',
        fontSize: '20px',
        backgroundColor: '#000',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        zIndex: 1000
      }}
      onClick={() => {
        onStart()
        setStarted(true)
      }}
    >
      Play Music
    </button>
  )
}