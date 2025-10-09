import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '@/axios/auth.axios'; 


export const fetchUserRoles = createAsyncThunk(
    'auth/fetchUserRoles',
    async(_, {rejectWithValue})=>{
        try{
            console.log("thunk started")
            const response = await authApi.get('/roles');
            console.log('thunk success', response.data)
            return response.data;
        }catch(error){
            if(error.response?.status===401){
                console.log("User not authenticated-ignoring error");
                return rejectWithValue(null);
            }
            console.log('thunk failed', error)
            return rejectWithValue(error.response?.data || "Failed to fetch user roles")
        }
    }
)

const initialState = {
    user: {
        id: null,
        name: null,
        isAdmin: false,
        isGuide: false,
        isGuideBlocked: null,
        guideId: null,
        isHost: false,
        isHostBlocked: null,
        hostId: null,
        isTraveller: true,
        isActive: false,
        isKycVerified: null
    },
    isAuthenticated: false,
    blocked: false,
    isLoading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser(state, action) {
            const { id, name = null, isAdmin = false, isGuide = false, isGuideBlocked = null, guideId = null, isHost = false, isHostBlocked = null, hostId = null, isTraveller = true, isActive = false, isKycVerified = null } = action.payload || {};
            state.user = { id, name, isAdmin, isGuide, isGuideBlocked, guideId, isHost, isHostBlocked, hostId, isTraveller, isActive, isKycVerified };
            state.isAuthenticated = Boolean(id);
            state.blocked = !state.user.isActive
            console.log(state.user)
        },
        logout(state) {
            state.user = { ...initialState.user };
            state.isAuthenticated = false;
            state.blocked = false
        },
    },
    extraReducers: (builder)=>{
        builder
        .addCase(fetchUserRoles.pending, (state)=>{
            state.isLoading=true;
        })
        .addCase(fetchUserRoles.fulfilled, (state,action)=>{
            state.user = action.payload;
            state.isAuthenticated = Boolean(action.payload.id);
            state.blocked = !action.payload.isActive;
            state.isLoading = false;
        })
        .addCase(fetchUserRoles.rejected, (state,action)=>{
            state.isLoading=false;
            state.error = action.payload;
        });
    }
});

export const { setUser, logout } = authSlice.actions;

export default authSlice.reducer;


