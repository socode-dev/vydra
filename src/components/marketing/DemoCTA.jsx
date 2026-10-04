import { FiArrowUpRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MotionReveal } from "./Motion";

const DemoCTA = () => (
  <section className="scroll-mt-24 border-t border-border/70 px-5 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-22">
    <MotionReveal className="mx-auto flex max-w-7xl flex-col gap-8 border-y border-border py-10 sm:flex-row sm:items-end sm:justify-between sm:gap-12 sm:py-14">
      <div>
        <h2 className="font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">See Vydra in action.</h2>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">Explore the real Vydra experience with representative financial data.</p>
      </div>
      <div className="shrink-0">
        <Link to="/demo" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/10 transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none">
          Launch demo
          <motion.span whileHover={{ x: 3 }} transition={{ duration: 0.2, ease: "easeOut" }}><FiArrowUpRight aria-hidden="true" className="size-4" /></motion.span>
        </Link>
        <p className="mt-3 text-xs text-muted-foreground">Read-only demo. No personal financial information required.</p>
      </div>
    </MotionReveal>
  </section>
);

export default DemoCTA;
