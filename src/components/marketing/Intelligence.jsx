import Screenshot from "./Screenshot";
import insightsDark from "../../assets/marketing/insights-dark.png";
import insightsLight from "../../assets/marketing/insights-light.png";
import { MotionReveal } from "./Motion";

const architecture = ["Financial data", "Structured analysis", "Financial signal", "AI-assisted context"];

const Intelligence = () => (
  <section id="intelligence" className="marketing-section-emphasis scroll-mt-24 border-t border-border/70 px-5 py-10 sm:px-8 lg:px-10 lg:py-18">
    <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-20">
      <MotionReveal className="order-2 overflow-hidden rounded-xl border border-border bg-card shadow-[0_1.5rem_3rem_color-mix(in_srgb,var(--foreground)_10%,transparent)] lg:order-1">
        <Screenshot darkSrc={insightsDark} lightSrc={insightsLight} alt="Vydra Active Insights showing anomaly, budget, and cash-flow insights" className="h-[28rem] overflow-hidden lg:h-[32rem]" imgClassName="h-full min-h-0 object-fill object-center" width="1366" height="1044" />
      </MotionReveal>

      <MotionReveal className="order-1 max-w-xl lg:order-2" delay={0.08}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary sm:text-sm">Financial intelligence</p>
        <h2 className="mt-5 font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Not just what happened. Context for what it means.</h2>
        <p className="mt-6 text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">Vydra identifies meaningful financial conditions from your activity and turns them into clear, contextual insights, so you can understand what deserves attention.</p>
        <ol className="mt-9 border-y border-border">
          {architecture.map((item) => (
            <li key={item} className="flex items-center gap-4 border-b border-border py-4 last:border-b-0"><span className="size-2 rounded-full bg-primary" aria-hidden="true" /><span className="text-sm font-medium sm:text-base">{item}</span></li>
          ))}
        </ol>
        <p className="mt-6 text-sm leading-6 text-muted-foreground">AI helps explain the signal. It doesn&apos;t decide whether the underlying financial condition exists.</p>
      </MotionReveal>
    </div>
  </section>
);

export default Intelligence;
