"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";

const easeOutQuint = [0.22, 1, 0.36, 1];

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return <AnimatePresence mode="wait" initial={false}><motion.div key={pathname} initial={shouldReduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={shouldReduceMotion ? undefined : { opacity: 0 }} transition={{ duration: shouldReduceMotion ? 0 : 0.28, ease: easeOutQuint }}>{children}</motion.div></AnimatePresence>;
}
