"use client";

export function About() {
  return (
    <section id="sobre" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop&ixlib-rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Área de lazer do hotel"
              className="rounded-lg shadow-2xl w-full h-auto object-cover"
            />
            <div className="absolute -bottom-4 -left-4 bg-blue-800 text-white px-4 py-2 rounded-md text-sm font-semibold shadow-lg">
              Flat Hotel à beira-mar
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Uma Experiência Inesquecível
            </h2>
            <p className="text-gray-600 mb-4">
              Localizado em uma das praias mais belas, nosso flat hotel oferece uma combinação perfeita de conforto, sofisticação e contato com a natureza. Desfrute de apartamentos modernos, serviços de alta qualidade e uma vista deslumbrante para o mar.
            </p>
            <p className="text-gray-600">
              Seja para uma escapada romântica, férias em família ou uma viagem de negócios, proporcionamos o ambiente ideal para que sua estadia seja memorável. Relaxe em nossa piscina, saboreie nossa gastronomia e deixe-se encantar pela hospitalidade que nos define.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}