import { motion, useScroll } from "framer-motion";
import { useLenis } from "../lib/lenis";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const { prefersReducedMotion } = useLenis();
  return prefersReducedMotion ? null : (
    <motion.div
      className="scroll-progress"
      style={{ scaleX: scrollYProgress }}
      aria-hidden="true"
    />
  );
}
