import { initiateSignUp, verifyOTP, retryOTP, login } from "@/services/auth/AuthService";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";


export function useSignUpInitiation(){
    return useMutation({
        mutationFn: initiateSignUp,
        onSuccess: (data)=>{
            const message = data?.message || 'Sign up initiated successfully! Please check your email for OTP.';
            toast.success(message);
            console.log("Otp send in mail:", data)
        },
        onError: (error)=>{
            const errorMessage = error.message || 'An error occurred during sign up. Please try again.';
            toast.error(errorMessage);
        }
    })
}

export function useOtpVerify(){
    return useMutation({
        mutationFn: verifyOTP,
        onSuccess: (data)=>{
            const message = data?.message || 'User created successfully'
            toast.success(message)
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })
}


export function useResendOTP(){
    return useMutation({
        mutationFn: retryOTP,
        onSuccess: (data)=>{
            const message = data?.message || 'OTP resent successfully'
            toast.success(message)
        },
        onError: (error)=>{
            toast.error(error.message)
        }
    })
}


export function useLogin(){
    return useMutation({
        mutationFn: login,
        onSuccess: (data)=>{
            const message = data?.message || 'Login successful'
            toast.success(message)
        },
        onError: (error)=>{
            const message = error?.message || 'Login failed'
            toast.error(message)
        }
    })
}