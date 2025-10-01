import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminSideKyc from "@/components/admin-settings/AdminSideKyc"
import HikerLogo from "@/assets/hiker-logo.svg"

export default function AdminSettings() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState("kyc")

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && ["kyc", "other"].includes(tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (value) => {
    setActiveTab(value)
    navigate(`?tab=${value}`, { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/home")}
            >
              <img src={HikerLogo || "/placeholder.svg"} alt="Hiker Logo" className="h-8 w-8" />
              <span className="text-xl font-bold text-gray-800">HopInn Admin</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              Admin Panel
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            Admin Dashboard
          </h1>
          <p className="text-gray-600">Manage platform operations, user verification, and system settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="grid grid-cols-12 gap-8">
            <aside className="col-span-12 lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 10h16M4 14h16M4 18h16"
                    />
                  </svg>
                  Admin Menu
                </h3>
                <TabsList className="flex lg:flex-col gap-2 bg-transparent w-full">
                  <TabsTrigger
                    value="kyc"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-indigo-600 data-[state=active]:text-white justify-start px-4 py-3 rounded-lg hover:bg-indigo-50 transition-all duration-200 w-full text-left font-medium"
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
                  <TabsTrigger
                    value="other"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white justify-start px-4 py-3 rounded-lg hover:bg-purple-50 transition-all duration-200 w-full text-left font-medium"
                  >
                    <span className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                        />
                      </svg>
                      System Settings
                    </span>
                  </TabsTrigger>
                </TabsList>
              </div>
            </aside>

            <section className="col-span-12 lg:col-span-9">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px]">
                <TabsContent value="kyc" className="m-0">
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">KYC Verification Management</h2>
                      <p className="text-gray-600">Review and manage user verification requests</p>
                    </div>
                    <AdminSideKyc />
                  </div>
                </TabsContent>
                <TabsContent value="other" className="m-0">
                  <div className="p-6">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900 mb-2">System Settings</h2>
                      <p className="text-gray-600">Configure platform settings and preferences</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                        <h3 className="text-lg font-medium text-blue-900 mb-2">Platform Configuration</h3>
                        <p className="text-blue-700 text-sm">Manage global platform settings and configurations</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                        <h3 className="text-lg font-medium text-green-900 mb-2">User Management</h3>
                        <p className="text-green-700 text-sm">Oversee user accounts and permissions</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                        <h3 className="text-lg font-medium text-purple-900 mb-2">Analytics & Reports</h3>
                        <p className="text-purple-700 text-sm">View platform analytics and generate reports</p>
                      </div>
                      <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                        <h3 className="text-lg font-medium text-orange-900 mb-2">System Monitoring</h3>
                        <p className="text-orange-700 text-sm">Monitor system health and performance</p>
                      </div>
                    </div>
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
