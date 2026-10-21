"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Billboard, Text } from "@react-three/drei";
import * as THREE from "three";

/* ──────────────────────────────────────────────
   Platform icon definitions – ONLY the 6 the client wants
   ────────────────────────────────────────────── */
const PLATFORMS = [
  { id: "google-ads",   label: "Google Ads",    icon: "/icons/google-ads.svg",   color: "#4285F4", accent: "#34A853", orbit: 3.2, speed: 0.22,  yOffset: 0.3,  size: 0.52 },
  { id: "facebook-ads", label: "Facebook Ads",  icon: "/icons/facebook-ads.svg", color: "#1877F2", accent: "#42A5F5", orbit: 2.7, speed: -0.28, yOffset: -0.5, size: 0.50 },
  { id: "youtube-ads",  label: "YouTube Ads",   icon: "/icons/youtube-ads.svg",  color: "#FF0000", accent: "#FF6666", orbit: 3.5, speed: 0.18,  yOffset: -0.3, size: 0.50 },
  { id: "tiktok-ads",   label: "TikTok Ads",    icon: "/icons/tiktok-ads.svg",   color: "#010101", accent: "#69C9D0", orbit: 2.9, speed: -0.24, yOffset: 0.7,  size: 0.48 },
  { id: "linkedin-ads", label: "LinkedIn Ads",  icon: "/icons/linkedin-ads.svg", color: "#0A66C2", accent: "#5EBBFF", orbit: 3.7, speed: 0.20,  yOffset: -0.7, size: 0.46 },
  { id: "seo",          label: "SEO",           icon: "/icons/seo.svg",          color: "#006402", accent: "#AEFF1C", orbit: 3.0, speed: -0.30, yOffset: 0.5,  size: 0.48 },
] as const;

type Platform = (typeof PLATFORMS)[number];

/* ──────────────────────────────────────────────
   Shared elapsed time accumulator (avoids THREE.Clock)
   We accumulate delta values from useFrame instead
   of calling state.clock.getElapsedTime().
   ────────────────────────────────────────────── */
const elapsedRef = { current: 0 };

function ElapsedTimeAccumulator() {
  useFrame((_state, delta) => {
    // Cap delta to avoid huge jumps on tab-refocus
    elapsedRef.current += Math.min(delta, 0.1);
  });
  return null;
}

/* ──────────────────────────────────────────────
   Mouse tracker (lightweight, no re-renders)
   ────────────────────────────────────────────── */
const mousePos = new THREE.Vector2(0, 0);

function MouseTracker() {
  const { size } = useThree();
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mousePos.x = (e.clientX / size.width - 0.5) * 2;
      mousePos.y = -(e.clientY / size.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [size]);
  return null;
}



/* ──────────────────────────────────────────────
   Orbit ring (subtle decorative ring)
   ────────────────────────────────────────────── */
function OrbitRing({ radius, tilt }: { radius: number; tilt: number }) {
  const lineObject = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle) * radius * Math.sin(tilt),
          Math.sin(angle) * radius * Math.cos(tilt)
        )
      );
    }
    const geom = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({
      color: "#AEFF1C",
      transparent: true,
      opacity: 0.08,
    });
    return new THREE.Line(geom, mat);
  }, [radius, tilt]);

  return <primitive object={lineObject} />;
}

/* ──────────────────────────────────────────────
   Custom canvas texture for authentic brand icons
   ────────────────────────────────────────────── */
function usePlatformTexture(platform: Platform) {
  return useMemo(() => {
    if (typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // Draw base colored circle immediately
    ctx.beginPath();
    ctx.arc(128, 128, 120, 0, Math.PI * 2);
    ctx.fillStyle = platform.color;
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;

    // Load authentic brand SVG onto canvas
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      ctx.clearRect(0, 0, 256, 256);
      ctx.drawImage(img, 0, 0, 256, 256);
      texture.needsUpdate = true;
    };
    img.src = platform.icon;

    return texture;
  }, [platform.icon, platform.color]);
}

/* ──────────────────────────────────────────────
   Orbiting platform icon ball with brand logo & hover tooltip
   ────────────────────────────────────────────── */
