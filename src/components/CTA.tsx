import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTA() {
  return (
    <section className="cta" id="start">
      <motion.div
        className="cta-glow"
        animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <span className="section-number">
        <Sparkles size={14} />
        READY TO DIRECT?
      </span>

      <h2>
        Your next shot
        <br />
        starts with a <em>sentence.</em>
      </h2>

      <p>
        Describe the camera movement. Let AI build the shot.
      </p>

      <a className="primary-button cta-button" href="#top">
        Start Creating
        <ArrowRight size={17} />
      </a>
    </section>
  )
}
