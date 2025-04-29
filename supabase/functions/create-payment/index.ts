
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@14.21.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const STRIPE_SECRET_KEY = 'sk_test_51RIcEXD1dRP1CmW4rN4vTE9eLZWmQBBIwZ97PhO4xFm3NUY94Iug7VAeMtVaQJihJjmVCPBDazyDu4QT5KJawtZq00pWPGxqVn';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, title, description = '' } = await req.json()
    
    // Enhanced validation for amount
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount provided')
    }
    
    // Ensure minimum amount - lower to 5,000 TZS which is around $2 USD
    if (amount < 5000) {
      throw new Error('Amount must be at least 5,000 TZS')
    }
    
    if (!title) {
      throw new Error('Title is required')
    }

    // Initialize Stripe with the hardcoded key
    const stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    })

    // Origin for success/cancel URLs
    const origin = req.headers.get('origin') || 'http://localhost:5173'

    // Create a payment session
    // Convert TZS to USD for Stripe (approximate conversion of 2500 TZS = $1 USD)
    // This is a rough conversion - in production you'd use a currency API
    const usdAmount = Math.ceil(amount / 2500 * 100); // Convert to USD cents, rounding up

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            // Use USD instead of TZS to avoid currency conversion issues
            currency: 'usd',
            product_data: {
              name: title,
              description: description,
            },
            unit_amount: usdAmount, // Use USD amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/contribution-success?amount=${amount}&title=${encodeURIComponent(title)}`,
      cancel_url: `${origin}/contribute`,
    })

    if (!session.url) {
      throw new Error('Failed to create payment session')
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Payment error:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred while processing your payment'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
