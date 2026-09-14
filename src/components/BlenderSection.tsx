import { Canvas, useFrame } from '@react-three/fiber'
import { Line, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { motion } from 'framer-motion'
import { ArrowDownToLine, Box, Code2, FileBox } from 'lucide-react'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const GREEN = '#b9ff39'

function Character() {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return

    const t = clock.getElapsedTime()

    ref.current.position.y =
      Math.abs(Math.sin(t * 4)) * 0.035

    ref.current.rotation.y =
      Math.sin(t * 0.8) * 0.08
  })

  return (
    <group ref={ref} position={[0, 0, 0]}>
      <mesh position={[0, 2.25, 0]} castShadow>
        <sphereGeometry args={[0.43, 32, 32]} />
        <meshStandardMaterial
          color="#d6ddd5"
          roughness={0.28}
          metalness={0.08}
        />
      </mesh>

      <mesh position={[0, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.52, 1.25, 10, 24]} />
        <meshStandardMaterial
          color="#566056"
          roughness={0.48}
          metalness={0.15}
        />
      </mesh>

      <mesh position={[-0.56, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.78, 8, 16]} />
        <meshStandardMaterial color="#8a948a" />
      </mesh>

      <mesh position={[0.56, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.12, 0.78, 8, 16]} />
        <meshStandardMaterial color="#8a948a" />
      </mesh>

      <mesh position={[-0.22, 0.05, 0]} castShadow>
        <capsuleGeometry args={[0.14, 1.05, 8, 16]} />
        <meshStandardMaterial color="#737d73" />
      </mesh>

      <mesh position={[0.22, 0.05, 0]} castShadow>
        <capsuleGeometry args={[0.14, 1.05, 8, 16]} />
        <meshStandardMaterial color="#737d73" />
      </mesh>

      <mesh position={[-0.15, 2.34, 0.37]}>
        <sphereGeometry args={[0.055, 16, 16]} />
        <meshStandardMaterial
          color={GREEN}
          emissive={GREEN}
          emissiveIntensity={5}
        />
      </mesh>

      <mesh position={[0.15, 2.34, 0.37]}>
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

function CameraRig() {
  const ref = useRef<THREE.Group>(null)

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6.5, 3.2, 5.5),
        new THREE.Vector3(-4.2, 2.7, 4),
        new THREE.Vector3(-2.2, 2.2, 3.2),
        new THREE.Vector3(0, 2.1, 3),
        new THREE.Vector3(2.7, 2.5, 3.6),
        new THREE.Vector3(4.8, 3.2, 2.2),
        new THREE.Vector3(5.8, 3.8, -1),
        new THREE.Vector3(3.5, 4.1, -3.8),
      ]),
    [],
  )

  const points = useMemo(
    () => curve.getPoints(160),
    [curve],
  )

  useFrame(({ clock }) => {
    if (!ref.current) return

    const t = (clock.getElapsedTime() % 10) / 10
    const p = curve.getPointAt(t)

    ref.current.position.lerp(p, 0.08)

    const target = new THREE.Vector3(0, 1.45, 0)

    const desired = new THREE.Quaternion()
    const temp = new THREE.Matrix4()

    temp.lookAt(
      ref.current.position,
      target,
      new THREE.Vector3(0, 1, 0),
    )

    desired.setFromRotationMatrix(temp)

    ref.current.quaternion.slerp(desired, 0.12)
  })

  return (
    <>
      <Line
        points={points}
        color={GREEN}
        lineWidth={2.5}
      />

      <Line
        points={points}
        color={GREEN}
        lineWidth={10}
        transparent
        opacity={0.08}
      />

      {[0, 0.2, 0.4, 0.6, 0.8, 1].map((t) => {
        const p = curve.getPointAt(t)

        return (
          <mesh key={t} position={p}>
            <sphereGeometry args={[0.075, 16, 16]} />
            <meshStandardMaterial
              color={GREEN}
              emissive={GREEN}
              emissiveIntensity={4}
            />
          </mesh>
        )
      })}

      <group ref={ref}>
        <mesh castShadow>
          <boxGeometry args={[0.9, 0.52, 1.2]} />
          <meshStandardMaterial
            color="#151a15"
            roughness={0.2}
            metalness={0.9}
          />
        </mesh>

        <mesh
          position={[0, 0, -0.78]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.28, 0.34, 0.42, 32]} />
          <meshStandardMaterial
            color="#30382d"
            roughness={0.12}
            metalness={0.95}
            emissive="#5f821c"
            emissiveIntensity={0.6}
          />
        </mesh>

        <mesh position={[0, 0.38, 0]}>
          <boxGeometry args={[0.38, 0.1, 0.45]} />
          <meshStandardMaterial
            color="#4b544b"
            metalness={0.7}
          />
        </mesh>

        <pointLight
          position={[0, 0, -1]}
          color={GREEN}
          intensity={5}
          distance={4}
        />
      </group>
    </>
  )
}

