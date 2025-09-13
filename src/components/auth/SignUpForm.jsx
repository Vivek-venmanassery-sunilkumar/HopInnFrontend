import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useOtpVerify, useSignUpInitiation } from '@/hooks/AuthHooks';
import OTPModal from './OTPModal';
import { VALIDATION_PATTERNS } from '@/constants/validation';

export default function SignUpForm({ onSwitchToLogin }) {
    const { mutate: initiateSignUp, isLoading} = useSignUpInitiation();
    const { mutate: verifyOTP} = useOtpVerify();
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
    const [email, setEmail] = useState('')
    const [otpError, setOtpError] = useState(false)
    
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        delete data.confirmPassword
        initiateSignUp(data, {
            onSuccess: (data)=>{
                reset()
                setShowOTPModal(true)
                setEmail(data?.data?.email)
            }
        })
    }

    const handleVerifyOTP = async (otp) => {
        setIsVerifyingOTP(true);
        const data = {
            email: email,
            otp: otp
        }
        verifyOTP(data, {
            onSuccess: ()=>{
                setShowOTPModal(false)
                setOtpError(false)
                if (onSwitchToLogin) {
                    onSwitchToLogin();
                }
            },
            onSettled: ()=>{
                setIsVerifyingOTP(false);
            },
            onError: ()=>{
                setOtpError(!otpError)
            }
        })
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">
                            First Name *
                        </Label>
                        <Input
                            id="firstName"
                            type="text"
                            placeholder="Enter your first name"
                            className={`${errors.firstName ? 'border-red-500 focus:border-red-500' : ''}`}
                            {...register('firstName', {
                                required: 'First name is required',
                                minLength: { value: 2, message: 'First name must be at least 2 characters' },
                                pattern: VALIDATION_PATTERNS.FIRSTNAME,
                            })}
                        />
                        {errors.firstName && (
                            <span className="text-sm text-red-500">{errors.firstName.message}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">
                            Last Name
                        </Label>
                        <Input
                            id="lastName"
                            type="text"
                            placeholder="Enter your last name"
                            className={`${errors.lastName ? 'border-red-500 focus:border-red-500' : ''}`}
                            {...register('lastName', {
                                pattern: VALIDATION_PATTERNS.LASTNAME,
                            })}
                        />
                        {errors.lastName && (
                            <span className="text-sm text-red-500">{errors.lastName.message}</span>
                        )}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                        Email Address *
                    </Label>
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
                    <Label htmlFor="phoneNumber" className="text-sm font-medium">
                        Phone Number *
                    </Label>
                    <Input
                        id="phoneNumber"
                        type="tel"
                        placeholder="Enter your phone number"
                        className={`${errors.phoneNumber ? 'border-red-500 focus:border-red-500' : ''}`}
                        {...register('phoneNumber', {
                            required: 'Phone number is required',
                            pattern: VALIDATION_PATTERNS.PHONENUMBER,
                        })}
                        onChange = {(e)=>{
                            e.target.value = e.target.value.replace(/\D/g, '');
                        }}
                    />
                    {errors.phoneNumber && (
                        <span className="text-sm text-red-500">{errors.phoneNumber.message}</span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium">
                            Password *
                        </Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            className={`${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                            })}
                        />
                        {errors.password && (
                            <span className="text-sm text-red-500">{errors.password.message}</span>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-sm font-medium">
                            Confirm Password *
                        </Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            className={`${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: (value) =>
                                    value === watch('password') || 'Passwords do not match',
                            })}
                        />
                        {errors.confirmPassword && (
                            <span className="text-sm text-red-500">{errors.confirmPassword.message}</span>
                        )}
                    </div>
                </div>

                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
                >
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>

            <OTPModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                onVerifyOTP={handleVerifyOTP}
                isLoading={isVerifyingOTP}
                toggleInitialOTPState = {otpError}
                email = {email}
            />
        </>
    );
}