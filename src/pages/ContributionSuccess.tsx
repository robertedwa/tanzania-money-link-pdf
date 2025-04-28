
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const ContributionSuccess = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const amount = queryParams.get('amount');
  const title = queryParams.get('title');
  
  // Notify parent window to update contribution list
  useEffect(() => {
    window.dispatchEvent(new Event('storage')); // Trigger storage event to refresh lists
  }, []);

  return (
    <Layout>
      <div className="max-w-md mx-auto text-center py-12">
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your contribution has been processed successfully.
          </p>
          
          {(amount || title) && (
            <Alert className="mb-6 bg-green-50">
              <AlertDescription>
                <div className="text-left">
                  {title && <p><span className="font-semibold">Project:</span> {title}</p>}
                  {amount && <p><span className="font-semibold">Amount:</span> {parseInt(amount).toLocaleString()} TZS</p>}
                </div>
              </AlertDescription>
            </Alert>
          )}
          
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
