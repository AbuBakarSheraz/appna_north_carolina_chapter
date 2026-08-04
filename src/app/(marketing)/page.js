import HeroSection from "../../components/home/HeroSection";
import PresidentMessage from "../../components/home/PresidentMessage";
import About from "../../components/home/About";
import Flyers from "../../components/home/Flyers";



export default function Home() {
  return (
    <>
      <HeroSection />
      <Flyers />
      <PresidentMessage />
      <About />
      {/* Other sections here */}
    </>
  );
}
