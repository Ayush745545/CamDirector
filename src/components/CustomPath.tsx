import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { Move3d, RotateCcw, Sparkles } from 'lucide-react'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const GREEN = '#b9ff39'

function Character() {
  const character = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!character.current) return

    const time = clock.getElapsedTime()
    const walk = Math.sin(time * 7)

    // Walking forward through the scene
    const progress = (time % 10) / 10
    character.current.position.x = -3 + progress * 6
    character.current.position.z = 0.5 + Math.sin(progress * Math.PI * 2) * 1.2

    // Face walking direction
    character.current.rotation.y = Math.PI / 2

    // Walking bounce
    character.current.position.y = 1.15 + Math.abs(Math.sin(time * 7)) * 0.04

    const legs = character.current.children.filter(
      (child) => child.userData.limb,
    )

    legs.forEach((leg, index) => {
      leg.rotation.x = index % 2 === 0 ? walk * 0.35 : -walk * 0.35
    })
  })

  return (
    <group ref={character} position={[-3, 1.15, 0]}>
      {/* Head */}
      <mesh position={[0, 1.45, 0]} castShadow>
        <sphereGeometry args={[0.38, 24, 24]} />
        <meshStandardMaterial
          color="#aab2aa"
          roughness={0.32}
          metalness={0.2}
        />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <capsuleGeometry args={[0.48, 1.05, 8, 20]} />
        <meshStandardMaterial
          color="#424a42"
          roughness={0.5}
          metalness={0.15}
        />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.52, 0.7, 0]} rotation={[0, 0, -0.18]} castShadow>
        <capsuleGeometry args={[0.11, 0.7, 6, 12]} />
        <meshStandardMaterial color="#697169" />
      </mesh>

      {/* Right arm */}
      <mesh position={[0.52, 0.7, 0]} rotation={[0, 0, 0.18]} castShadow>
        <capsuleGeometry args={[0.11, 0.7, 6, 12]} />
        <meshStandardMaterial color="#697169" />
      </mesh>

      {/* Legs */}
      <mesh
        userData={{ limb: true }}
        position={[-0.23, -0.15, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.13, 0.85, 6, 12]} />
        <meshStandardMaterial color="#555e55" />
      </mesh>

      <mesh
        userData={{ limb: true }}
        position={[0.23, -0.15, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.13, 0.85, 6, 12]} />
        <meshStandardMaterial color="#555e55" />
      </mesh>

      {/* Chest light */}
      <mesh position={[0, 0.8, 0.48]}>
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

function CameraFrustum() {
  const points = useMemo(
    () => [
      new THREE.Vector3(-0.65, 0.42, 0),
      new THREE.Vector3(0.65, 0.42, 0),
      new THREE.Vector3(0.65, -0.42, 0),
      new THREE.Vector3(-0.65, -0.42, 0),
      new THREE.Vector3(-0.65, 0.42, 0),

      new THREE.Vector3(0, 0, -3.8),
      new THREE.Vector3(-0.65, 0.42, 0),

      new THREE.Vector3(0, 0, -3.8),
      new THREE.Vector3(0.65, 0.42, 0),

      new THREE.Vector3(0, 0, -3.8),
      new THREE.Vector3(0.65, -0.42, 0),

      new THREE.Vector3(0, 0, -3.8),
      new THREE.Vector3(-0.65, -0.42, 0),
    ],
    [],
  )

  return (
    <Line
      points={points}
      color={GREEN}
      lineWidth={2}
      transparent
      opacity={0.85}
    />
  )
}

