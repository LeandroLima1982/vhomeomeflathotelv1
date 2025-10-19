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
        <About className="pt-[97px]" />
        <Rooms className="pt-48" />
        <Amenities className="pt-48" />
        <Gallery className="pt-48" />
        <Nearby className="pt-48" />
        <Contact className="pt-48" />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Hotel;