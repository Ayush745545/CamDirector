import { motion } from 'framer-motion'

import { useState } from 'react'


import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { useRef } from 'react'
import * as THREE from 'three'

const GREEN = '#b9ff39'

function Character() {
  const group = useRef<THREE.Group>(null)

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* HEAD */}
      <mesh position={[0, 2.45, 0]} castShadow>
        <sphereGeometry args={[0.43, 32, 32]} />
        <meshStandardMaterial
          color="#bfc5bd"
          roughness={0.32}
          metalness={0.08}
        />
      </mesh>

      {/* NECK */}
      <mesh position={[0, 1.92, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.18, 0.28, 20]} />
        <meshStandardMaterial color="#777e77" />
      </mesh>

      {/* BODY */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.53, 1.25, 10, 24]} />
        <meshStandardMaterial
          color="#3e463e"
          roughness={0.48}
          metalness={0.12}
        />
      </mesh>

      {/* LEFT ARM */}
      <mesh
        position={[-0.63, 1.18, 0]}
        rotation={[0, 0, 0.08]}
        castShadow
      >
        <capsuleGeometry args={[0.12, 0.82, 8, 16]} />
        <meshStandardMaterial color="#858c84" />
      </mesh>

      {/* RIGHT ARM */}
      <mesh
        position={[0.63, 1.18, 0]}
        rotation={[0, 0, -0.08]}
        castShadow
      >
        <capsuleGeometry args={[0.12, 0.82, 8, 16]} />
        <meshStandardMaterial color="#858c84" />
      </mesh>

      {/* LEFT LEG */}
      <mesh position={[-0.22, 0.05, 0]} castShadow>
        <capsuleGeometry args={[0.15, 1.05, 8, 16]} />
        <meshStandardMaterial color="#666e66" />
      </mesh>

      {/* RIGHT LEG */}
      <mesh position={[0.22, 0.05, 0]} castShadow>
        <capsuleGeometry args={[0.15, 1.05, 8, 16]} />
        <meshStandardMaterial color="#666e66" />
      </mesh>

      {/* FACE LIGHTS */}
      <mesh position={[-0.15, 2.48, 0.39]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={GREEN}
          emissive={GREEN}
          emissiveIntensity={7}
        />
      </mesh>

      <mesh position={[0.15, 2.48, 0.39]}>
        <sphereGeometry args={[0.045, 16, 16]} />
        <meshStandardMaterial
          color={GREEN}
          emissive={GREEN}
          emissiveIntensity={7}
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
        position={[0, -0.58, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#070a07"
          roughness={0.84}
          metalness={0.08}
        />
      </mesh>

      <gridHelper
        args={[30, 30, '#263323', '#111811']}
        position={[0, -0.56, 0]}
      />

      <mesh position={[-4.5, 1.5, -3.5]} castShadow>
        <boxGeometry args={[2.5, 3, 2.5]} />
        <meshStandardMaterial color="#151b15" roughness={0.7} />
      </mesh>

      <mesh position={[4.5, 1.2, -4]} castShadow>
        <boxGeometry args={[2.4, 2.4, 2.4]} />
        <meshStandardMaterial color="#1b211b" roughness={0.68} />
      </mesh>

      <mesh position={[0, 3.2, -6]} castShadow>
        <boxGeometry args={[9, 6, 0.4]} />
        <meshStandardMaterial color="#0d120d" roughness={0.9} />
      </mesh>
    </>
  )
}

function CinematicCamera() {
  const camera = useRef<THREE.PerspectiveCamera>(null)

  useFrame(({ clock }) => {
    if (!camera.current) return

    const time = clock.getElapsedTime()
    const cycle = 14
    const t = (time % cycle) / cycle

    const position = new THREE.Vector3()
    const target = new THREE.Vector3(0, 1.55, 0)

    /*
      0.00 - 0.16
      WIDE DIRECTOR VIEW
    */
    if (t < 0.16) {
      const p = THREE.MathUtils.smoothstep(t, 0, 0.16)

      position.set(
        THREE.MathUtils.lerp(8.8, 4.8, p),
        THREE.MathUtils.lerp(5.2, 2.8, p),
        THREE.MathUtils.lerp(10, 6, p),
      )

      target.set(0, 1.35, 0)
    }

    /*
      0.16 - 0.30
      CAMERA PUSHES TOWARD CHARACTER
    */
    else if (t < 0.30) {
      const p = THREE.MathUtils.smoothstep(t, 0.16, 0.30)

      position.set(
        THREE.MathUtils.lerp(4.8, 2.7, p),
        THREE.MathUtils.lerp(2.8, 2.0, p),
        THREE.MathUtils.lerp(6, 3.4, p),
      )

      target.set(0, 1.55, 0)
    }

    /*
      0.30 - 0.48
      FRONT CINEMATIC CAMERA FOOTAGE
    */
    else if (t < 0.48) {
      const p = THREE.MathUtils.smoothstep(t, 0.30, 0.48)

      position.set(
        THREE.MathUtils.lerp(2.7, 0.15, p),
        THREE.MathUtils.lerp(2.0, 1.75, p),
        THREE.MathUtils.lerp(3.4, 3.15, p),
      )

      target.set(0, 1.55, 0)
    }

    /*
      0.48 - 0.66
      FRONT → SIDE → ORBIT
    */
    else if (t < 0.66) {
      const p = THREE.MathUtils.smoothstep(t, 0.48, 0.66)

      const angle = THREE.MathUtils.lerp(0, Math.PI * 0.75, p)
      const radius = 3.15

      position.set(
        Math.sin(angle) * radius,
        1.75 + Math.sin(p * Math.PI) * 0.18,
        Math.cos(angle) * radius,
      )

      target.set(0, 1.55, 0)
    }

    /*
      0.66 - 0.79
      ORBIT → BACK
    */
    else if (t < 0.79) {
      const p = THREE.MathUtils.smoothstep(t, 0.66, 0.79)

      const angle = THREE.MathUtils.lerp(
        Math.PI * 0.75,
        Math.PI,
        p,
      )

      const radius = THREE.MathUtils.lerp(3.15, 3.8, p)

      position.set(
        Math.sin(angle) * radius,
        THREE.MathUtils.lerp(1.75, 2.15, p),
        Math.cos(angle) * radius,
      )

      target.set(0, 1.5, 0)
    }

    /*
      0.79 - 1.0
      PULL BACK TO DIRECTOR VIEW
    */
    else {
      const p = THREE.MathUtils.smoothstep(t, 0.79, 1)

      position.set(
        THREE.MathUtils.lerp(0, 8.8, p),
        THREE.MathUtils.lerp(2.15, 5.2, p),
        THREE.MathUtils.lerp(-3.8, 10, p),
      )

      target.set(0, 1.25, 0)
    }

    camera.current.position.lerp(position, 0.075)

    const lookTarget = new THREE.Vector3().lerpVectors(
      camera.current.position,
      target,
      0.92,
    )

    camera.current.lookAt(lookTarget)

    camera.current.fov = t > 0.29 && t < 0.80 ? 48 : 42
    camera.current.updateProjectionMatrix()
  })

  return (
    <PerspectiveCamera
      ref={camera}
      makeDefault
      position={[8.8, 5.2, 10]}
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

      <ambientLight intensity={1.5} />

      <hemisphereLight
        args={['#dff5df', '#060806', 2.5]}
      />

      <directionalLight
        position={[4, 9, 6]}
        intensity={4.5}
        castShadow
      />

      <pointLight
        position={[-4, 4, 4]}
        intensity={25}
        distance={14}
        color={GREEN}
      />

      <pointLight
        position={[5, 3, -3]}
        intensity={18}
        distance={15}
        color="#9bbcff"
      />

      <Set />
      <Character />

    </>
  )
}

export function Hero() {
  const [showPopup, setShowPopup] = useState(false)

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
          <a
            className="primary-button"
            href="#start"
            onClick={(e) => {
              e.preventDefault()
              setShowPopup(true)
            }}
          >
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
          <fog attach="fog" args={['#050705', 12, 30]} />
          <Scene />
        </Canvas>

        <div className="cinematic-overlay">
          <div className="cinematic-top">
            <span>CAMERA FOOTAGE</span>
            <span className="rec-dot">● REC</span>
          </div>

          <div className="cinematic-frame-lines" />

          <div className="cinematic-bottom">
            <span>CAMDIRECTOR</span>
            <span>LIVE CINEMATIC SHOT</span>
          </div>
        </div>

        <div className="cinematic-caption">
          <small>AI CAMERA MOVEMENT</small>
          <strong>FRONT → ORBIT → BACK</strong>
        </div>
      </div>

      {showPopup && (
        <div className="nav-popup">
          <div className="popup-content">
            <strong>Coming Soon</strong>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}
    </section>
  )
}
