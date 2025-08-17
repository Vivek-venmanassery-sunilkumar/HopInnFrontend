import { initiateSignUp, verifyOTP, retryOTP } from "@/services/auth/auth";
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
            const errorMessage = error || 'An error occurred during sign up. Please try again.';
            toast.error(errorMessage);
            console.error("Signup initiation failed:", error);
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