import './App.css'
import Authentication from './pages/Authentication'
import LandingPage from './pages/LandingPage'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from '@/redux/store'
import { TravellerProtectedRoute, AdminProtectedRoute, HomePage, TravellerSettings, AdminSettings, 
  RegistrationForm, GuideSettings, GuideProtectedRoute, HostProtectedRoute, HostSettings} from '@/routes'
import PropertyDetails from './pages/PropertyDetails'
import GuideDetails from './pages/GuideDetails'
import PropertyBookingConfirmationPage from './pages/PropertyBookingConfirmationPage'
import NotFound from './components/common/NotFound'
import 'mapbox-gl/dist/mapbox-gl.css'


const queryClient = new QueryClient()

function App() {
  return (
    <>
      <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<Authentication />} />
            <Route
              path="/home"
              element={
                <TravellerProtectedRoute>
                  <HomePage />
                </TravellerProtectedRoute>
              }
            />
            <Route
              path="/traveller/settings"
              element={
                <TravellerProtectedRoute>
                  <TravellerSettings />
                </TravellerProtectedRoute>
              }
            />
            <Route
              path='/admin/settings' 
              element={
                <AdminProtectedRoute>
                  <AdminSettings/>
                </AdminProtectedRoute>
              }
            />
            <Route
              path='/registration'
              element={
                <TravellerProtectedRoute>
                  <RegistrationForm/>
                </TravellerProtectedRoute>
              }
            />
            <Route
              path='/guide-settings'
              element={
                <GuideProtectedRoute>
                  <GuideSettings/>
                </GuideProtectedRoute>
              }
            />
            <Route
            path='/host-settings'
            element={
              <HostProtectedRoute>
                <HostSettings/> 
              </HostProtectedRoute>
            }
            />
            <Route
              path="/property/:id"
              element={
                <TravellerProtectedRoute>
                  <PropertyDetails />
                </TravellerProtectedRoute>
              }
            />
            <Route
              path="/guide/:id"
              element={
                <TravellerProtectedRoute>
                  <GuideDetails />
                </TravellerProtectedRoute>
              }
            />
            <Route
              path="/booking-confirmation"
              element={
                <TravellerProtectedRoute>
                  <PropertyBookingConfirmationPage />
                </TravellerProtectedRoute>
              }
            />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
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
