// components/traveller-settings/TravellerSettings.jsx
import { useState, useEffect, useRef } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import ProfileTab from "@/components/traveller-settings/ProfileTab"
import WalletTab from "@/components/traveller-settings/WalletTab"
import KycTab from "@/components/traveller-settings/KycTab"
import { Tabs, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { ChevronRight, Home } from "lucide-react"
import HikerLogo from "@/assets/hiker-logo.svg"
import { fetchUserRoles } from "@/redux/slices/authSlice"
import ScrollingRoadAnimation from "@/components/animation/ScrollingRoadAnimation"

export default function TravellerSettings() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState("profile")
  const [direction, setDirection] = useState(null)
  const containerRef = useRef(null)
  const tabContentRef = useRef(null)

  const tabs = ["profile", "wallet", "kyc"]

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && tabs.includes(tab) && tab !== activeTab) {
      const oldIndex = tabs.indexOf(activeTab)
      const newIndex = tabs.indexOf(tab)
      setDirection(newIndex > oldIndex ? "right" : "left")
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value) => {
    navigate(`?tab=${value}`, { replace: true })
  }

  const getAnimationClass = (tabValue) => {
    if (tabValue === activeTab) {
      return direction === "left" ? "animate-slide-in-left" : "animate-slide-in-right"
    }
    return "hidden"
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden relative">
      {/* Reusable Animation Component */}
      <ScrollingRoadAnimation />

      <header className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm border-b border-[#D4B5A0] flex-shrink-0">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/home")}
            >
              <img src={HikerLogo || "/placeholder.svg"} alt="Hiker Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-[#2D5016]">HopInn</span>
            </div>
            <div className="flex gap-3">
              {!user.isGuide && (
                <Button
                  onClick={() => {
                    dispatch(fetchUserRoles())
                    navigate("/registration?type=guide")
                  }}
                  className="bg-[#2D5016] hover:bg-[#1F3A0F] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Become a Guide
                </Button>
              )}
              {user.isGuide && (
                <Button
                  onClick={() => navigate("/guide-settings")}
                  variant="outline"
                  className="border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016]/10 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Guide Settings
                </Button>
              )}
              {!user.isHost && (
                <Button
                  onClick={() => {
                    dispatch(fetchUserRoles())
                    navigate("/registration?type=host")
                  }}
                  className="bg-[#F68241] hover:bg-[#E5732A] text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Become a Host
                </Button>
              )}
              {user.isHost && (
                <Button
                  onClick={() => navigate("/host-settings")}
                  variant="outline"
                  className="border-[#F68241] text-[#F68241] hover:bg-[#F68241]/10 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Host Settings
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="absolute top-0 left-0 w-full h-full flex flex-col pt-24 z-1">
        <div className="max-w-6xl mx-auto px-4 py-6 h-full flex flex-col">
          <nav className="flex items-center space-x-2 text-sm text-[#8B4513] mb-4 flex-shrink-0">
            <button
              onClick={() => navigate("/home")}
              className="flex items-center gap-1 hover:text-[#2D5016] transition-colors"
            >
              <Home className="h-4 w-4" />
              Home
            </button>
            <ChevronRight className="h-4 w-4" />
            <span className="text-[#2D5016] font-medium">Account Settings</span>
          </nav>

          <div className="mb-6 flex-shrink-0">
            <h1 className="text-3xl font-bold text-[#2D5016] mb-2">Account Settings</h1>
            <p className="text-[#8B4513]">Manage your profile, wallet, and verification settings</p>
          </div>

          <div ref={containerRef} className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
              <div className="grid grid-cols-12 gap-8 h-full">
                <aside className="col-span-12 lg:col-span-3">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] p-6">
                    <h3 className="text-lg font-semibold text-[#2D5016] mb-4">Settings Menu</h3>
                    <TabsList className="flex lg:flex-col gap-2 bg-transparent w-full">
                      <TabsTrigger
                        value="profile"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F68241] data-[state=active]:to-[#F3CA62] data-[state=active]:text-white justify-start px-4 py-3 rounded-lg hover:bg-[#F68241]/10 transition-all duration-200 w-full text-left font-medium text-[#8B4513]"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          Profile
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="wallet"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F3CA62] data-[state=active]:to-[#F68241] data-[state=active]:text-white justify-start px-4 py-3 rounded-lg hover:bg-[#F3CA62]/10 transition-all duration-200 w-full text-left font-medium text-[#8B4513]"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          Wallet
                        </span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="kyc"
                        className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#2D5016] data-[state=active]:to-[#8B4513] data-[state=active]:text-white justify-start px-4 py-3 rounded-lg hover:bg-[#2D5016]/10 transition-all duration-200 w-full text-left font-medium text-[#8B4513]"
                      >
                        <span className="flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          KYC Verification
                        </span>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </aside>
                <section className="col-span-12 lg:col-span-9 h-full relative">
                  <div
                    ref={activeTab === "profile" ? tabContentRef : null}
                    className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] h-full flex flex-col p-6 overflow-auto absolute inset-0 ${getAnimationClass("profile")}`}
                  >
                    <ProfileTab />
                  </div>
                  <div
                    ref={activeTab === "wallet" ? tabContentRef : null}
                    className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] h-full flex flex-col p-6 overflow-auto absolute inset-0 ${getAnimationClass("wallet")}`}
                  >
                    <WalletTab />
                  </div>
                  <div
                    ref={activeTab === "kyc" ? tabContentRef : null}
                    className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] h-full flex flex-col p-6 overflow-auto absolute inset-0 ${getAnimationClass("kyc")}`}
                  >
                    <KycTab />
                  </div>
                </section>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}