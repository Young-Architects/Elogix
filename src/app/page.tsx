import Navbar from "@/components/layout/Navbar";
import FeaturesVideo from "@/components/sections/FeaturesVideo";
import HeroSection from "@/components/sections/HeroSection";
import ScrollBeamDivider from "@/components/ui/ScrollBeamDivider";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050816] text-white">
      <Navbar />
      <HeroSection />
      {/* <ScrollBeamDivider /> */}
      <FeaturesVideo />

    </main>
  );
}