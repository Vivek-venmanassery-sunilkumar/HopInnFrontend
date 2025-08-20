import './App.css'
import Authentication from './pages/Authentication'
import HomePage from './pages/HomePage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { useSelector } from 'react-redux'
function ProtectedTravellerRoute({ children }) {
  const { isAuthenticated, blocked, user, isLoading } = useSelector((state) => state.auth);
  const isTraveller = user?.isTraveller;

  if(isLoading){
    return <div>Loading...</div>
  }
  if (!isAuthenticated || blocked || !isTraveller) {
    return <Navigate to="/" replace />;
  }
  return children;
}


const queryClient = new QueryClient()

function App() {
  return (
    <>
      <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Authentication />} />
            <Route
              path="/home"
              element={
                <ProtectedTravellerRoute>
                  <HomePage />
                </ProtectedTravellerRoute>
              }
            />
          </Routes>
        </BrowserRouter>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4ade80',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </QueryClientProvider>
      </Provider>
    </>
  )
}

export default App
