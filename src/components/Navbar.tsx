import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

export function Navbar() {
  const [showPopup, setShowPopup] = useState(false)

  return (
    <header className="navbar">
      <a className="logo" href="#">
        <img src="/logo.png" alt="CamDirector" className="logo-mark" />
        CamDirector
      </a>

      <nav>
        <a href="#workflow">Workflow</a>
        <a href="#movements">Camera Moves</a>
        <a href="#blender">Blender</a>
        <a href="#features">Features</a>
      </nav>

      <a
        className="nav-cta"
        href="#start"
        onClick={(e) => {
          e.preventDefault()
          setShowPopup(true)
        }}
      >
        Open Studio
        <small>Live Soon</small>
        <ArrowUpRight size={15} />
      </a>

      {showPopup && (
        <div className="nav-popup">
          <div className="popup-content">
            <strong>Studio Live Soon</strong>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </header>
  )
}
