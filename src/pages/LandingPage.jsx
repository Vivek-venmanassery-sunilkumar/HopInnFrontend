import { useNavigate } from 'react-router-dom'
import HikerLogo from '@/assets/hiker-logo.svg'

export default function LandingPage() {
  const navigate = useNavigate()

  const handleHopInnClick = () => {
    navigate('/auth?login=1')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={HikerLogo} alt="HopInn" className="h-10 w-10" />
            <span className="text-xl font-semibold">HopInn</span>
          </div>
          <button
            onClick={handleHopInnClick}
            className="px-4 py-2 rounded-md border border-black text-black hover:text-[#F68241] transition-colors"
          >
            hopinn
          </button>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover, book, and enjoy your stay</h1>
          <p className="text-gray-600 mb-8">Plan your next adventure with a seamless experience tailored for travellers.</p>
          <button
            onClick={handleHopInnClick}
            className="px-6 py-3 rounded-lg border border-black text-black hover:text-[#F68241] transition-colors"
          >
            Get started
          </button>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white/90 backdrop-blur-sm border-t border-[#D4B5A0] py-3 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            © 2024 HopInn. Copyright Protected. Developed by Vivek V S
          </p>
        </div>
      </footer>
    </div>
  )
}


