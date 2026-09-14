import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, Line } from '@react-three/drei'
import { ArrowRight, Play, Sparkles } from 'lucide-react'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const GREEN = '#b9ff39'

function Character({ animated = true }: { animated?: boolean }) {
  const group = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!group.current || !animated) return

    const t = clock.getElapsedTime()
    group.current.position.y = Math.abs(Math.sin(t * 7)) * 0.035
    group.current.rotation.y = Math.sin(t * 1.2) * 0.04
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      <mesh position={[0, 2.25, 0]} castShadow>
        <sphereGeometry args={[0.43, 32, 32]} />
        <meshStandardMaterial
          color="#c8d0c5"
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>

      <mesh position={[0, 1.18, 0]} castShadow>
        <capsuleGeometry args={[0.52, 1.25, 10, 24]} />
        <meshStandardMaterial
          color="#424b43"
          roughness={0.42}
          metalness={0.18}
        />
      </mesh>

      <mesh
        position={[-0.58, 1.18, 0]}
        rotation={[0, 0, -0.12]}
        castShadow
      >
        <capsuleGeometry args={[0.12, 0.78, 8, 16]} />
        <meshStandardMaterial color="#aeb7ad" roughness={0.35} />
      </mesh>

      <mesh
        position={[0.58, 1.18, 0]}
        rotation={[0, 0, 0.12]}
        castShadow
      >
        <capsuleGeometry args={[0.12, 0.78, 8, 16]} />
        <meshStandardMaterial color="#aeb7ad" roughness={0.35} />
      </mesh>

      <mesh
        position={[-0.22, 0.05, 0]}
        rotation={[0, 0, -0.02]}
        castShadow
      >
        <capsuleGeometry args={[0.14, 1.05, 8, 16]} />
        <meshStandardMaterial color="#9da79d" roughness={0.38} />
      </mesh>

      <mesh
        position={[0.22, 0.05, 0]}
        rotation={[0, 0, 0.02]}
        castShadow
      >
        <capsuleGeometry args={[0.14, 1.05, 8, 16]} />
        <meshStandardMaterial color="#9da79d" roughness={0.38} />
      </mesh>

      <mesh position={[0, 1.38, 0.43]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color={GREEN}
          emissive={GREEN}
          emissiveIntensity={5}
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
          metalness={0.08}
        />
      </mesh>

      <gridHelper
        args={[30, 30, '#33452e', '#141b14']}
        position={[0, -0.04, 0]}
      />

      <mesh position={[-4, 1.6, -3]} castShadow>
        <boxGeometry args={[2.5, 3.2, 2.5]} />
        <meshStandardMaterial color="#1b221b" roughness={0.65} />
      </mesh>

      <mesh position={[4.5, 1.25, -4]} castShadow>
        <boxGeometry args={[2.4, 2.5, 2.4]} />
        <meshStandardMaterial color="#202820" roughness={0.62} />
      </mesh>

      <mesh position={[5.5, 2.5, 3]} castShadow>
        <boxGeometry args={[2.2, 5, 2.2]} />
        <meshStandardMaterial color="#121812" roughness={0.7} />
      </mesh>
    </>
  )
}

function CameraModel() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[1.25, 0.7, 1.7]} />
        <meshStandardMaterial
          color="#111611"
          metalness={0.9}
          roughness={0.18}
        />
      </mesh>

      <mesh position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.46, 0.55, 32]} />
        <meshStandardMaterial
          color="#263125"
          metalness={0.9}
          roughness={0.08}
        />
      </mesh>

      <mesh position={[0, 0.48, 0]}>
        <boxGeometry args={[0.48, 0.16, 0.58]} />
        <meshStandardMaterial color="#343d34" metalness={0.7} />
      </mesh>

      <pointLight
        position={[0, 0, -1.4]}
        intensity={7}
        distance={5}
        color={GREEN}
      />
    </group>
  )
}

