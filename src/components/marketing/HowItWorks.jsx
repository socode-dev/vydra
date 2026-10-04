import { motion } from "framer-motion";
import { MotionGroup, MotionReveal } from "./Motion";
import { fadeUpVariants } from "./marketingMotionConfig";

const flow = ["Financial activity", "Signals", "Context", "Understanding"];

const HowItWorks = () => (
  <section id="how-it-works" className="scroll-mt-24 border-t border-border/70 px-5 py-10 sm:px-8 lg:px-10 lg:py-18">
    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-end lg:gap-20">
      <MotionReveal>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">How Vydra works</p>
        <h2 className="mt-5 max-w-xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Your financial activity says more than your balance does.</h2>
        <p className="mt-6 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">Income arrives. Expenses accumulate. Budgets change. Goals move forward. Over time, patterns begin to emerge.</p>
        <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">Vydra helps identify what deserves attention and provides context to help you understand it.</p>
      </MotionReveal>

      <MotionGroup className="border-y border-border py-2">
        <ol className="marketing-flow relative divide-y divide-border">
          {flow.map((item, index) => (
            <motion.li key={item} variants={fadeUpVariants} className="relative flex items-center gap-5 py-5 sm:py-6">
              <span className="relative z-10 bg-background pr-2 font-display text-sm text-primary">0{index + 1}</span>
              <span className="font-display text-xl font-medium sm:text-2xl">{item}</span>
              {index < flow.length - 1 && <span className="ml-auto text-muted-foreground" aria-hidden="true">{"\u2192"}</span>}
            </motion.li>
          ))}
        </ol>
        <motion.p variants={fadeUpVariants} className="px-10 pb-4 pt-5 text-base font-medium text-foreground/80">You decide what happens next.</motion.p>
      </MotionGroup>
    </div>
  </section>
);

export default HowItWorks;
