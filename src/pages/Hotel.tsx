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
        <About className="pt-10 scroll-mt-10" />
<Rooms id="acomodacoes" className="pt-10 scroll-mt-[55px]" />
<Amenities className="pt-10 scroll-mt-[55px]" />
<Gallery className="pt-10 scroll-mt-[55px]" />
<Nearby className="pt-10 scroll-mt-[55px]" />
<Contact className="pt-10 scroll-mt-[55px]" />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Hotel;
