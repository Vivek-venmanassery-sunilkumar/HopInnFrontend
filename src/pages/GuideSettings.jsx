import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { ChevronRight, Home } from 'lucide-react';
import HikerLogo from '@/assets/hiker-logo.svg';
import GuideProfileTab from '@/components/guide-settings/GuideProfileTab';
import ScrollingRoadAnimation from '@/components/animation/ScrollingRoadAnimation';

export default function GuideSettings() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('profile');
    const [direction, setDirection] = useState(null);
    const scrollTimeoutRef = useRef(null);
    const containerRef = useRef(null);
    const tabContentRef = useRef(null);

    const tabs = ['profile'];

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && tabs.includes(tab) && tab !== activeTab) {
            const oldIndex = tabs.indexOf(activeTab);
            const newIndex = tabs.indexOf(tab);
            setDirection(newIndex > oldIndex ? 'right' : 'left');
            setActiveTab(tab);
        }
    }, [searchParams]);

    useEffect(() => {
        const handleWheel = (e) => {
            const tabContent = tabContentRef.current;
            const isScrollingInContent =
                tabContent && (tabContent.contains(e.target) || e.target.closest("[data-radix-tabs-content]"))

            if (isScrollingInContent && tabContent) {
                const { scrollTop, scrollHeight, clientHeight } = tabContent;
                const isAtTop = scrollTop <= 5;
                const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

                if ((e.deltaY > 0 && !isAtBottom) || (e.deltaY < 0 && !isAtTop)) {
                    return;
                }
            }

            e.preventDefault();

            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }

            scrollTimeoutRef.current = setTimeout(() => {
                const currentIndex = tabs.indexOf(activeTab);
                let nextIndex;

                if (e.deltaY > 0) {
                    nextIndex = Math.min(currentIndex + 1, tabs.length - 1);
                } else {
                    nextIndex = Math.max(currentIndex - 1, 0);
                }

                if (nextIndex !== currentIndex) {
                    handleTabChange(tabs[nextIndex]);
                }
            }, 50);
        }

        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => {
                container.removeEventListener('wheel', handleWheel);
                if (scrollTimeoutRef.current) {
                    clearTimeout(scrollTimeoutRef.current);
                }
            }
        }
    }, [activeTab]);

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
                        {/* Empty div to maintain layout balance - buttons removed as requested */}
                        <div></div>
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
                        <button
                            onClick={() => navigate("/traveller/settings")}
                            className="hover:text-[#2D5016] transition-colors"
                        >
                            Account Settings
                        </button>
                        <ChevronRight className="h-4 w-4" />
                        <span className="text-[#2D5016] font-medium">Guide Settings</span>
                    </nav>

                    <div className="mb-6 flex-shrink-0">
                        <h1 className="text-3xl font-bold text-[#2D5016] mb-2">Guide Settings</h1>
                        <p className="text-[#8B4513]">Manage your guide profile and preferences</p>
                    </div>

                    <div ref={containerRef} className="flex-1 overflow-hidden">
                        <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
                            <div className="grid grid-cols-12 gap-8 h-full">
                                <aside className="col-span-12 lg:col-span-3">
                                    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] p-6">
                                        <h3 className="text-lg font-semibold text-[#2D5016] mb-4">Guide Settings</h3>
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
                                        </TabsList>
                                    </div>
                                </aside>

                                <section className="col-span-12 lg:col-span-9 h-full relative">
                                    <div
                                        ref={activeTab === 'profile' ? tabContentRef : null}
                                        className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4B5A0] h-full flex flex-col p-6 overflow-auto absolute inset-0 ${getAnimationClass('profile')}`}
                                    >
                                        <GuideProfileTab />
                                    </div>
                                </section>
                            </div>
                        </Tabs>
                    </div>
                </div>
            </div>
        </div>
    );
}