return (
    <Dialog open={!!room} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] sm:max-w-[95vw] md:max-w-[90vw] lg:max-w-[1100px] max-h-[95vh] w-full p-0 bg-white border-0 shadow-2xl overflow-hidden">
        {/* Container com scroll para o modal inteiro */}
        <div className="max-h-[95vh] overflow-y-auto">
          {/* Header com gradiente moderno */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
            {/* Botão fechar moderno */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200 group"
            >
              <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            {/* Título e informações principais */}
            <div className="px-6 sm:px-8 lg:px-10 pt-8 pb-6">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-yellow-400 font-medium text-sm">4 Estrelas</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 leading-tight">
                    {room.name}
                  </h1>
                  {room.special_name && (
                    <p className="text-lg sm:text-xl text-slate-300 font-light italic">
                      "{room.special_name}"
                    </p>
                  )}
                </div>
                
                {/* Rating e localização */}
                <div className="flex flex-col sm:flex-row gap-4 lg:flex-col lg:items-end">
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">Macaé, RJ</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-slate-300 text-sm ml-2">(4.8)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel de Imagens Moderno */}
          <div className="relative w-full h-64 sm:h-80 lg:h-[400px] bg-slate-100 overflow-hidden">
            {loadingImages ? (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-600 mx-auto mb-4"></div>
                  <p className="text-slate-600 font-medium">Carregando imagens...</p>
                </div>
              </div>
            ) : roomImages.length > 0 ? (
              <div className="relative w-full h-full group">
                <img
                  src={roomImages[currentImageIndex]}
                  alt={`${room.name} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 ease-out"
                />
                
                {/* Overlay gradiente sutil */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
                
                {/* Botões de navegação modernos */}
                {roomImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    >
                      <ChevronLeft className="w-6 h-6 text-slate-700 group-hover:scale-110 transition-transform" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
                    >
                      <ChevronRight className="w-6 h-6 text-slate-700 group-hover:scale-110 transition-transform" />
                    </button>
                  </>
                )}
                
                {/* Indicadores modernos */}
                {roomImages.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
                    {roomImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-white scale-125 shadow-lg' 
                            : 'bg-white/60 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                )}
                
                {/* Contador elegante */}
                <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  {currentImageIndex + 1} / {roomImages.length}
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="text-center text-slate-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">Nenhuma imagem disponível</p>
                  <p className="text-sm text-slate-400 mt-1">As imagens serão exibidas aqui em breve</p>
                </div>
              </div>
            )}
          </div>

          {/* Conteúdo principal com design moderno */}
          <div className="bg-gradient-to-b from-slate-50/50 to-white">
            <div className="px-6 sm:px-8 lg:px-10 py-8 sm:py-10 lg:py-12">
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
        </div>
      </DialogContent>
    </Dialog>
  );