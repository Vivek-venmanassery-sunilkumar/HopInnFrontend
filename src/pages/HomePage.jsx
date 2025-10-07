import { useSelector } from 'react-redux'
import Logo from '@/assets/hiker-logo.svg'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import HomePageFilter from '@/components/home-page/HomePageFilter'
import PropertyCard from '@/components/home-page/PropertyCard'
import { useSearchProperties, useSearchGuides } from '@/hooks/HomePageFilterHook'
import { useState, useEffect } from 'react'

export default function HomePage() {
    const navigate = useNavigate()
    const user = useSelector((state)=>state.auth.user)
    const [filterParams, setFilterParams] = useState(null)
    const [activeTab, setActiveTab] = useState('properties')
    const [initialLoad, setInitialLoad] = useState(true)
    
    // Load all properties on initial page load
    const initialParams = {
        destination: '',
        guests: 1,
        fromDate: '',
        toDate: '',
        latitude: '',
        longitude: '',
        all: true,
        page: 1,
        pageSize: 10
    }
    
    const { data: propertiesData, isLoading: isPropertiesLoading, error: propertiesError } = useSearchProperties(
        initialLoad ? initialParams : filterParams, 
        initialLoad || !!filterParams
    )
    const { data: guidesData, isLoading: isGuidesLoading, error: guidesError } = useSearchGuides(
        initialLoad ? initialParams : filterParams, 
        initialLoad || !!filterParams
    )
    
    const isSearching = isPropertiesLoading || isGuidesLoading
    const searchResults = (initialLoad || filterParams) ? {
        properties: propertiesData,
        guides: guidesData
    } : null

    // Load all properties when component mounts
    useEffect(() => {
        setInitialLoad(true)
    }, [])

    const handleFilter = (filterData) => {
        setInitialLoad(false)
        setFilterParams(filterData)
    }

    const handleClear = () => {
        setInitialLoad(true)
        setFilterParams(null)
    }

    return (
        <div className="min-h-screen flex flex-col">
            <header className="w-full border-b">
                <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={Logo} alt="HopInn" className="h-15 w-auto" />
                    </div>
                    <div>
                        {user.isAdmin ? (
                            <Button
                                onClick = {()=> navigate("/admin/settings")} 
                                variant="ghost"     
                                className="flex items-center gap-2"
                            >
                                Dashboard
                            </Button>
                        ): (
                            <Button
                                onClick={()=>navigate("/traveller/settings")} 
                                variant="ghost"     
                                className="flex items-center gap-2"
                            >
                                Profile
                            </Button>
                        )}
                    </div>
                </div>
            </header>
            
            <main className="flex-1 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    {/* HomePage Filter Component */}
                    <div className="mb-8">
                        <HomePageFilter 
                            onFilter={handleFilter}
                            onClear={handleClear}
                            isLoading={isSearching}
                        />
                    </div>

                    {/* Search Tabs */}
                    <div className="mb-6">
                        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
                            <button
                                onClick={() => setActiveTab('properties')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === 'properties'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Properties
                            </button>
                            <button
                                onClick={() => setActiveTab('guides')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === 'guides'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                Guides
                            </button>
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchResults && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-bold mb-4">
                                {initialLoad 
                                    ? `All ${activeTab === 'properties' ? 'Properties' : 'Guides'}`
                                    : `${activeTab === 'properties' ? 'Properties' : 'Guides'} Found`
                                }
                            </h2>
                            
                            {activeTab === 'properties' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {searchResults.properties?.properties?.map((property) => (
                                        <PropertyCard 
                                            key={property.id} 
                                            property={property} 
                                        />
                                    ))}
                                </div>
                            )}

                            {activeTab === 'guides' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {searchResults.guides?.guides?.map((guide) => (
                                        <div key={guide.id} className="bg-white rounded-lg shadow-md p-4">
                                            <h3 className="text-lg font-semibold mb-2">{guide.name || 'Local Guide'}</h3>
                                            <p className="text-gray-600 mb-2">{guide.bio || 'Professional local guide'}</p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-500">
                                                    {guide.profession} • {guide.expertise}
                                                </span>
                                                <span className="text-lg font-bold text-primary">
                                                    ${guide.hourly_rate}/hour
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Welcome Message when no search */}
                    {!searchResults && !isSearching && (
                        <div className="text-center py-12">
                            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome to HopInn</h1>
                            <p className="text-gray-600 text-lg">
                                Discover amazing places to stay and local guides to enhance your travel experience.
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}


