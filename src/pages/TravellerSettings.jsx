import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { Button } from "@/components/ui/button"
import ProfileTab from "@/components/traveller-settings/ProfileTab"
import WalletTab from "@/components/traveller-settings/WalletTab"
import KycTab from "@/components/traveller-settings/KycTab"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import HikerLogo from "@/assets/hiker-logo.svg"

export default function TravellerSettings() {
  const navigate = useNavigate()
  const user = useSelector((state) => state.auth.user)
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState("profile")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["profile", "wallet", "kyc"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value) => {
    setActiveTab(value)
    navigate(`?tab=${value}`, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/home")}
            >
              <img src={HikerLogo || "/placeholder.svg"} alt="Hiker Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-800">HopInn</span>
            </div>
            <div className="flex gap-3">
              {!user.isGuide && (
                <Button
                  onClick={() => navigate("/registration?type=guide")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Become a Guide
                </Button>
              )}
              {user.isGuide && (
                <Button
                  onClick={() => navigate("/guide-settings")}
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Guide Settings
                </Button>
              )}
              {!user.isHost && (
                <Button
                  onClick={() => navigate("/registration?type=host")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Become a Host
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Account Settings</h1>
          <p className="text-gray-600">Manage your profile, wallet, and verification settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Settings Menu</h3>
                <TabsList className="flex lg:flex-col gap-2 bg-transparent w-full">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white justify-start px-4 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 w-full text-left font-medium"
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
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white justify-start px-4 py-3 rounded-lg hover:bg-emerald-50 transition-all duration-200 w-full text-left font-medium"
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
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-600 data-[state=active]:text-white justify-start px-4 py-3 rounded-lg hover:bg-amber-50 transition-all duration-200 w-full text-left font-medium"
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

            <section className="col-span-12 lg:col-span-9">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
                <TabsContent value="profile" className="m-0">
                  <div className="p-6">
                    <ProfileTab />
                  </div>
                </TabsContent>
                <TabsContent value="wallet" className="m-0">
                  <div className="p-6">
                    <WalletTab />
                  </div>
                </TabsContent>
                <TabsContent value="kyc" className="m-0">
                  <div className="p-6">
                    <KycTab />
                  </div>
                </TabsContent>
              </div>
            </section>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
