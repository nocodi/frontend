import Navbar from "../../../components/navbar";
import HeroSection from "./heroSection";
import Footer from "../../../components/footer";
import Services from "./featureSection";
import TutorialSection from "./tutorial";
import About from "./about";

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
