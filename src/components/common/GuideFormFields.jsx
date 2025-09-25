import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Select from 'react-select';
import { LANGUAGES } from '@/constants/languages';
import { Controller } from 'react-hook-form';

export default function GuideFormFields({
  control,
  register,
  errors,
  showAbout = true,
  showProfession = true,
  showLanguages = true,
  showHourlyRate = true,
  showExpertise = true,
}) {
  return (
    <>
      {showLanguages && (
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
      )}

      {showAbout && (
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
            placeholder="Describe your background, experience, passion, and what makes you unique..."
            rows={4}
            className="mt-1"
          />
          {errors.about && <span className="text-red-500 text-sm">{errors.about.message}</span>}
        </div>
      )}

      {showProfession && (
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
      )}

      {showHourlyRate && (
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
      )}

      {showExpertise && (
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
            placeholder="e.g., Historical tours, Food and culinary experiences, Adventure activities, Cultural immersion..."
            rows={3}
            className="mt-1"
          />
          {errors.expertise && <span className="text-red-500 text-sm">{errors.expertise.message}</span>}
        </div>
      )}
    </>
  );
}