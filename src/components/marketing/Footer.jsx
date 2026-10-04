import { Link } from "react-router-dom";
import BrandMark from "../ui/BrandMark";

const Footer = () => (
  <footer id="footer" className="border-t border-border/70 bg-background px-5 py-10 sm:px-8 lg:px-10">
    <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <Link
          to="/"
          aria-label="Vydra home"
          className="inline-flex rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <BrandMark markClassName="size-8" />
        </Link>
        <p className="mt-3 text-sm text-muted-foreground">
          Personal financial intelligence.
        </p>
      </div>
      <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
        <a href="#product" className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Product</a>
        <a href="#intelligence" className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Intelligence</a>
        <Link to="/about" className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">About</Link>
        <Link to="/login" className="hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Sign in</Link>
      </nav>
    </div>
  </footer>
);

export default Footer;
