
import React, { useEffect, useState } from 'react';
import { Layout } from '@/components/Layout';
import { ContributionList } from '@/components/ContributionList';
import { getAllContributions, Contribution } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load contributions
    const loadContributions = () => {
      const data = getAllContributions();
      setContributions(data);
      setLoading(false);
    };
    
    loadContributions();
    
    // Set up event listener for storage changes
    const handleStorageChange = () => {
      loadContributions();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const totalAmount = contributions
    .filter(c => c.paymentStatus === 'completed')
    .reduce((sum, c) => sum + c.amount, 0);
  
  const completedCount = contributions
    .filter(c => c.paymentStatus === 'completed')
    .length;

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Community Contributions</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Total Raised</p>
              <p className="text-2xl font-bold text-primary">
                {totalAmount.toLocaleString()} <span className="text-sm">TZS</span>
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-sm text-gray-500">Contributions</p>
              <p className="text-2xl font-bold text-primary">{completedCount}</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Activity</h2>
          <div className="flex space-x-2">
            <Button asChild size="sm" variant="outline">
              <Link to="/reports">
                <FileText className="h-4 w-4 mr-1" />
                Reports
              </Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/contribute">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Link>
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : (
          <ContributionList contributions={contributions} />
        )}
        
        {!loading && contributions.length === 0 && (
          <div className="text-center py-12 space-y-4 bg-white rounded-lg">
            <p className="text-gray-500">No contributions yet</p>
            <Button asChild>
              <Link to="/contribute">
                <Plus className="h-4 w-4 mr-1" />
                Create Contribution
              </Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
