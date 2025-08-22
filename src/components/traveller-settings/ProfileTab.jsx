import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useProfile, useUpdateProfile } from '@/hooks/traveller-profile/TravellerProfileHooks'
import { uploadToCloudinary } from '@/lib/cloudinaryUtils'
import ProfileImageUpload from './ProfileImageUpload'

export default function ProfileTab() {
    const { data: profile, isLoading } = useProfile()
    const updateProfileMutation = useUpdateProfile()
    const [profileImage, setProfileImage] = useState(null)
    const [uploadError, setUploadError] = useState(null)
    const [isUploadingImage, setIsUploadingImage] = useState(false)

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
        }
    })

    useEffect(() => {
        if (profile) {
            reset({
                firstName: profile.firstName || '',
                lastName: profile.lastName || '',
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
            })
        }
    }, [profile, reset])

    const onSubmit = async (values) => {
        setUploadError(null)
        
        try {
            const updateData = { ...values }
            
            // If there's a new profile image, upload it to Cloudinary first
            if (profileImage) {
                setIsUploadingImage(true)
                try {
                    const uploadResult = await uploadToCloudinary(profileImage)
                    updateData.profileImageUrl = uploadResult.imageUrl
                    updateData.profileImagePublicId = uploadResult.publicId
                } catch (error) {
                    console.error('Cloudinary upload failed:', error)
                    setUploadError(error.message || 'Failed to upload image. Please try again.')
                    setIsUploadingImage(false)
                    return
                } finally {
                    setIsUploadingImage(false)
                }
            }
            
            await updateProfileMutation.mutateAsync(updateData)
            setProfileImage(null) // Reset after successful upload
        } catch (error) {
            console.error('Error updating profile:', error)
            setUploadError(error.message || 'Failed to update profile')
        }
    }

    const isSaving = updateProfileMutation.isPending || isUploadingImage

    return (
        <div className="border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Profile</h3>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex justify-center mb-6">
                        <ProfileImageUpload
                            currentImageUrl={profile?.profileImageUrl}
                            onImageChange={setProfileImage}
                        />
                    </div>
                    
                    {uploadError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {uploadError}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label htmlFor="firstName">First name</Label>
                            <Input 
                                id="firstName" 
                                placeholder="John" 
                                {...register('firstName', { required: 'First name is required' })} 
                                aria-invalid={!!errors.firstName} 
                            />
                            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="lastName">Last name</Label>
                            <Input 
                                id="lastName" 
                                placeholder="Doe" 
                                {...register('lastName', { required: 'Last name is required' })} 
                                aria-invalid={!!errors.lastName} 
                            />
                            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="john@example.com" 
                                {...register('email', { 
                                    required: 'Email is required', 
                                    pattern: { 
                                        value: /[^\s@]+@[^\s@]+\.[^\s@]+/, 
                                        message: 'Invalid email' 
                                    } 
                                })} 
                                aria-invalid={!!errors.email} 
                            />
                            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="phoneNumber">Phone number</Label>
                            <Input 
                                id="phoneNumber" 
                                placeholder="+1 555 123 4567" 
                                {...register('phoneNumber', { 
                                    required: 'Phone number is required', 
                                    minLength: { 
                                        value: 7, 
                                        message: 'Invalid phone number' 
                                    } 
                                })} 
                                aria-invalid={!!errors.phoneNumber} 
                            />
                            {errors.phoneNumber && <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>}
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button 
                            type="submit" 
                            className="bg-[#F3CA62] hover:bg-[#F68241] text-black"
                            disabled={isSubmitting || isSaving}
                        >
                            {isSaving ? 'Saving...' : 'Save changes'}
                        </Button>
                    </div>
                </form>
            )}
        </div>
    )
}