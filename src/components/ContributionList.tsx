
import React from 'react';
import { Contribution } from '@/lib/data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface ContributionListProps {
  contributions: Contribution[];
}

export const ContributionList = ({ contributions }: ContributionListProps) => {
  if (contributions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No contributions yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {contributions.map((contribution) => (
        <Card key={contribution.id} className="overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{contribution.title}</CardTitle>
              <PaymentStatusBadge status={contribution.paymentStatus} />
            </div>
            <CardDescription className="text-xs">
              {format(new Date(contribution.date), 'MMM d, yyyy • HH:mm')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm mb-2 line-clamp-2">
              {contribution.description || "No description provided."}
            </div>
            <div className="flex justify-between items-center mt-2 text-sm">
              <div>
                <span className="font-medium">
                  {contribution.amount.toLocaleString()} TZS
                </span>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <span>{getProviderName(contribution.paymentMethod)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const PaymentStatusBadge = ({ status }: { status: Contribution['paymentStatus'] }) => {
  switch (status) {
    case 'completed':
      return <Badge variant="default" className="bg-green-500">Completed</Badge>;
    case 'pending':
      return <Badge variant="secondary" className="bg-yellow-500">Pending</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return null;
  }
};

const getProviderName = (providerId: string) => {
  const providers: Record<string, string> = {
    'mpesa': 'M-Pesa',
    'tigopesa': 'Tigo Pesa',
    'airtelmoney': 'Airtel Money',
    'halopesa': 'Halopesa',
  };
  
  return providers[providerId] || providerId;
};
