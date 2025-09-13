import { useEffect, useState } from 'react';
import GuideRegistrationForm from '@/components/traveller-settings/GuideRegistrationForm';
import HostRegistrationForm from '@/components/traveller-settings/HostRegistrationForm';
import { Button } from '@/components/ui/button';
import { useSearchParams } from 'react-router-dom';

export default function RegistrationForm({ defaultType = 'guide'}) {
  const [type, setType] = useState(defaultType);
  const [searchParams] = useSearchParams();

  useEffect(()=>{
    const urlType = searchParams.get('type');
    if (urlType && (urlType === 'guide' || urlType === 'host')){
        setType(urlType)
    }
  }, [searchParams])

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={type === 'guide' ? 'default' : 'outline'}
          onClick={() => setType('guide')}
        >
          Guide Registration
        </Button>
        <Button
          variant={type === 'host' ? 'default' : 'outline'}
          onClick={() => setType('host')}
        >
          Host Registration
        </Button>
      </div>
      {type === 'guide' ? <GuideRegistrationForm /> : <HostRegistrationForm />}
    </div>
  );
}
