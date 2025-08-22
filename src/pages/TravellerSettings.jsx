import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ProfileTab from '@/components/traveller-settings/ProfileTab'
import WalletTab from '@/components/traveller-settings/WalletTab'
import { Tabs,TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

export default function TravellerSettings(){
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [activeTab, setActiveTab] = useState('profile')

    useEffect(()=>{
        const tab = searchParams.get('tab')
        if(tab && ['profile', 'wallet'].includes(tab)){
            setActiveTab(tab)
        }
    },[searchParams])

    const handleTabChange = (value)=>{
        setActiveTab(value)
        navigate(`?tab=${value}`, {replace: true})
    }

    return (
        <div className="min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-6">
                <h2 className="text-xl font-semibold mb-4">Settings</h2>
                 <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                    <div className="grid grid-cols-12 gap-6">
                        <aside className="col-span-12 md:col-span-3 border rounded-md p-2">
                            <TabsList className="flex md:flex-col gap-2 bg-transparent">
                                <TabsTrigger 
                                    value="profile"
                                    className="data-[state=active]:bg-[#F3CA62] justify-start px-3 py-2 rounded-md hover:bg-[#FFEEC2]"
                                >
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger 
                                    value="wallet"
                                    className="data-[state=active]:bg-[#F3CA62] justify-start px-3 py-2 rounded-md hover:bg-[#FFEEC2]"
                                >
                                    Wallet
                                </TabsTrigger>
                            </TabsList>
                        </aside>
                        
                        <section className="col-span-12 md:col-span-9">
                            <TabsContent value="profile" className="m-0">
                                <ProfileTab />
                            </TabsContent>
                            <TabsContent value="wallet" className="m-0">
                                <WalletTab />
                            </TabsContent>
                        </section>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}


