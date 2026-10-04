import { FiArrowDown, FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import useThemeStore from "../../store/useThemeStore";
import overviewDark from "../../assets/marketing/overview-dark.png";
import overviewLight from "../../assets/marketing/overview-light.png";
import { motion, useReducedMotion } from "framer-motion";
import { MotionReveal } from "./Motion";
import { fadeUpVariants } from "./marketingMotionConfig";

const Hero = () => {
  const theme = useThemeStore((state) => state.theme);
  const reducedMotion = useReducedMotion();
  const overviewImage = theme === "dark" ? overviewDark : overviewLight;
  const heroVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: reducedMotion ? 0 : 0.08 },
    },
  };

  return (
    <section className="marketing-hero relative overflow-hidden px-5 pb-6 pt-10 sm:px-8 sm:pb-14 sm:pt-18 lg:px-10 lg:pb-22 lg:pt-26">
    <div className="marketing-hero-glow pointer-events-none absolute left-1/2 top-0 h-96 w-[min(60rem,100vw)] -translate-x-1/2 opacity-70" aria-hidden="true" />
    <div className="relative mx-auto max-w-7xl">
      <motion.div
        className="mx-auto max-w-3xl text-center"
        initial={reducedMotion ? false : "hidden"}
        animate="visible"
        variants={heroVariants}
      >
        <motion.p variants={fadeUpVariants} className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">
          Personal financial intelligence
        </motion.p>
        <motion.h1 variants={fadeUpVariants} className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-foreground sm:text-7xl lg:text-8xl">
          Financial clarity.
        </motion.h1>
        <motion.p variants={fadeUpVariants} className="mt-6 font-display text-xl leading-tight text-foreground/80 sm:text-2xl">
          Understand what your money is telling you.
        </motion.p>
        <motion.p variants={fadeUpVariants} className="mx-auto mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
          Vydra turns your financial activity into meaningful signals and clear context, helping you see what deserves attention and make informed decisions.
        </motion.p>
        
        <motion.div variants={fadeUpVariants} className="mt-9 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link
            to="/demo"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/10 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
          >
            See Vydra in action
            <motion.span whileHover={{ x: 3 }} transition={{ duration: 0.2, ease: "easeOut" }}>
              <FiArrowUpRight aria-hidden="true" className="size-4" />
            </motion.span>
          </Link>
          
          <a
            href="#how-it-works"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-border bg-transparent px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
          >
            How it works
            <FiArrowDown aria-hidden="true" className="size-4" />
          </a>
        </motion.div>
      </motion.div>

      <MotionReveal delay={0.3} amount={0.1} className="mt-16 sm:mt-20 lg:mt-24">
        <div className="marketing-product-frame relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/25 sm:rounded-2xl">
          <div className="flex h-9 items-center gap-2 border-b border-border bg-surface px-4 sm:h-11 sm:px-5" aria-hidden="true">
            <span className="size-2 rounded-full bg-danger/70" />
            <span className="size-2 rounded-full bg-warning/70" />
            <span className="size-2 rounded-full bg-success/70" />
            <span className="ml-2 h-4 w-px bg-border" />
            <span className="h-2 w-24 rounded-full bg-border/70 sm:w-36" />
          </div>
          <div className="marketing-screenshot-window h-[23rem] bg-background sm:h-[38rem] lg:h-[46rem]">
            <img
              src={overviewImage}
              alt="Vydra Overview showing financial summary cards, a financial overview chart, and budget overview"
              className="block h-auto min-h-full w-full max-w-none object-cover object-top"
              width="1366"
              height="1739"
              fetchPriority="high"
              decoding="async"
            />
          </div>
          <div className="marketing-screenshot-fade pointer-events-none absolute inset-x-0 bottom-0 h-24" aria-hidden="true" />
        </div>
      </MotionReveal>
    </div>
    </section>
  );
};

export default Hero;
