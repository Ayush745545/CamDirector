import { motion } from 'framer-motion'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line, OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Pause, Play, Sparkles } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const GREEN = '#b9ff39'

function Character({ playing }: { playing: boolean }) {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current || !playing) return

    const t = (clock.getElapsedTime() % 10) / 10
    const walk = clock.getElapsedTime() * 8

    ref.current.position.x = -2.8 + t * 5.6
    ref.current.position.z = Math.sin(t * Math.PI * 2) * 0.7
    ref.current.position.y = Math.abs(Math.sin(walk)) * 0.035

    ref.current.rotation.y = Math.PI / 2

    const legs = ref.current.children.filter(
      (child) => child.userData.limb,
    )

    legs.forEach((leg, i) => {
      leg.rotation.x =
        i % 2 === 0
          ? Math.sin(walk) * 0.35
          : -Math.sin(walk) * 0.35
    })

    const arms = ref.current.children.filter(
      (child) => child.userData.arm,
    )

    arms.forEach((arm, i) => {
      arm.rotation.x =
        i % 2 === 0
          ? -Math.sin(walk) * 0.25
          : Math.sin(walk) * 0.25
    })
  })

  return (
    <group ref={ref}>
      {/* HEAD */}
      <mesh position={[0, 2.45, 0]} castShadow>
        <sphereGeometry args={[0.42, 32, 32]} />
        <meshStandardMaterial
          color="#b8c0b8"
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>

      {/* FACE */}
      <mesh position={[0, 2.48, 0.36]}>
        <boxGeometry args={[0.25, 0.08, 0.025]} />
        <meshStandardMaterial
          color={GREEN}
          emissive={GREEN}
          emissiveIntensity={3}
        />
      </mesh>

      {/* BODY */}
      <mesh position={[0, 1.25, 0]} castShadow>
        <capsuleGeometry args={[0.5, 1.25, 8, 24]} />
        <meshStandardMaterial
          color="#3e473e"
          roughness={0.48}
          metalness={0.15}
        />
      </mesh>

      {/* LEFT LEG */}
      <mesh
        userData={{ limb: true }}
        position={[-0.22, 0.15, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.13, 1, 8, 16]} />
        <meshStandardMaterial color="#697169" />
      </mesh>

      {/* RIGHT LEG */}
      <mesh
        userData={{ limb: true }}
        position={[0.22, 0.15, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.13, 1, 8, 16]} />
        <meshStandardMaterial color="#697169" />
      </mesh>

      {/* LEFT ARM */}
      <mesh
        userData={{ arm: true }}
        position={[-0.58, 1.25, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.11, 0.78, 8, 16]} />
        <meshStandardMaterial color="#727a72" />
      </mesh>

      {/* RIGHT ARM */}
      <mesh
        userData={{ arm: true }}
        position={[0.58, 1.25, 0]}
        castShadow
      >
        <capsuleGeometry args={[0.11, 0.78, 8, 16]} />
        <meshStandardMaterial color="#727a72" />
      </mesh>
    </group>
  )
}

function CameraModel() {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[1.35, 0.75, 1.7]} />
        <meshStandardMaterial
          color="#101510"
          roughness={0.18}
          metalness={0.9}
        />
      </mesh>

      <mesh position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.38, 0.46, 0.5, 32]} />
        <meshStandardMaterial
          color="#242d23"
          roughness={0.08}
          metalness={0.95}
          emissive="#5d8018"
          emissiveIntensity={0.7}
        />
      </mesh>

      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.55, 0.16, 0.65]} />
        <meshStandardMaterial
          color="#353d35"
          metalness={0.75}
        />
      </mesh>

      <pointLight
        position={[0, 0, -1.4]}
        intensity={7}
        distance={5}
        color={GREEN}
      />

      <Line
        points={[
          [-0.72, 0.48, 0],
          [0.72, 0.48, 0],
          [0.72, -0.48, 0],
          [-0.72, -0.48, 0],
          [-0.72, 0.48, 0],
          [0, 0, -4],
          [0.72, 0.48, 0],
          [0, 0, -4],
          [0.72, -0.48, 0],
          [0, 0, -4],
          [-0.72, -0.48, 0],
        ].map(([x, y, z]) => new THREE.Vector3(x, y, z))}
        color={GREEN}
        lineWidth={2}
      />
    </group>
  )
}

