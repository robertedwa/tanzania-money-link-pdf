
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addContribution } from '@/lib/data';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';

export const ContributionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate input
    if (!title) {
      setError('Please enter a title for your contribution');
      return;
    }
    
    const numericAmount = parseFloat(amount);
    if (!amount || isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    
    // Validate minimum amount (5,000 TZS)
    if (numericAmount < 5000) {
      setError('Amount must be at least 5,000 TZS');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Call the edge function to create payment
      const { data, error: paymentError } = await supabase.functions.invoke('create-payment', {
        body: { 
          amount: numericAmount,
          title,
          description
        },
      });

      if (paymentError) {
        console.error('Payment function error:', paymentError);
        throw new Error(paymentError.message || 'Failed to process payment');
      }
      
      if (!data?.url) {
        throw new Error('No payment URL received from server');
      }

      // Add to contributions list
      addContribution({
        title,
        description,
        amount: numericAmount,
        paymentMethod: 'stripe',
        paymentStatus: 'pending',
        contributors: [],
      });

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Payment error:', error);
      setError(error.message || 'Failed to process payment. Please try again.');
      setIsProcessing(false);
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Create Contribution</h2>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Community Water Project"
              required
              disabled={isProcessing}
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
              disabled={isProcessing}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (TZS)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="5000"
              required
              min="5000"
              disabled={isProcessing}
            />
            <p className="text-xs text-gray-500">Minimum amount: 5,000 TZS</p>
          </div>
          
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Proceed to Payment"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
