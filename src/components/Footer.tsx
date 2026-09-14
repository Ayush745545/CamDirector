import { ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <a className="logo" href="#">
          <span className="logo-mark">◉</span>
          CamDirector
        </a>

        <p>AI-powered cinematic camera direction.</p>
      </div>

      <div className="footer-links">
        <a href="#workflow">Workflow</a>
        <a href="#movements">Camera Moves</a>
        <a href="#blender">Blender</a>
        <a href="#features">Features</a>
      </div>

      <a
        className="linkedin-link"
        href="https://www.linkedin.com/"
        target="_blank"
        rel="noreferrer"
      >
        in
        LinkedIn
        <ArrowUpRight size={15} />
      </a>

      <div className="footer-bottom">
        <span>© 2026 Camera AI</span>
        <span>Built for filmmakers & creators</span>
      </div>
    </footer>
  )
}
