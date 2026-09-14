import { motion } from 'framer-motion'
import { Camera, Gauge, Layers3, Wand2 } from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'Cinematic CamDirector',
    text: 'Generate intentional camera movements from simple natural-language direction.',
  },
  {
    icon: Gauge,
    title: 'Precise Control',
    text: 'Tune lens, duration, speed and movement without rebuilding the shot.',
  },
  {
    icon: Layers3,
    title: 'Shot Building',
    text: 'Turn individual camera ideas into organized cinematic sequences.',
  },
  {
    icon: Wand2,
    title: 'AI-Assisted Directing',
    text: 'Focus on the visual idea while AI handles the technical camera setup.',
  },
]

export function Features() {
  return (
    <section className="features" id="features">
      <div className="section-heading centered">
        <span className="section-number">05 / BUILT FOR CREATORS</span>
        <h2>Less keyframes.<br /><em>More filmmaking.</em></h2>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => {
          const Icon = feature.icon

          return (
            <motion.div
              className="feature-card"
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <div className="feature-icon">
                <Icon size={21} />
              </div>

              <span className="feature-index">
                0{index + 1}
              </span>

              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
