import clsx from "clsx";

const VydraLogo = ({ className, label = "Vydra" }) => {
  const decorative = label === "";

  return (
    <img
      src="/assets/vydra-mark.svg"
      alt={decorative ? "" : label}
      aria-hidden={decorative || undefined}
      className={clsx("inline-block shrink-0 object-contain", className)}
    />
  );
};

export default VydraLogo;
