import ReactMarkdown from "react-markdown";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import Footer from "../components/marketing/Footer";
import Navbar from "../components/marketing/Navbar";
import ScrollToTop from "../layout/ScrollToTop";
import aboutContent from "../content/about.md?raw";

const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="relative pb-7 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
      {children}
      <span
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-1 w-14 rounded-full bg-primary"
      />
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 scroll-mt-28 border-t border-border/70 pt-6 font-display text-2xl font-semibold leading-[1.15] tracking-tight text-foreground sm:text-3xl">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="mt-5 max-w-2xl text-[1.0625rem] leading-8 text-muted-foreground sm:text-lg">
      {children}
    </p>
  ),
  hr: () => <hr className="my-12 border-0 border-t border-border/70" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
};

const About = () => {
  return (
    <div className="marketing-page min-h-dvh bg-background text-foreground">
      <Navbar />
      <main>
        <ScrollToTop />
        <article className="about-document mx-auto max-w-3xl px-5 pb-28 pt-14 sm:px-8 sm:pt-24 lg:px-10 [&>h1+p]:mt-8 [&>h1+p]:max-w-2xl [&>h1+p]:text-xl [&>h1+p]:leading-8 [&>h1+p]:text-foreground sm:[&>h1+p]:text-2xl sm:[&>h1+p]:leading-9 [&>p:has(>strong:only-child)]:mt-8 [&>p:has(>strong:only-child)]:border-l-2 [&>p:has(>strong:only-child)]:border-primary [&>p:has(>strong:only-child)]:pl-5 [&>p:has(>strong:only-child)]:text-lg [&>p:has(>strong:only-child)]:leading-8 sm:[&>p:has(>strong:only-child)]:text-xl">
          <ReactMarkdown
            components={markdownComponents}
          >
            {aboutContent}
          </ReactMarkdown>

          <div className="mt-14 border-t border-border/70 pt-8">
            <Link
              to="/demo"
              className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none"
            >
              See Vydra in action
              <FiArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default About;
