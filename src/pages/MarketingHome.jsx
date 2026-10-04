import Footer from "../components/marketing/Footer";
import DemoCTA from "../components/marketing/DemoCTA";
import HowItWorks from "../components/marketing/HowItWorks";
import Hero from "../components/marketing/Hero";
import InsightStory from "../components/marketing/InsightStory";
import Intelligence from "../components/marketing/Intelligence";
import Navbar from "../components/marketing/Navbar";
import Product from "../components/marketing/Product";
import ScrollToTop from "../layout/ScrollToTop";

const MarketingHome = () => {
  return (
    <div className="marketing-page min-h-dvh bg-background text-foreground">
      <Navbar />
      <main>
        <ScrollToTop />

        <Hero />
        <HowItWorks />
        <Product />
        <Intelligence />
        <InsightStory />
        <DemoCTA />
      </main>
      <Footer />
    </div>
  );
};

export default MarketingHome;
