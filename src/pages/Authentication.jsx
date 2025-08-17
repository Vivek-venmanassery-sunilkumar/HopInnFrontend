import SignUpForm from '@/components/auth/SignUpForm';

export default function Authentication() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Create Your Account
                    </h1>
                    <p className="text-gray-600">
                        Join us and start your journey today
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <SignUpForm />
                </div>

                {/* Footer */}
                <div className="text-center mt-6">
                    <p className="text-gray-500 text-sm">
                        Already have an account?{' '}
                        <a href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                            Sign in here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}