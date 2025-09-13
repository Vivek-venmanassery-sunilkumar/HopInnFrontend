import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useResendOTP } from '@/hooks/AuthHooks';

export default function OTPModal({ isOpen, onClose, onVerifyOTP, isLoading, toggleInitialOTPState, email }) {
    const initialOTPState = ['', '', '', '', '', '']
    const [otp, setOtp] = useState(initialOTPState);
    const {mutate: retrySendOTP} = useResendOTP()
    const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds
    const inputRefs = useRef([]);

    useEffect(()=>{
        setOtp(initialOTPState);
        if(inputRefs.current[0]){
            inputRefs.current[0].focus();
        }
    }, [toggleInitialOTPState])

    useEffect(() => {
        if (isOpen && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        
    }}, [isOpen, timeLeft]);

    useEffect(() => {
        if (isOpen) {
            setTimeLeft(60);
            setOtp(initialOTPState);
            // Focus first input when modal opens
            if (inputRefs.current[0]) {
                inputRefs.current[0].focus();
            }
        }
    }, [isOpen]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleInputChange = (index, value) => {
        if (value.length > 1) return; // Only allow single character
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input if value is entered
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        // Move to previous input on backspace if current is empty
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length === 6) {
            console.log(otpString)
            onVerifyOTP(otpString);
        }
    };

    const handleResend = () => {
        // You can add resend OTP logic here
        retrySendOTP({email}, {
            onSuccess: ()=>{
                setTimeLeft(60);
                setOtp(initialOTPState);
                console.log('I am here inside the onSuccess of the retrysendotp mutate funciton of the otpmodal component')
                // Focus first input after resend
                if (inputRefs.current[0]) {
                    inputRefs.current[0].focus();
                }
            }
        })
    };

    const isTimerExpired = timeLeft === 0;
    const otpString = otp.join('');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e)=>{e.preventDefault()}}>
                <DialogHeader>
                    <DialogTitle>Enter OTP</DialogTitle>
                    <DialogDescription>
                        We've sent a verification code to your email. Please enter it below.
                    </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="flex gap-2">
                                {otp.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        disabled={isLoading}
                                        className="w-12 h-12 text-center text-lg font-mono border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                                        placeholder=""
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Time remaining: <span className="font-mono">{formatTime(timeLeft)}</span>
                        </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                        {!isTimerExpired ? (
                            <Button 
                                type="submit" 
                                disabled={otpString.length !== 6 || isLoading}
                                className="w-full"
                            >
                                {isLoading ? 'Verifying...' : 'Verify OTP'}
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleResend}
                                disabled={isLoading}
                                className="w-full"
                            >
                                Resend OTP
                            </Button>
                        )}
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
