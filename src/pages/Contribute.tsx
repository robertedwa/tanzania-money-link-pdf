
import { Layout } from '@/components/Layout';
import { ContributionForm } from '@/components/ContributionForm';

const Contribute = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Make a Contribution</h1>
        <p className="text-gray-600 mb-3">
          Support community projects with secure mobile money payments.
        </p>
        <div className="bg-blue-50 p-3 rounded-md mb-6 text-sm">
          <p className="font-medium mb-1 text-blue-700">How it works:</p>
          <ul className="list-disc pl-4 text-blue-700 space-y-1">
            <li>Enter project details and amount (minimum 5,000 TZS)</li>
            <li>Choose your mobile money provider</li>
            <li>Enter your phone number</li>
            <li>You'll receive a prompt on your phone to confirm payment</li>
          </ul>
        </div>
        <ContributionForm />
      </div>
    </Layout>
  );
};

export default Contribute;
