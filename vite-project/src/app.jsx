import Characters from './pages/Characters'

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-blue-900 text-gray-100 py-6 md:py-8 px-4 border-b border-gray-700">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-white">
            Superhéroes Marvel & DC
          </h1>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg">
            Explora el universo de superhéroes
          </p>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-4 md:py-8 px-4 sm:px-6 lg:px-8">
        <Characters />
      </main>
    </div>
  )
}

export default App