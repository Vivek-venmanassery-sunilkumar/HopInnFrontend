import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLogin, useGoogleLogin } from '@/hooks/AuthHooks';
import { useDispatch } from 'react-redux';
import { fetchUserRoles } from '@/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { VALIDATION_PATTERNS } from '@/constants/validation';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { mutateAsync: login, isPending: isLoading } = useLogin();
    const {mutateAsync: googleLogin, isPending: isGoogleLoading}= useGoogleLogin()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    //Get Google Client Id from env variables
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    const onSubmit = async (data) => {
        const response = await login(data);
        const authData = response.user
        try{
        await dispatch(fetchUserRoles()).unwrap()
        }catch(rolesError){
            await dispatch(fetchUserRoles()).unwrap()
        }
        if(!authData.isAdmin){
            navigate('/home');
        }else{
            navigate('/admin/settings')
        }
    };

    const handleGoogleSuccess = async (credentialResponse)=>{
        try{
            const response = await googleLogin({
                token: credentialResponse.credential,
            })

            const authData = response.user
            try{
            await dispatch(fetchUserRoles()).unwrap()
            }catch(rolesError){
                await dispatch(fetchUserRoles()).unwrap()
            }
            if(!authData.isAdmin){
                navigate('/home')
            }else{
                navigate('/admin/settings')
            }
        }catch(error){
            console.error("Google login failed:",error)
        }
    }

    const handleGoogleError = ()=>{
        console.error("Google login failed")
    };

    return (
         <div className="space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        className={`${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                        {...register('email', {
                            required: 'Email is required',
                            pattern: VALIDATION_PATTERNS.EMAIL,
                        })}
                    />
                    {errors.email && (
                        <span className="text-sm text-red-500">{errors.email.message}</span>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">Password *</Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className={`${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                        {...register('password', {
                            required: 'Password is required',
                            minLength: { value: 8, message: 'Password must be at least 8 characters' },
                            pattern: VALIDATION_PATTERNS.PASSWORD
                        })}
                    />
                    {errors.password && (
                        <span className="text-sm text-red-500">{errors.password.message}</span>
                    )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="flex-shrink mx-4 text-gray-500 text-sm">Or continue with</span>
                <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* Google Sign-In Button */}
            <div className="flex justify-center">
                <GoogleLogin
                    clientId={googleClientId}
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    shape="rectangular"
                    size="large"
                    text="signin_with"
                    theme="outline"
                    width="300"
                    flow='implicit'
                />
            </div>
        </div>
    );
}


