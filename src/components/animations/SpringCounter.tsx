"use client";

import { useEffect, useRef, useState } from "react";
import { useSpring, animated, config } from "@react-spring/web";

interface SpringCounterProps {
  value: string | number;
  className?: string;
}

export function SpringCounter({ value, className = "" }: SpringCounterProps) {
  const [isInView, setIsInView] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  const rawStr = String(value);
  // Extract sign or prefix (+ or -)
  const prefixMatch = rawStr.match(/^([+-])/);
  const prefix = prefixMatch ? prefixMatch[1] : "";

  // Extract number (integer or decimal)
  const numMatch = rawStr.replace(/^[+-]/, "").match(/([\d,.]+)/);
  const rawNumStr = numMatch ? numMatch[1].replace(/,/g, "") : "0";
  const targetNumber = parseFloat(rawNumStr) || 0;
  const isDecimal = rawNumStr.includes(".");
  const decimalPlaces = isDecimal ? (rawNumStr.split(".")[1]?.length ?? 1) : 0;

  // Extract suffix (e.g. "%", "+", "k", "k rating", "x Revenue")
  const suffix = rawStr.replace(/^[+-]/, "").replace(numMatch ? numMatch[1] : "", "");

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { animatedNumber } = useSpring({
    from: { animatedNumber: 0 },
    to: { animatedNumber: isInView ? targetNumber : 0 },
    config: {
      mass: 1.2,
      tension: 65,
      friction: 18,
    },
    delay: 150,
  });

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      <animated.span>
        {animatedNumber.to((n) => {
          if (isDecimal) {
            return n.toFixed(decimalPlaces);
          }
          const rounded = Math.round(n);
          // Add thousand commas if target had them
          return rawStr.includes(",") ? rounded.toLocaleString() : rounded.toString();
        })}
      </animated.span>
      {suffix}
    </span>
  );
}
