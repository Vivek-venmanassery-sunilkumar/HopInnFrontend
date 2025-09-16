import { useSelector } from 'react-redux'
import Logo from '@/assets/hiker-logo.svg'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

export default function HomePage() {
    const navigate = useNavigate()
    const user = useSelector((state)=>state.auth.user)
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
            <main className="flex-1 flex items-center justify-center">
                <h1 className="text-2xl font-bold">Welcome to HopInn</h1>
            </main>
        </div>
    );
}


