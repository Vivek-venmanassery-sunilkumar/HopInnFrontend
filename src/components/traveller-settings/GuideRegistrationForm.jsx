import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import AddressForm from '../common/AddressForm';
import { useGuideOnboard } from '@/hooks/GuideHooks';
import { useDispatch } from 'react-redux';
import { fetchUserRoles } from '@/redux/slices/authSlice';
import GuideFormFields from '../common/GuideFormFields';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function GuideRegistrationForm() {
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.auth.user)
  const navigate = useNavigate()
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm();
  const { mutateAsync: onboardGuide, isPending: isLoading } = useGuideOnboard();


  const onSubmit = async (data) => {
    // Format knownLanguages as values
    if (data.knownLanguages) {
      data.knownLanguages = data.knownLanguages.map(l => l.value);
    }
    
    if(data.country && typeof data.country === 'object'){
      data.country = data.country.value;
    }

    if(data.district && typeof data.district === 'object'){
      data.district = data.district.value;
    }

    if(data.state && typeof data.state == 'object'){
      data.state = data.state.label;
    }

    console.log('Guide Registration:', data);
    const response = await onboardGuide(data, {
      onSuccess: async ()=>{
        // Dispatch the thunk to refresh user roles 
        await dispatch(fetchUserRoles()).unwrap()
        navigate('/guide-settings')
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Guide Registration</h2>
        <p className="text-gray-600">Complete your profile to become a certified guide</p>
      </div>

      {/* Use the reusable GuideFormFields component */}
      <GuideFormFields
        control={control}
        register={register}
        errors={errors}
      />

      {/* Use the reusable AddressForm component */}
      <AddressForm 
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
      />

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Guide Certification</h4>
        <p className="text-blue-700 text-sm">
          By submitting this form, you agree to our terms and confirm that you have the necessary 
          qualifications and permissions to work as a guide in your region.
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        size="lg"
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Submit Guide Registration'}
      </Button>
    </form>
  );
}