function CameraPath() {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6.5, 3.2, 6),
        new THREE.Vector3(-4.2, 2.5, 4.3),
        new THREE.Vector3(-2.5, 2.1, 3.3),
        new THREE.Vector3(0, 1.8, 3.1),
        new THREE.Vector3(2.8, 2.1, 3.2),
        new THREE.Vector3(4.5, 2.8, 1.8),
        new THREE.Vector3(0, 2.4, -4.2),
        new THREE.Vector3(-5.5, 3.8, -6),
      ]),
    [],
  )

  const points = useMemo(() => curve.getPoints(180), [curve])

  return (
    <>
      <Line
        points={points}
        color={GREEN}
        lineWidth={3}
        transparent
        opacity={0.95}
      />

      <Line
        points={points}
        color={GREEN}
        lineWidth={12}
        transparent
        opacity={0.08}
      />
    </>
  )
}

function DirectorCamera() {
  const camera = useRef<THREE.Group>(null)

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6.5, 3.2, 6),
        new THREE.Vector3(-4.2, 2.5, 4.3),
        new THREE.Vector3(-2.5, 2.1, 3.3),
        new THREE.Vector3(0, 1.8, 3.1),
        new THREE.Vector3(2.8, 2.1, 3.2),
        new THREE.Vector3(4.5, 2.8, 1.8),
        new THREE.Vector3(0, 2.4, -4.2),
        new THREE.Vector3(-5.5, 3.8, -6),
      ]),
    [],
  )

  useFrame(({ clock }) => {
    if (!camera.current) return

    const t = (clock.getElapsedTime() % 16) / 16
    const p = curve.getPointAt(t)

    camera.current.position.lerp(p, 0.045)
    camera.current.lookAt(0, 1.35, 0)
  })

  return (
    <group ref={camera}>
      <CameraModel />
    </group>
  )
}

function DirectorScene() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[9, 6, 11]}
        fov={42}
      />

      <ambientLight intensity={1.25} />

      <hemisphereLight
        args={['#dff5df', '#050805', 2.2]}
      />

      <directionalLight
        position={[5, 10, 7]}
        intensity={4}
        castShadow
      />

      <pointLight
        position={[-5, 5, 4]}
        intensity={20}
        distance={16}
        color={GREEN}
      />

      <Set />
      <Character />
      <CameraPath />
      <DirectorCamera />
    </>
  )
}

function ShotCamera() {
  const camera = useRef<THREE.PerspectiveCamera>(null)

  const target = new THREE.Vector3()

  useFrame(({ clock }) => {
    if (!camera.current) return

    const time = clock.getElapsedTime() % 16
    const t = time / 16

    let position = new THREE.Vector3()

    if (t < 0.16) {
      const p = THREE.MathUtils.smoothstep(t, 0, 0.16)

      position.set(
        THREE.MathUtils.lerp(7.8, 3.8, p),
        THREE.MathUtils.lerp(4.5, 2.3, p),
        THREE.MathUtils.lerp(9, 4.2, p),
      )

      target.set(0, 1.35, 0)
    } else if (t < 0.32) {
      const p = THREE.MathUtils.smoothstep(t, 0.16, 0.32)

      position.set(
        THREE.MathUtils.lerp(3.8, 0, p),
        THREE.MathUtils.lerp(2.3, 1.7, p),
        THREE.MathUtils.lerp(4.2, 3.2, p),
      )

      target.set(0, 1.45, 0)
    } else if (t < 0.62) {
      const p = THREE.MathUtils.smoothstep(t, 0.32, 0.62)

      const angle = THREE.MathUtils.lerp(
        0,
        Math.PI * 1.75,
        p,
      )

      const radius = 3.2

      position.set(
        Math.sin(angle) * radius,
        1.65 + Math.sin(p * Math.PI) * 0.18,
        Math.cos(angle) * radius,
      )

      target.set(0, 1.45, 0)
    } else if (t < 0.78) {
      const p = THREE.MathUtils.smoothstep(t, 0.62, 0.78)

      const angle = THREE.MathUtils.lerp(
        Math.PI * 1.75,
        Math.PI,
        p,
      )

      position.set(
        Math.sin(angle) * 3.7,
        THREE.MathUtils.lerp(1.65, 2.15, p),
        THREE.MathUtils.lerp(
          Math.cos(angle) * 3.2,
          -4.4,
          p,
        ),
      )

      target.set(0, 1.45, 0)
    } else {
      const p = THREE.MathUtils.smoothstep(t, 0.78, 1)

      position.set(
        THREE.MathUtils.lerp(0, 8.8, p),
        THREE.MathUtils.lerp(2.15, 5.2, p),
        THREE.MathUtils.lerp(-4.4, 10, p),
      )

      target.set(0, 1.3, 0)
    }

    camera.current.position.lerp(position, 0.055)

    const look = new THREE.Vector3().lerpVectors(
      camera.current.position,
      target,
      0.96,
    )

    camera.current.lookAt(look)

    camera.current.fov =
      t > 0.28 && t < 0.79 ? 48 : 42

    camera.current.updateProjectionMatrix()
  })

  return (
    <PerspectiveCamera
      ref={camera}
      makeDefault
      position={[7.8, 4.5, 9]}
      fov={42}
      near={0.1}
      far={100}
    />
  )
}

