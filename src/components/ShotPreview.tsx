import { Canvas, useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

const GREEN = '#b9ff39'

function Subject() {
  const ref = useRef<THREE.Group>(null)

  useFrame(({ clock }) => {
    if (!ref.current) return

    const t = (clock.getElapsedTime() % 8) / 8
    const walk = clock.getElapsedTime() * 9

    ref.current.position.x = -2.8 + t * 5.6
    ref.current.position.z = Math.sin(t * Math.PI * 2) * 0.8
    ref.current.position.y = Math.abs(Math.sin(walk)) * 0.035

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
        <sphereGeometry args={[0.4, 24, 24]} />
        <meshStandardMaterial
          color="#b5bdb5"
          roughness={0.3}
          metalness={0.15}
        />
      </mesh>

      <mesh position={[0, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.48, 1.2, 8, 20]} />
        <meshStandardMaterial
          color="#3f483f"
          roughness={0.48}
        />
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
        <capsuleGeometry args={[0.1, 0.72, 6, 12]} />
        <meshStandardMaterial color="#697169" />
      </mesh>

      <mesh position={[0.55, 1.15, 0]} castShadow>
        <capsuleGeometry args={[0.1, 0.72, 6, 12]} />
        <meshStandardMaterial color="#697169" />
      </mesh>

      <mesh position={[0, 1.35, 0.5]}>
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

function ShotCamera() {
  const camera = useRef<THREE.PerspectiveCamera>(null)

  useFrame(({ clock }) => {
    if (!camera.current) return

    const t = (clock.getElapsedTime() % 8) / 8

    const x =
      -7 +
      t * 14

    const z =
      5 -
      t * 6 +
      Math.sin(t * Math.PI * 2) * 0.7

    const y =
      3 +
      Math.sin(t * Math.PI) * 1.2

    const target = new THREE.Vector3(
      -2.8 + t * 5.6,
      1.45,
      Math.sin(t * Math.PI * 2) * 0.8,
    )

    camera.current.position.set(x, y, z)
    camera.current.lookAt(target)
  })

  return (
    <PerspectiveCamera
      ref={camera}
      makeDefault
      fov={38}
      near={0.1}
      far={100}
      position={[-7, 3, 5]}
    />
  )
}

function ShotScene() {
  return (
    <>
      <ShotCamera />

      <ambientLight intensity={1.4} />

      <directionalLight
        position={[4, 10, 6]}
        intensity={4}
        castShadow
      />

      <pointLight
        position={[-4, 4, 3]}
        intensity={18}
        distance={15}
        color={GREEN}
      />

      <pointLight
        position={[5, 5, -5]}
        intensity={14}
        distance={16}
        color="#8eb8ff"
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.5, 0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#090d09"
          roughness={0.82}
        />
      </mesh>

      <gridHelper
        args={[40, 40, '#33402f', '#151c15']}
        position={[0, -0.48, 0]}
      />

      <mesh position={[-4, 1.5, -4]} castShadow>
        <boxGeometry args={[2.5, 3, 2.5]} />
        <meshStandardMaterial color="#202820" />
      </mesh>

      <mesh position={[4, 1.2, -5]} castShadow>
        <boxGeometry args={[2.4, 2.4, 2.4]} />
        <meshStandardMaterial color="#252d25" />
      </mesh>

      <mesh position={[0, 2, -7]} castShadow>
        <boxGeometry args={[5, 4, 1]} />
        <meshStandardMaterial color="#171d17" />
      </mesh>

      <Subject />
    </>
  )
}

export function ShotPreview() {
  return (
    <div className="shot-preview">
      <div className="shot-preview-label">
        <div>
          <span>CAMERA OUTPUT</span>
          <strong>WHAT THE CAMERA SEES</strong>
        </div>

        <div className="shot-live">
          <i />
          LIVE
        </div>
      </div>

      <div className="shot-preview-canvas">
        <Canvas
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            powerPreference: 'high-performance',
          }}
        >
          <color attach="background" args={['#070907']} />
          <fog attach="fog" args={['#070907', 15, 35]} />
          <ShotScene />
        </Canvas>

        <div className="shot-frame">
          <span className="frame-corner tl" />
          <span className="frame-corner tr" />
          <span className="frame-corner bl" />
          <span className="frame-corner br" />
        </div>

        <div className="shot-crosshair">
          <span />
          <span />
        </div>

        <div className="shot-hud shot-hud-left">
          <span>SHOT 01</span>
          <strong>TRACKING</strong>
        </div>

        <div className="shot-hud shot-hud-right">
          <span>35 MM</span>
          <strong>24 FPS</strong>
        </div>

        <div className="shot-center-tag">
          AI CAMERA
        </div>

        <div className="shot-bottom">
          <span>00:04:12</span>
          <span>REC ●</span>
          <span>1.85 : 1</span>
        </div>
      </div>
    </div>
  )
}
