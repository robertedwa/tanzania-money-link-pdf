
import { Layout } from '@/components/Layout';
import { ReportGenerator } from '@/components/ReportGenerator';

const Reports = () => {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        <ReportGenerator />
      </div>
    </Layout>
  );
};

export default Reports;
