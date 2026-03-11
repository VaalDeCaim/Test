"use client";

import { useRef, useState, useEffect, type ReactNode } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  /** Fraction of element that must be visible to trigger (0–1). Default 0.1 */
  threshold?: number;
  /** Distance in px for the slide (opacity + translate). Default 24 */
  distance?: number;
  /** Transition duration in ms. Default 500 */
  duration?: number;
};

export function ScrollReveal({
  children,
  className,
  threshold = 0.1,
  distance = 24,
  duration = 500,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [fromDirection, setFromDirection] = useState<"top" | "bottom">("bottom");
  const scrollDirRef = useRef<"up" | "down">("down");
  const lastScrollY = useRef(0);
  const hasRevealed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      const y = typeof window !== "undefined" ? window.scrollY : 0;
      scrollDirRef.current = y > lastScrollY.current ? "down" : "up";
      lastScrollY.current = y;
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || hasRevealed.current) continue;
          hasRevealed.current = true;
          setFromDirection(scrollDirRef.current === "down" ? "bottom" : "top");
          requestAnimationFrame(() => {
            setVisible(true);
          });
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );

    if (typeof window !== "undefined") {
      lastScrollY.current = window.scrollY;
      window.addEventListener("scroll", handleScroll, { passive: true });
    }
    observer.observe(el);
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("scroll", handleScroll);
      }
      observer.disconnect();
    };
  }, [threshold]);

  const translateY = visible ? 0 : fromDirection === "bottom" ? distance : -distance;
  const opacity = visible ? 1 : 0;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
      }}
    >
      {children}
    </div>
  );
}
