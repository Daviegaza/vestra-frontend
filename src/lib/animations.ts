import type { Variants, Transition } from 'framer-motion';

export const spring: Transition = { type: 'spring', stiffness: 300, damping: 30 };
export const smooth: Transition = { type: 'spring', stiffness: 120, damping: 20 };
export const snappy: Transition = { type: 'spring', stiffness: 400, damping: 40 };
export const bouncy: Transition = { type: 'spring', stiffness: 200, damping: 15 };

// Page-level staggered children
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

// Fade up + slide — most common card/row entrance
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: smooth },
};

export const fadeUpQuick: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// Scale in — for modals, popovers
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: spring },
};

// Slide in from right — for side panels
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 60 },
  show: { opacity: 1, x: 0, transition: smooth },
};

// Slide in from left
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -60 },
  show: { opacity: 1, x: 0, transition: smooth },
};

// Bounce in — for attention elements
export const bounceIn: Variants = {
  hidden: { opacity: 0, scale: 0.3 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 12 } },
};

// Stagger list items
export const staggerList: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

export const listItem: Variants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

// Floating animation — continuous subtle bounce
export const float: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
  },
};

// Pulse glow — for trust badges, CTAs
export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      '0 0 0 0 rgba(5, 150, 105, 0.4)',
      '0 0 0 16px rgba(5, 150, 105, 0)',
      '0 0 0 0 rgba(5, 150, 105, 0)',
    ],
    transition: { duration: 2.5, repeat: Infinity },
  },
};

// Count up number animation helper
export function animateValue(
  setValue: (v: number) => void,
  end: number,
  duration: number = 2000,
  start: number = 0
) {
  const startTime = performance.now();
  function step(now: number) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    setValue(Math.round(start + (end - start) * eased));
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
