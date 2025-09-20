import React from 'react';
import About from './About';
import Services from './Services';
import Footer from './Footer';

function Home() {
  return (
    <section id="home">
    <div>
      <div id="about-section">
      <About />
      </div>
      <div id="services-section">
      <Services />
      </div>
      <Footer />
    </div>
    </section>
  );
}

export default Home;