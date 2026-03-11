"use client";

import {useState, useEffect, type ReactNode} from "react";

type AppearProps = {
  children: ReactNode;
  className?: string;
  /** Direction to slide from. Default "up" (from below). */
  direction?: "up" | "down";
  /** Distance in px for the slide. Default 20 */
  distance?: number;
  /** Transition duration in ms. Default 400 */
  duration?: number;
  /** Delay before animation starts in ms. Default 0 */
  delay?: number;
};

export function Appear({
  children,
  className = "",
  direction = "up",
  distance = 20,
  duration = 400,
  delay = 0,
}: AppearProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setVisible(true);
    }, delay);
    return () => window.clearTimeout(id);
  }, [delay]);

  const fromY = direction === "up" ? distance : -distance;
  const translateY = visible ? 0 : fromY;
  const opacity = visible ? 1 : 0;

  return (
    <div
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
