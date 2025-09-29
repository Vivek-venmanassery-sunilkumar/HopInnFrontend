import { useEffect, useState, useRef } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import GuideRegistrationForm from "@/components/traveller-settings/GuideRegistrationForm"
import HostRegistrationForm from "@/components/traveller-settings/HostRegistrationForm"
import HikerLogo from "@/assets/hiker-logo.svg"
import { useSelector } from "react-redux"
import toast from "react-hot-toast"
import { ChevronRight, Home } from "lucide-react"
import ScrollingRoadAnimation from "@/components/animation/ScrollingRoadAnimation"

export default function RegistrationForm({ defaultType = "guide" }) {
  const user = useSelector((state) => state.auth.user)
  const [type, setType] = useState(defaultType)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toastShownRef = useRef(false)

  useEffect(() => {
    if (!user.isKycVerified && !toastShownRef.current) {
      console.log(`user verified: ${user.isKycVerified}`)
      toastShownRef.current = true
      navigate('/traveller/settings?tab=kyc')
      toast.error("Please complete your KYC to proceed")
      return
    }
    const urlType = searchParams.get("type")
    if (urlType && (urlType === "guide" || urlType === "host")) {
      setType(urlType)
    }
  }, [user, searchParams])

  return (
    <div className="min-h-screen flex flex-col relative overflow-y-auto">
      {/* Reusable Animation Component */}
      <ScrollingRoadAnimation />

      <header className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm border-b border-[#D4B5A0] flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity w-fit"
            onClick={() => navigate("/home")}
          >
            <img src={HikerLogo || "/placeholder.svg"} alt="Hiker Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-[#2D5016]">HopInn</span>
          </div>
        </div>
      </header>

      <div className="flex-1 pt-24 pb-8 z-1">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <nav className="flex items-center space-x-2 text-sm text-[#8B4513] mb-4">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-1 hover:text-[#2D5016] transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            <ChevronRight className="h-4 w-4" />
            <button
              onClick={() => navigate("/traveller/settings")}
              className="hover:text-[#2D5016] transition-colors"
            >
              Account Settings
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#2D5016] font-medium">
              {type === "guide" ? "Guide Registration" : "Host Registration"}
            </span>
          </nav>

          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#2D5016] mb-2">
              {type === "guide" ? "Become a Guide" : "Become a Host"}
            </h1>
            <p className="text-[#8B4513] text-lg">
              {type === "guide"
                ? "Share your local expertise and help travelers discover amazing experiences"
                : "Open your doors to travelers and create memorable stays"}
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] overflow-hidden mb-6">
            <div className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] px-6 py-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                {type === "guide" ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Guide Registration
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Host Registration
                  </>
                )}
              </h2>
            </div>

            {/* Form container - no longer scrollable */}
            <div className="p-6">
              {type === "guide" ? <GuideRegistrationForm /> : <HostRegistrationForm />}
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#2D5016]/10 to-[#8B4513]/10 rounded-lg p-6 border border-[#D4B5A0] backdrop-blur-sm">
            <h3 className="text-lg font-semibold text-[#2D5016] mb-2">
              {type === "guide" ? "Why become a Guide?" : "Why become a Host?"}
            </h3>
            <ul className="text-[#8B4513] space-y-1">
              {type === "guide" ? (
                <>
                  <li>• Share your local knowledge and passion</li>
                  <li>• Earn money doing what you love</li>
                  <li>• Meet travelers from around the world</li>
                  <li>• Build your reputation in the travel community</li>
                </>
              ) : (
                <>
                  <li>• Welcome travelers to your space</li>
                  <li>• Generate additional income</li>
                  <li>• Meet people from different cultures</li>
                  <li>• Be part of the travel community</li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}