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