
import { Layout } from '@/components/Layout';
import { ContributionForm } from '@/components/ContributionForm';

const Contribute = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Make a Contribution</h1>
        <ContributionForm />
      </div>
    </Layout>
  );
};

export default Contribute;
