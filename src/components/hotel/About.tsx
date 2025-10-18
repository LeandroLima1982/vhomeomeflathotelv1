import React from "react";

const About = () => {
  return (
    <section id="about" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1566073771259-d38429e0a2d1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Hotel exterior"
              className="rounded-lg shadow-xl object-cover w-full h-96"
            />
          </div>
          <div className="lg:w-1/2">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">
                Bem-vindo ao V-Home
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                Seu refúgio perfeito para uma estadia inesquecível.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                No V-Home, combinamos o charme da hospitalidade tradicional com
                o conforto e as conveniências modernas. Nossos quartos são
                projetados para oferecer o máximo de relaxamento, com vistas
                deslumbrantes e amenidades de primeira linha.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Seja para uma viagem de negócios ou lazer, nossa equipe
                dedicada está pronta para garantir que cada momento da sua
                estadia seja perfeito. Descubra a diferença V-Home.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;