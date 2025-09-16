import { useForm, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import { Textarea } from '@/components/ui/textarea';
import { LANGUAGES } from '@/constants/languages';
import AddressForm from '@/components/common/AddressForm';

export default function GuideProfileTab({ initialData }) {
  const { register, control, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      knownLanguages: [],
      about: '',
      profession: '',
      dob: '',
      hourlyRate: '',
      expertise: '',
      ...initialData
    }
  });

  return (
    <form className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Guide Profile</h2>
        <p className="text-gray-600">Update your guide profile information</p>
      </div>
      <div>
        <Label>Known Languages *</Label>
        <Controller
          name="knownLanguages"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={LANGUAGES}
              classNamePrefix="select"
              placeholder="Select languages you speak..."
              className="mt-1"
              onChange={val => field.onChange(val)}
              value={field.value}
            />
          )}
        />
      </div>
      <div>
        <Label htmlFor="about">Tell us about yourself *</Label>
        <Textarea
          id="about"
          {...register('about')}
          placeholder="Describe your background, experience, passion for guiding, and what makes you unique..."
          rows={4}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="profession">Profession *</Label>
        <Input
          id="profession"
          {...register('profession')}
          placeholder="e.g., Certified Tour Guide, History Professor, Adventure Specialist"
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="dob">Date of Birth *</Label>
          <Input
            id="dob"
            type="date"
            {...register('dob')}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="hourlyRate">Hourly Rate (₹) *</Label>
          <Input
            id="hourlyRate"
            type="number"
            {...register('hourlyRate')}
            placeholder="e.g., 500"
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="expertise">Areas of Expertise/Specializations *</Label>
        <Textarea
          id="expertise"
          {...register('expertise')}
          placeholder="e.g., Historical tours, Food and culinary experiences, Adventure activities, Cultural immersion, Wildlife safaris, Photography tours..."
          rows={3}
          className="mt-1"
        />
      </div>
      <AddressForm
        control={control}
        watch={watch}
        setValue={setValue}
        errors={errors}
      />
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Guide Certification</h4>
        <p className="text-blue-700 text-sm">
          By updating this form, you agree to our terms and confirm that you have the necessary
          qualifications and permissions to work as a guide in your region.
        </p>
      </div>
    </form>
  );
}