function FootageScene() {
  return (
    <>
      <ShotCamera />

      <ambientLight intensity={1.5} />

      <hemisphereLight
        args={['#e6f4e2', '#050705', 2.5]}
      />

      <directionalLight
        position={[4, 8, 6]}
        intensity={4.2}
        castShadow
      />

      <pointLight
        position={[-4, 4, 4]}
        intensity={18}
        distance={13}
        color={GREEN}
      />

      <pointLight
        position={[4, 3, -4]}
        intensity={12}
        distance={14}
        color="#91b5ff"
      />

      <Set />
      <Character />
    </>
  )
}

export function Hero() {
  return (
    <section className="hero cinematic-hero-section">
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
          Describe the shot you imagine. Camera AI turns your idea
          into cinematic camera movement, ready for Blender.
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
        <div className="hero-director-canvas">
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
            }}
          >
            <color attach="background" args={['#050705']} />
            <fog attach="fog" args={['#050705', 14, 32]} />
            <DirectorScene />
          </Canvas>
        </div>

        <div className="hero-footage-canvas">
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
            }}
          >
            <color attach="background" args={['#050705']} />
            <fog attach="fog" args={['#050705', 10, 28]} />
            <FootageScene />
          </Canvas>
        </div>

        <div className="cinematic-overlay">
          <div className="cinematic-top">
            <span>CAMERA FOOTAGE</span>
            <span className="rec-dot">● REC</span>
          </div>

          <div className="cinematic-frame-lines" />

          <div className="cinematic-bottom">
            <span>FRONT → SIDE → ORBIT → BACK</span>
            <span>35MM · 24 FPS</span>
          </div>
        </div>

        <motion.div
          className="shot-transition"
          animate={{
            opacity: [1, 1, 0, 0, 0, 1, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            times: [0, 0.16, 0.18, 0.76, 0.79, 0.82, 1],
            ease: 'linear',
          }}
        />

        <motion.div
          className="shot-mode"
          animate={{
            opacity: [1, 1, 0, 0, 1, 1],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            times: [0, 0.15, 0.18, 0.78, 0.82, 1],
            ease: 'linear',
          }}
        >
          <span>DIRECTOR VIEW</span>
          <strong>CAMERA PATH</strong>
        </motion.div>

        <motion.div
          className="shot-name"
          animate={{
            opacity: [0, 0, 1, 1, 1],
            y: [10, 10, 0, 0, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            times: [0, 0.78, 0.84, 0.92, 1],
            ease: 'easeInOut',
          }}
        >
          <small>AI CAMERA SYSTEM</small>
          <strong>CamDirector</strong>
          <span>SHOT COMPLETE</span>
        </motion.div>
      </div>
    </section>
  )
}