function PlatformIcon({
  platform,
  index,
  total,
  reducedMotion,
}: {
  platform: Platform;
  index: number;
  total: number;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const texture = usePlatformTexture(platform);
  const baseAngle = (index / total) * Math.PI * 2;

  useFrame(() => {
    if (!groupRef.current) return;
    const t = elapsedRef.current;
    const speed = reducedMotion ? platform.speed * 0.1 : platform.speed;
    const angle = baseAngle + t * speed;

    const x = Math.cos(angle) * platform.orbit;
    const z = Math.sin(angle) * platform.orbit;
    const y = platform.yOffset + Math.sin(t * 0.5 + index) * (reducedMotion ? 0.05 : 0.2);

    // Parallax from mouse
    const px = mousePos.x * 0.15;
    const py = mousePos.y * 0.1;

    groupRef.current.position.set(x + px, y + py, z);

    // Smooth hover scale
    const targetScale = hovered ? platform.size * 1.35 : platform.size;
    const cs = groupRef.current.scale.x;
    const ns = cs + (targetScale - cs) * 0.12;
    groupRef.current.scale.setScalar(ns);
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic 3D point light for realistic depth and colored ambient glow */}
      <pointLight
        color={platform.accent}
        intensity={hovered ? 2.5 : 0.4}
        distance={3.5}
        decay={2}
      />

      <Billboard follow lockX={false} lockY={false} lockZ={false}>
        <group
          onPointerEnter={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "pointer";
            setHovered(true);
          }}
          onPointerLeave={(e) => {
            e.stopPropagation();
            document.body.style.cursor = "default";
            setHovered(false);
          }}
        >
          {/* Outer glow ring on hover */}
          {hovered && (
            <mesh position={[0, 0, -0.04]}>
              <circleGeometry args={[1.22, 32]} />
              <meshBasicMaterial color={platform.accent} transparent opacity={0.35} />
            </mesh>
          )}

          {/* White rim border */}
          <mesh position={[0, 0, -0.02]}>
            <circleGeometry args={[1.05, 36]} />
            <meshBasicMaterial color="#FFFFFF" transparent opacity={0.92} />
          </mesh>

          {/* Social media brand icon ball */}
          <mesh position={[0, 0, 0]}>
            <circleGeometry args={[1, 36]} />
            {texture ? (
              <meshBasicMaterial map={texture} transparent />
            ) : (
              <meshBasicMaterial color={platform.color} />
            )}
          </mesh>

          {/* Social media name tooltip shown ONLY on hover */}
          {hovered && (
            <group position={[0, -1.45, 0.08]}>
              {/* Tooltip background pill */}
              <mesh>
                <planeGeometry args={[platform.label.length * 0.22 + 0.6, 0.48]} />
                <meshBasicMaterial color="#0A2A2B" transparent opacity={0.95} depthWrite={false} />
              </mesh>
              {/* Tooltip text */}
              <Text
                position={[0, 0, 0.02]}
                fontSize={0.28}
                color="#AEFF1C"
                anchorX="center"
                anchorY="middle"
                fontWeight="bold"
                letterSpacing={0.03}
              >
                {platform.label}
              </Text>
            </group>
          )}
        </group>
      </Billboard>
    </group>
  );
}



/* ──────────────────────────────────────────────
   Growth particles (floating upward specs)
   ────────────────────────────────────────────── */
function GrowthParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      vel[i] = 0.005 + Math.random() * 0.01;
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const posAttr = pointsRef.current.geometry.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 1] += velocities[i];
      if (posAttr.array[i * 3 + 1] > 5) {
        posAttr.array[i * 3 + 1] = -5;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial color="#AEFF1C" size={0.03} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

/* ──────────────────────────────────────────────
   Camera rig with smooth parallax
   ────────────────────────────────────────────── */
function CameraRig() {
  useFrame((state) => {
    const cam = state.camera;
    const tx = 7 + mousePos.x * 0.4;
    const ty = 2 + mousePos.y * 0.3;
    cam.position.x += (tx - cam.position.x) * 0.02;
    cam.position.y += (ty - cam.position.y) * 0.02;
    cam.lookAt(0, 0, 0);
  });
  return null;
}

/* ──────────────────────────────────────────────
   Main Scene (composed inside Canvas)
   ────────────────────────────────────────────── */
function SceneContent({ reducedMotion }: { reducedMotion: boolean }) {
  const platformCount = PLATFORMS.length; // Always 6

  return (
    <>
      <ElapsedTimeAccumulator />
      <MouseTracker />
      <CameraRig />

      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[-3, -2, -5]} intensity={0.3} color="#AEFF1C" />

      {/* Orbit decorative rings */}
      <OrbitRing radius={2.8} tilt={0.3} />
      <OrbitRing radius={3.4} tilt={-0.5} />
      <OrbitRing radius={3.9} tilt={0.15} />

      {/* Platform icons */}
      {PLATFORMS.map((p, i) => (
        <PlatformIcon
          key={p.id}
          platform={p}
          index={i}
          total={platformCount}
          reducedMotion={reducedMotion}
        />
      ))}

      {/* Rising growth particles */}
      <GrowthParticles count={50} />
    </>
  );
}

/* ──────────────────────────────────────────────
   Exported canvas wrapper
   ────────────────────────────────────────────── */
export function MarketingScene3D({ className = "" }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });

    return () => {
      mq.removeEventListener("change", handler);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <div className={`w-full h-full ${className}`} aria-hidden="true">
      <Canvas
        dpr={typeof window !== "undefined" ? (isMobile ? 1 : Math.min(window.devicePixelRatio, 1.5)) : 1}
        camera={{ position: [7, 2, 5], fov: 40 }}
        gl={{
          antialias: !isMobile,
          alpha: true,
          powerPreference: "high-performance",
        }}
        style={{ background: "transparent" }}
        onCreated={({ gl }) => {
          // Suppress THREE.Clock deprecation: replace R3F's internal
          // clock with the modern THREE.Timer API if available.
          const renderer = gl as THREE.WebGLRenderer & { _clock?: unknown };
          if (typeof THREE.Timer === "function") {
            try {
              renderer._clock = new THREE.Timer();
            } catch {
              // Timer may not be assignable in all R3F versions — safe to ignore
            }
          }
        }}
      >
        <SceneContent reducedMotion={reducedMotion} />
      </Canvas>
    </div>
  );
}

