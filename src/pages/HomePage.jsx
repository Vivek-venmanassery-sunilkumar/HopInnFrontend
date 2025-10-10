import { useSelector, useDispatch } from 'react-redux'
import Logo from '@/assets/hiker-logo.svg'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import HomePageFilter from '@/components/home-page/HomePageFilter'
import PropertyCard from '@/components/home-page/PropertyCard'
import GuideCard from '@/components/home-page/GuideCard'
import PropertyMap from '@/components/home-page/PropertyMap'
import { useSearchProperties, useSearchGuides } from '@/hooks/HomePageFilterHook'
import { useState, useEffect } from 'react'
import { ChevronDown, User, Home, MapPin, Settings, LogOut, Plus, Shield } from 'lucide-react'
import { fetchUserRoles, logout } from '@/redux/slices/authSlice'
import { setSearchFilters, setSearchResults, setSearchLoading, setSearchError, clearSearch, loadFiltersFromStorage } from '@/redux/slices/searchSlice'

export default function HomePage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state)=>state.auth.user)
    const searchState = useSelector((state)=>state.search)
    const [activeTab, setActiveTab] = useState('properties')
    const [initialLoad, setInitialLoad] = useState(true)
    const [showUserMenu, setShowUserMenu] = useState(false)
    
    // Get search filters from Redux state
    const searchFilters = searchState.searchFilters
    const hasActiveSearch = searchState.hasActiveSearch
    
    // Load all properties on initial page load or use saved filters
    const searchParams = initialLoad ? {
        destination: '',
        guests: 1,
        fromDate: '',
        toDate: '',
        latitude: '',
        longitude: '',
        all: true,
        page: 1,
        pageSize: 10
    } : {
        destination: searchFilters.destination,
        guests: searchFilters.guests,
        fromDate: searchFilters.fromDate,
        toDate: searchFilters.toDate,
        latitude: searchFilters.latitude,
        longitude: searchFilters.longitude,
        children_onboard: searchFilters.children_onboard,
        all: !hasActiveSearch,
        page: 1,
        pageSize: 10
    }
    
    const { data: propertiesData, isLoading: isPropertiesLoading, error: propertiesError } = useSearchProperties(
        searchParams, 
        true
    )
    const { data: guidesData, isLoading: isGuidesLoading, error: guidesError } = useSearchGuides(
        searchParams, 
        true // Enable guide search
    )
    
    const isSearching = isPropertiesLoading || isGuidesLoading
    const searchResults = {
        properties: propertiesData,
        guides: guidesData || []
    }

    // Load filters from localStorage on component mount
    useEffect(() => {
        dispatch(loadFiltersFromStorage())
    }, [dispatch])

    // Load properties when component mounts or when hasActiveSearch changes
    useEffect(() => {
        if (hasActiveSearch) {
            // If there are saved filters, use them for search
            setInitialLoad(false)
        } else {
            // If no saved filters, load all properties
            setInitialLoad(true)
        }
    }, [hasActiveSearch])

    const handleFilter = (filterData) => {
        setInitialLoad(false)
        // Save filters to Redux state
        dispatch(setSearchFilters(filterData))
    }

    const handleClear = () => {
        setInitialLoad(true)
        // Clear filters from Redux state
        dispatch(clearSearch())
    }

    // Close user menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showUserMenu && !event.target.closest('.user-menu-container')) {
                setShowUserMenu(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [showUserMenu])

    return (
        <div className="h-screen flex flex-col overflow-hidden relative">
            {/* Background matching TravellerSettings */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#F68241]/10 to-[#2D5016]/10"></div>
            
            <header className="absolute top-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-sm shadow-sm border-b border-[#D4B5A0] flex-shrink-0">
                <div className="w-full px-8 py-4">
                    {/* Header Row - Logo, Filter, User Menu with Buttons */}
                    <div className="flex items-center justify-between w-full">
                        {/* Logo Section - Left */}
                        <div 
                            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => navigate("/home")}
                        >
                            <img 
                                src={Logo} 
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

                        {/* Filter Section - Center */}
                        <div className="flex-1 mx-8">
                            <HomePageFilter 
                                onFilter={handleFilter}
                                onClear={handleClear}
                                isLoading={isSearching}
                                initialValues={searchFilters}
                            />
                        </div>

                        {/* User Menu Section with Host/Guide Buttons - Right */}
                        <div className="flex items-center gap-4">
                            {/* Host/Guide Quick Access */}
                            <div className="flex items-center gap-3">
                                {/* Host Section */}
                                {user.isHost ? (
                                    <Button
                                        onClick={() => navigate("/host-settings")}
                                        className="bg-[#F68241] hover:bg-[#E5732A] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Home className="h-4 w-4" />
                                        <span className="hidden sm:block">Host Dashboard</span>
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            dispatch(fetchUserRoles())
                                            navigate("/registration?type=host")
                                        }}
                                        className="bg-[#F68241] hover:bg-[#E5732A] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:block">Become a Host</span>
                                    </Button>
                                )}

                                {/* Guide Section */}
                                {user.isGuide ? (
                                    <Button
                                        onClick={() => navigate("/guide-settings")}
                                        className="bg-[#F3CA62] hover:bg-[#E4BA52] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        <span className="hidden sm:block">Guide Dashboard</span>
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => {
                                            dispatch(fetchUserRoles())
                                            navigate("/registration?type=guide")
                                        }}
                                        className="bg-[#F3CA62] hover:bg-[#E4BA52] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span className="hidden sm:block">Become a Guide</span>
                                    </Button>
                                )}

                                {/* Admin Section */}
                                {user.isAdmin && (
                                    <Button
                                        onClick={() => navigate("/admin/settings")}
                                        className="bg-[#2D5016] hover:bg-[#1F3A0F] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Shield className="h-4 w-4" />
                                        <span className="hidden sm:block">Admin Dashboard</span>
                                    </Button>
                                )}
                            </div>

                            {/* User Menu */}
                            <div className="relative user-menu-container">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="hidden sm:block">{user.name || 'User'}</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* User Menu Dropdown - Simplified */}
                                {showUserMenu && (
                                    <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
                                        <div className="p-3">
                                            {/* Profile Settings */}
                                            <button
                                                onClick={() => {
                                                    navigate("/traveller/settings")
                                                    setShowUserMenu(false)
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-2"
                                            >
                                                <Settings className="h-4 w-4 text-gray-500" />
                                                <span>Profile Settings</span>
                                            </button>

                                            {/* Logout */}
                                            <button
                                                onClick={() => {
                                                    dispatch(logout())
                                                    navigate("/login")
                                                    setShowUserMenu(false)
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Logout</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="flex-1 pt-28 z-1">
                <div className="max-w-7xl mx-auto px-2 py-4">

                    {/* Search Tabs */}
                    <div className="mb-4">
                        <div className="flex space-x-1 bg-white/80 backdrop-blur-sm border border-[#D4B5A0] p-1 rounded-lg w-fit shadow-lg">
                            <button
                                onClick={() => setActiveTab('properties')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === 'properties'
                                        ? 'bg-gradient-to-r from-[#F68241] to-[#F3CA62] text-white shadow-sm'
                                        : 'text-[#8B4513] hover:text-[#2D5016]'
                                }`}
                            >
                                Properties
                            </button>
                            <button
                                onClick={() => setActiveTab('guides')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === 'guides'
                                        ? 'bg-gradient-to-r from-[#F68241] to-[#F3CA62] text-white shadow-sm'
                                        : 'text-[#8B4513] hover:text-[#2D5016]'
                                }`}
                            >
                                Guides
                            </button>
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchResults && (
                        <div className="mt-6">
                            <h2 className="text-2xl font-bold mb-4 text-[#2D5016]">
                                {initialLoad 
                                    ? `All ${activeTab === 'properties' ? 'Properties' : 'Guides'}`
                                    : `${activeTab === 'properties' ? 'Properties' : 'Guides'} Found`
                                }
                            </h2>
                            
                            {activeTab === 'properties' && (
                                <div className="flex gap-4">
                                    {/* Properties Grid - Takes more space when no filter */}
                                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 ${
                                        !initialLoad ? 'flex-1' : 'w-full'
                                    }`}>
                                    {searchResults.properties?.properties?.map((property) => (
                                        <PropertyCard 
                                            key={property.id} 
                                            property={property} 
                                        />
                                    ))}
                                    </div>

                                    {/* Map Component - Only show when filtering is done */}
                                    {!initialLoad && (
                                        <div className="w-1/3 min-w-[400px] hidden lg:block">
                                            <PropertyMap properties={searchResults.properties?.properties || []} />
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'guides' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {searchResults.guides?.guides?.length > 0 ? (
                                        searchResults.guides.guides.map((guide) => (
                                            <GuideCard 
                                                key={guide.id} 
                                                guide={guide} 
                                            />
                                        ))
                                    ) : (
                                        <div className="col-span-full text-center py-12">
                                            <div className="text-gray-500 text-lg">
                                                {isGuidesLoading ? 'Loading guides...' : 'No guides found'}
                                            </div>
                                            <div className="text-gray-400 text-sm mt-2">
                                                {isGuidesLoading ? 'Please wait while we fetch guides for you.' : 'Try adjusting your search criteria or check back later.'}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Welcome Message when no search */}
                    {!searchResults && !isSearching && (
                        <div className="text-center py-12">
                                <h1 className="text-3xl font-bold text-[#2D5016] mb-4">Welcome to HopInn</h1>
                                <p className="text-[#8B4513] text-lg">
                                Discover amazing places to stay and local guides to enhance your travel experience.
                            </p>
                        </div>
                    )}
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
    );
}


