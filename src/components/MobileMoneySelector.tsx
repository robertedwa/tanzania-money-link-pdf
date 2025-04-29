
import React from 'react';
import { mobileMoneyProviders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface MobileMoneyProps {
  onSelect: (provider: string) => void;
  onPhoneChange: (phone: string) => void;
  selectedProvider: string;
  phoneNumber: string;
  amount: number;
  onProcessPayment: () => void;
  isProcessing: boolean;
}

export const MobileMoneySelector = ({ 
  onSelect, 
  onPhoneChange,
  selectedProvider,
  phoneNumber,
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
    
    if (!phoneNumber || phoneNumber.length < 9) {
      toast({
        title: "Error",
        description: "Please enter a valid phone number",
        variant: "destructive",
      });
      return;
    }
    
    onProcessPayment();
  };

  const formatPhoneNumber = (input: string) => {
    // Only allow digits
    const cleaned = input.replace(/\D/g, '');
    // Limit length
    return cleaned.substring(0, 12);
  };
  
  return (
    <div className="space-y-4 bg-white p-5 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium">Select Payment Method</h3>
      
      <div className="space-y-4">
        <RadioGroup 
          value={selectedProvider} 
          onValueChange={onSelect}
          className="flex flex-col space-y-3"
        >
          {mobileMoneyProviders.map(provider => (
            <div key={provider.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-slate-50">
              <RadioGroupItem value={provider.id} id={provider.id} />
              <Label htmlFor={provider.id} className="flex-1 flex items-center cursor-pointer">
                <span className="mr-2">{provider.logo}</span>
                <span>{provider.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {selectedProvider && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => onPhoneChange(formatPhoneNumber(e.target.value))}
                placeholder="e.g. 0712345678"
                disabled={isProcessing}
              />
              <p className="text-xs text-gray-500">Enter the mobile money number without country code</p>
            </div>
            
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
              {phoneNumber && (
                <div className="flex justify-between mt-1">
                  <span>Phone:</span>
                  <span className="font-medium">{phoneNumber}</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleProcessPayment}
          disabled={!selectedProvider || !phoneNumber || isProcessing}
          className="w-full"
        >
          {isProcessing ? "Processing..." : `Pay ${amount.toLocaleString()} TZS`}
        </Button>
      </div>
    </div>
  );
};
