
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
import { supabase } from '@/integrations/supabase/client';

export const ContributionForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { 
          amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          title 
        },
      });

      if (error) throw error;

      if (data?.url) {
        // Add to contributions list first
        addContribution({
          title,
          description,
          amount: parseFloat(amount),
          paymentMethod: 'stripe',
          paymentStatus: 'pending',
          contributors: [],
        });

        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Error",
        description: "Failed to process payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h2 className="text-xl font-bold mb-4">Create Contribution</h2>
        
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
          
          <Button type="submit" className="w-full" disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Proceed to Payment"}
          </Button>
        </form>
      </div>
    </div>
  );
};
