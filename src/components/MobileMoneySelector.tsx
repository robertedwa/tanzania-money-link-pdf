
import React, { useState, useEffect } from 'react';
import { mobileMoneyProviders } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { SmartphoneIcon, PhoneIcon, NetworkIcon, CheckIcon, AlertCircle, InfoIcon } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  
  const [phoneError, setPhoneError] = useState<string>("");
  const [providerInfo, setProviderInfo] = useState<string>("");
  
  // Set provider specific info when provider changes
  useEffect(() => {
    if (selectedProvider === 'mpesa') {
      setProviderInfo("M-Pesa transactions require a PIN confirmation on your device. Keep your phone nearby.");
    } else if (selectedProvider === 'tigopesa') {
      setProviderInfo("Tigo Pesa will send a USSD prompt to your phone. Reply with your PIN to complete payment.");
    } else if (selectedProvider === 'airtelmoney') {
      setProviderInfo("Airtel Money will prompt you to confirm this transaction on your phone.");
    } else if (selectedProvider === 'halopesa') {
      setProviderInfo("You will receive a Halopesa payment request on your phone to authorize.");
    } else {
      setProviderInfo("");
    }
  }, [selectedProvider]);

  const handleProcessPayment = () => {
    // Validate inputs before processing payment
    if (!selectedProvider) {
      toast({
        title: "Error",
        description: "Please select a payment provider",
        variant: "destructive",
      });
      return;
    }
    
    if (!validatePhoneNumber(phoneNumber)) {
      setPhoneError("Please enter a valid Tanzanian mobile number");
      return;
    }
    
    // Verify phone number matches selected provider
    if (!isPhoneCompatibleWithProvider(phoneNumber, selectedProvider)) {
      setPhoneError(`This number doesn't appear to be a valid ${getProviderName(selectedProvider)} number`);
      return;
    }
    
    setPhoneError("");
    onProcessPayment();
  };

  const validatePhoneNumber = (phone: string): boolean => {
    // Tanzanian phone patterns: 07xxxxxxxx, 255xxxxxxxx, +255xxxxxxxx
    if (!phone) return false;
    
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Check if starts with 0 followed by 9 digits
    const tanzanianPattern1 = /^0[67][0-9]{8}$/;
    
    // Check if starts with 255 followed by 9 digits
    const tanzanianPattern2 = /^255[67][0-9]{8}$/;
    
    return tanzanianPattern1.test(cleanPhone) || tanzanianPattern2.test(cleanPhone);
  };

  const isPhoneCompatibleWithProvider = (phone: string, provider: string): boolean => {
    // Real-world validation would check precise number prefixes
    // This is a simplified version
    const cleanPhone = phone.replace(/\D/g, '');
    
    // Get last 2 digits of phone prefix after country code
    let prefix = "";
    if (cleanPhone.startsWith("0")) {
      prefix = cleanPhone.substring(1, 3);
    } else if (cleanPhone.startsWith("255")) {
      prefix = cleanPhone.substring(3, 5);
    }
    
    // Check provider compatibility based on prefix
    // These are simplified - real implementation would use actual Tanzanian number ranges
    switch(provider) {
      case 'mpesa':
        // Vodacom prefixes
        return ['74', '75', '76'].includes(prefix);
      case 'tigopesa':
        // Tigo prefixes
        return ['65', '67', '71'].includes(prefix);
      case 'airtelmoney':
        // Airtel prefixes
        return ['78', '79', '68', '69'].includes(prefix);
      case 'halopesa':
        // Halotel prefixes
        return ['62', '63', '64'].includes(prefix);
      default:
        return true; // If provider unknown, don't validate
    }
  };

  const formatPhoneNumber = (input: string) => {
    // Only allow digits
    const cleaned = input.replace(/\D/g, '');
    // Limit length
    return cleaned.substring(0, 12);
  };

  const getProviderName = (id: string): string => {
    const provider = mobileMoneyProviders.find(p => p.id === id);
    return provider ? provider.name : id;
  };
  
  return (
    <div className="space-y-4 bg-white p-5 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium flex items-center">
        <NetworkIcon className="h-5 w-5 mr-2" />
        Select Payment Method
      </h3>
      
      <div className="space-y-4">
        <RadioGroup 
          value={selectedProvider} 
          onValueChange={(value) => {
            onSelect(value);
            setPhoneError("");
          }}
          className="flex flex-col space-y-3"
        >
          {mobileMoneyProviders.map(provider => (
            <div key={provider.id} className="flex items-center space-x-2 p-3 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all duration-200">
              <RadioGroupItem value={provider.id} id={provider.id} />
              <Label htmlFor={provider.id} className="flex-1 flex items-center cursor-pointer">
                <span className="mr-2 text-xl">{provider.logo}</span>
                <span>{provider.name}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
        
        {selectedProvider && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber" className="flex items-center gap-2">
                <PhoneIcon className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  onPhoneChange(formatted);
                  setPhoneError("");
                }}
                placeholder="e.g. 0712345678"
                disabled={isProcessing}
                className={phoneError ? "border-red-500" : ""}
              />
              {phoneError ? (
                <Alert variant="destructive" className="py-2">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{phoneError}</AlertDescription>
                </Alert>
              ) : (
                <p className="text-xs text-gray-500">Enter your mobile money phone number (e.g. 0712345678)</p>
              )}
            </div>
            
            {providerInfo && (
              <Alert className="bg-blue-50 border-blue-200">
                <InfoIcon className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-xs text-blue-700">
                  {providerInfo}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="p-4 bg-slate-50 rounded-md border border-slate-200">
              <div className="text-sm font-medium text-gray-700 mb-2">Transaction Summary</div>
              <div className="flex justify-between">
                <span>Amount:</span>
                <span className="font-medium">{amount.toLocaleString()} TZS</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Provider:</span>
                <span className="font-medium">
                  {getProviderName(selectedProvider)}
                </span>
              </div>
              {phoneNumber && (
                <div className="flex justify-between mt-1">
                  <span>Phone:</span>
                  <span className="font-medium">{phoneNumber}</span>
                </div>
              )}
              <div className="mt-2 pt-2 border-t border-slate-300">
                <div className="text-xs text-gray-500">
                  Transaction fees may apply according to your provider's rates
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-600 p-3 border border-gray-200 rounded-md bg-gray-50">
              <p className="font-medium mb-1">Live Transaction Process:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>A payment request will be sent to your mobile phone</li>
                <li>You will receive a USSD prompt to confirm the transaction</li>
                <li>Enter your mobile money PIN to complete the payment</li>
                <li>Wait for the confirmation before closing this page</li>
                <li>Transaction status updates will appear on this page</li>
              </ul>
            </div>
          </div>
        )}
        
        <Button 
          onClick={handleProcessPayment}
          disabled={!selectedProvider || !phoneNumber || isProcessing || amount < 5000}
          className="w-full"
        >
          {isProcessing ? (
            <div className="flex items-center">
              <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
              Processing Transaction...
            </div>
          ) : (
            <>
              <SmartphoneIcon className="mr-2 h-4 w-4" />
              Pay {amount.toLocaleString()} TZS
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
