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
        <About className="pt-[63px] md:pt-[60px]" />
        <About className="pt-[40px]" />
<Rooms className="pt-[40px]" />
<Amenities className="pt-[40px]" />
<Gallery className="pt-[40px]" />
<Nearby className="pt-[40px]" />
<Contact className="pt-[40px]" />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Hotel;
