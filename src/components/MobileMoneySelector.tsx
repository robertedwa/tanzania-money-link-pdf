
import React from 'react';
import { mobileMoneyProviders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

interface MobileMoneyProps {
  onSelect: (provider: string) => void;
  selectedProvider: string;
  amount: number;
  onProcessPayment: () => void;
  isProcessing: boolean;
}

export const MobileMoneySelector = ({ 
  onSelect, 
  selectedProvider,
  amount,
  onProcessPayment,
  isProcessing
}: MobileMoneyProps) => {
  
  const handleProcessPayment = () => {
    if (!selectedProvider) {
      toast({
        title: "Error",
        description: "Please select a payment provider",
        variant: "destructive",
      });
      return;
    }
    
    onProcessPayment();
  };
  
  return (
    <div className="space-y-4 bg-white p-5 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium">Select Payment Method</h3>
      
      <div className="space-y-4">
        <Select 
          value={selectedProvider} 
          onValueChange={onSelect}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select payment provider" />
          </SelectTrigger>
          <SelectContent>
            {mobileMoneyProviders.map(provider => (
              <SelectItem key={provider.id} value={provider.id}>
                <div className="flex items-center">
                  <span className="mr-2">{provider.logo}</span>
                  <span>{provider.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        {selectedProvider && (
          <div className="p-4 bg-slate-50 rounded-md">
            <div className="text-sm text-gray-500 mb-2">Transaction Summary</div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <span className="font-medium">{amount.toLocaleString()} TZS</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Provider:</span>
              <span className="font-medium">
                {mobileMoneyProviders.find(p => p.id === selectedProvider)?.name}
              </span>
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleProcessPayment}
          disabled={!selectedProvider || isProcessing}
          className="w-full"
        >
          {isProcessing ? "Processing..." : `Pay ${amount.toLocaleString()} TZS`}
        </Button>
      </div>
    </div>
  );
};
