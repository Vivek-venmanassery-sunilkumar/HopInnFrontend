import { Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Select from 'react-select';

export function AddressFields({ control, errors, countries, states, districts, loadingStates, loadingDistricts, fieldName, country }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label>Country *</Label>
        <Controller
          name={fieldName('country')}
          control={control}
          rules={{ required: 'Country is required' }}
          render={({ field }) => (
            <Select
              {...field}
              options={countries}
              classNamePrefix="select"
              placeholder="Select your country..."
              className="mt-1"
            />
          )}
        />
        {errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}
      </div>

      <div>
        <Label>State/Province *</Label>
        <Controller
          name={fieldName('state')}
          control={control}
          rules={{ required: 'State is required' }}
          render={({ field }) => (
            <Select
              {...field}
              options={states}
              classNamePrefix="select"
              placeholder={loadingStates ? "Loading states..." : "Select state..."}
              isLoading={loadingStates}
              isDisabled={!country || loadingStates}
              className="mt-1"
            />
          )}
        />
        {errors.state && <span className="text-red-500 text-sm">{errors.state.message}</span>}
      </div>

      <div>
        <Label>District/City *</Label>
        <Controller
          name={fieldName('district')}
          control={control}
          rules={{ required: 'District is required' }}
          render={({ field }) => (
            <Select
              {...field}
              options={districts}
              classNamePrefix="select"
              placeholder={loadingDistricts ? "Loading districts..." : "Select district..."}
              isLoading={loadingDistricts}
              isDisabled={!country || loadingDistricts}
              className="mt-1"
            />
          )}
        />
        {errors.district && <span className="text-red-500 text-sm">{errors.district.message}</span>}
      </div>

      <div>
        <Label htmlFor={fieldName('houseName')}>House Name/Building *</Label>
        <Input 
          id={fieldName('houseName')}
          {...control.register(fieldName('houseName'), { required: 'House name is required' })} 
          placeholder="House name or building number"
          className="mt-1"
        />
        {errors.houseName && <span className="text-red-500 text-sm">{errors.houseName.message}</span>}
      </div>

      <div>
        <Label htmlFor={fieldName('landmark')}>Nearby Landmark (optional)</Label>
        <Input 
          id={fieldName('landmark')}
          {...control.register(fieldName('landmark'))} 
          placeholder="e.g., Near Central Park, Opposite Museum"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor={fieldName('pincode')}>Postal Code *</Label>
        <Input 
          id={fieldName('pincode')}
          {...control.register(fieldName('pincode'), { 
            required: 'Postal code is required',
            pattern: {
              value: /^[0-9]+$/,
              message: 'Postal code must contain only numbers'
            }
          })} 
          placeholder="e.g., 123456"
          className="mt-1"
        />
        {errors.pincode && <span className="text-red-500 text-sm">{errors.pincode.message}</span>}
      </div>
    </div>
  );
}