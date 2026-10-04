import { useEffect, useState } from "react";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import BrandMark from "../ui/BrandMark";
import useThemeStore from "../../store/useThemeStore";

const navigation = [
  { href: "#product", label: "Product" },
  { href: "#intelligence", label: "Intelligence" },
  { href: "/about", label: "About", route: true },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <header className="marketing-nav sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="px-5 sm:px-8 lg:px-10">
        <div className="mx-auto flex min-h-18 w-full max-w-7xl items-center justify-between gap-6">
        <Link
          to="/"
          aria-label="Vydra home"
          onClick={closeMenu}
          className="flex shrink-0 items-center rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <BrandMark markClassName="sm:size-11" />
        </Link>

        <nav aria-label="Marketing navigation" className="hidden items-center gap-8 lg:flex">
          {navigation.map((item) =>
            item.route ? (
              <Link
                key={item.label}
                to={item.href}
                className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
              >
                {item.label}
              </Link>
            ) : (
              <a
                key={item.label}
                href={item.href}
                className="w-fit text-sm text-muted-foreground transition-colors hover:text-primary! focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
              >
                {item.label}
              </a>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="inline-flex size-10 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-surface hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none cursor-pointer"
          >
            {theme === "dark" ? <FiSun aria-hidden="true" className="size-4" /> : <FiMoon aria-hidden="true" className="size-4" />}
          </button>

          <div className="hidden grid-cols-[auto_auto] items-center justify-items-end gap-x-4 gap-y-2 lg:flex">
            <Link
              to="/login"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="col-span-2 inline-flex min-h-10 items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
            >
              Sign up
            </Link>
          </div>

          <button
            type="button"
            aria-expanded={open}
            aria-controls="marketing-mobile-navigation"
            aria-label={open ? "Close navigation" : "Open navigation"}
            onClick={() => setOpen((value) => !value)}
            className="inline-flex size-11 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden cursor-pointer"
          >
            {open ? <FiX aria-hidden="true" size={20} /> : <FiMenu aria-hidden="true" size={20} />}
          </button>
        </div>

        </div>
      </div>

      {open && (
        <div id="marketing-mobile-navigation" className="border-t border-border/70 bg-background px-5 py-4 lg:hidden sm:px-8">
          <nav aria-label="Mobile marketing navigation" className="flex flex-col gap-1">
            {navigation.map((item) => {
              const Component = item.route ? Link : "a";
              return (
                <Component
                  key={item.label}
                  to={item.route ? item.href : undefined}
                  href={!item.route ? item.href : undefined}
                  onClick={closeMenu}
                  className="my-3 w-fit text-sm font-medium text-muted-foreground hover:text-primary! focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {item.label}
                </Component>
              );
            })}
            
            <div className="mt-3 grid grid-cols-[auto_auto] items-center justify-items-start gap-x-4 gap-y-3 border-t border-border/70 pt-4">
              <Link
                to="/login"
                onClick={closeMenu}
                className="py-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Sign in
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="col-span-2 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                Sign up
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
