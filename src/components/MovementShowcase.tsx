import { motion } from 'framer-motion'
import { ArrowUpRight, CircleDot, Move3d, Scan } from 'lucide-react'

const movements = [
  {
    name: 'Dolly In',
    description: 'Push toward the subject for cinematic intensity.',
    icon: Move3d,
    path: 'M 30 110 C 100 100 180 70 290 35',
  },
  {
    name: 'Orbit',
    description: 'Circle around your subject while maintaining focus.',
    icon: CircleDot,
    path: 'M 35 75 C 80 15 230 15 285 75 C 230 135 80 135 35 75',
  },
  {
    name: 'Tracking',
    description: 'Follow the subject through the environment.',
    icon: Scan,
    path: 'M 25 55 L 100 55 L 175 55 L 285 55',
  },
]

export function MovementShowcase() {
  return (
    <section className="movements" id="movements">
      <div className="movement-header">
        <div>
          <span className="section-number">03 / CAMERA MOVEMENTS</span>
          <h2>Every cinematic<br /><em>move, directed.</em></h2>
        </div>

        <p>
          Choose a movement, describe the intention, and CamDirector creates
          the path automatically.
        </p>
      </div>

      <div className="movement-grid">
        {movements.map((movement, index) => {
          const Icon = movement.icon

          return (
            <motion.article
              className="movement-card"
              key={movement.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12 }}
            >
              <div className="movement-preview">
                {movement.name === 'Dolly In' ? (
                  <video
                    className="dolly-video"
                    src="/DollyIn.mp4"
                    autoPlay
                    muted
                    loop
                    playsInline
                  />
                ) : (
                  <>
                    <div className="mini-grid" />
                    <div className="mini-subject" />
                    <svg
                      className="movement-path"
                      viewBox="0 0 320 150"
                      preserveAspectRatio="none"
                    >
                      <path d={movement.path} />
                    </svg>
                    <motion.div
                      className="moving-camera"
                      animate={{ x: [0, 110, 220, 110, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                    >
                      <Icon size={15} />
                    </motion.div>
                  </>
                )}

                {movement.name !== 'Dolly In' && (
                  <div className="movement-hud">
                    <span>AI PATH</span>
                    <strong>ACTIVE</strong>
                  </div>
                )}
              </div>

              <div className="movement-info">
                <div className="movement-icon">
                  <Icon size={17} />
                </div>

                <div>
                  <h3>{movement.name}</h3>
                  <p>{movement.description}</p>
                </div>

                <ArrowUpRight size={18} />
              </div>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}
