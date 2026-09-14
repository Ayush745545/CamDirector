import { Canvas, useFrame } from '@react-three/fiber'
import { Line, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Pause, Play, Settings2 } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { ShotPreview } from './ShotPreview'

const GREEN = '#b9ff39'

function Character() {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return

    const t = (clock.getElapsedTime() % 8) / 8
    const walk = clock.getElapsedTime() * 9

    ref.current.position.x = -3 + t * 6
    ref.current.position.z = Math.sin(t * Math.PI * 2) * 1.1
    ref.current.position.y = Math.abs(Math.sin(walk)) * 0.04

    const legs = ref.current.children.filter(
      (child) => child.userData.limb,
    )

    legs.forEach((leg, index) => {
      leg.rotation.x =
        index % 2 === 0
          ? Math.sin(walk) * 0.3
          : -Math.sin(walk) * 0.3
    })
  })

  return (
    <group ref={ref}>
      <mesh position={[0, 2.25, 0]} castShadow>
        <sphereGeometry args={[0.42, 24, 24]} />
        <meshStandardMaterial color="#aeb6ae" roughness={0.35} />
      </mesh>

      <mesh position={[0, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.5, 1.25, 8, 20]} />
        <meshStandardMaterial color="#424a42" roughness={0.5} />
      </mesh>

      <mesh
        userData={{ limb: true }}
        position={[-0.22, 0.02, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.13, 1, 6, 12]} />
        <meshStandardMaterial color="#697169" />
      </mesh>

      <mesh
        userData={{ limb: true }}
        position={[0.22, 0.02, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.13, 1, 6, 12]} />
        <meshStandardMaterial color="#697169" />
      </mesh>

      <mesh position={[-0.55, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.11, 0.75, 6, 12]} />
        <meshStandardMaterial color="#697169" />
      </mesh>

      <mesh position={[0.55, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.11, 0.75, 6, 12]} />
        <meshStandardMaterial color="#697169" />
      </mesh>

      <mesh position={[0, 1.35, 0.5]}>
        <sphereGeometry args={[0.06, 16, 16]} />
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
        new THREE.Vector3(-7, 3, 6),
        new THREE.Vector3(-5, 3.5, 3),
        new THREE.Vector3(-1, 2.8, 3),
        new THREE.Vector3(3, 3.5, 4),
        new THREE.Vector3(7, 4.5, -1),
      ]),
    [],
  )

  const points = useMemo(() => curve.getPoints(150), [curve])

  useFrame(({ clock }) => {
    if (!ref.current) return

    const t = (clock.getElapsedTime() % 8) / 8
    const position = curve.getPointAt(t)

    const target = new THREE.Vector3(
      -3 + t * 6,
      1.3,
      Math.sin(t * Math.PI * 2) * 1.1,
    )

    ref.current.position.copy(position)
    ref.current.lookAt(target)
  })

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

      {[0, 0.25, 0.5, 0.75, 1].map((t) => {
        const point = curve.getPointAt(t)

        return (
          <mesh key={t} position={point}>
            <sphereGeometry args={[0.12, 16, 16]} />
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
          <boxGeometry args={[1.4, 0.75, 1.8]} />
          <meshStandardMaterial
            color="#111511"
            metalness={0.9}
            roughness={0.18}
          />
        </mesh>

        <mesh
          position={[0, 0, -1.05]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.4, 0.48, 0.5, 32]} />
          <meshStandardMaterial
            color="#202820"
            metalness={0.95}
            roughness={0.08}
            emissive="#719d1d"
            emissiveIntensity={0.6}
          />
        </mesh>

        <mesh position={[0, 0.52, 0]}>
          <boxGeometry args={[0.55, 0.16, 0.65]} />
          <meshStandardMaterial color="#303830" />
        </mesh>

        <Line
          points={[
            [-0.7, 0.45, 0],
            [0.7, 0.45, 0],
            [0.7, -0.45, 0],
            [-0.7, -0.45, 0],
            [-0.7, 0.45, 0],
            [0, 0, -4],
            [0.7, 0.45, 0],
            [0, 0, -4],
            [0.7, -0.45, 0],
            [0, 0, -4],
            [-0.7, -0.45, 0],
          ].map(([x, y, z]) => new THREE.Vector3(x, y, z))}
          color={GREEN}
          lineWidth={2}
        />

        <pointLight
          position={[0, 0, -1.5]}
          intensity={8}
          distance={5}
          color={GREEN}
        />
      </group>
    </>
  )
}

function DirectorScene() {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={[11, 8, 13]}
        fov={45}
      />

      <ambientLight intensity={1.1} />

      <hemisphereLight
        args={['#ffffff', '#101810', 2]}
      />

      <directionalLight
        position={[5, 10, 7]}
        intensity={4}
        castShadow
      />

      <pointLight
        position={[-6, 5, 3]}
        intensity={25}
        distance={18}
        color={GREEN}
      />

      <pointLight
        position={[7, 5, -5]}
        intensity={18}
        distance={18}
        color="#8eb8ff"
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#090d09"
          roughness={0.8}
          metalness={0.12}
        />
      </mesh>

      <gridHelper
        args={[40, 40, '#53653d', '#1d251d']}
      />

      <mesh position={[-5, 1.5, -3]} castShadow>
        <boxGeometry args={[2.5, 3, 2.5]} />
        <meshStandardMaterial color="#202720" />
      </mesh>

      <mesh position={[5, 1.2, -4]} castShadow>
        <boxGeometry args={[2.2, 2.4, 2.2]} />
        <meshStandardMaterial color="#252c25" />
      </mesh>

      <Character />
      <CameraRig />

      <OrbitControls
        enablePan={false}
        minDistance={7}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.05}
      />
    </>
  )
}

