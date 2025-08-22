import { useState, useRef, useEffect } from 'react'
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import toast from 'react-hot-toast'

// Simple SVG icons
const CameraIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
        <circle cx="12" cy="13" r="4"/>
    </svg>
)

const XIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <line x1="18" y1="6" x2="6" y2="18"/>
        <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
)

function centerAspectCrop(mediaWidth, mediaHeight, aspect) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function ProfileImageUpload({ 
    currentImageUrl, 
    onImageChange, 
    fallbackImage = '/src/assets/profile_avatar.png' 
}) {
    const [previewUrl, setPreviewUrl] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [crop, setCrop] = useState()
    const [imageSrc, setImageSrc] = useState('')
    const fileInputRef = useRef(null)
    const imgRef = useRef(null)
    const [completedCrop, setCompletedCrop] = useState()
    const [isCropping, setIsCropping] = useState(false)

    // Cleanup preview URL when component unmounts or image changes
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl)
            }
        }
    }, [previewUrl])

    const handleFileSelect = (event) => {
        const file = event.target.files[0]
        if (!file) return

        // Validate file size (2-5 MB)
        const fileSizeInMB = file.size / (1024 * 1024)
        if (fileSizeInMB > 5) {
            toast.error('Please select an image with size less than 5MB')
            return
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            setImageSrc(reader.result)
            setIsOpen(true)
        }
        reader.readAsDataURL(file)
    }

    function onImageLoad(e) {
        const { width, height } = e.currentTarget
        setCrop(centerAspectCrop(width, height, 1))
    }

    const getCroppedImg = (image, crop) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!image || !crop) {
            return null
        }

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height
        const pixelRatio = window.devicePixelRatio

        canvas.width = Math.floor(crop.width * scaleX * pixelRatio)
        canvas.height = Math.floor(crop.height * scaleY * pixelRatio)

        ctx.scale(pixelRatio, pixelRatio)
        ctx.imageSmoothingQuality = 'high'

        const cropX = crop.x * scaleX
        const cropY = crop.y * scaleY

        ctx.save()
        // Move the crop origin to the canvas origin (0,0)
        ctx.translate(-cropX, -cropY)
        // Draw the image
        ctx.drawImage(
            image,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
            0,
            0,
            image.naturalWidth,
            image.naturalHeight,
        )
        ctx.restore()

        return new Promise((resolve) => {
            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        console.error('Canvas is empty')
                        return
                    }
                    resolve(blob)
                },
                'image/webp',
                0.9
            )
        })
    }

    const handleCropComplete = async () => {
        if (!imgRef.current || !completedCrop) {
            return
        }

        setIsCropping(true)
        
        try {
            const croppedBlob = await getCroppedImg(
                imgRef.current,
                completedCrop
            )
            
            if (!croppedBlob) {
                throw new Error('Failed to crop image')
            }
            
            const croppedFile = new File([croppedBlob], 'profile-image.webp', {
                type: 'image/webp'
            })
            
            // Create preview URL for the cropped image
            const previewUrl = URL.createObjectURL(croppedBlob)
            setPreviewUrl(previewUrl)
            
            onImageChange(croppedFile)
            setIsOpen(false)
            setImageSrc('')
        } catch (error) {
            console.error('Error cropping image:', error)
            alert('Error processing image. Please try again.')
        } finally {
            setIsCropping(false)
        }
    }

    const handleRemoveImage = () => {
        onImageChange(null)
        setPreviewUrl(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="relative">
                <Avatar className="w-24 h-24">
                    <AvatarImage 
                        src={previewUrl || currentImageUrl || fallbackImage} 
                        alt="Profile" 
                    />
                    <AvatarFallback>
                        <img src={fallbackImage} alt="Default Profile" className="w-full h-full object-cover" />
                    </AvatarFallback>
                </Avatar>
                
                <div className="absolute -bottom-2 -right-2">
                    <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="w-8 h-8 rounded-full p-0 bg-[#F3CA62] hover:bg-[#F68241] text-black"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <CameraIcon />
                    </Button>
                </div>
            </div>

            <div className="flex gap-2">
                {(currentImageUrl || previewUrl) && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="bg-[#FFEEC2] hover:bg-[#F68241] text-black border-[#F68241]"
                        onClick={handleRemoveImage}
                    >
                        <XIcon />
                        Remove
                    </Button>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Crop Profile Image</DialogTitle>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                        {imageSrc && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={1}
                                circularCrop
                            >
                                <img
                                    ref={imgRef}
                                    src={imageSrc}
                                    alt="Crop preview"
                                    style={{ maxWidth: '100%' }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        )}
                        
                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="bg-[#FFEEC2] hover:bg-[#F68241] text-black border-[#F68241]"
                                onClick={() => setIsOpen(false)}
                                disabled={isCropping}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="button"
                                className="bg-[#F3CA62] hover:bg-[#F68241] text-black"
                                onClick={handleCropComplete}
                                disabled={isCropping || !completedCrop}
                            >
                                {isCropping ? "Processing..." : "Apply Crop"}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}