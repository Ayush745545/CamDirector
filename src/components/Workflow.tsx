import { motion } from 'framer-motion'
import { ArrowRight, Brain, MessageSquare, WandSparkles } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Describe',
    text: 'Tell the AI exactly how you want the camera to move.',
    icon: MessageSquare,
  },
  {
    number: '02',
    title: 'AI Plans',
    text: 'CamDirector understands your shot and builds the movement.',
    icon: Brain,
  },
  {
    number: '03',
    title: 'Preview',
    text: 'Watch the camera path animate before touching Blender.',
    icon: WandSparkles,
  },
]

export function Workflow() {
  return (
    <section className="workflow" id="workflow">
      <div className="section-heading centered">
        <span className="section-number">02 / WORKFLOW</span>
        <h2>From idea to<br /><em>camera movement.</em></h2>
        <p>
          No complicated keyframes. Just describe the shot and let AI
          handle the camera direction.
        </p>
      </div>

      <div className="workflow-grid">
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <motion.div
              className="workflow-card"
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
            >
              <div className="workflow-top">
                <span>{step.number}</span>
                <Icon size={20} />
              </div>

              <div className="workflow-icon">
                <Icon size={24} />
              </div>

              <h3>{step.title}</h3>
              <p>{step.text}</p>

              {index < steps.length - 1 && (
                <ArrowRight className="workflow-arrow" size={18} />
              )}
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
