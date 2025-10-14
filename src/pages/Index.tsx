import React from 'react';
import Header from '@/components/hotel/Header';
import { Hero } from '@/components/hotel/Hero';
import About from '@/components/hotel/About';
import Rooms from '@/components/hotel/Rooms';
import { Gallery } from '@/components/hotel/Gallery';
import { Nearby } from '@/components/hotel/Nearby';
import Contact from '@/components/hotel/Contact';
import Footer from '@/components/hotel/Footer';

const Index: React.FC = () => {
  return (
    <div className="bg-white">
      <Header />
      <main>
        <Hero />
        <About />
        <Rooms />
        <Gallery />
        <Nearby />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;