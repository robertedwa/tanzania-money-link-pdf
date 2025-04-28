
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
    
    // Ensure minimum amount (50,000 TZS is approximately $20 USD)
    if (amount < 50000) {
      throw new Error('Amount must be at least 50,000 TZS to meet Stripe minimum requirements')
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
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'tzs',
            product_data: {
              name: title,
              description: description,
            },
            unit_amount: Math.round(amount), // Ensure amount is rounded
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