export function CameraViewport() {
  const [playing, setPlaying] = useState(true)

  return (
    <section className="viewport-section">

      <div className="section-heading">
        <span className="section-number">
          01 / LIVE 3D CAMERA DIRECTOR
        </span>

        <h2>
          See the camera move
          <br />
          <em>before you render.</em>
        </h2>

        <p>
          Direct the physical camera, watch the subject move,
          and see the exact shot the camera is capturing.
        </p>
      </div>

      <div className="viewport">

        <div className="viewport-toolbar">
          <div className="toolbar-left">
            <span className="active-tool">3D VIEW</span>
            <span>CAMERA</span>
            <span>PATH</span>
          </div>

          <div className="toolbar-right">
            <span>REAL-TIME</span>
            <Settings2 size={15} />
          </div>
        </div>

        <div className="director-stage">

          <div className="director-view">

            <div className="view-label">
              <span>DIRECTOR VIEW</span>
              <strong>CAMERA PATH</strong>
            </div>

            <Canvas
              shadows
              dpr={[1, 2]}
              gl={{
                antialias: true,
                powerPreference: 'high-performance',
              }}
            >
              <color attach="background" args={['#070907']} />
              <fog
                attach="fog"
                args={['#070907', 18, 42]}
              />
              <DirectorScene />
            </Canvas>

            <div className="director-bottom">
              <div>
                <span>LENS</span>
                <strong>35 MM</strong>
              </div>

              <div>
                <span>FPS</span>
                <strong>24</strong>
              </div>

              <div>
                <span>SHOT</span>
                <strong>08.0 SEC</strong>
              </div>

              <div>
                <span>MODE</span>
                <strong>AI DIRECTED</strong>
              </div>
            </div>

            <div className="real-3d-hint">
              DRAG TO ORBIT · SCROLL TO ZOOM
            </div>

          </div>

          <ShotPreview />

        </div>

        <div className="timeline">

          <div className="timeline-top">

            <button
              className="play-button"
              onClick={() => setPlaying(!playing)}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? (
                <Pause size={14} />
              ) : (
                <Play size={14} />
              )}
            </button>

            <span>
              {playing ? 'PLAYING' : 'PAUSED'}
            </span>

            <div className="timeline-tools">
              <span>08.0s</span>
              <span>24 FPS</span>
            </div>

          </div>

          <div className="timeline-track">
            <div className="timeline-progress" />
            <div className="timeline-marker" />

            <span>0s</span>
            <span>2s</span>
            <span>4s</span>
            <span>6s</span>
            <span>8s</span>
          </div>

        </div>

      </div>

    </section>
  )
}