function CameraRig() {
  const rig = useRef<THREE.Group>(null)

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8, 3.2, 7),
        new THREE.Vector3(-5, 3.8, 4),
        new THREE.Vector3(-1, 3, 3),
        new THREE.Vector3(3, 3.8, 4),
        new THREE.Vector3(7, 4.5, -2),
      ]),
    [],
  )

  const points = useMemo(() => curve.getPoints(180), [curve])

  useFrame(({ clock }) => {
    if (!rig.current) return

    const t = (clock.getElapsedTime() % 10) / 10

    const position = curve.getPointAt(t)

    // Camera follows the spline
    rig.current.position.copy(position)

    // Always look toward the moving character zone
    const targetX = -3 + t * 6
    const targetZ = 0.5 + Math.sin(t * Math.PI * 2) * 1.2

    rig.current.lookAt(targetX, 1.25, targetZ)
  })

  return (
    <>
      {/* Main 3D camera path */}
      <Line
        points={points}
        color={GREEN}
        lineWidth={3}
        transparent
        opacity={0.95}
      />

      {/* Glow path */}
      <Line
        points={points}
        color={GREEN}
        lineWidth={12}
        transparent
        opacity={0.07}
      />

      {/* Position markers */}
      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const p = curve.getPointAt(t)

        return (
          <mesh key={t} position={p}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshStandardMaterial
              color={GREEN}
              emissive={GREEN}
              emissiveIntensity={4}
            />
          </mesh>
        )
      })}

      {/* Physical camera */}
      <group ref={rig}>
        <mesh castShadow>
          <boxGeometry args={[1.35, 0.75, 1.8]} />
          <meshStandardMaterial
            color="#111511"
            metalness={0.9}
            roughness={0.18}
          />
        </mesh>

        {/* Lens */}
        <mesh
          position={[0, 0, -1.05]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.38, 0.48, 0.5, 32]} />
          <meshStandardMaterial
            color="#202820"
            metalness={0.95}
            roughness={0.08}
            emissive="#5d8018"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Top handle */}
        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[0.55, 0.16, 0.65]} />
          <meshStandardMaterial
            color="#303830"
            metalness={0.7}
          />
        </mesh>

        {/* Camera light */}
        <pointLight
          position={[0, 0, -1.4]}
          intensity={7}
          distance={5}
          color={GREEN}
        />

        <CameraFrustum />
      </group>
    </>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[12, 9, 14]}
        fov={42}
        near={0.1}
        far={100}
      />

      <ambientLight intensity={1.1} />

      <hemisphereLight
        args={['#ffffff', '#111811', 2.2]}
      />

      <directionalLight
        position={[6, 12, 8]}
        intensity={4}
        castShadow
      />

      <pointLight
        position={[-6, 5, 3]}
        intensity={28}
        distance={18}
        color={GREEN}
      />

      <pointLight
        position={[7, 5, -6]}
        intensity={20}
        distance={18}
        color="#8bb7ff"
      />

      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#090d09"
          roughness={0.82}
          metalness={0.12}
        />
      </mesh>

      <gridHelper
        args={[40, 40, '#506044', '#1c241b']}
        position={[0, 0, 0]}
      />

      {/* Environment blocks */}
      <mesh position={[-5, 1.4, -3]} castShadow>
        <boxGeometry args={[2.4, 2.8, 2.4]} />
        <meshStandardMaterial
          color="#202720"
          roughness={0.6}
          metalness={0.25}
        />
      </mesh>

      <mesh position={[5, 1.1, -4]} castShadow>
        <boxGeometry args={[2, 2.2, 2]} />
        <meshStandardMaterial
          color="#252c25"
          roughness={0.58}
          metalness={0.2}
        />
      </mesh>

      <mesh position={[6, 2.2, 2]} castShadow>
        <boxGeometry args={[2.5, 4.4, 2.5]} />
        <meshStandardMaterial
          color="#181e18"
          roughness={0.65}
          metalness={0.2}
        />
      </mesh>

      <Character />
      <CameraRig />

      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.05}
      />
    </>
  )
}

export function CustomPath() {
  return (
    <section className="custom-path" id="custom-path">
      <div className="custom-path-header">
        <div>
          <span className="section-number">
            06 / REAL-TIME CAMERA DIRECTOR
          </span>

          <h2>
            Direct the
            <br />
            <em>entire shot.</em>
          </h2>
        </div>

        <p>
          Watch the character move while the physical camera travels through
          the 3D scene and continuously reframes the action.
        </p>
      </div>

      <div className="custom-path-editor">
        <div className="path-toolbar">
          <div className="path-tools">
            <span className="path-tool active">
              <Move3d size={15} />
              3D VIEW
            </span>

            <span className="path-tool">
              <RotateCcw size={15} />
              ORBIT
            </span>
          </div>

          <div className="path-ai">
            <Sparkles size={14} />
            AI CAMERA PATH
          </div>
        </div>

        <div className="real-3d-scene">
          <Canvas
            shadows
            dpr={[1, 2]}
            gl={{
              antialias: true,
              powerPreference: 'high-performance',
            }}
          >
            <color attach="background" args={['#070907']} />
            <fog attach="fog" args={['#070907', 20, 45]} />
            <Scene />
          </Canvas>

          <div className="scene-hud top-left-hud">
            <span>SUBJECT</span>
            <strong>CHARACTER_001</strong>
            <small>ANIMATED / REAL-TIME</small>
          </div>

          <div className="scene-hud top-right-hud">
            <span>PATH</span>
            <strong>CATMULL-ROM 3D</strong>
            <small>5 CAMERA POSITIONS</small>
          </div>

          <div className="scene-center-label">
            <span>CAMERA</span>
            <strong>CAMERA_001</strong>
          </div>

          <div className="scene-bottom-hud">
            <div>
              <span>POSITION</span>
              <strong>TRACKING</strong>
            </div>

            <div>
              <span>HEIGHT</span>
              <strong>3.20 M</strong>
            </div>

            <div>
              <span>LENS</span>
              <strong>35 MM</strong>
            </div>

            <div>
              <span>FPS</span>
              <strong>24</strong>
            </div>

            <div>
              <span>TAKE</span>
              <strong>01</strong>
            </div>
          </div>

          <div className="real-3d-hint">
            DRAG TO ORBIT · SCROLL TO ZOOM
          </div>
        </div>

        <div className="cinematic-timeline">
          <div className="timeline-label">
            <span>SHORT CINEMATIC CAPTURE</span>
            <strong>10.00 SEC</strong>
          </div>

          <div className="timeline-main">
            <span>00:00</span>

            <div className="timeline-line">
              <div className="timeline-key key-1" />
              <div className="timeline-key key-2" />
              <div className="timeline-key key-3" />
              <div className="timeline-key key-4" />

              <motion.div
                className="timeline-playhead"
                animate={{ left: ['0%', '100%', '0%'] }}
                transition={{
                  duration: 10,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </div>

            <span>00:10</span>
          </div>
        </div>
      </div>
    </section>
  )
}
