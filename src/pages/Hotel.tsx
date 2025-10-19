import Header from "@/components/hotel/Header";
import { Hero } from "@/components/hotel/Hero";
import { BookingForm } from "@/components/hotel/BookingForm"; // Importação corrigida
import About from "@/components/hotel/About";
import { Amenities } from "@/components/hotel/Amenities";
import { Nearby } from "@/components/hotel/Nearby";
import { Gallery } from "@/components/hotel/Gallery";
import Footer from "@/components/hotel/Footer";
import Contact from "@/components/hotel/Contact";
import Rooms from "@/components/hotel/Rooms";
import { ScrollToTop } from "@/components/hotel/ScrollToTop";

const Hotel = () => {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <Hero />
        <BookingForm />
        <About className="pt-40" />
        <Rooms className="pt-40" />
        <Amenities className="pt-40" />
        <Gallery className="pt-40" />
        <Nearby className="pt-40" />
        <Contact className="pt-40" />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Hotel;