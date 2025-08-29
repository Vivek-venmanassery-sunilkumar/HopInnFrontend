import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useLogin } from '@/hooks/auth/AuthHooks';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { VALIDATION_PATTERNS } from '@/constants/validation';

export default function LoginForm() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { mutateAsync: login, isPending: isLoading } = useLogin();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const response = await login(data);
        const authData = response?.data?.user ?? response?.data?.data?.user ?? response?.user ?? response?.data ?? response;
        const payload = {
            id: authData.id,
            isAdmin: authData.isAdmin,
            isGuide: authData.isGuide,
            isHost: authData.isHost,
            isTraveller: authData.isTraveller,
            isActive: authData.isActive,
        };
        dispatch(setUser(payload));
        if(!authData.isAdmin){
            navigate('/home');
        }else{
            navigate('/admin/settings')
        }
    };

    return (
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
                        pattern:VALIDATION_PATTERNS.PASSWORD
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
    );
}


