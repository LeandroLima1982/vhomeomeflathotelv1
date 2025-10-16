import React from 'react';
import Header from '@/components/hotel/Header';
import Footer from '@/components/hotel/Footer';
import { CheckCircle } from 'lucide-react';

const pillars = [
  "CUMPRIMENTO DE PRAZO",
  "SATISFAÇÃO DO CLIENTE",
  "ACABAMENTOS DE ALTA QUALIDADE",
  "RELACIONAMENTO COM O CLIENTE",
  "TRANSPARÊNCIA",
  "QUALIDADE DE ENTREGA",
  "PROJETOS E OBRAS",
  "SUSTENTABILIDADE",
  "ANDAMENTO DA OBRA",
  "SISTEMAS DE SEGURANÇA",
];

const values = [
    {
        title: "TRANSPARÊNCIA TOTAL",
        description: "Toda assinatura de contrato é acompanhado por um representante da VERY , que esclarece os pontos mais importantes e fica à disposição para esclarecer dúvidas. Essa filosofia garante segurança, transparência e a satisfação dos clientes."
    },
    {
        title: "ENTREGA NO PRAZO",
        description: "100% das obras já executadas foram entregues no prazo. Essa política de seriedade proporciona aos clientes a tranqüilidade de poder programar a mudança ao novo apartamento com segurança."
    },
    {
        title: "SATISFAÇÃO DO CLIENTE",
        description: "Segundo pesquisa realizada, 98% dos clientes que compraram apartamentos conosco, comprariam novamente ou indicariam a um amigo. O resultado é obtido a partir de pesquisa feita com os clientes após a entrega das chaves."
    },
    {
        title: "DETALHES QUE FAZEM A DIFERENÇA",
        description: "Uma das características que faz a VERY CONSTRUTORA se destacar no mercado é o cuidado com os detalhes. Essa preocupação visa proporcionar ao nosso cliente a melhor experiência na aquisição do seu imóvel."
    }
]

const Institutional: React.FC = () => {
  return (
    <div className="bg-gray-50">
      <Header />
      <main className="pt-24">
        <section className="py-16 md:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-4">
              Sobre a VERY Construtora
            </h1>
            <p className="text-lg text-gray-600 text-center mb-12">
              Soares Ferreira Incorporações LTDA
            </p>

            <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
              <p>
                A VERY (Soares Ferreira Incorporações LTDA) é uma empresa do ramo da construção civil, que nasceu da combinação de experiência de dois sócios, que atuavam em áreas completamente distintas. O “Soares”, vem de um empresário com mais de 25 anos de experiência na Indústria de Óleo & Gás atuando na área de engenharia, e o “Ferreira” vem de um empresário também com mais de 25 anos de experiência no ramo de medicina.
              </p>
              <p>
                Desde 2014, o foco da VERY está voltado para a superação das expectativas dos clientes quando se pensa em uma construtora, sempre imprimindo soluções arquitetônicas com projetos de design contemporâneo e materiais de alto padrão.
              </p>
              <p>
                Nestes 11 anos de experiência, o maior diferencial da VERY tem sido o total respeito com os clientes, desde as vendas, mas também durante as obras e no pós-venda.
              </p>
              <p>
                Consciente das responsabilidades com nossos clientes, sempre nos preocupamos com a qualidade, entendendo que ela não se faz apenas com materiais de construção selecionados, com técnicas modernas e profissionais competentes para a execução de cada obra, mas também com credibilidade, profissionalismo, cumprindo rigorosamente os prazos, com transparência nas ações, comportamento ético e respeito aos nossos clientes.
              </p>
              <p className="font-semibold text-gray-800">
                No final, o resultado é assertivo: empreendimentos únicos e clientes satisfeitos.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-12">
              Nossos Pilares e Valores
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
              {pillars.map((pillar, index) => (
                <div key={index} className="flex items-center bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                  <CheckCircle className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                  <span className="text-sm font-medium text-gray-700">{pillar}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                        <p className="text-gray-600">{value.description}</p>
                    </div>
                ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Institutional;