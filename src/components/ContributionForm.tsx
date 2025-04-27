
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileMoneySelector } from './MobileMoneySelector';
import { addContribution } from '@/lib/data';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Smartphone } from 'lucide-react';

export const ContributionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [showPaymentMethods, setShowPaymentMethods] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setShowPaymentMethods(true);
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      // Add to contributions list
      addContribution({
        title,
        description,
        amount: parseFloat(amount),
        paymentMethod: selectedProvider,
        paymentStatus: 'completed',
        contributors: [],
      });
      
      setIsProcessing(false);
      
      // Show success message
      toast({
        title: "Success!",
        description: "Your contribution has been processed",
      });
      
      // Navigate back to home
      navigate('/');
    } catch (error) {
      setIsProcessing(false);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Create Contribution</h2>
        
        {!showPaymentMethods ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Community Water Project"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of this contribution"
                className="resize-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (TZS)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10000"
                required
                min="1"
              />
            </div>
            
            <Button type="submit" className="w-full">
              Continue to Payment
            </Button>
          </form>
        ) : (
          <MobileMoneySelector
            selectedProvider={selectedProvider}
            onSelect={setSelectedProvider}
            amount={parseFloat(amount)}
            onProcessPayment={handleProcessPayment}
            isProcessing={isProcessing}
          />
        )}
      </div>
      
      {showPaymentMethods && (
        <Button
          variant="outline"
          onClick={() => setShowPaymentMethods(false)}
          className="w-full"
        >
          Back to Form
        </Button>
      )}
    </div>
  );
};
