import { useState, useRef } from 'react';
import { useAddKycDocuments, useGetKycDetails } from '@/hooks/kyc/KycHooks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { uploadToCloudinary } from '@/lib/cloudinaryUtils';
import { 
  Upload, 
  FileCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  ImageIcon 
} from 'lucide-react';

export default function KycTab() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const inputRef = useRef();

  // Fetch KYC details on mount
  const { data: kycDetails, isLoading } = useGetKycDetails();
  const mutation = useAddKycDocuments();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Reset previous errors
    setError('');
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File must be an image (JPEG, PNG, etc.)');
      return;
    }
    
    // Validate file size
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      return;
    }
    
    setSelectedFile(file);
    
    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    if (!selectedFile) return;
    
    try {
    
      const result = await uploadToCloudinary(selectedFile);
      const payload={
        kycImageUrl: result.imageUrl,
        kycImagePublicId: result.publicId,
      }
      mutation.mutate(payload);
      console.log('Payload being sent for kyc add: ', payload)
      
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
      setSelectedFile(null);
      
      // Reset file input
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    } catch (err) {
      setError('Failed to upload image: ' + err.message);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl('');
    }
    setSelectedFile(null);
    // Reset file input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };


  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-amber-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h1>
        <p className="text-gray-600">
          Upload your government-issued ID for identity verification
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg bg-gray-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
          <p>Loading your KYC information...</p>
        </div>
      ) : kycDetails ? (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FileCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">KYC Document Submitted</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span>Status:</span>
                  {getStatusIcon(kycDetails.verificationStatus)}
                  <span className={`font-semibold ${getStatusColor(kycDetails.verificationStatus)}`}>
                    {kycDetails.verificationStatus || 'Not Submitted'}
                  </span>
                </div>
                <img 
                  src={kycDetails.kycImageUrl} 
                  alt="KYC Document" 
                  className="max-w-xs rounded-lg border shadow-sm mt-3"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">KYC Verification Required</h3>
                <p className="text-amber-700">
                  You need to complete KYC verification to access all features. Please upload a government-issued ID.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload KYC Document</h3>
              <p className="text-sm text-gray-600 mb-4">
                Upload a clear image of your government-issued ID (Driver's License, Passport, or National ID)
              </p>
            </div>

            <div className="space-y-4">
              <div 
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50"
                onClick={() => inputRef.current?.click()}
              >
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <p className="font-medium text-gray-700">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500 mt-1">JPG, PNG (Max 5MB)</p>
                <Input
                  id="kyc-upload"
                  type="file"
                  accept="image/*"
                  ref={inputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {error && (
                <Alert variant="destructive" className="bg-red-50 border-red-200">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Requirements:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Document must be clearly visible
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    All four corners should be within the image
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    No glare or reflections on the document
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    File size must be less than 5MB
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="sm:max-w-md">
          <div className="space-y-4">
            <div className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <ImageIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-lg">Confirm KYC Document</h4>
              <p className="text-gray-600 mt-1">Is the document clearly visible and correct?</p>
            </div>
            
            {previewUrl && (
              <div className="border rounded-lg p-2 bg-gray-50">
                <img 
                  src={previewUrl} 
                  alt="Document preview" 
                  className="max-w-full max-h-64 object-contain mx-auto rounded"
                />
              </div>
            )}
            
            <div className="flex gap-3 justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={mutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleConfirm}
                disabled={mutation.isPending}
                className="min-w-[100px]"
              >
                {mutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  'Confirm'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {mutation.isPending && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <div className="flex-1">
                <p className="font-medium">Uploading your document...</p>
                <Progress value={66} className="mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {mutation.isError && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <XCircle className="w-4 h-4 mr-2" />
          <AlertDescription>
            Error uploading document: {mutation.error.message}
          </AlertDescription>
        </Alert>
      )}

      {mutation.isSuccess && (
        <Alert variant="default" className="bg-green-50 border-green-200">
          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
          <AlertDescription className="text-green-800">
            Document uploaded successfully! Your verification is pending review.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}