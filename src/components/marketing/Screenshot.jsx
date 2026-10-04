import useThemeStore from "../../store/useThemeStore";

const Screenshot = ({
  darkSrc,
  lightSrc,
  alt,
  className = "",
  imgClassName = "",
  width,
  height,
}) => {
  const theme = useThemeStore((state) => state.theme);
  const src = theme === "dark" ? darkSrc : lightSrc;

  return (
    <div className={`marketing-screenshot ${className}`}>
      <img
        src={src}
        alt={alt}
        {...(width && height ? { width, height } : {})}
        loading="lazy"
        decoding="async"
        className={`block h-auto w-full max-w-none ${imgClassName}`}
      />
    </div>
  );
};

export default Screenshot;
