import About from "@/components/hotel/About";
import Amenities from "@/components/hotel/Amenities";
import Contact from "@/components/hotel/Contact";
import Footer from "@/components/hotel/Footer";
import Gallery from "@/components/hotel/Gallery";
import Header from "@/components/hotel/Header";
import Hero from "@/components/hotel/Hero";

export default function Index() {
  return (
    <div className="bg-gray-50 text-gray-800">
      <Header />
      <main>
        <Hero />
        <About />
        <Gallery />
        <Amenities />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}