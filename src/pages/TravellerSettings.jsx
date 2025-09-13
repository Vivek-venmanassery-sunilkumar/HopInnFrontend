import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import ProfileTab from '@/components/traveller-settings/ProfileTab'
import WalletTab from '@/components/traveller-settings/WalletTab'
import KycTab from '@/components/traveller-settings/KycTab'
import { Tabs,TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs'

export default function TravellerSettings(){
    const navigate = useNavigate();
    const user = useSelector(state => state.auth.user);
        // removed duplicate declarations
        const [searchParams] = useSearchParams();
        const [activeTab, setActiveTab] = useState('profile');

    useEffect(()=>{
        const tab = searchParams.get('tab')
        if(tab && ['profile', 'wallet', 'kyc'].includes(tab)){
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
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Settings</h2>
                    <div className="flex gap-2">
                        {!user.isGuide && (
                            <Button onClick={() => navigate('/registration?type=guide')}>Be a Guide</Button>
                        )}
                        {!user.isHost && (
                            <Button onClick={() => navigate('/registration?type=host')}>Be a Host</Button>
                        )}
                    </div>
                </div>
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
                                <TabsTrigger 
                                    value="kyc"
                                    className="data-[state=active]:bg-[#F3CA62] justify-start px-3 py-2 rounded-md hover:bg-[#FFEEC2]"
                                >
                                    KYC
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
                            <TabsContent value="kyc" className="m-0">
                                <KycTab />
                            </TabsContent>
                        </section>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}


