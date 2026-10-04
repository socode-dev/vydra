export const easeOut = [0.22, 1, 0.36, 1];

export const fadeUpVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: easeOut } },
};

export const groupVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};
