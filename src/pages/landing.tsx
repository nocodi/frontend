import Navbar from "../components/navbar";
import HeroSection from "../components/heroSection";
import Footer from "../components/footer";
import Services from "../components/featureSection";
import TutorialSection from "../components/tutorial";
import About from "../components/about";

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