function Scene() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[9, 6, 11]}
        fov={42}
      />

      <ambientLight intensity={1.2} />

      <hemisphereLight
        args={['#e8f5e5', '#080b08', 2]}
      />

      <directionalLight
        position={[5, 9, 7]}
        intensity={4}
        castShadow
      />

      <pointLight
        position={[-4, 4, 4]}
        intensity={20}
        distance={14}
        color={GREEN}
      />

      <pointLight
        position={[5, 4, -5]}
        intensity={15}
        distance={15}
        color="#8fb8ff"
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#080c08"
          roughness={0.82}
          metalness={0.12}
        />
      </mesh>

      <gridHelper
        args={[
          30,
          30,
          '#354331',
          '#151c15',
        ]}
      />

      <mesh
        position={[-4, 1.6, -2]}
        castShadow
      >
        <boxGeometry args={[2.2, 3.2, 2.2]} />
        <meshStandardMaterial
          color="#171e17"
          roughness={0.6}
        />
      </mesh>

      <mesh
        position={[4, 1.3, -3]}
        castShadow
      >
        <boxGeometry args={[2.5, 2.6, 2.5]} />
        <meshStandardMaterial
          color="#202720"
          roughness={0.58}
        />
      </mesh>

      <Character />
      <CameraRig />

      {/* LIGHT RIG */}
      <group>
        <mesh position={[-4, 5, 2]}>
          <sphereGeometry args={[0.13, 16, 16]} />
          <meshStandardMaterial
            color={GREEN}
            emissive={GREEN}
            emissiveIntensity={5}
          />
        </mesh>

        <pointLight
          position={[-4, 5, 2]}
          intensity={18}
          distance={10}
          color={GREEN}
        />

        <mesh position={[4, 4, 1]}>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial
            color="#8fb8ff"
            emissive="#8fb8ff"
            emissiveIntensity={4}
          />
        </mesh>

        <pointLight
          position={[4, 4, 1]}
          intensity={14}
          distance={9}
          color="#8fb8ff"
        />

        <Line
          points={[
            new THREE.Vector3(-4, 5, 2),
            new THREE.Vector3(0, 1.4, 0),
          ]}
          color={GREEN}
          lineWidth={1}
          transparent
          opacity={0.25}
        />

        <Line
          points={[
            new THREE.Vector3(4, 4, 1),
            new THREE.Vector3(0, 1.4, 0),
          ]}
          color="#8fb8ff"
          lineWidth={1}
          transparent
          opacity={0.2}
        />
      </group>

      <OrbitControls
        enablePan={false}
        minDistance={6}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.05}
      />
    </>
  )
}

export function BlenderSection() {
  return (
    <section
      className="blender-section"
      id="blender"
    >
      <div className="blender-copy">
        <span className="section-number">
          04 / BLENDER WORKFLOW
        </span>

        <h2>
          From AI idea
          <br />
          to <em>Blender.</em>
        </h2>

        <p>
          Build your camera shot with AI, preview the
          movement, then take the result directly into
          your Blender workflow.
        </p>

        <div className="blender-features">
          <div>
            <Code2 size={18} />
            <span>Python-ready camera animation</span>
          </div>

          <div>
            <FileBox size={18} />
            <span>Exportable shot data</span>
          </div>

          <div>
            <Box size={18} />
            <span>Blender scene workflow</span>
          </div>
        </div>

        <button className="outline-button">
          <ArrowDownToLine size={16} />
          Export to Blender
        </button>
      </div>

      <motion.div
        className="blender-window"
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="blender-bar">
          <div className="window-dots">
            <i />
            <i />
            <i />
          </div>

          <span>CAMERA_AI_SCENE.blend</span>

          <span className="blender-status">
            ● LIVE
          </span>
        </div>

        <div className="blender-body">
          <div className="blender-sidebar">
            <span>SCENE</span>

            <div className="blender-tree active">
              <b>⌄</b>
              <strong>Camera</strong>
              <small>CAMERA.001</small>
            </div>

            <div className="blender-tree active">
              <b>⌄</b>
              <strong>Character</strong>
              <small>CHARACTER_001</small>
            </div>

            <div className="blender-tree active">
              <b>⌄</b>
              <strong>Environment</strong>
              <small>SET_001</small>
            </div>

            <div className="blender-tree active">
              <b>⌄</b>
              <strong>Lights</strong>
              <small>KEY + FILL</small>
            </div>

            <div className="blender-tree active">
              <b>⌄</b>
              <strong>Camera Path</strong>
              <small>AI_PATH_001</small>
            </div>
          </div>

          <div className="blender-viewport">
            <Canvas
              shadows
              dpr={[1, 2]}
              gl={{
                antialias: true,
                powerPreference: 'high-performance',
              }}
            >
              <color
                attach="background"
                args={['#050705']}
              />

              <fog
                attach="fog"
                args={['#050705', 10, 28]}
              />

              <Scene />
            </Canvas>

            <div className="blender-scene-label">
              <span>CAMERA.001</span>
              <strong>35mm</strong>
              <small>AI DIRECTED</small>
            </div>

            <div className="blender-live-label">
              <span className="live-dot" />
              CAMERA PATH ACTIVE
            </div>
          </div>
        </div>

        <div className="blender-timeline">
          <span>00:00</span>

          <div className="blender-track">
            <div className="blender-key key-a" />
            <div className="blender-key key-b" />
            <div className="blender-key key-c" />
            <div className="blender-key key-d" />

            <motion.div
              className="blender-playhead"
              animate={{
                left: ['0%', '100%', '0%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </div>

          <span>10:00</span>
        </div>
      </motion.div>
    </section>
  )
}
