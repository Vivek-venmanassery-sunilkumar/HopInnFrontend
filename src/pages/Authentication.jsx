import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import HikerLogo from '@/assets/hiker-logo.svg';
import SignUpForm from '@/components/auth/SignUpForm';
import LoginForm from '@/components/auth/LoginForm';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Simple SVG icons
const PlaneIcon = ({ className, size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21 4 19 4c-1 0-1.4.3-2.8 1.7L12 8l-8.2-1.8c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 5H4l-1 1 3 2 2 3 1-1v-3l5-2 5.5 5.3c.3.3.8.4 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
    </svg>
)

const TrainIcon = ({ className, size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
        <path d="M7 21v-2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/>
        <path d="M9 11h6"/>
        <path d="M9 7h6"/>
    </svg>
)

const ShipIcon = ({ className, size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 21h12M6 21l2-9h8l2 9M6 12l3-4h6l3 4"/>
        <path d="M12 3v18"/>
    </svg>
)

const BusIcon = ({ className, size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
        <path d="M7 21v-2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/>
        <path d="M9 11h6"/>
        <path d="M9 7h6"/>
    </svg>
)

const HotelIcon = ({ className, size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 21h18"/>
        <path d="M5 21V7l8-4v18"/>
        <path d="M19 21V11l-6-4"/>
        <path d="M9 9h1"/>
        <path d="M9 13h1"/>
        <path d="M9 17h1"/>
        <path d="M14 13h1"/>
        <path d="M14 17h1"/>
    </svg>
)

const MountainIcon = ({ className, size = 24 }) => (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M8 3l4 8 5-5 5 15H2L8 3z"/>
    </svg>
)

export default function Authentication() {
    const location = useLocation();
    const [showLogin, setShowLogin] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('login') === '1') {
            setShowLogin(true);
        }
    }, [location.search]);
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl border border-gray-100 bg-white/90">
                {/* Background travel icons */}
                <PlaneIcon className="pointer-events-none absolute -top-6 -left-6 text-gray-200" size={96} />
                <TrainIcon className="pointer-events-none absolute top-10 right-6 text-gray-200" size={88} />
                <ShipIcon className="pointer-events-none absolute bottom-6 left-10 text-gray-200" size={80} />
                <BusIcon className="pointer-events-none absolute bottom-10 right-12 text-gray-200" size={72} />
                <HotelIcon className="pointer-events-none absolute top-1/2 left-1 text-gray-200 -rotate-12" size={64} />
                <MountainIcon className="pointer-events-none absolute top-1/3 right-1 text-gray-200 rotate-6" size={64} />

                {/* Content */}
                <div className="relative grid grid-cols-1 md:grid-cols-2 gap-0">
                    {/* Illustration */}
                    <div className="hidden md:flex items-center justify-center p-10">
                        <img src={HikerLogo} alt="Hiker logo" className="w-80 h-80" />
                    </div>

                    {/* Form Card with animation and internal header */}
                    <div className={`p-8 md:p-10 ${showLogin ? 'animate-fade-in-left' : 'animate-fade-in-right'}`}>
                        <div className="text-center mb-6">
                            {showLogin ? (
                                <>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                                    <p className="text-gray-600">Sign in to continue your journey</p>
                                </>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
                                    <p className="text-gray-600">Join us and start your journey today</p>
                                </>
                            )}
                        </div>

                        {showLogin ? <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}><LoginForm /> </GoogleOAuthProvider>: <SignUpForm onSwitchToLogin={() => setShowLogin(true)} />}
                        <div className="text-center mt-6">
                            {showLogin ? (
                                <p className="text-gray-500 text-sm">
                                    Don't have an account?{' '}
                                    <button onClick={() => setShowLogin(false)} className="text-blue-600 hover:text-blue-700 font-medium">
                                        Create one
                                    </button>
                                </p>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Already have an account?{' '}
                                    <button onClick={() => setShowLogin(true)} className="text-blue-600 hover:text-blue-700 font-medium">
                                        Sign in here
                                    </button>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}