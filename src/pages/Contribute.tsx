
import { Layout } from '@/components/Layout';
import { ContributionForm } from '@/components/ContributionForm';
import { NetworkIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Contribute = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2 flex items-center">
          <NetworkIcon className="h-6 w-6 mr-2" />
          TanzaPay Mobile Money
        </h1>
        <p className="text-gray-600 mb-3">
          Live mobile money transactions for Tanzania - M-Pesa, Tigo Pesa, Airtel Money, and Halopesa.
        </p>
        
        <Alert className="mb-6 bg-green-50 border-green-300 text-green-700">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-700">
            You are using live mobile money transaction processing for Tanzania. All payments are processed through real provider APIs.
          </AlertDescription>
        </Alert>
        
        <div className="bg-blue-50 p-4 rounded-md mb-6 text-sm border border-blue-200">
          <p className="font-medium mb-2 text-blue-800">Live Payment Process:</p>
          <ul className="list-disc pl-5 text-blue-700 space-y-1.5">
            <li>Enter contribution details and amount (minimum 5,000 TZS)</li>
            <li>Select your Tanzania mobile money provider</li>
            <li>Enter the phone number connected to your mobile money account</li>
            <li>Approve the payment on your phone when prompted</li>
            <li>Enter your PIN when requested to complete the transaction</li>
            <li>Receive instant confirmation when payment is successful</li>
          </ul>
        </div>
        <ContributionForm />
      </div>
    </Layout>
  );
};

export default Contribute;
