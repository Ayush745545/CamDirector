import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import * as THREE from 'three'

const GREEN = '#b9ff39'
const DURATION = 12

function Character() {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!group.current) return

    const t = clock.getElapsedTime()
    const breathing = Math.sin(t * 1.8) * 0.025
    const sway = Math.sin(t * 1.1) * 0.035

    group.current.position.y = breathing
    group.current.rotation.y = sway
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh position={[0, 2.45, 0]} castShadow>
        <sphereGeometry args={[0.43, 32, 32]} />
        <meshStandardMaterial
          color="#d9ded8"
          roughness={0.28}
          metalness={0.08}
        />
      </mesh>

      <mesh position={[0, 1.3, 0]} castShadow>
        <capsuleGeometry args={[0.52, 1.35, 10, 24]} />
        <meshStandardMaterial
          color="#465047"
          roughness={0.42}
          metalness={0.18}
        />
      </mesh>

      <mesh position={[-0.58, 1.3, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.82, 8, 16]} />
        <meshStandardMaterial color="#c0c6bf" roughness={0.35} />
      </mesh>

      <mesh position={[0.58, 1.3, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.82, 8, 16]} />
        <meshStandardMaterial color="#c0c6bf" roughness={0.35} />
      </mesh>

      <mesh position={[-0.22, 0.05, 0]} castShadow>
        <capsuleGeometry args={[0.14, 1.05, 8, 16]} />
        <meshStandardMaterial color="#aeb5ad" roughness={0.4} />
      </mesh>

      <mesh position={[0.22, 0.05, 0]} castShadow>
        <capsuleGeometry args={[0.14, 1.05, 8, 16]} />
        <meshStandardMaterial color="#aeb5ad" roughness={0.4} />
      </mesh>

      <mesh position={[0, 1.38, 0.5]}>
        <sphereGeometry args={[0.065, 20, 20]} />
        <meshStandardMaterial
          color={GREEN}
          emissive={GREEN}
          emissiveIntensity={4}
        />
      </mesh>
    </group>
  )
}

function Set() {
  return (
    <>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#080c08"
          roughness={0.82}
          metalness={0.12}
        />
      </mesh>

      <gridHelper
        args={[40, 40, '#34402f', '#151b15']}
        position={[0, -0.04, 0]}
      />

      <mesh position={[-4.8, 1.7, -4]} castShadow>
        <boxGeometry args={[2.8, 3.4, 2.8]} />
        <meshStandardMaterial
          color="#171d17"
          roughness={0.58}
          metalness={0.22}
        />
      </mesh>

      <mesh position={[5, 1.35, -5]} castShadow>
        <boxGeometry args={[2.5, 2.7, 2.5]} />
        <meshStandardMaterial
          color="#202720"
          roughness={0.55}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[5.8, 2.7, 3]} castShadow>
        <boxGeometry args={[2.4, 5.4, 2.4]} />
        <meshStandardMaterial
          color="#111711"
          roughness={0.65}
          metalness={0.16}
        />
      </mesh>

      <mesh position={[-7, 1.1, 3]} castShadow>
        <boxGeometry args={[2, 2.2, 2]} />
        <meshStandardMaterial
          color="#1b211b"
          roughness={0.62}
          metalness={0.18}
        />
      </mesh>
    </>
  )
}

