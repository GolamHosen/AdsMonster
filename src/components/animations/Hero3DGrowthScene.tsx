"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { Volume2, VolumeX } from "lucide-react";

interface ChannelConfig {
  name: string;
  r: number;
  label: string;
  leads: number;
  col: number;
}

const CHANNELS: ChannelConfig[] = [
  { name: "facebook", r: 4.8, label: "Facebook", leads: 2400, col: 0x1877f2 },
  { name: "google", r: 4.3, label: "Google Ads", leads: 3200, col: 0x4285f4 },
  { name: "youtube", r: 4.6, label: "YouTube Ads", leads: 1500, col: 0xff0000 },
  { name: "linkedin", r: 4.1, label: "LinkedIn", leads: 1800, col: 0x0a66c2 },
  { name: "instagram", r: 4.5, label: "Instagram", leads: 2100, col: 0xdd2a7b },
  { name: "tiktok", r: 4.2, label: "TikTok Ads", leads: 1300, col: 0x00f2fe },
  { name: "twitter", r: 3.9, label: "X (Twitter)", leads: 800, col: 0x104042 },
];

const NOTES = [329.63, 392.0, 261.63, 440.0, 523.25, 293.66, 587.33];

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function makeSprite(name: string): THREE.Sprite {
  const size = 256;
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext("2d");
  if (!ctx) return new THREE.Sprite();

  const pad = 16;
  ctx.save();
  ctx.imageSmoothingEnabled = true;

  if (name === "facebook") {
    ctx.fillStyle = "#1877F2";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - pad, 0, Math.PI * 2);
    ctx.fill();

    // Subtle gloss ring
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.lineWidth = 4;
    ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 " + Math.round(size * 0.58) + "px Georgia, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("f", size / 2 + 5, size / 2 + size * 0.05);
  } else if (name === "google") {
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2 - pad, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "rgba(0,0,0,0.06)";
    ctx.lineWidth = 4;
    ctx.stroke();

    const cx = size / 2;
    const cy = size / 2;
    const rad = size * 0.27;
    const cols = ["#4285F4", "#EA4335", "#FBBC05", "#34A853"];
    for (let k = 0; k < 4; k++) {
      ctx.beginPath();
      ctx.strokeStyle = cols[k];
      ctx.lineWidth = size * 0.11;
      ctx.arc(
        cx,
        cy,
        rad,
        (Math.PI / 2) * k - 0.25,
        (Math.PI / 2) * (k + 1) - 0.25
      );
      ctx.stroke();
    }
    ctx.fillStyle = "#104042";
    ctx.font = "700 " + Math.round(size * 0.3) + "px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("G", cx, cy + 3);
  } else if (name === "youtube") {
    ctx.fillStyle = "#FF0000";
    roundRect(ctx, pad, size * 0.22, size - 2 * pad, size * 0.56, size * 0.16);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    const tx = size * 0.44;
    const ty = size * 0.5;
    const tw = size * 0.22;
    ctx.moveTo(tx, ty - tw * 0.55);
    ctx.lineTo(tx, ty + tw * 0.55);
    ctx.lineTo(tx + tw * 0.9, ty);
    ctx.closePath();
    ctx.fill();
  } else if (name === "linkedin") {
    ctx.fillStyle = "#0A66C2";
    roundRect(ctx, pad, pad, size - 2 * pad, size - 2 * pad, size * 0.18);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 " + Math.round(size * 0.42) + "px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("in", size / 2, size / 2 + 3);
  } else if (name === "instagram") {
    const grad = ctx.createLinearGradient(0, size, size, 0);
    grad.addColorStop(0, "#FEDA77");
    grad.addColorStop(0.35, "#DD2A7B");
    grad.addColorStop(0.65, "#9B4EFF");
    grad.addColorStop(1, "#515BD4");
    ctx.fillStyle = grad;
    roundRect(ctx, pad, pad, size - 2 * pad, size - 2 * pad, size * 0.26);
    ctx.fill();

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = size * 0.048;
    roundRect(
      ctx,
      size * 0.26,
      size * 0.26,
      size * 0.48,
      size * 0.48,
      size * 0.14
    );
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size * 0.15, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(size * 0.69, size * 0.31, size * 0.026, 0, Math.PI * 2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fill();
  } else if (name === "tiktok") {
    ctx.fillStyle = "#0A0A0A";
    roundRect(ctx, pad, pad, size - 2 * pad, size - 2 * pad, size * 0.22);
    ctx.fill();

    const nx = size * 0.56;
    const ny = size * 0.34;
    const r = size * 0.1;

    ctx.fillStyle = "#25F4EE";
    ctx.beginPath();
    ctx.arc(nx - size * 0.03, ny + size * 0.02, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FE2C55";
    ctx.beginPath();
    ctx.arc(nx + size * 0.03, ny - size * 0.02, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(nx, ny, r, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillRect(nx, ny - size * 0.02, size * 0.04, size * 0.34);
    ctx.beginPath();
    ctx.arc(nx, ny + size * 0.32, size * 0.085, 0, Math.PI * 2);
    ctx.fill();
  } else if (name === "twitter") {
    ctx.fillStyle = "#0A0A0A";
    roundRect(ctx, pad, pad, size - 2 * pad, size - 2 * pad, size * 0.5);
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "700 " + Math.round(size * 0.4) + "px Arial, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("X", size / 2, size / 2 + 3);
  }
  ctx.restore();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;

  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const spr = new THREE.Sprite(mat);
  spr.scale.set(1.15, 1.15, 1.15);
  return spr;
}

function makeBowTexture(colorHex: string): THREE.CanvasTexture {
  const size = 64;
  const cv = document.createElement("canvas");
  cv.width = size;
  cv.height = size;
  const ctx = cv.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(cv);

  ctx.save();
  ctx.fillStyle = colorHex;
  // Left bow wing
  ctx.beginPath();
  ctx.moveTo(10, 18);
  ctx.lineTo(32, 32);
  ctx.lineTo(10, 46);
  ctx.closePath();
  ctx.fill();

  // Right bow wing
  ctx.beginPath();
  ctx.moveTo(54, 18);
  ctx.lineTo(32, 32);
  ctx.lineTo(54, 46);
  ctx.closePath();
  ctx.fill();

  // Center white knot
  ctx.beginPath();
  ctx.arc(32, 32, 5, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();
  ctx.restore();

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export function Hero3DGrowthScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hudNumRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [soundOn, setSoundOn] = useState(false);
  const soundOnRef = useRef(false);

  // Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const busRef = useRef<GainNode | null>(null);
  const noiseBufRef = useRef<AudioBuffer | null>(null);
  const lastNoteAtRef = useRef<number>(0);
  const totalLeadsRef = useRef<number>(
    CHANNELS.reduce((a, c) => a + c.leads, 0)
  );

  const ensureAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return false;

      const actx = new AC();
      audioCtxRef.current = actx;

      const bus = actx.createGain();
      bus.gain.value = 0.85;
      busRef.current = bus;

      const comp = actx.createDynamicsCompressor();
      const dly = actx.createDelay(1);
      dly.delayTime.value = 0.21;
      const fb = actx.createGain();
      fb.gain.value = 0.28;
      const wet = actx.createGain();
      wet.gain.value = 0.22;
      const lp = actx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 2400;

      bus.connect(comp);
      bus.connect(dly);
      dly.connect(lp);
      lp.connect(fb);
      fb.connect(dly);
      lp.connect(wet);
      wet.connect(comp);
      comp.connect(actx.destination);

      const nbuf = actx.createBuffer(
        1,
        Math.floor(actx.sampleRate * 0.03),
        actx.sampleRate
      );
      const nd = nbuf.getChannelData(0);
      for (let n = 0; n < nd.length; n++) {
        nd[n] = (Math.random() * 2 - 1) * (1 - n / nd.length);
      }
      noiseBufRef.current = nbuf;
    }

    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    return true;
  }, []);

  const playPiano = useCallback(
    (freq: number, vel: number, when: number = 0, pan: number = 0) => {
      const actx = audioCtxRef.current;
      const bus = busRef.current;
      const nbuf = noiseBufRef.current;
      if (!actx || !bus || !nbuf) return;

      const t0 = actx.currentTime + (when || 0);
      const out = actx.createGain();
      const tone = actx.createBiquadFilter();
      tone.type = "lowpass";
      tone.frequency.setValueAtTime(Math.min(freq * 9, 9000), t0);
      tone.frequency.exponentialRampToValueAtTime(freq * 2.5, t0 + 0.7);

      out.gain.setValueAtTime(0.0001, t0);
      out.gain.exponentialRampToValueAtTime(vel, t0 + 0.006);
      out.gain.exponentialRampToValueAtTime(vel * 0.4, t0 + 0.3);
      out.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.2);
      out.connect(tone);

      if (actx.createStereoPanner) {
        const pn = actx.createStereoPanner();
        pn.pan.value = pan;
        tone.connect(pn);
        pn.connect(bus);
      } else {
        tone.connect(bus);
      }

      // Harmonic string partials
      const partials: [number, number, number, number][] = [
        [1, 0.55, 2.2, -4],
        [1, 0.55, 2.2, 4],
        [2, 0.4, 1.5, 0],
        [3, 0.2, 1.0, 0],
        [4, 0.1, 0.7, 0],
        [5, 0.05, 0.5, 0],
      ];

      partials.forEach((p) => {
        const o = actx.createOscillator();
        o.type = "sine";
        o.frequency.value = freq * p[0] * (1 + 0.0004 * p[0] * p[0]);
        o.detune.value = p[3];
        const g = actx.createGain();
        g.gain.setValueAtTime(p[1], t0);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + p[2]);
        o.connect(g);
        g.connect(out);
        o.start(t0);
        o.stop(t0 + p[2] + 0.05);
      });

      // Soft hammer thump
      const nz = actx.createBufferSource();
      nz.buffer = nbuf;
      const nf = actx.createBiquadFilter();
      nf.type = "lowpass";
      nf.frequency.value = 1800;
      const ng = actx.createGain();
      ng.gain.value = 0.4;
      nz.connect(nf);
      nf.connect(ng);
      ng.connect(out);
      nz.start(t0);
    },
    []
  );

  const arrivalNote = useCallback(
    (ci: number, iconX: number) => {
      if (!soundOnRef.current || !audioCtxRef.current) return;
      const now = performance.now();
      if (now - lastNoteAtRef.current < 190) return;
      lastNoteAtRef.current = now;
      const pan = Math.max(-0.7, Math.min(0.7, iconX / 8));
      playPiano(NOTES[ci], 0.2 + Math.random() * 0.08, 0, pan);
    },
    [playPiano]
  );

  const toggleSound = () => {
    if (!soundOn) {
      if (ensureAudio()) {
        soundOnRef.current = true;
        setSoundOn(true);
        // Play gentle rising welcome chord
        [261.63, 329.63, 392.0, 523.25].forEach((f, i) => {
          playPiano(f, 0.2, i * 0.11, 0);
        });
      }
    } else {
      soundOnRef.current = false;
      setSoundOn(false);
    }
  };

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    let animId: number;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      wrap.clientWidth / wrap.clientHeight,
      0.1,
      100
    );
    camera.position.set(0.6, 0.6, 13);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(wrap.clientWidth, wrap.clientHeight);
    wrap.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    // Accent and bar colors (rich AdsMonster emerald/lime progression)
    const accentHex = 0xaeff1c; // Bright neon lime apex
    const barColors = [0x16383a, 0x184d3c, 0x176e4b, 0x006402, 0x00a859];

    // ─── Growth bar chart ───
    const chartGroup = new THREE.Group();
    const bars = 5;
    const barW = 0.62;
    const gap = 0.28;
    const heights = [0.7, 1.3, 1.9, 2.6, 3.5];
    const chartStartX = -((bars - 1) * (barW + gap)) / 2;
    const barMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < bars; i++) {
      const geo = new THREE.BoxGeometry(barW, heights[i], barW);
      const mat = new THREE.MeshBasicMaterial({
        color: barColors[i],
        transparent: true,
        opacity: 0.94,
      });
      const bar = new THREE.Mesh(geo, mat);
      bar.position.set(
        chartStartX + i * (barW + gap),
        heights[i] / 2 - 1.9,
        -0.4
      );
      bar.userData.targetH = heights[i];
      bar.userData.baseY = bar.position.y;
      chartGroup.add(bar);
      barMeshes.push(bar);
    }
    chartGroup.position.set(0, -0.3, 0);
    world.add(chartGroup);

    const apex = new THREE.Vector3(
      chartStartX + (bars - 1) * (barW + gap),
      heights[bars - 1] - 1.9 - 0.3,
      -0.4
    );

    // ─── Channel icons ───
    const iconGroup = new THREE.Group();
    const icons: THREE.Sprite[] = [];
    const N = CHANNELS.length;

    // 7 staggered altitudes for kites soaring in 360 degrees horizontal space
    const KITE_ALTITUDES = [1.2, 2.2, 0.4, 2.6, 0.8, 1.8, 0.2];

    for (let i = 0; i < N; i++) {
      const angle = (i / N) * Math.PI * 2;
      const r = CHANNELS[i].r;
      const pos = new THREE.Vector3(
        Math.cos(angle) * r,
        KITE_ALTITUDES[i % KITE_ALTITUDES.length],
        Math.sin(angle) * (r * 0.95)
      );
      const spr = makeSprite(CHANNELS[i].name);
      spr.position.copy(pos);
      spr.userData.base = pos.clone();
      spr.userData.phase = Math.random() * Math.PI * 2;
      spr.userData.label = CHANNELS[i].label;
      spr.userData.hoverT = 0;
      spr.userData.leads = CHANNELS[i].leads;
      iconGroup.add(spr);
      icons.push(spr);
    }
    world.add(iconGroup);

    // ─── Connecting flexible kite tether strings (curved multi-vertex lines) ───
    const STRING_SEGMENTS = 16;
    const linkLines = icons.map((s, i) => {
      const g = new THREE.BufferGeometry();
      g.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array((STRING_SEGMENTS + 1) * 3),
          3
        )
      );
      const l = new THREE.Line(
        g,
        new THREE.LineBasicMaterial({
          color: CHANNELS[i].col,
          transparent: true,
          opacity: 0.2,
        })
      );
      l.frustumCulled = false;
      world.add(l);
      return l;
    });

    // ─── Fluttering streamer kite tails with decorative ribbon bows ───
    const TAIL_SEGMENTS = 10;
    const tailLines: THREE.Line[] = [];
    const tailBows: THREE.Sprite[][] = [];

    CHANNELS.forEach((ch, i) => {
      const tg = new THREE.BufferGeometry();
      tg.setAttribute(
        "position",
        new THREE.BufferAttribute(
          new Float32Array((TAIL_SEGMENTS + 1) * 3),
          3
        )
      );
      const tl = new THREE.Line(
        tg,
        new THREE.LineBasicMaterial({
          color: ch.col,
          transparent: true,
          opacity: 0.38,
        })
      );
      tl.frustumCulled = false;
      world.add(tl);
      tailLines.push(tl);

      // 3 tiny fluttering ribbon bows along the kite tail
      const bows: THREE.Sprite[] = [];
      const colHex = "#" + ch.col.toString(16).padStart(6, "0");
      const bowTex = makeBowTexture(colHex);

      for (let b = 0; b < 3; b++) {
        const bowMat = new THREE.SpriteMaterial({
          map: bowTex,
          transparent: true,
          opacity: 0.85 - b * 0.15,
        });
        const bowSpr = new THREE.Sprite(bowMat);
        bowSpr.scale.set(0.24 - b * 0.03, 0.24 - b * 0.03, 0.24 - b * 0.03);
        world.add(bowSpr);
        bows.push(bowSpr);
      }
      tailBows.push(bows);
    });

    // ─── Glowing visitor particles ───
    const glowCv = document.createElement("canvas");
    glowCv.width = 64;
    glowCv.height = 64;
    const gctx = glowCv.getContext("2d");
    if (gctx) {
      const grad2 = gctx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad2.addColorStop(0, "rgba(255,255,255,1)");
      grad2.addColorStop(0.35, "rgba(174,255,28,0.7)");
      grad2.addColorStop(1, "rgba(174,255,28,0)");
      gctx.fillStyle = grad2;
      gctx.fillRect(0, 0, 64, 64);
    }
    const glowTex = new THREE.CanvasTexture(glowCv);

    const particles: THREE.Sprite[] = [];
    icons.forEach((s, ci) => {
      for (let k = 0; k < 3; k++) {
        const p = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: glowTex,
            color: CHANNELS[ci].col,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0,
          })
        );
        p.userData.ci = ci;
        p.userData.t = Math.random();
        p.userData.speed = 0.28 + Math.random() * 0.18;
        p.userData.delay = 1.0 + Math.random() * 1.5;
        world.add(p);
        particles.push(p);
      }
    });

    // ─── Glowing beacon at the apex ───
    const beacon = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        color: accentHex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.35,
      })
    );
    beacon.position.copy(apex);
    beacon.scale.setScalar(1.2);
    world.add(beacon);

    let pulse = 0;
    let hudTick = 0;

    // ─── Ambient drifting dots for 3D depth ───
    const dotGeo = new THREE.SphereGeometry(0.035, 6, 6);
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0x104042,
      transparent: true,
      opacity: 0.28,
    });
    const dots: THREE.Mesh[] = [];
    for (let i = 0; i < 24; i++) {
      const d = new THREE.Mesh(dotGeo, dotMat);
      d.position.set(
        (Math.random() - 0.5) * 14,
        (Math.random() - 0.5) * 9,
        (Math.random() - 0.5) * 6 - 3
      );
      d.userData.phase = Math.random() * Math.PI * 2;
      d.userData.base = d.position.clone();
      world.add(d);
      dots.push(d);
    }

    // ─── Interaction & Raycasting ───
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2(-10, -10);
    let hovered: THREE.Sprite | null = null;
    let lastTip = "";
    const worldPos = new THREE.Vector3();

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
      const rect = wrap.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleMouseLeave = () => {
      ndc.x = -10;
      ndc.y = -10;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    wrap.addEventListener("mouseleave", handleMouseLeave);

    const onResize = () => {
      if (!wrap) return;
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w === 0 || h === 0) return;

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      // On wide displays, shift scene right to frame hero headline cleanly
      if (camera.aspect > 1.25) {
        world.position.x = Math.min(5.6, Math.max(4.4, camera.aspect * 2.7));
        world.position.y = 0.1;
        world.scale.setScalar(1.0);
      } else if (camera.aspect > 1.0) {
        world.position.x = 2.8;
        world.position.y = 0;
        world.scale.setScalar(0.9);
      } else {
        // On mobile / narrow screens, center and scale nicely
        world.position.x = 0;
        world.position.y = -0.4;
        world.scale.setScalar(Math.min(0.9, Math.max(0.72, camera.aspect * 0.95)));
      }
    };

    window.addEventListener("resize", onResize);
    onResize();

    const startTime = performance.now();
    let lastTime = startTime;

    // ─── Animation Loop ───
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();
      const t = (now - startTime) * 0.001; // elapsed time in seconds
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      // ─── 360-degree horizontal rotation (left-to-right) ───
      // Continuously rotates 360 degrees horizontally around the vertical Y-axis
      const baseHorizontalSpeed = 0.0035;
      world.rotation.y += baseHorizontalSpeed + mouseX * 0.003;

      // Strictly lock vertical rotation to 0 (no vertical/top-bottom rotation)
      world.rotation.x = 0;
      world.rotation.z = 0;

      // Bars initial entrance growth
      const growT = Math.min(1, t / 1.8);
      const ease = 1 - Math.pow(1 - growT, 3);
      barMeshes.forEach((b) => {
        const h = b.userData.targetH * ease;
        b.scale.y = Math.max(0.001, h / b.userData.targetH);
        b.position.y = b.userData.baseY - (b.userData.targetH - h) / 2;
      });

      // Ambient dots bobbing
      dots.forEach((d) => {
        d.position.y =
          d.userData.base.y + Math.sin(t * 0.3 + d.userData.phase) * 0.3;
      });

      // ─── Kite Aerodynamics: Flying, Banking & Wind Swaying ───
      icons.forEach((s, i) => {
        const phase = s.userData.phase;

        // Figure-8 wind swaying path (harmonic kites soaring in the wind)
        const swayX =
          Math.sin(t * 1.15 + phase) * 0.44 +
          Math.sin(t * 2.3 + phase * 1.6) * 0.16;
        const swayY =
          Math.cos(t * 0.95 + phase) * 0.34 +
          Math.sin(t * 1.8 + phase * 0.9) * 0.14;
        const swayZ = Math.sin(t * 0.75 + phase * 1.3) * 0.22;

        // Wind gust lift & tether tension breathing (pulling against apex tether)
        const gust = Math.sin(t * 0.6 + phase * 0.8);
        const lift = Math.max(0, gust) * 0.32;
        const tetherTension = Math.sin(t * 1.3 + phase) * 0.12;

        // Mouse breeze deflection (horizontal only)
        const mouseWindX = mouseX * 0.45;
        const mouseWindY = 0;

        const targetX = s.userData.base.x + swayX + mouseWindX + tetherTension;
        const targetY = s.userData.base.y + swayY + mouseWindY + lift;
        const targetZ = s.userData.base.z + swayZ;

        const curX = s.position.x;
        s.position.x += (targetX - s.position.x) * 0.08;
        s.position.y += (targetY - s.position.y) * 0.08;
        s.position.z += (targetZ - s.position.z) * 0.08;

        // Aerodynamic roll banking (kite tilts when swaying into the wind!)
        const velX = (s.position.x - curX) / Math.max(dt, 0.001);
        const targetRoll =
          -Math.max(-0.35, Math.min(0.35, velX * 0.2)) +
          Math.sin(t * 2.8 + phase) * 0.06;
        (s.material as THREE.SpriteMaterial).rotation +=
          (targetRoll - (s.material as THREE.SpriteMaterial).rotation) * 0.12;

        // ─── Flexible Curved Kite String (Catenary / Bezier) ───
        const midX =
          (apex.x + s.position.x) * 0.5 + Math.cos(t * 1.4 + i) * 0.1;
        const midY =
          (apex.y + s.position.y) * 0.5 - 0.32 + Math.sin(t * 1.7 + i) * 0.06;
        const midZ =
          (apex.z + s.position.z) * 0.5 + Math.sin(t * 1.1 + i) * 0.08;
        s.userData.midX = midX;
        s.userData.midY = midY;
        s.userData.midZ = midZ;

        const stringPosAttr = linkLines[i].geometry.attributes
          .position as THREE.BufferAttribute;
        for (let k = 0; k <= STRING_SEGMENTS; k++) {
          const u = k / STRING_SEGMENTS;
          const invU = 1 - u;
          const ripple =
            Math.sin(t * 4.0 - u * 7.0 + phase) *
            0.035 *
            Math.sin(Math.PI * u);
          const x =
            invU * invU * apex.x + 2 * invU * u * midX + u * u * s.position.x;
          const y =
            invU * invU * apex.y +
            2 * invU * u * midY +
            u * u * s.position.y +
            ripple;
          const z =
            invU * invU * apex.z + 2 * invU * u * midZ + u * u * s.position.z;
          stringPosAttr.setXYZ(k, x, y, z);
        }
        stringPosAttr.needsUpdate = true;

        // ─── Fluttering Streamer Kite Tails with Ribbon Bows ───
        const tailPosAttr = tailLines[i].geometry.attributes
          .position as THREE.BufferAttribute;
        const kiteBottomX = s.position.x;
        const kiteBottomY = s.position.y - 0.5;
        const kiteBottomZ = s.position.z;

        for (let k = 0; k <= TAIL_SEGMENTS; k++) {
          const segFrac = k / TAIL_SEGMENTS;
          const tailWaveX =
            Math.sin(t * 3.8 - k * 0.55 + phase) * (0.04 + segFrac * 0.24);
          const tailWaveZ =
            Math.cos(t * 3.2 - k * 0.45 + phase) * (0.03 + segFrac * 0.18);
          const gravityY = -k * 0.15;

          const tx = kiteBottomX + tailWaveX + mouseWindX * segFrac * 0.2;
          const ty = kiteBottomY + gravityY;
          const tz = kiteBottomZ + tailWaveZ;
          tailPosAttr.setXYZ(k, tx, ty, tz);

          // Update attached ribbon bows at segments 3, 6, 9
          if (k === 3 && tailBows[i][0]) {
            tailBows[i][0].position.set(tx, ty, tz);
            tailBows[i][0].material.rotation =
              Math.sin(t * 4.5 + phase) * 0.4;
          } else if (k === 6 && tailBows[i][1]) {
            tailBows[i][1].position.set(tx, ty, tz);
            tailBows[i][1].material.rotation =
              Math.sin(t * 4.5 + phase + 1) * 0.4;
          } else if (k === 9 && tailBows[i][2]) {
            tailBows[i][2].position.set(tx, ty, tz);
            tailBows[i][2].material.rotation =
              Math.sin(t * 4.5 + phase + 2) * 0.4;
          }
        }
        tailPosAttr.needsUpdate = true;
      });

      // Particles glide along curved kite string
      particles.forEach((p) => {
        const d = p.userData;
        if (t < d.delay) return;
        d.t += dt * d.speed;
        if (d.t >= 1) {
          d.t = 0;
          d.speed = 0.28 + Math.random() * 0.18;
          icons[d.ci].userData.leads++;
          totalLeadsRef.current++;
          pulse = Math.min(1, pulse + 0.3);
          arrivalNote(d.ci, icons[d.ci].position.x);
        }
        const from = icons[d.ci].position;
        const midX =
          icons[d.ci].userData.midX ?? (apex.x + from.x) * 0.5;
        const midY =
          icons[d.ci].userData.midY ?? (apex.y + from.y) * 0.5;
        const midZ =
          icons[d.ci].userData.midZ ?? (apex.z + from.z) * 0.5;

        const e = d.t * d.t * (3 - 2 * d.t); // Smoothstep curve
        const u = 1 - e; // 0 at kite, 1 at apex
        const invU = 1 - u;

        const px =
          invU * invU * apex.x + 2 * invU * u * midX + u * u * from.x;
        const py =
          invU * invU * apex.y + 2 * invU * u * midY + u * u * from.y;
        const pz =
          invU * invU * apex.z + 2 * invU * u * midZ + u * u * from.z;

        p.position.set(px, py, pz);
        const k = Math.sin(Math.PI * d.t);
        p.scale.setScalar(0.12 + 0.26 * k);
        (p.material as THREE.SpriteMaterial).opacity =
          0.25 + 0.75 * Math.min(1, k * 1.6);
      });

      // Beacon decay
      pulse *= 0.93;
      beacon.scale.setScalar(1.1 + pulse * 1.2);
      (beacon.material as THREE.SpriteMaterial).opacity = 0.35 + pulse * 0.55;

      // Update HUD number with formatted commas
      hudTick += dt;
      if (hudTick > 0.08 && hudNumRef.current) {
        hudTick = 0;
        hudNumRef.current.textContent =
          totalLeadsRef.current.toLocaleString("en-US");
      }

      // Raycaster hover detection
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(icons);
      hovered = hits.length ? (hits[0].object as THREE.Sprite) : null;

      icons.forEach((s, i) => {
        const target = s === hovered ? 1 : 0;
        s.userData.hoverT += (target - s.userData.hoverT) * 0.18;
        s.scale.setScalar(1.15 * (1 + s.userData.hoverT * 0.35));
        (linkLines[i].material as THREE.LineBasicMaterial).opacity =
          0.2 + s.userData.hoverT * 0.7;
        (tailLines[i].material as THREE.LineBasicMaterial).opacity =
          0.38 + s.userData.hoverT * 0.4;
      });

      // Position screen-space tooltip
      const tooltip = tooltipRef.current;
      if (tooltip) {
        if (hovered) {
          hovered.getWorldPosition(worldPos);
          const p = worldPos.clone().project(camera);
          const rect = wrap.getBoundingClientRect();
          const sx = (p.x * 0.5 + 0.5) * rect.width;
          const sy = (-p.y * 0.5 + 0.5) * rect.height;

          tooltip.style.left = `${sx}px`;
          tooltip.style.top = `${sy}px`;

          const tip = `<span class="font-bold text-sm tracking-tight text-[#104042]">${
            hovered.userData.label
          }</span><span class="block text-xs font-semibold text-[#006402] mt-0.5">${hovered.userData.leads.toLocaleString(
            "en-US"
          )} leads</span>`;

          if (tip !== lastTip) {
            tooltip.innerHTML = tip;
            lastTip = tip;
          }
          tooltip.style.opacity = "1";
          tooltip.style.transform = "translate(-50%, calc(-100% - 24px)) scale(1)";
          wrap.style.cursor = "pointer";
        } else {
          tooltip.style.opacity = "0";
          tooltip.style.transform = "translate(-50%, calc(-100% - 14px)) scale(0.95)";
          wrap.style.cursor = "default";
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", handleMouseMove);
      wrap.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", onResize);

      // Clean up WebGL resources
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
      dotGeo.dispose();
      dotMat.dispose();
      barMeshes.forEach((b) => {
        b.geometry.dispose();
        (b.material as THREE.Material).dispose();
      });
      icons.forEach((s) => {
        (s.material as THREE.SpriteMaterial).map?.dispose();
        (s.material as THREE.SpriteMaterial).dispose();
      });
      linkLines.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
      particles.forEach((p) => {
        (p.material as THREE.SpriteMaterial).dispose();
      });
      tailLines.forEach((tl) => {
        tl.geometry.dispose();
        (tl.material as THREE.Material).dispose();
      });
      tailBows.forEach((bowList) => {
        bowList.forEach((b) => {
          (b.material as THREE.SpriteMaterial).map?.dispose();
          (b.material as THREE.SpriteMaterial).dispose();
        });
      });
      beacon.geometry.dispose();
      (beacon.material as THREE.SpriteMaterial).dispose();
      glowTex.dispose();
    };
  }, [arrivalNote]);

  return (
    <>
      {/* Three.js Canvas container spanning the hero */}
      <div
        ref={wrapRef}
        id="canvas-wrap"
        className="absolute inset-0 z-0 overflow-hidden pointer-events-auto"
        aria-hidden="true"
      />

      {/* Subtle directional scrim to ensure 100% readability of left copy */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none bg-gradient-to-r from-[#E2F1F1] via-[#E2F1F1]/85 to-transparent lg:w-[60%] w-full"
        aria-hidden="true"
      />

      {/* Screen-space floating tooltip for hovered social media icon */}
      <div
        ref={tooltipRef}
        className="pointer-events-none absolute z-20 rounded-xl border border-[#104042]/15 bg-white/95 px-3 py-1.5 shadow-xl backdrop-blur-md transition-[opacity,transform] duration-200 ease-out opacity-0 text-center select-none"
        style={{ willChange: "transform, opacity" }}
      />

      {/* Real-time HUD Card in bottom-right corner */}
      <div className="absolute right-4 sm:right-8 lg:right-12 bottom-4 sm:bottom-6 lg:bottom-8 z-30 w-fit min-w-[240px] sm:min-w-[270px] rounded-2xl border border-[#104042]/15 bg-white/95 p-4 sm:p-5 shadow-2xl backdrop-blur-xl pointer-events-auto">
        <div className="flex items-center justify-between gap-3 border-b border-[#104042]/10 pb-2.5 mb-2.5">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#104042]/80">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-[#006402] opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#006402]" />
            </span>
            <span>Leads from all channels</span>
          </div>

          {/* Sound synthesizer toggle button */}
          <button
            onClick={toggleSound}
            type="button"
            className="flex items-center gap-1.5 rounded-full border border-[#104042]/20 bg-white/90 px-2.5 py-1 text-[11px] font-bold text-[#104042] transition-colors hover:border-[#006402] hover:text-[#006402]"
            aria-pressed={soundOn}
            title={soundOn ? "Mute interactive piano" : "Enable piano audio"}
          >
            {soundOn ? (
              <>
                <Volume2 className="h-3 w-3 text-[#006402] animate-pulse" />
                <span>Sound on</span>
              </>
            ) : (
              <>
                <VolumeX className="h-3 w-3 text-[#5E5E5E]" />
                <span className="text-[#5E5E5E]">Sound off</span>
              </>
            )}
          </button>
        </div>

        {/* Live leads number */}
        <div
          ref={hudNumRef}
          className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-[#104042] tabular-nums"
        >
          {totalLeadsRef.current.toLocaleString("en-US")}
        </div>

        <div className="mt-1 flex items-center gap-1.5 text-xs font-bold text-[#006402]">
          <span>▲ 18.4%</span>
          <span className="font-medium text-[#5E5E5E]">vs last month</span>
        </div>

        <div className="mt-2 text-[10px] font-medium text-[#5E5E5E]/80">
          Sample campaign data, updating live
        </div>
      </div>
    </>
  );
}