function CameraPath({ playing }: { playing: boolean }) {
  const camera = useRef<THREE.Group>(null)

  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 2.8, 7.5),
        new THREE.Vector3(3.5, 3, 5),
        new THREE.Vector3(5.5, 2.7, 1),
        new THREE.Vector3(3.5, 3, -3.5),
        new THREE.Vector3(-2.5, 3.4, -5),
        new THREE.Vector3(-6, 3.8, -1.5),
      ]),
    [],
  )

  const points = useMemo(
    () => curve.getPoints(180),
    [curve],
  )

  useFrame(({ clock }) => {
    if (!camera.current || !playing) return

    const t = (clock.getElapsedTime() % 10) / 10
    const position = curve.getPointAt(t)

    const characterX = -2.8 + t * 5.6
    const characterZ =
      Math.sin(t * Math.PI * 2) * 0.7

    camera.current.position.lerp(position, 0.08)

    camera.current.lookAt(
      characterX,
      1.7,
      characterZ,
    )
  })

  return (
    <>
      <Line
        points={points}
        color={GREEN}
        lineWidth={3}
      />

      <Line
        points={points}
        color={GREEN}
        lineWidth={14}
        transparent
        opacity={0.08}
      />

      {[0, 0.2, 0.4, 0.6, 0.8, 1].map(
        (t) => {
          const p = curve.getPointAt(t)

          return (
            <mesh key={t} position={p}>
              <sphereGeometry
                args={[0.1, 16, 16]}
              />
              <meshStandardMaterial
                color={GREEN}
                emissive={GREEN}
                emissiveIntensity={4}
              />
            </mesh>
          )
        },
      )}

      <group
        ref={camera}
        position={[0, 2.8, 7.5]}
      >
        <CameraModel />
      </group>
    </>
  )
}

function World({
  playing,
  director = false,
}: {
  playing: boolean
  director?: boolean
}) {
  return (
    <>
      <PerspectiveCamera
        makeDefault
        position={
          director
            ? [11, 8, 13]
            : [0, 2.5, 7.5]
        }
        fov={director ? 45 : 48}
      />

      <ambientLight intensity={1.15} />

      <hemisphereLight
        args={['#ffffff', '#101610', 2]}
      />

      <directionalLight
        position={[5, 10, 8]}
        intensity={4}
        castShadow
      />

      <pointLight
        position={[-5, 5, 4]}
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
        receiveShadow
      >
        <planeGeometry args={[40, 40]} />
        <meshStandardMaterial
          color="#090d09"
          roughness={0.82}
          metalness={0.1}
        />
      </mesh>

      <gridHelper
        args={[
          40,
          40,
          '#53653d',
          '#1d251d',
        ]}
      />

      <mesh
        position={[-5, 1.5, -3]}
        castShadow
      >
        <boxGeometry args={[2.5, 3, 2.5]} />
        <meshStandardMaterial color="#202720" />
      </mesh>

      <mesh
        position={[5, 1.2, -4]}
        castShadow
      >
        <boxGeometry args={[2.2, 2.4, 2.2]} />
        <meshStandardMaterial color="#252c25" />
      </mesh>

      <Character playing={playing} />

      {director && (
        <CameraPath playing={playing} />
      )}

      {director && (
        <OrbitControls
          enablePan={false}
          minDistance={7}
          maxDistance={25}
          maxPolarAngle={Math.PI / 2.05}
        />
      )}
    </>
  )
}

