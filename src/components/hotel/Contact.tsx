import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Entre em Contato</h2>
          <p className="text-gray-600 mt-2">
            Estamos aqui para ajudar. Envie-nos uma mensagem ou ligue para nós.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold mb-6 text-gray-800">
              Envie uma Mensagem
            </h3>
            <form className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nome
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mensagem
                </label>
                <Textarea
                  id="message"
                  placeholder="Sua mensagem"
                  className="mt-1"
                  rows={5}
                />
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-yellow-500 text-black p-3 rounded-full">
                  <MapPin size={24} />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-xl font-semibold text-gray-800">
                  Endereço
                </h4>
                <p className="text-gray-600 mt-1">
                  123 Avenida Principal, Cidade, Estado, 12345
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-yellow-500 text-black p-3 rounded-full">
                  <Phone size={24} />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-xl font-semibold text-gray-800">
                  Telefone
                </h4>
                <p className="text-gray-600 mt-1">(12) 3456-7890</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="bg-yellow-500 text-black p-3 rounded-full">
                  <Mail size={24} />
                </div>
              </div>
              <div className="ml-4">
                <h4 className="text-xl font-semibold text-gray-800">Email</h4>
                <p className="text-gray-600 mt-1">contato@hotel.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;