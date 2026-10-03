"use client";

import { motion, useReducedMotion } from "framer-motion";

const easeOutQuint = [0.22, 1, 0.36, 1];
const viewport = { once: true, amount: 0.25 };

const revealVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOutQuint } },
};

const staggerVariants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.08, staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.985 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.65, ease: easeOutQuint } },
};

function MotionWrapper({ children, className, variants, interactive = false, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  return <motion.div {...props} className={className} initial={shouldReduceMotion ? false : "hidden"} whileInView={shouldReduceMotion ? undefined : "visible"} viewport={viewport} variants={variants} whileHover={interactive && !shouldReduceMotion ? { y: -2, scale: 1.01 } : undefined}>{children}</motion.div>;
}

export function Reveal({ children, className, ...props }) {
  return <MotionWrapper {...props} className={className} variants={revealVariants}>{children}</MotionWrapper>;
}

export function Stagger({ children, className, ...props }) {
  return <MotionWrapper {...props} className={className} variants={staggerVariants}>{children}</MotionWrapper>;
}

export function StaggerItem({ children, className, interactive = false, ...props }) {
  return <MotionWrapper {...props} className={className} variants={cardVariants} interactive={interactive}>{children}</MotionWrapper>;
}
