import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import OurSpace from "@/components/OurSpace";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-off-white selection:bg-gold-200 selection:text-charcoal cursor-default">
      <Navbar />
      <Hero />
      <About />
      <OurSpace />
      <Services />
      <Contact />
      <Footer />
    </main>
  );
}
