import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import SkillsServices from "@/components/SkillsServices";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col selection:bg-black selection:text-white">
      {/* Curved Notch Top Navigation */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-20 sm:pt-24">
        {/* Hero Section */}
        <Hero />

        {/* Eco.com-Style About Section with Scroll Typing Animation */}
        <About />

        {/* Unified Skills, Technologies & Services Section */}
        <SkillsServices />

        {/* Projects Section */}
        <div className="w-full max-w-5xl mx-auto px-6">
          <section id="projects" className="min-h-[50vh] flex flex-col justify-center" />
        </div>

        {/* Contact Section */}
        <Contact />
      </main>

      {/* Dark Modern Footer */}
      <Footer />
    </div>
  );
}
