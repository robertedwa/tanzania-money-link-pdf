
import { Layout } from '@/components/Layout';
import { ContributionForm } from '@/components/ContributionForm';
import { NetworkIcon } from 'lucide-react';

const Contribute = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <NetworkIcon className="h-6 w-6 mr-2" />
          Mobile Money Contribution
        </h1>
        <p className="text-gray-600 mb-3">
          Support community projects with secure Tanzanian mobile money payments.
        </p>
        <div className="bg-blue-50 p-3 rounded-md mb-6 text-sm">
          <p className="font-medium mb-1 text-blue-700">Live Payment Process:</p>
          <ul className="list-disc pl-4 text-blue-700 space-y-1">
            <li>Enter project details and amount (minimum 5,000 TZS)</li>
            <li>Choose your mobile money provider: M-Pesa, Tigo Pesa, Airtel Money or Halopesa</li>
            <li>Enter the phone number linked to your mobile money account</li>
            <li>You'll receive a USSD prompt on your phone to confirm the payment</li>
            <li>Enter your mobile money PIN to complete the transaction</li>
          </ul>
        </div>
        <ContributionForm />
      </div>
    </Layout>
  );
};

export default Contribute;
