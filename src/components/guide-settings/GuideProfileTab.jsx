import { useFetchGuideProfile, useUpdateGuideProfile } from '@/hooks/GuideHooks';
import { Loader2, MapPin, Calendar, Briefcase, Languages, Award, Edit2, Save, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AddressDisplay from '../common/AddressDisplay';
import AddressForm from '../common/AddressForm';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function GuideProfileTab() {
  const { data: profile, isLoading, error } = useFetchGuideProfile();
  const updateProfileMutation = useUpdateGuideProfile();
  
  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: profile || {}
  });
  
  const [editingCard, setEditingCard] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await updateProfileMutation.mutateAsync(data);
      setEditingCard(null);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (cardName) => {
    if (editingCard === cardName) {
      setEditingCard(null);
    } else {
      setEditingCard(cardName);
    }
  };

  const handleSave = () => {
    handleSubmit(onSubmit)();
  };

  const handleCancel = () => {
    setEditingCard(null);
    // Reset form values to original profile data
    if (profile) {
      Object.keys(profile).forEach(key => {
        setValue(key, profile[key]);
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 text-sm">Loading profile...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 max-w-md mx-auto">
          <h3 className="text-red-800 font-semibold text-sm mb-1">Error Loading Profile</h3>
          <p className="text-red-600 text-xs">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 max-w-md mx-auto">
          <h3 className="text-yellow-800 font-semibold text-sm mb-1">No Profile Found</h3>
          <p className="text-yellow-600 text-xs">Please complete your guide profile setup.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Compact Header */}
      <div className="pb-2">
        <h2 className="text-lg font-bold text-gray-800">Guide Profile</h2>
        <p className="text-gray-600 text-sm">Your professional guide profile information</p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Professional Information Card */}
        <Card className="md:col-span-2 relative group">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Professional Information
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEditClick('professional')}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {editingCard === 'professional' ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">Profession</label>
                  <Input
                    {...control.register('profession')}
                    defaultValue={profile.profession}
                    className="mt-1 text-sm"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700">Hourly Rate (₹)</label>
                  <Input
                    type="number"
                    {...control.register('hourly_rate')}
                    defaultValue={profile.hourly_rate}
                    className="mt-1 text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="button" size="sm" onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-medium text-gray-700">Profession</label>
                  <p className="text-gray-900 text-sm mt-0.5">{profile.profession || 'Not specified'}</p>
                </div>
                
                <div>
                  <label className="text-xs font-medium text-gray-700">Hourly Rate</label>
                  <p className="text-gray-900 text-sm mt-0.5 flex items-center gap-1">
                    ₹{profile.hourly_rate || '0'}/hour
                  </p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-700">Member Since</label>
                  <p className="text-gray-900 text-sm mt-0.5 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {profile.joinedOn ? new Date(profile.joinedOn).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : 'Not available'}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* About Me Card */}
        <Card className="relative group">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              About Me
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEditClick('bio')}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingCard === 'bio' ? (
              <div className="space-y-3">
                <Textarea
                  {...control.register('bio')}
                  defaultValue={profile.bio}
                  className="text-sm min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 text-sm line-clamp-4 leading-relaxed">
                {profile.bio || 'No bio provided yet.'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Languages Card */}
        <Card className="relative group">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                Languages
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEditClick('languages')}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingCard === 'languages' ? (
              <div className="space-y-3">
                <Input
                  {...control.register('knownLanguages')}
                  defaultValue={Array.isArray(profile.knownLanguages) ? profile.knownLanguages.join(', ') : profile.knownLanguages}
                  className="text-sm"
                  placeholder="Enter languages separated by commas"
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {profile.knownLanguages && profile.knownLanguages.length > 0 ? (
                  profile.knownLanguages.map((language, index) => (
                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                      {language.label || language}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-xs">No languages specified</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expertise Card */}
        <Card className="md:col-span-2 relative group">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                Areas of Expertise
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEditClick('expertise')}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingCard === 'expertise' ? (
              <div className="space-y-3">
                <Textarea
                  {...control.register('expertise')}
                  defaultValue={profile.expertise}
                  className="text-sm"
                  placeholder="Enter your areas of expertise separated by commas"
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1">
                {profile.expertise ? (
                  profile.expertise.split(',').map((skill, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-2 py-0">
                      {skill.trim()}
                    </Badge>
                  ))
                ) : (
                  <p className="text-gray-500 text-xs">No expertise specified</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Address Card */}
        <Card className="md:col-span-2 relative group">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEditClick('address')}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {editingCard === 'address' ? (
              <div className="space-y-4">
                <AddressForm 
                  control={control}
                  errors={errors}
                  setValue={setValue}
                  watch={watch}
                  prefix="address"
                />
                <div className="flex gap-2">
                  <Button type="button" size="sm" onClick={handleSave} disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <AddressDisplay address={profile.address} mapHeight="h-32" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Certification Notice */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-800 text-xs mb-1">Guide Certification</h4>
        <p className="text-blue-700 text-xs">
          Your profile has been verified and you are certified to work as a professional guide.
        </p>
      </div>
    </form>
  );
}