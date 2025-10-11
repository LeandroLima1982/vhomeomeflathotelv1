import React from 'react';
import Header from '../components/common/Header';
import Hero from '../components/hotel/Hero';
import About from '../components/hotel/About';
import Rooms from '../components/hotel/Rooms';
import Gallery from '../components/hotel/Gallery';
import Contact from '../components/hotel/Contact';
import Footer from '../components/common/Footer';

const Index: React.FC = () => {
  return (
    <div>
      <Header />
      <Hero />
      <About />
      <Gallery />
      <Rooms />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;