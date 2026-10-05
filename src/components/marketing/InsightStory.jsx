import Screenshot from "./Screenshot";
import activityDark from "../../assets/marketing/activity-dark.jpeg";
import activityLight from "../../assets/marketing/activity-light.jpeg";
import conditionDark from "../../assets/marketing/condition-dark.jpeg";
import conditionLight from "../../assets/marketing/condition-light.jpeg";
import insightDark from "../../assets/marketing/insight-dark.jpeg";
import insightLight from "../../assets/marketing/insight-light.jpeg";
import { motion } from "framer-motion";
import { MotionGroup } from "./Motion";
import { fadeUpVariants } from "./marketingMotionConfig";

const story = [
  { label: "Activity", title: "Market and household groceries", detail: "A food purchase enters the activity stream.", darkSrc: activityDark, lightSrc: activityLight, alt: "Vydra transaction showing market and household groceries categorized as Food" },
  { label: "Condition", title: "Food", detail: "Vydra detects that a large portion of the food budget has been used while time remains in the month.", darkSrc: conditionDark, lightSrc: conditionLight, alt: "Vydra Food budget showing spending over its limit" },
  { label: "Insight", title: "A signal with context", detail: "Vydra explains why the condition matters and suggests a next step.", darkSrc: insightDark, lightSrc: insightLight, alt: "Vydra financial insight explaining the Food spending condition" },
];

const InsightStory = () => (
  <section id="activity-story" className="scroll-mt-24 border-t border-border/70 px-5 py-10 sm:px-8 lg:px-10 lg:py-18">
    <div className="mx-auto max-w-7xl">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">The Vydra loop</p>
        <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">From activity to insight.</h2>
      </div>
      <MotionGroup className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-8" delay={0.05}>
        {story.map((item, index) => (
          <motion.article key={item.label} variants={fadeUpVariants} className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">{item.label}</span>
              {index < story.length - 1 && <motion.span variants={fadeUpVariants} className="hidden text-muted-foreground lg:inline" aria-hidden="true">{"\u2192"}</motion.span>}
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card shadow-[0_1.5rem_3rem_color-mix(in_srgb,var(--foreground)_10%,transparent)]">
              <Screenshot darkSrc={item.darkSrc} lightSrc={item.lightSrc} alt={item.alt} imgClassName="h-auto w-full" />
            </div>
            <h3 className="mt-5 font-display text-xl font-medium">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.detail}</p>
          </motion.article>
        ))}
      </MotionGroup>
    </div>
  </section>
);

export default InsightStory;
