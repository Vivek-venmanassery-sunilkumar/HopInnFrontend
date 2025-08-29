import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminSideKyc from "@/components/admin-settings/AdminSideKyc";

export default function AdminSettings() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState('kyc')

    useEffect(() => {
        const tab = searchParams.get('tab')
        if (tab && ['kyc', 'other'].includes(tab)) {
            setActiveTab(tab)
        }
    }, [searchParams])

    const handleTabChange = (value) => {
        setActiveTab(value)
        navigate(`?tab=${value}`, { replace: true })
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <h2 className="text-2xl font-semibold mb-6">Admin Settings</h2>
                
                <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <div className="grid grid-cols-12 gap-6">
                        <aside className="col-span-12 md:col-span-3 border rounded-md p-4 bg-white shadow-sm">
                            <TabsList className="flex md:flex-col gap-2 bg-transparent">
                                <TabsTrigger 
                                    value="kyc"
                                    className="data-[state=active]:bg-[#F3CA62] justify-start px-3 py-2 rounded-md hover:bg-[#FFEEC2] w-full text-left"
                                >
                                    KYC Verification
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="other"
                                    className="data-[state=active]:bg-[#F3CA62] justify-start px-3 py-2 rounded-md hover:bg-[#FFEEC2] w-full text-left"
                                >
                                    Other Settings
                                </TabsTrigger>
                            </TabsList>
                        </aside>
                        
                        <section className="col-span-12 md:col-span-9">
                            <TabsContent value="kyc" className="m-0">
                                <AdminSideKyc />
                            </TabsContent>
                            <TabsContent value="other" className="m-0">
                                <div className="p-6 bg-white rounded-md shadow-sm">
                                    <h3 className="text-lg font-medium mb-4">Other Admin Settings</h3>
                                    <p>Other admin features will be displayed here.</p>
                                </div>
                            </TabsContent>
                        </section>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}