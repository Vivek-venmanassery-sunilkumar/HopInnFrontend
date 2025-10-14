import { useSelector, useDispatch } from 'react-redux'
import Logo from '@/assets/hiker-logo.svg'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import HomePageFilter from '@/components/home-page/HomePageFilter'
import MobileFilter from '@/components/home-page/MobileFilter'
import PropertyCard from '@/components/home-page/PropertyCard'
import GuideCard from '@/components/home-page/GuideCard'
import PropertyMap from '@/components/home-page/PropertyMap'
import { useSearchProperties, useSearchGuides } from '@/hooks/HomePageFilterHook'
import { useState, useEffect } from 'react'
import { ChevronDown, User, Home, MapPin, Settings, LogOut, Plus, Shield, Search, X, Building2, Users } from 'lucide-react'
import { logoutUser } from '@/redux/slices/authSlice'
import { setSearchFilters, setSearchResults, setSearchLoading, setSearchError, clearSearch, loadFiltersFromStorage } from '@/redux/slices/searchSlice'

export default function HomePage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state)=>state.auth.user)
    const searchState = useSelector((state)=>state.search)
    const [activeTab, setActiveTab] = useState('properties')
    const [initialLoad, setInitialLoad] = useState(true)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const [isMobileFilterExpanded, setIsMobileFilterExpanded] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(10)
    
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
        page: currentPage,
        pageSize: pageSize
    } : {
        destination: searchFilters.destination,
        guests: searchFilters.guests,
        fromDate: searchFilters.fromDate,
        toDate: searchFilters.toDate,
        latitude: searchFilters.latitude,
        longitude: searchFilters.longitude,
        children_onboard: searchFilters.children_onboard,
        all: !hasActiveSearch,
        page: currentPage,
        pageSize: pageSize
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
        setCurrentPage(1) // Reset to first page when filtering
        // Save filters to Redux state
        dispatch(setSearchFilters(filterData))
    }

    const handlePageChange = (page) => {
        setCurrentPage(page)
        // Scroll to top when changing pages
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleClear = () => {
        setInitialLoad(true)
        setCurrentPage(1)
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
                <div className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
                    {/* Mobile Layout - Stacked */}
                    <div className="flex flex-col space-y-4 lg:hidden">
                        {/* Top Row - Logo and User Menu */}
                        <div className="flex items-center justify-between">
                            {/* Logo Section */}
                            <div 
                                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={() => navigate("/home")}
                            >
                                <img 
                                    src={Logo} 
                                    alt="HopInn" 
                                    className="h-12 w-auto transition-transform duration-300 hover:scale-105" 
                                />
                                <div>
                                    <h1 className="text-xl font-bold text-[#2D5016]">
                                        HopInn
                                    </h1>
                                    <p className="text-xs text-[#8B4513] -mt-1">Your Travel Companion</p>
                                </div>
                            </div>

                            {/* User Menu - Mobile */}
                            <div className="relative user-menu-container">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg font-medium transition-colors"
                                >
                                    <User className="h-4 w-4" />
                                    <span className="text-sm">{user.name || 'User'}</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* User Menu Dropdown - Mobile */}
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
                                                    dispatch(logoutUser())
                                                    navigate("/auth")
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

                        {/* Filter Section - Mobile */}
                        <div className="w-full">
                            {/* Collapsed Filter Button */}
                            {!isMobileFilterExpanded && (
                                <button
                                    onClick={() => setIsMobileFilterExpanded(true)}
                                    className="w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex items-center justify-between hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gradient-to-r from-[#F68241] to-[#F3CA62] rounded-full flex items-center justify-center">
                                            <Search className="h-5 w-5 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <div className="text-sm font-medium text-gray-900">
                                                {hasActiveSearch ? 'Modify Search' : 'Search Properties & Guides'}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {hasActiveSearch 
                                                    ? `${searchFilters.destination || 'Anywhere'} • ${searchFilters.fromDate ? new Date(searchFilters.fromDate).toLocaleDateString() : 'Any dates'} • ${searchFilters.guests || 1} guest${(searchFilters.guests || 1) > 1 ? 's' : ''}`
                                                    : 'Tap to set filters'
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <ChevronDown className="h-5 w-5 text-gray-400" />
                                </button>
                            )}

                            {/* Expanded Filter */}
                            {isMobileFilterExpanded && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsMobileFilterExpanded(false)}
                                        className="absolute top-2 right-2 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                                    >
                                        <X className="h-4 w-4 text-gray-600" />
                                    </button>
                                    <MobileFilter 
                                        key={`mobile-filter-${JSON.stringify(searchFilters)}`}
                                        onFilter={(data) => {
                                            handleFilter(data)
                                            setIsMobileFilterExpanded(false)
                                        }}
                                        onClear={() => {
                                            handleClear()
                                            setIsMobileFilterExpanded(false)
                                        }}
                                        isLoading={isSearching}
                                        initialValues={searchFilters}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Action Buttons - Mobile */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                            {/* Host Section */}
                            {user.isHost ? (
                                <Button
                                    onClick={() => navigate("/host-settings")}
                                    className="bg-[#F68241] hover:bg-[#E5732A] text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Home className="h-4 w-4" />
                                    <span className="text-sm">Host</span>
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => navigate("/registration?type=host")}
                                    className="bg-[#F68241] hover:bg-[#E5732A] text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="text-sm">Host</span>
                                </Button>
                            )}

                            {/* Guide Section */}
                            {user.isGuide ? (
                                <Button
                                    onClick={() => navigate("/guide-settings")}
                                    className="bg-[#F3CA62] hover:bg-[#E4BA52] text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <MapPin className="h-4 w-4" />
                                    <span className="text-sm">Guide</span>
                                </Button>
                            ) : (
                                <Button
                                    onClick={() => navigate("/registration?type=guide")}
                                    className="bg-[#F3CA62] hover:bg-[#E4BA52] text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Plus className="h-4 w-4" />
                                    <span className="text-sm">Guide</span>
                                </Button>
                            )}

                            {/* Admin Section */}
                            {user.isAdmin && (
                                <Button
                                    onClick={() => navigate("/admin/settings")}
                                    className="bg-[#2D5016] hover:bg-[#1F3A0F] text-white px-3 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
                                >
                                    <Shield className="h-4 w-4" />
                                    <span className="text-sm">Admin</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Desktop Layout - Horizontal */}
                    <div className="hidden lg:flex items-center justify-between w-full">
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
                            <div>
                                <h1 className="text-3xl font-bold text-[#2D5016]">
                                    HopInn
                                </h1>
                                <p className="text-sm text-[#8B4513] -mt-1">Your Travel Companion</p>
                            </div>
                        </div>

                        {/* Filter Section - Center */}
                        <div className="flex-1 mx-8">
                            <HomePageFilter 
                                key={`desktop-filter-${JSON.stringify(searchFilters)}`}
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
                                        <span>Host Dashboard</span>
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => navigate("/registration?type=host")}
                                        className="bg-[#F68241] hover:bg-[#E5732A] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Become a Host</span>
                                    </Button>
                                )}

                                {/* Guide Section */}
                                {user.isGuide ? (
                                    <Button
                                        onClick={() => navigate("/guide-settings")}
                                        className="bg-[#F3CA62] hover:bg-[#E4BA52] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <MapPin className="h-4 w-4" />
                                        <span>Guide Dashboard</span>
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={() => navigate("/registration?type=guide")}
                                        className="bg-[#F3CA62] hover:bg-[#E4BA52] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Plus className="h-4 w-4" />
                                        <span>Become a Guide</span>
                                    </Button>
                                )}

                                {/* Admin Section */}
                                {user.isAdmin && (
                                    <Button
                                        onClick={() => navigate("/admin/settings")}
                                        className="bg-[#2D5016] hover:bg-[#1F3A0F] text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Shield className="h-4 w-4" />
                                        <span>Admin Dashboard</span>
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
                                    <span>{user.name || 'User'}</span>
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                                </button>

                                {/* User Menu Dropdown - Desktop */}
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
                                                    dispatch(logoutUser())
                                                    navigate("/auth")
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
            
            <main className="flex-1 pt-40 lg:pt-28 z-1">
                <div className="max-w-7xl mx-auto px-2 py-4">

                    {/* Search Tabs - Homepage Style */}
                    <div className="mb-8">
                        <div className="flex justify-center">
                            <div className="flex space-x-4">
                                {/* Properties Tab */}
                                <button
                                    onClick={() => setActiveTab('properties')}
                                    className={`group relative px-8 py-4 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
                                        activeTab === 'properties'
                                            ? 'bg-gradient-to-r from-[#F68241] to-[#F3CA62] text-white shadow-xl'
                                            : 'bg-white text-gray-700 shadow-lg hover:shadow-xl border border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl transition-colors duration-300 ${
                                            activeTab === 'properties'
                                                ? 'bg-white/20'
                                                : 'bg-gradient-to-r from-[#F68241] to-[#F3CA62] text-white'
                                        }`}>
                                            <Building2 className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-lg">Properties</div>
                                            <div className={`text-sm ${
                                                activeTab === 'properties'
                                                    ? 'text-white/80'
                                                    : 'text-gray-500'
                                            }`}>
                                                Find places to stay
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Guides Tab */}
                                <button
                                    onClick={() => setActiveTab('guides')}
                                    className={`group relative px-8 py-4 rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-105 ${
                                        activeTab === 'guides'
                                            ? 'bg-gradient-to-r from-[#F68241] to-[#F3CA62] text-white shadow-xl'
                                            : 'bg-white text-gray-700 shadow-lg hover:shadow-xl border border-gray-200'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-xl transition-colors duration-300 ${
                                            activeTab === 'guides'
                                                ? 'bg-white/20'
                                                : 'bg-gradient-to-r from-[#F68241] to-[#F3CA62] text-white'
                                        }`}>
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-semibold text-lg">Guides</div>
                                            <div className={`text-sm ${
                                                activeTab === 'guides'
                                                    ? 'text-white/80'
                                                    : 'text-gray-500'
                                            }`}>
                                                Connect with locals
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            </div>
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
                                <div className="flex flex-col lg:flex-row gap-4">
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
                                        <div className="w-full lg:w-1/3 lg:min-w-[400px]">
                                            <PropertyMap 
                                                properties={searchResults.properties?.properties || []} 
                                                guides={[]} 
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'guides' && (
                                <div className="flex flex-col lg:flex-row gap-4">
                                    {/* Guides Grid - Takes more space when no filter */}
                                    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${
                                        !initialLoad ? 'flex-1' : 'w-full'
                                    }`}>
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

                                    {/* Map Component - Only show when filtering is done */}
                                    {!initialLoad && (
                                        <div className="w-full lg:w-1/3 lg:min-w-[400px]">
                                            <PropertyMap 
                                                properties={[]} 
                                                guides={searchResults.guides?.guides || []} 
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Pagination */}
                            {searchResults && (searchResults.properties?.totalPages > 1 || searchResults.guides?.totalPages > 1) && (
                                <div className="mt-8 flex justify-center">
                                    <div className="flex items-center gap-2">
                                        {/* Previous Button */}
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Previous
                                        </button>

                                        {/* Page Numbers */}
                                        {(() => {
                                            const totalPages = activeTab === 'properties' 
                                                ? searchResults.properties?.totalPages || 1
                                                : searchResults.guides?.totalPages || 1
                                            
                                            const pages = []
                                            const maxVisiblePages = 5
                                            let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
                                            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
                                            
                                            if (endPage - startPage + 1 < maxVisiblePages) {
                                                startPage = Math.max(1, endPage - maxVisiblePages + 1)
                                            }

                                            // Add first page and ellipsis if needed
                                            if (startPage > 1) {
                                                pages.push(
                                                    <button
                                                        key={1}
                                                        onClick={() => handlePageChange(1)}
                                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                                    >
                                                        1
                                                    </button>
                                                )
                                                if (startPage > 2) {
                                                    pages.push(
                                                        <span key="ellipsis1" className="px-2 text-gray-500">
                                                            ...
                                                        </span>
                                                    )
                                                }
                                            }

                                            // Add visible pages
                                            for (let i = startPage; i <= endPage; i++) {
                                                pages.push(
                                                    <button
                                                        key={i}
                                                        onClick={() => handlePageChange(i)}
                                                        className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                            i === currentPage
                                                                ? 'bg-[#F68241] text-white'
                                                                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                                                        }`}
                                                    >
                                                        {i}
                                                    </button>
                                                )
                                            }

                                            // Add ellipsis and last page if needed
                                            if (endPage < totalPages) {
                                                if (endPage < totalPages - 1) {
                                                    pages.push(
                                                        <span key="ellipsis2" className="px-2 text-gray-500">
                                                            ...
                                                        </span>
                                                    )
                                                }
                                                pages.push(
                                                    <button
                                                        key={totalPages}
                                                        onClick={() => handlePageChange(totalPages)}
                                                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                                    >
                                                        {totalPages}
                                                    </button>
                                                )
                                            }

                                            return pages
                                        })()}

                                        {/* Next Button */}
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === (activeTab === 'properties' 
                                                ? searchResults.properties?.totalPages || 1
                                                : searchResults.guides?.totalPages || 1)}
                                            className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Results Info */}
                            {searchResults && (
                                <div className="mt-4 text-center text-sm text-gray-600">
                                    {activeTab === 'properties' ? (
                                        <>
                                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, searchResults.properties?.totalCount || 0)} of {searchResults.properties?.totalCount || 0} properties
                                        </>
                                    ) : (
                                        <>
                                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, searchResults.guides?.totalCount || 0)} of {searchResults.guides?.totalCount || 0} guides
                                        </>
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


