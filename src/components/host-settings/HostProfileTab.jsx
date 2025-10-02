import { useFetchHostProfile, useUpdateHostProfile } from '@/hooks/HostHooks';
import { Loader2, Calendar, Briefcase, Languages, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { LANGUAGES } from '@/constants/languages';

export default function HostProfileTab() {
  const { data: profile, isLoading, error } = useFetchHostProfile();
  const updateProfileMutation = useUpdateHostProfile();
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      profession: '',
      about: '',
      knownLanguages: []
    }
  });
  const [isEditing, setIsEditing] = useState(false);

  const watchedLanguages = watch('knownLanguages');

  useEffect(() => {
    if (profile) {
      setValue('profession', profile.profession || '');
      setValue('about', profile.about || '');
      setValue('knownLanguages', profile.knownLanguages || []);
    }
  }, [profile, setValue]);

  const onSubmit = async (data) => {
    try {
      // Prepare data for API call
      const updateData = {
        profession: data.profession,
        about: data.about,
        knownLanguages: data.knownLanguages
      };

      await updateProfileMutation.mutateAsync(updateData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading profile...</span>
      </div>
    );
  }

  if (error) return <div className="text-red-600 text-center p-4">Error loading profile</div>;
  if (!profile) return <div className="text-yellow-600 text-center p-4">No profile found</div>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Host Profile</h2>
          <p className="text-gray-600">Update your host profile information</p>
        </div>
        {!isEditing && (
          <Button onClick={() => setIsEditing(true)} variant="outline">
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Profile
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <div>
              <label className="text-sm font-medium">Profession</label>
              <Input {...register('profession')} className="mt-1" />
            </div>
          ) : (
            <div>
              <label className="text-sm font-medium">Profession</label>
              <p className="mt-1">{profile.profession || 'Not specified'}</p>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium">Member Since</label>
            <p className="mt-1 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {profile.joinedOn ? new Date(profile.joinedOn).toLocaleDateString() : 'Not available'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Me</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              {...register('about')}
              placeholder="Tell us about yourself..."
              rows={4}
            />
          ) : (
            <p>{profile.about || 'No information provided yet.'}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Languages className="h-5 w-5" />
            Languages
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div>
              <label className="text-sm font-medium">Known Languages</label>
              <Select
                isMulti
                options={LANGUAGES}
                value={watchedLanguages?.map(lang => ({ value: lang, label: lang })) || []}
                onChange={(selectedOptions) => {
                  const languages = selectedOptions?.map(option => option.value) || [];
                  setValue('knownLanguages', languages);
                }}
                className="mt-1"
                placeholder="Select languages you know..."
                classNamePrefix="react-select"
              />
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {profile.knownLanguages?.map((lang, index) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {lang}
                </span>
              )) || 'No languages specified'}
            </div>
          )}
        </CardContent>
      </Card>

      {isEditing && (
        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <Button type="submit" disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>
      )}
    </form>
  );
}