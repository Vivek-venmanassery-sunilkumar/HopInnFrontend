import { createSlice } from '@reduxjs/toolkit';

// Helper functions for localStorage
const loadFromLocalStorage = () => {
    try {
        const savedFilters = localStorage.getItem('hopinn_search_filters');
        if (savedFilters) {
            return JSON.parse(savedFilters);
        }
    } catch (error) {
        console.error('Error loading search filters from localStorage:', error);
    }
    return null;
};

const saveToLocalStorage = (filters) => {
    try {
        localStorage.setItem('hopinn_search_filters', JSON.stringify(filters));
    } catch (error) {
        console.error('Error saving search filters to localStorage:', error);
    }
};

const clearFromLocalStorage = () => {
    try {
        localStorage.removeItem('hopinn_search_filters');
    } catch (error) {
        console.error('Error clearing search filters from localStorage:', error);
    }
};

// Load initial state from localStorage
const savedFilters = loadFromLocalStorage();

const initialState = {
    searchFilters: savedFilters || {
        destination: '',
        fromDate: '',
        toDate: '',
        guests: 1,
        adultCount: 1,
        childrenCount: 0,
        infantCount: 0,
        latitude: null,
        longitude: null,
        children_onboard: false
    },
    searchResults: {
        properties: [],
        guides: [],
        totalCount: 0,
        page: 1,
        pageSize: 10,
        isLoading: false,
        error: null
    },
    hasActiveSearch: savedFilters ? Object.values(savedFilters).some(value => 
        value !== '' && value !== null && value !== 0 && value !== false
    ) : false
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        setSearchFilters(state, action) {
            const filters = action.payload;
            const newFilters = {
                ...state.searchFilters,
                ...filters
            };
            state.searchFilters = newFilters;
            state.hasActiveSearch = true;
            
            // Save to localStorage
            saveToLocalStorage(newFilters);
        },
        setSearchResults(state, action) {
            const { properties, guides, totalCount, page, pageSize } = action.payload;
            state.searchResults = {
                properties: properties || [],
                guides: guides || [],
                totalCount,
                page,
                pageSize,
                isLoading: false,
                error: null
            };
        },
        setSearchLoading(state, action) {
            state.searchResults.isLoading = action.payload;
        },
        setSearchError(state, action) {
            state.searchResults.error = action.payload;
            state.searchResults.isLoading = false;
        },
        clearSearch(state) {
            state.searchFilters = {
                destination: '',
                fromDate: '',
                toDate: '',
                guests: 1,
                adultCount: 1,
                childrenCount: 0,
                infantCount: 0,
                latitude: null,
                longitude: null,
                children_onboard: false
            };
            state.searchResults = {
                properties: [],
                guides: [],
                totalCount: 0,
                page: 1,
                pageSize: 10,
                isLoading: false,
                error: null
            };
            state.hasActiveSearch = false;
            
            // Clear from localStorage
            clearFromLocalStorage();
        },
        updateSearchPage(state, action) {
            state.searchResults.page = action.payload;
        },
        updateSearchPageSize(state, action) {
            state.searchResults.pageSize = action.payload;
        },
        loadFiltersFromStorage(state) {
            const savedFilters = loadFromLocalStorage();
            if (savedFilters) {
                state.searchFilters = savedFilters;
                state.hasActiveSearch = Object.values(savedFilters).some(value => 
                    value !== '' && value !== null && value !== 0 && value !== false
                );
            }
        }
    }
});

export const { 
    setSearchFilters, 
    setSearchResults, 
    setSearchLoading, 
    setSearchError, 
    clearSearch,
    updateSearchPage,
    updateSearchPageSize,
    loadFiltersFromStorage
} = searchSlice.actions;

export default searchSlice.reducer;
