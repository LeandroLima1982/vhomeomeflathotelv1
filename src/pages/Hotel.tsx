import { Header } from "@/components/hotel/Header";
import { Hero } from "@/components/hotel/Hero";
import { BookingForm } from "@/components/hotel/BookingForm";
import { About } from "@/components/hotel/About";
import { Amenities } from "@/components/hotel/Amenities";
import { Nearby } from "@/components/hotel/Nearby";
import { Gallery } from "@/components/hotel/Gallery";
import { Footer } from "@/components/hotel/Footer";
import Contact from "@/components/hotel/Contact";
import { useState } from "react";
import { AvailabilityResults } from "@/components/hotel/AvailabilityResults";
import { Rooms } from "@/components/hotel/Rooms";

const Hotel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availabilityResults, setAvailabilityResults] = useState<any[] | null>(null);

  return (
    <div className="bg-white">
      <Header />
      <main>
        <Hero />
        <BookingForm
          loading={loading}
          setLoading={setLoading}
          setError={setError}
          onResults={setAvailabilityResults}
        />
        <AvailabilityResults
          loading={loading}
          error={error}
          results={availabilityResults}
        />
        <About />
        <Rooms />
        <Amenities />
        <Nearby />
        <Gallery />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Hotel;