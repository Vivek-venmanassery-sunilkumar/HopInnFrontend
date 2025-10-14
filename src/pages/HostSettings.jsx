import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { ChevronRight, Home } from 'lucide-react';
import HikerLogo from '@/assets/hiker-logo.svg';
import HostProfileTab from '@/components/host-settings/HostProfileTab';
import PropertyManagementTab from '@/components/host-settings/PropertyManagementTab';
import ScrollingRoadAnimation from '@/components/animation/ScrollingRoadAnimation';

export default function HostSettings() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('profile');
    const [direction, setDirection] = useState(null);

    const tabs = ['profile', 'properties'];

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tabs.includes(tab) && tab !== activeTab) {
            const oldIndex = tabs.indexOf(activeTab);
            const newIndex = tabs.indexOf(tab);
            setDirection(newIndex > oldIndex ? 'right' : 'left');
            setActiveTab(tab);
        }
    }, [searchParams]);

    const handleTabChange = (value) => {
        navigate(`?tab=${value}`, { replace: true });
    }

    const getAnimationClass = (tabValue) => {
        if (tabValue === activeTab) {
            return direction === 'left' ? 'animate-slide-in-left' : 'animate-slide-in-right';
        }
        return 'hidden';
    }

    return (
        <div className="min-h-screen flex flex-col relative">
            {/* Reusable Animation Component */}
            <ScrollingRoadAnimation />

            <header className="absolute top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-sm shadow-sm border-b border-[#D4B5A0] flex-shrink-0">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate("/home")}
                        >
                            <img 
                                src={HikerLogo || "/placeholder.svg"} 
                                alt="HopInn" 
                                className="h-20 w-auto transition-transform duration-300 hover:scale-105" 
                            />
                            <div className="hidden lg:block">
                                <h1 className="text-3xl font-bold text-[#2D5016]">
                                    HopInn
                                </h1>
                                <p className="text-sm text-[#8B4513] -mt-1">Your Travel Companion</p>
                            </div>
                        </div>
                        {/* Empty div to maintain layout balance */}
                        <div></div>
                    </div>
                </div>
            </header>

            <div className="flex-1 flex flex-col pt-28 z-1">
                <div className="max-w-6xl mx-auto px-4 py-6 flex-1 flex flex-col">
                    <nav className="flex items-center space-x-2 text-sm text-[#8B4513] mb-4 flex-shrink-0">
                        <button
                            onClick={() => navigate("/home")}
                            className="flex items-center gap-1 hover:text-[#2D5016] transition-colors"
                        >
                            <Home className="h-4 w-4" />
                            Home
                        </button>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-[#2D5016] font-medium">Host Dashboard</span>
                    </nav>


                    <div className="flex-1 overflow-hidden min-h-[500px] max-h-[600px]">
                        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full min-h-[500px]">
                            <div className="grid grid-cols-12 gap-8 h-full">
                                <aside className="col-span-12 lg:col-span-3">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] p-4">
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
                                                    Profile Settings
                                                </span>
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="properties"
                                                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#F68241] data-[state=active]:to-[#F3CA62] data-[state=active]:text-white justify-start px-4 py-3 rounded-lg hover:bg-[#F68241]/10 transition-all duration-200 w-full text-left font-medium text-[#8B4513]"
                                            >
                                                <span className="flex items-center gap-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                        />
                                                    </svg>
                                                    Property Management
                                                </span>
                                            </TabsTrigger>
                                        </TabsList>
                                    </div>
                                </aside>

                                <section className="col-span-12 lg:col-span-9 h-full relative min-h-[500px] max-h-[600px] overflow-y-auto">
                                    {/* Profile Tab */}
                                    <div
                                        className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] h-full flex flex-col p-6 overflow-auto absolute inset-0 ${getAnimationClass('profile')}`}
                                    >
                                        <HostProfileTab />
                                    </div>

                                    {/* Properties Tab */}
                                    <div
                                        className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] h-full flex flex-col p-6 overflow-auto absolute inset-0 ${getAnimationClass('properties')}`}
                                    >
                                        <PropertyManagementTab />
                                    </div>
                                </section>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
            
            {/* Footer */}
            <footer className="bg-white/90 backdrop-blur-sm border-t border-[#D4B5A0] py-2 relative z-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-xs text-gray-500">
                        © 2024 HopInn. Copyright Protected. Developed by Vivek V S
                    </p>
                </div>
            </footer>
        </div>
    );
}