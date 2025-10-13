{/* Conteúdo principal com design moderno */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50/50 to-white max-h-[60vh] sm:max-h-[70vh] lg:max-h-[80vh]">
          <div className="px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12 min-h-full">
            {/* Descrições completas */}
            <div className="mb-10 sm:mb-12">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Sobre este quarto</h3>
              </div>
              
              {/* Descrição principal */}
              {(room.custom_description || room.description) && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/60 mb-6">
                  <p className="text-base sm:text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {room.custom_description || room.description}
                  </p>
                </div>
              )}

              {/* Descrição adicional do banco de dados */}
              {room.details?.description && room.details.description !== (room.custom_description || room.description) && (
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-200/60 mb-6">
                  <h4 className="text-lg font-semibold text-slate-800 mb-3">Detalhes adicionais</h4>
                  <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
                    {room.details.description}
                  </p>
                </div>
              )}
            </div>

            {/* Destaques */}
            {renderDetails()}

            {/* Características Adicionais */}
            {room.additional_features && Array.isArray(room.additional_features) && room.additional_features.length > 0 && (
              <div className="mb-10 sm:mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-800">Características</h3>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
                  <FeatureListDisplay features={room.additional_features as FeatureCategory[]} />
                </div>
              </div>
            )}

            {/* Informações adicionais */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 sm:mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-800">Check-in/out</h4>
                </div>
                <p className="text-sm text-slate-600">Check-in: 14:00<br />Check-out: 12:00</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-500 rounded-xl">
                    <Wifi className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-800">Conectividade</h4>
                </div>
                <p className="text-sm text-slate-600">Wi-Fi gratuito<br />em todas as áreas</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100/50 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-xl">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-800">Localização</h4>
                </div>
                <p className="text-sm text-slate-600">Av. Atlântica<br />Praia Campista</p>
              </div>
            </div>

            {/* Botão de reserva moderno */}
            {room.booking_url && (
              <div className="flex justify-center pt-6 border-t border-slate-200/60">
                <Button
                  onClick={() => window.open(room.booking_url, '_blank')}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold px-8 sm:px-12 py-4 sm:py-5 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-base sm:text-lg transform hover:scale-105"
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
                  Reservar Agora
                  <ExternalLink className="w-5 h-5 sm:w-6 sm:h-6 ml-3" />
                </Button>
              </div>
            )}
          </div>
        </div>