export function CameraViewport() {
  const [playing, setPlaying] = useState(true)

  return (
    <section className="viewport-section">
      <motion.div
        className="section-heading"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.span
          className="section-number"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          01 / LIVE 3D CAMERA DIRECTOR
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          See the camera move
          <br />
          <em>before you render.</em>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Direct the camera, watch the character move,
          and see exactly what the camera is capturing.
        </motion.p>
      </motion.div>

      <div
        className="cinematic-director"
        style={{
          border: '1px solid rgba(185,255,57,.18)',
          borderRadius: 22,
          overflow: 'hidden',
          background: '#050705',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom:
              '1px solid rgba(255,255,255,.08)',
            fontSize: 11,
            letterSpacing: '.16em',
            color: '#777f76',
          }}
        >
          <span
            style={{
              color: GREEN,
              fontWeight: 700,
            }}
          >
            CAMDIRECTOR
          </span>

          <span>LIVE CINEMATIC PREVIEW</span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              '1.45fr 1fr',
            minHeight: 560,
          }}
        >
          {/* DIRECTOR VIEW */}
          <div
            style={{
              position: 'relative',
              borderRight:
                '1px solid rgba(255,255,255,.08)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                zIndex: 2,
                top: 18,
                left: 20,
                fontSize: 10,
                letterSpacing: '.16em',
                color: GREEN,
              }}
            >
              DIRECTOR VIEW · CAMERA PATH
            </div>

            <Canvas
              shadows
              dpr={[1, 2]}
              gl={{
                antialias: true,
                powerPreference:
                  'high-performance',
              }}
            >
              <color
                attach="background"
                args={['#070907']}
              />
              <fog
                attach="fog"
                args={[
                  '#070907',
                  18,
                  42,
                ]}
              />

              <World
                playing={playing}
                director
              />
            </Canvas>

            <div
              style={{
                position: 'absolute',
                left: 20,
                bottom: 18,
                fontSize: 10,
                color: '#667066',
              }}
            >
              CAMERA TRACK · FRONT → ORBIT → BACK
            </div>
          </div>

          {/* REAL CAMERA FOOTAGE */}
          <div
            style={{
              position: 'relative',
              background:
                'radial-gradient(circle at 50% 45%, #20291d 0%, #080b08 55%, #030403 100%)',
            }}
          >
            <div
              style={{
                position: 'absolute',
                zIndex: 3,
                top: 18,
                left: 20,
                right: 20,
                display: 'flex',
                justifyContent:
                  'space-between',
                fontSize: 10,
                letterSpacing: '.15em',
              }}
            >
              <span style={{ color: GREEN }}>
                CAMERA FOOTAGE
              </span>

              <span style={{ color: '#6e776d' }}>
                LIVE
              </span>
            </div>

            <Canvas
              shadows
              dpr={[1, 2]}
              gl={{
                antialias: true,
                powerPreference:
                  'high-performance',
              }}
            >
              <color
                attach="background"
                args={['#060806']}
              />

              <fog
                attach="fog"
                args={[
                  '#060806',
                  12,
                  30,
                ]}
              />

              <World playing={playing} />
            </Canvas>

            {/* CINEMATIC FRAME */}
            <div
              style={{
                position: 'absolute',
                inset: 22,
                pointerEvents: 'none',
                border:
                  '1px solid rgba(255,255,255,.18)',
                boxShadow:
                  'inset 0 0 80px rgba(0,0,0,.55)',
              }}
            />

            {/* LETTERBOX */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: 52,
                background:
                  'rgba(0,0,0,.7)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: 52,
                background:
                  'rgba(0,0,0,.7)',
                pointerEvents: 'none',
              }}
            />

            <div
              style={{
                position: 'absolute',
                left: 22,
                bottom: 72,
                color: '#bfc6bc',
                fontSize: 10,
                letterSpacing: '.12em',
              }}
            >
              SHOT 01
            </div>

            <div
              style={{
                position: 'absolute',
                right: 22,
                bottom: 72,
                color: '#737b72',
                fontSize: 10,
                letterSpacing: '.12em',
              }}
            >
              CAMDIRECTOR
            </div>

            <div
              style={{
                position: 'absolute',
                left: '50%',
                bottom: 72,
                transform:
                  'translateX(-50%)',
                color: GREEN,
                fontSize: 10,
                letterSpacing: '.18em',
                fontWeight: 700,
              }}
            >
              CINEMATIC TAKE
            </div>
          </div>
        </div>

        {/* TIMELINE */}
        <div
          style={{
            padding: '18px 20px 22px',
            borderTop:
              '1px solid rgba(255,255,255,.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              marginBottom: 14,
            }}
          >
            <button
              onClick={() =>
                setPlaying(!playing)
              }
              style={{
                width: 42,
                height: 42,
                borderRadius: 10,
                border:
                  '1px solid rgba(185,255,57,.25)',
                background: '#0c110b',
                color: GREEN,
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              {playing ? (
                <Pause size={16} />
              ) : (
                <Play size={16} />
              )}
            </button>

            <div>
              <div
                style={{
                  fontSize: 10,
                  letterSpacing: '.16em',
                  color: GREEN,
                }}
              >
                {playing
                  ? 'PLAYING'
                  : 'PAUSED'}
              </div>

              <div
                style={{
                  marginTop: 3,
                  fontSize: 11,
                  color: '#697269',
                }}
              >
                FRONT → ORBIT → BACK
              </div>
            </div>

            <div
              style={{
                marginLeft: 'auto',
                fontSize: 11,
                color: '#687168',
              }}
            >
              10.00 SEC · 24 FPS
            </div>
          </div>

          <div
            style={{
              height: 3,
              background: '#20251f',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {playing && (
              <div
                style={{
                  position: 'absolute',
                  inset: '0 auto 0 0',
                  width: '42%',
                  background: GREEN,
                  boxShadow:
                    '0 0 14px rgba(185,255,57,.8)',
                  animation:
                    'camdirector-progress 10s linear infinite',
                }}
              />
            )}
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent:
                'space-between',
              marginTop: 8,
              fontSize: 9,
              color: '#555d54',
            }}
          >
            <span>00:00</span>
            <span>FRONT</span>
            <span>ORBIT</span>
            <span>BACK</span>
            <span>00:10</span>
          </div>
        </div>

        {/* BRAND */}
        <div
          style={{
            textAlign: 'center',
            padding: '28px 20px 34px',
            borderTop:
              '1px solid rgba(255,255,255,.06)',
          }}
        >
          <Sparkles
            size={15}
            color={GREEN}
            style={{
              verticalAlign: 'middle',
              marginRight: 8,
            }}
          />

          <span
            style={{
              fontSize: 11,
              letterSpacing: '.28em',
              color: '#697269',
            }}
          >
            AI CAMERA DIRECTION
          </span>

          <div
            style={{
              marginTop: 8,
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: '-.04em',
              color: '#eef2eb',
            }}
          >
            CamDirector
          </div>
        </div>
      </div>

      <style>
        {`
          @keyframes camdirector-progress {
            from { width: 0%; }
            to { width: 100%; }
          }

          @media (max-width: 900px) {
            .cinematic-director > div:nth-child(2) {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>
    </section>
  )
}
