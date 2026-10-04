import { motion, useReducedMotion } from "framer-motion";
import { easeOut, fadeUpVariants, groupVariants } from "./marketingMotionConfig";

export const MotionReveal = ({ children, className = "", delay = 0, amount = 0.2 }) => {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={fadeUpVariants}
      transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const MotionGroup = ({ children, className = "", delay = 0, amount = 0.2 }) => {
  const reducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={reducedMotion ? false : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={groupVariants}
      transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : delay, ease: easeOut }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
