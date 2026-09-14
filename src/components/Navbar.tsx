import { ArrowUpRight } from 'lucide-react'

export function Navbar() {
  return (
    <header className="navbar">
      <a className="logo" href="#">
        <span className="logo-mark">◉</span>
        CAMERA<span>AI</span>
      </a>

      <nav>
        <a href="#workflow">Workflow</a>
        <a href="#movements">Camera Moves</a>
        <a href="#blender">Blender</a>
        <a href="#features">Features</a>
      </nav>

      <a className="nav-cta" href="#start">
        Open Studio
        <small>Live Soon</small>
        <ArrowUpRight size={15} />
      </a>
    </header>
  )
}
