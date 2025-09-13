import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import { Textarea } from '@/components/ui/textarea';
import { LANGUAGES } from '@/constants/languages';
import AddressForm from '../common/AddressForm';
import { useGuideOnboard } from '@/hooks/GuideHooks';

export default function GuideRegistrationForm() {
  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm();
  const { mutateAsync: onboardGuide, isPending: isLoading } = useGuideOnboard();

  const onSubmit = async (data) => {
    // Format knownLanguages as values
    if (data.knownLanguages) {
      data.knownLanguages = data.knownLanguages.map(l => l.value);
    }
    
    console.log('Guide Registration:', data);
    const response = await onboardGuide(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Guide Registration</h2>
        <p className="text-gray-600">Complete your profile to become a certified guide</p>
      </div>

      <div>
        <Label>Known Languages *</Label>
        <Controller
          name="knownLanguages"
          control={control}
          rules={{ required: 'Please select at least one language' }}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={LANGUAGES}
              classNamePrefix="select"
              placeholder="Select languages you speak..."
              className="mt-1"
            />
          )}
        />
        {errors.knownLanguages && (
          <span className="text-red-500 text-sm">{errors.knownLanguages.message}</span>
        )}
      </div>

      <div>
        <Label htmlFor="about">Tell us about yourself *</Label>
        <Textarea 
          id="about"
          {...register('about', { 
            required: 'This field is required',
            minLength: {
              value: 50,
              message: 'Please write at least 50 characters about yourself'
            }
          })} 
          placeholder="Describe your background, experience, passion for guiding, and what makes you unique..."
          rows={4}
          className="mt-1"
        />
        {errors.about && <span className="text-red-500 text-sm">{errors.about.message}</span>}
      </div>

      <div>
        <Label htmlFor="profession">Profession *</Label>
        <Input 
          id="profession"
          {...register('profession', { required: 'Profession is required' })} 
          placeholder="e.g., Certified Tour Guide, History Professor, Adventure Specialist"
          className="mt-1"
        />
        {errors.profession && <span className="text-red-500 text-sm">{errors.profession.message}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input 
            id="dob"
            type="date" 
            {...register('dob', { 
              required: 'Date of birth is required',
              validate: {
                validAge: (value) => {
                  const birthDate = new Date(value);
                  const today = new Date();
                  const age = today.getFullYear() - birthDate.getFullYear();
                  const monthDiff = today.getMonth() - birthDate.getMonth();
                  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                    return age - 1 >= 18 || 'You must be at least 18 years old';
                  }
                  return age >= 18 || 'You must be at least 18 years old';
                }
              }
            })} 
            className="mt-1"
          />
          {errors.dob && <span className="text-red-500 text-sm">{errors.dob.message}</span>}
        </div>

        <div>
          <Label htmlFor="hourlyRate">Hourly Rate (₹) *</Label>
          <Input 
            id="hourlyRate"
            type="number" 
            {...register('hourlyRate', { 
              required: 'Hourly rate is required',
              min: { 
                value: 50, 
                message: 'Minimum rate is ₹50 per hour' 
              },
              max: {
                value: 5000,
                message: 'Maximum rate is ₹5000 per hour'
              }
            })} 
            placeholder="e.g., 500"
            className="mt-1"
          />
          {errors.hourlyRate && <span className="text-red-500 text-sm">{errors.hourlyRate.message}</span>}
        </div>
      </div>

      <div>
        <Label htmlFor="expertise">Areas of Expertise/Specializations *</Label>
        <Textarea 
          id="expertise"
          {...register('expertise', { 
            required: 'Please describe your areas of expertise',
            minLength: {
              value: 30,
              message: 'Please provide at least 30 characters about your expertise'
            }
          })} 
          placeholder="e.g., Historical tours, Food and culinary experiences, Adventure activities, Cultural immersion, Wildlife safaris, Photography tours..."
          rows={3}
          className="mt-1"
        />
        {errors.expertise && <span className="text-red-500 text-sm">{errors.expertise.message}</span>}
      </div>

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