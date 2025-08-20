import { useState } from 'react';
import HikerLogo from '@/assets/hiker-logo.svg';
import SignUpForm from '@/components/auth/SignUpForm';
import LoginForm from '@/components/auth/LoginForm';
import { Plane, Train, Ship, Bus, Hotel, Mountain } from 'lucide-react';

export default function Authentication() {
    const [showLogin, setShowLogin] = useState(false);
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl border border-gray-100 bg-white/90">
                {/* Background travel icons */}
                <Plane className="pointer-events-none absolute -top-6 -left-6 text-gray-200" size={96} />
                <Train className="pointer-events-none absolute top-10 right-6 text-gray-200" size={88} />
                <Ship className="pointer-events-none absolute bottom-6 left-10 text-gray-200" size={80} />
                <Bus className="pointer-events-none absolute bottom-10 right-12 text-gray-200" size={72} />
                <Hotel className="pointer-events-none absolute top-1/2 left-1 text-gray-200 -rotate-12" size={64} />
                <Mountain className="pointer-events-none absolute top-1/3 right-1 text-gray-200 rotate-6" size={64} />

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

                        {showLogin ? <LoginForm /> : <SignUpForm onSwitchToLogin={() => setShowLogin(true)} />}
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