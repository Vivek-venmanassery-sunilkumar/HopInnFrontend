import HostFormFields from '@/components/common/HostFormFields';

export default function HostProfileTab({ initialData }) {
  // You can pass initialData to HostFormFields if needed for default values
  return (
    <form className="space-y-6 max-w-4xl mx-auto">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Host Profile</h2>
        <p className="text-gray-600">Update your host profile information</p>
      </div>
      <HostFormFields initialData={initialData} />
      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Host Certification</h4>
        <p className="text-blue-700 text-sm">
          By updating this form, you agree to our terms and confirm that you have the necessary
          qualifications and permissions to work as a host in your region.
        </p>
      </div>
    </form>
  );
}
