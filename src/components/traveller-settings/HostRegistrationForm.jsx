import { useForm, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Select from 'react-select';
import { Textarea } from '@/components/ui/textarea';

export default function HostRegistrationForm() {
  const { register, handleSubmit, control, setValue, formState: { errors } } = useForm();
  const [languages, setLanguages] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch countries with specific fields to avoid the error
        const countriesResponse = await fetch('https://restcountries.com/v3.1/all?fields=name,languages');
        const countriesData = await countriesResponse.json();
        
        // Extract languages from all countries
        const allLanguages = new Set();
        countriesData.forEach(country => {
          if (country.languages) {
            Object.values(country.languages).forEach(lang => {
              allLanguages.add(lang);
            });
          }
        });
        
        // Convert to options format
        const languageOptions = Array.from(allLanguages).map(lang => ({
          label: lang,
          value: lang
        })).sort((a, b) => a.label.localeCompare(b.label));
        
        // Convert countries to options format
        const countryOptions = countriesData.map(country => ({
          label: country.name.common,
          value: country.name.common
        })).sort((a, b) => a.label.localeCompare(b.label));
        
        setLanguages(languageOptions);
        setCountries(countryOptions);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback data in case API fails
        setLanguages([
          { label: 'English', value: 'English' },
          { label: 'Spanish', value: 'Spanish' },
          { label: 'French', value: 'French' },
          { label: 'German', value: 'German' },
          { label: 'Chinese', value: 'Chinese' }
        ]);
        
        setCountries([
          { label: 'United States', value: 'United States' },
          { label: 'United Kingdom', value: 'United Kingdom' },
          { label: 'Canada', value: 'Canada' },
          { label: 'Australia', value: 'Australia' },
          { label: 'India', value: 'India' }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = (data) => {
    // Format knownLanguages and country as values
    if (data.knownLanguages) {
      data.knownLanguages = data.knownLanguages.map(l => l.value);
    }
    if (data.country) {
      data.country = data.country.value;
    }
    
    console.log('Host Registration:', data);
    // API call here
  };

  if (loading) {
    return <div className="text-center py-4">Loading form data...</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              options={languages}
              classNamePrefix="select"
              placeholder="Select languages you know..."
              isLoading={loading}
            />
          )}
        />
        {errors.knownLanguages && (
          <span className="text-red-500 text-sm">{errors.knownLanguages.message}</span>
        )}
      </div>

      <div>
        <Label>Tell a bit more about you *</Label>
        <Textarea 
          {...register('about', { required: 'This field is required' })} 
          placeholder="Describe yourself, your interests, etc."
          rows={4}
        />
        {errors.about && <span className="text-red-500 text-sm">{errors.about.message}</span>}
      </div>

      <div>
        <Label>What work do you do *</Label>
        <Input 
          {...register('profession', { required: 'Profession is required' })} 
          placeholder="e.g., Software Engineer, Teacher, Doctor"
        />
        {errors.profession && <span className="text-red-500 text-sm">{errors.profession.message}</span>}
      </div>

      <div>
        <Label>Date of Birth *</Label>
        <Input 
          type="date" 
          {...register('dob', { 
            required: 'Date of birth is required',
            validate: {
              validAge: (value) => {
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                return age >= 18 || 'You must be at least 18 years old';
              }
            }
          })} 
        />
        {errors.dob && <span className="text-red-500 text-sm">{errors.dob.message}</span>}
      </div>

      <div className="border p-4 rounded-lg space-y-4">
        <h3 className="font-semibold">Enter your address</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Country *</Label>
            <Controller
              name="country"
              control={control}
              rules={{ required: 'Country is required' }}
              render={({ field }) => (
                <Select
                  {...field}
                  options={countries}
                  classNamePrefix="select"
                  placeholder="Select your country..."
                  isLoading={loading}
                />
              )}
            />
            {errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}
          </div>

          <div>
            <Label>House Name/Building *</Label>
            <Input 
              {...register('houseName', { required: 'House name is required' })} 
              placeholder="House name or building number"
            />
            {errors.houseName && <span className="text-red-500 text-sm">{errors.houseName.message}</span>}
          </div>

          <div>
            <Label>Nearby Landmark (optional)</Label>
            <Input 
              {...register('landmark')} 
              placeholder="e.g., Near Central Park, Opposite Mall"
            />
          </div>

          <div>
            <Label>District *</Label>
            <Input 
              {...register('district', { required: 'District is required' })} 
              placeholder="District name"
            />
            {errors.district && <span className="text-red-500 text-sm">{errors.district.message}</span>}
          </div>

          <div>
            <Label>State/Province *</Label>
            <Input 
              {...register('state', { required: 'State is required' })} 
              placeholder="State or province name"
            />
            {errors.state && <span className="text-red-500 text-sm">{errors.state.message}</span>}
          </div>

          <div>
            <Label>Postal Code *</Label>
            <Input 
              {...register('pincode', { 
                required: 'Postal code is required',
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'Postal code must contain only numbers'
                }
              })} 
              placeholder="e.g., 123456"
            />
            {errors.pincode && <span className="text-red-500 text-sm">{errors.pincode.message}</span>}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Registration'}
      </Button>
    </form>
  );
}