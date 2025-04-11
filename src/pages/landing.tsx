import React, { use } from "react";
import Navbar from "../components/navbar";
import { useState } from "react";
import HeroSection from "../components/heroSection";
import Footer from "../components/footer";
import AutomationFlowSection from "../components/featureSection";
import TutorialSection from "../components/tutorial";

export default function Landing() {
  const [isLoginHovered, setIsLoginHovered] = useState(false);
  return (
    <>
      <Navbar setLoginHovered={setIsLoginHovered} />
      <HeroSection isLoginHovered={isLoginHovered} />
      <AutomationFlowSection />
      <TutorialSection />
      <Footer />
    </>
  );
}
