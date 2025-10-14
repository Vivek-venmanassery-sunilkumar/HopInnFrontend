import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound({ 
  title = "Page Not Found", 
  message = "The page you're looking for doesn't exist.", 
  showBackButton = true,
  showHomeButton = true,
  showSearchButton = true,
  customActions = null
}) {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F68241]/10 to-[#2D5016]/10">
      <div className="text-center max-w-md mx-auto px-4">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-[#F68241] mb-4">404</div>
          <div className="w-24 h-1 bg-gradient-to-r from-[#F68241] to-[#F3CA62] mx-auto rounded-full"></div>
        </div>

        {/* Title and Message */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">{message}</p>

        {/* Action Buttons */}
        <div className="space-y-4">
          {customActions ? (
            customActions
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {showBackButton && (
                <Button 
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="flex items-center gap-2 border-[#F68241] text-[#F68241] hover:bg-[#F68241] hover:text-white"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Go Back
                </Button>
              )}
              
              {showHomeButton && (
                <Button 
                  onClick={() => navigate('/home')}
                  className="bg-gradient-to-r from-[#F68241] to-[#F3CA62] hover:from-[#E67332] hover:to-[#E4BA52] text-white flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Go Home
                </Button>
              )}
              
              {showSearchButton && (
                <Button 
                  onClick={() => navigate('/home')}
                  variant="ghost"
                  className="text-gray-600 hover:text-[#F68241] flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search Properties
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Additional Help Text */}
        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Contact our support team or try searching for what you need.</p>
        </div>
      </div>
    </div>
  )
}
