import { useState, useEffect } from 'react'

function Characters() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const itemsPerPage = 20

  useEffect(() => {
    fetchCharacters()
  }, [])

  const fetchCharacters = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Conectando a la API de Superhéroes...')
      const response = await fetch('https://akabab.github.io/superhero-api/api/all.json')
      console.log('Respuesta recibida:', response.status)
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Datos recibidos:', data.length, 'superhéroes')
      console.log('Primer superhéroe:', data[0])
      
      // Filtrar solo personajes que tengan imagen
      const charactersWithImages = data.filter(character => character.images && character.images.lg)
      setCharacters(charactersWithImages)
      setLoading(false)
    } catch (error) {
      console.error('Error detallado:', error)
      setError(`Error: ${error.message}`)
      setLoading(false)
    }
  }

  // Función para obtener el color según el publisher
  const getPublisherColor = (publisher) => {
    if (publisher.includes('Marvel')) return 'bg-red-600 text-red-100'
    if (publisher.includes('DC')) return 'bg-blue-600 text-blue-100'
    return 'bg-gray-600 text-gray-100'
  }

  // Filtrar personajes por búsqueda
  const filteredCharacters = characters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (character.biography?.fullName && character.biography.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Calcular datos de paginación con personajes filtrados
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentCharacters = filteredCharacters.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage)

  // Funciones de navegación
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber)
    window.scrollTo(0, 0) // Scroll hacia arriba al cambiar página
  }

  const goToPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      window.scrollTo(0, 0)
    }
  }

  const goToNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      window.scrollTo(0, 0)
    }
  }

  // Generar números de páginas a mostrar
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    
    return pageNumbers
  }

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 text-center">
        <div className="text-blue-400 text-lg">Cargando superhéroes...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg border border-red-600 p-6 text-center">
        <div className="text-red-400 text-lg">{error}</div>
        <button 
          onClick={fetchCharacters}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-2 text-center">
          Superhéroes Marvel & DC
        </h2>
        <p className="text-gray-300 text-sm sm:text-base text-center">
          Total encontrados: <span className="text-blue-400 font-semibold">{filteredCharacters.length}</span> superhéroes
        </p>
        <p className="text-gray-500 text-xs text-center mt-1">
          Página {currentPage} de {totalPages} - Mostrando {currentCharacters.length} de {filteredCharacters.length}
        </p>
      </div>

      {/* Buscador */}
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4 sm:p-6">
        <div className="max-w-md mx-auto">
          <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-2">
            Buscar superhéroe
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1) // Resetear a página 1 cuando busque
            }}
            placeholder="Buscar por nombre o nombre real..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          />
          {searchTerm && (
            <p className="text-xs text-gray-400 mt-2">
              Mostrando {filteredCharacters.length} resultados para "{searchTerm}"
            </p>
          )}
        </div>
      </div>

      {/* Grid responsive de superhéroes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        {currentCharacters.map((character) => (
          <div 
            key={character.id} 
            className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 hover:border-blue-500 transition-all duration-300 hover:shadow-xl"
          >
            {/* Imagen del superhéroe */}
            <div className="p-4 pb-0">
              <div className="aspect-[3/4] w-full mb-4 overflow-hidden rounded-lg bg-gray-700">
                <img 
                  src={character.images.lg} 
                  alt={character.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
            
            {/* Información del superhéroe */}
            <div className="p-4 pt-0">
              <h3 className="text-gray-100 font-semibold text-sm sm:text-base mb-2 min-h-[2.5rem] flex items-center">
                {character.name || 'Nombre desconocido'}
              </h3>
              
              {/* Publisher (Marvel/DC) */}
              {character.biography?.publisher && (
                <div className="mb-2">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPublisherColor(character.biography.publisher)}`}>
                    {character.biography.publisher}
                  </span>
                </div>
              )}
              
              {/* Información adicional */}
              <div className="space-y-1 text-xs text-gray-400">
                {character.biography?.fullName && character.biography.fullName !== character.name && (
                  <p>Nombre real: {character.biography.fullName}</p>
                )}
                
                {character.biography?.alignment && (
                  <p className={`capitalize ${
                    character.biography.alignment === 'good' ? 'text-green-400' :
                    character.biography.alignment === 'bad' ? 'text-red-400' :
                    'text-yellow-400'
                  }`}>
                    Alineación: {character.biography.alignment}
                  </p>
                )}
                
                {character.appearance?.race && character.appearance.race !== 'Human' && (
                  <p>Raza: {character.appearance.race}</p>
                )}
                
                {character.work?.occupation && (
                  <p className="text-gray-300 font-medium mt-2">
                    {character.work.occupation.substring(0, 40)}
                    {character.work.occupation.length > 40 ? '...' : ''}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-4">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            
            {/* Botón Anterior */}
            <button
              onClick={goToPrevious}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === 1
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Anterior
            </button>

            {/* Números de páginas */}
            <div className="flex space-x-1">
              {/* Primera página si no está visible */}
              {getPageNumbers()[0] > 1 && (
                <>
                  <button
                    onClick={() => goToPage(1)}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                  >
                    1
                  </button>
                  {getPageNumbers()[0] > 2 && (
                    <span className="px-2 py-2 text-gray-500">...</span>
                  )}
                </>
              )}

              {/* Páginas visibles */}
              {getPageNumbers().map(pageNumber => (
                <button
                  key={pageNumber}
                  onClick={() => goToPage(pageNumber)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}

              {/* Última página si no está visible */}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <>
                  {getPageNumbers()[getPageNumbers().length - 1] < totalPages - 1 && (
                    <span className="px-2 py-2 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => goToPage(totalPages)}
                    className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors"
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            {/* Botón Siguiente */}
            <button
              onClick={goToNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentPage === totalPages
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
      
      {/* Mensaje si no hay superhéroes */}
      {filteredCharacters.length === 0 && !loading && (
        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 p-6 text-center">
          <div className="text-gray-400">
            {searchTerm ? `No se encontraron superhéroes con "${searchTerm}"` : 'No se encontraron superhéroes con imágenes'}
          </div>
        </div>
      )}
    </div>
  )
}

export default Characters