
import { Layout } from '@/components/Layout';
import { ContributionForm } from '@/components/ContributionForm';

const Contribute = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-2">Make a Contribution</h1>
        <p className="text-gray-600 mb-6">
          Support community projects with secure mobile money payments. Minimum contribution is 5,000 TZS.
        </p>
        <ContributionForm />
      </div>
    </Layout>
  );
};

export default Contribute;
