import Navbar from "../components/navbar";
import HeroSection from "../components/landing/heroSection";
import Footer from "../components/footer";
import Services from "../components/landing/featureSection";
import TutorialSection from "../components/landing/tutorial";
import About from "../components/landing/about";

export default function Landing() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <Services />
      <TutorialSection />
      <About />
      <Footer />
    </>
  );
}
