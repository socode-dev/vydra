import VydraLogo from "./VydraLogo";
import clsx from "clsx";

const BrandMark = ({ className, markClassName }) => (
  <span className={clsx("inline-flex items-center gap-1", className)}>
    <VydraLogo variant="mark" className={clsx("size-10 shrink-0", markClassName)} label="" />
    <span className="flex min-w-0 flex-col">
      <span className="font-display text-lg font-semibold leading-none tracking-tight text-primary">Vydra</span>
      <span className="mt-1 text-[0.65rem] leading-none tracking-[0.08em] text-muted-foreground">Financial clarity.</span>
    </span>
  </span>
);
export default BrandMark;
