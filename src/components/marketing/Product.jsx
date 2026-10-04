import Screenshot from "./Screenshot";
import reportsDark from "../../assets/marketing/reports-dark.png";
import reportsLight from "../../assets/marketing/reports-light.png";
import { MotionReveal } from "./Motion";

const Product = () => (
  <section id="product" className="scroll-mt-24 border-t border-border/70 px-5 py-10 sm:px-8 lg:px-10 lg:py-18">
    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)] lg:items-center lg:gap-20">
      <MotionReveal className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">The product</p>
        <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">One view of your financial life.</h2>
        <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">Vydra brings financial activity, budgets, goals, trends, and insights into one connected experience.</p>
        <div className="mt-9 grid max-w-sm grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-5 text-sm text-foreground/80">
          <span>Track activity</span>
          <span>Budgets &amp; goals</span>
          <span>Understand trends</span>
          <span>See what deserves attention</span>
        </div>
      </MotionReveal>

      <MotionReveal className="overflow-hidden rounded-xl border border-border bg-card shadow-[0_1.5rem_3rem_color-mix(in_srgb,var(--foreground)_10%,transparent)]" delay={0.08}>
        <Screenshot darkSrc={reportsDark} lightSrc={reportsLight} alt="Vydra Reports showing spending by category, category breakdown, and detailed breakdown" className="h-[30rem] overflow-hidden lg:h-[32rem]" imgClassName="h-full min-h-0 object-fill object-center" width="1366" height="1165" />
      </MotionReveal>
    </div>
  </section>
);

export default Product;
