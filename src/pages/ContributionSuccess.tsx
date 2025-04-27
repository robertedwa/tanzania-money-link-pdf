
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const ContributionSuccess = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto text-center py-12">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your contribution has been processed successfully.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/">View All Contributions</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/contribute">Make Another Contribution</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContributionSuccess;
