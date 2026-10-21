import confetti from "canvas-confetti";

export function triggerConfetti() {
  if (typeof window === "undefined") return;

  const brandColors = ["#006402", "#AEFF1C", "#104042", "#fbbf24", "#ffffff"];

  // Center multi-burst explosion
  confetti({
    particleCount: 50,
    spread: 70,
    origin: { y: 0.65 },
    colors: brandColors,
    ticks: 200,
    gravity: 1.1,
    scalar: 1.1,
  });

  // Left cannon burst
  setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 60,
      spread: 60,
      origin: { x: 0.1, y: 0.7 },
      colors: brandColors,
      ticks: 220,
    });
  }, 120);

  // Right cannon burst
  setTimeout(() => {
    confetti({
      particleCount: 35,
      angle: 120,
      spread: 60,
      origin: { x: 0.9, y: 0.7 },
      colors: brandColors,
      ticks: 220,
    });
  }, 240);
}