function CinematicCamera() {
  const camera = useRef<THREE.PerspectiveCamera>(null)

  useFrame(({ clock }) => {
    if (!camera.current) return

    const elapsed = clock.getElapsedTime()
    const time = elapsed % DURATION
    const t = time / DURATION

    const position = new THREE.Vector3()
    const target = new THREE.Vector3(0, 1.45, 0)

    /*
      0.00 → 0.25
      DIRECTOR VIEW → PUSH IN
    */
    if (t < 0.25) {
      const p = THREE.MathUtils.smoothstep(t, 0, 0.25)

      position.set(
        THREE.MathUtils.lerp(9.5, 4.4, p),
        THREE.MathUtils.lerp(5.8, 2.8, p),
        THREE.MathUtils.lerp(11, 5.6, p),
      )

      target.set(0, 1.35, 0)
    }

    /*
      0.25 → 0.38
      ENTER CINEMATIC CAMERA FOOTAGE
    */
    else if (t < 0.38) {
      const p = THREE.MathUtils.smoothstep(t, 0.25, 0.38)

      position.set(
        THREE.MathUtils.lerp(4.4, 2.4, p),
        THREE.MathUtils.lerp(2.8, 1.85, p),
        THREE.MathUtils.lerp(5.6, 3.25, p),
      )

      target.set(0, 1.5, 0)
    }

    /*
      0.38 → 0.70
      FRONT → SIDE → BACK ORBIT
    */
    else if (t < 0.70) {
      const p = THREE.MathUtils.smoothstep(t, 0.38, 0.70)

      const angle = THREE.MathUtils.lerp(
        0,
        Math.PI,
        p,
      )

      const radius = 3.25

      position.set(
        Math.sin(angle) * radius,
        1.72 + Math.sin(p * Math.PI) * 0.15,
        Math.cos(angle) * radius,
      )

      target.set(0, 1.48, 0)
    }

    /*
      0.70 → 0.75
      HOLD BACK SHOT
    */
    else if (t < 0.75) {
      position.set(0, 2.0, -3.5)
      target.set(0, 1.45, 0)
    }

    /*
      0.75 → 1.00
      PULL BACK TO DIRECTOR VIEW
      LAST 3 SECONDS = CAMDIRECTOR HOLD
    */
    else {
      const p = THREE.MathUtils.smoothstep(t, 0.75, 1)

      position.set(
        THREE.MathUtils.lerp(0, 9.5, p),
        THREE.MathUtils.lerp(2.0, 5.8, p),
        THREE.MathUtils.lerp(-3.5, 11, p),
      )

      target.set(0, 1.3, 0)
    }

    camera.current.position.lerp(position, 0.08)

    const look = new THREE.Vector3().lerpVectors(
      camera.current.position,
      target,
      0.94,
    )

    camera.current.lookAt(look)

    const cinematic = t > 0.25 && t < 0.75
    const desiredFov = cinematic ? 48 : 42

    camera.current.fov = THREE.MathUtils.lerp(
      camera.current.fov,
      desiredFov,
      0.08,
    )

    camera.current.updateProjectionMatrix()
  })

  return (
    <PerspectiveCamera
      ref={camera}
      makeDefault
      position={[9.5, 5.8, 11]}
      fov={42}
      near={0.1}
      far={100}
    />
  )
}

function Scene() {
  return (
    <>
      <CinematicCamera />

      <ambientLight intensity={1.35} />

      <hemisphereLight
        args={['#e9f7e8', '#050705', 2.2]}
      />

      <directionalLight
        position={[5, 10, 7]}
        intensity={4.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <pointLight
        position={[-5, 4, 3]}
        intensity={28}
        distance={16}
        color={GREEN}
      />

      <pointLight
        position={[5, 4, -4]}
        intensity={20}
        distance={18}
        color="#91b9ff"
      />

      <Set />
      <Character />
    </>
  )
}

export function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <motion.div
          className="eyebrow"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles size={14} />
          AI CAMERA DIRECTOR
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Direct your
          <br />
          camera with <em>words.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Describe the shot you imagine. Camera AI turns your idea into
          cinematic camera movement, ready for Blender.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <a className="primary-button" href="#start">
            Create Your Shot
            <ArrowRight size={17} />
          </a>

          <a className="secondary-button" href="#workflow">
            <Play size={15} />
            See how it works
          </a>
        </motion.div>

        <div className="hero-note">
          <span className="live-dot" />
          AI-powered cinematic camera direction
        </div>
      </div>

      <div className="hero-visual cinematic-hero">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
          }}
        >
          <color attach="background" args={['#050705']} />
          <fog attach="fog" args={['#050705', 12, 32]} />
          <Scene />
        </Canvas>

        <div className="cinematic-overlay">
          <div className="cinematic-top">
            <span>CAMERA FOOTAGE</span>
            <span className="rec-dot">● REC</span>
          </div>

          <div className="cinematic-frame-lines" />

          <motion.div
            className="cinematic-mode"
            animate={{
              opacity: [0, 1, 1, 0, 0, 1],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              times: [0, 0.12, 0.25, 0.72, 0.75, 0.76],
              ease: 'easeInOut',
            }}
          >
            DIRECTOR VIEW
          </motion.div>

          <div className="cinematic-bottom">
            <span>FRONT → SIDE → ORBIT → BACK</span>
            <span>LIVE CINEMATIC SHOT</span>
          </div>
        </div>

        <motion.div
          className="camdirector-title"
          animate={{
            opacity: [0, 0, 0, 0, 1, 1],
            y: [10, 10, 10, 10, 0, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            times: [0, 0.72, 0.75, 0.76, 0.79, 1],
            ease: 'easeOut',
          }}
        >
          <small>AI CAMERA SYSTEM</small>
          <strong>CamDirector</strong>
        </motion.div>

        <div className="cinematic-caption">
          <small>AI CAMERA MOVEMENT</small>
          <strong>SMOOTH CINEMATIC PATH</strong>
        </div>
      </div>
    </section>
  )
}
