
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, title, description = '', provider = '' } = await req.json()
    
    // Enhanced validation for amount
    if (!amount || isNaN(amount) || amount <= 0) {
      throw new Error('Invalid amount provided')
    }
    
    // Ensure minimum amount - 5,000 TZS 
    if (amount < 5000) {
      throw new Error('Amount must be at least 5,000 TZS')
    }
    
    if (!title) {
      throw new Error('Title is required')
    }

    if (!provider) {
      throw new Error('Mobile money provider is required')
    }

    // Origin for success/cancel URLs
    const origin = req.headers.get('origin') || 'http://localhost:5173'

    // Simulate mobile money transaction
    // In a real implementation, this would integrate with mobile money APIs
    const paymentId = crypto.randomUUID();
    
    // Create a simulated payment response
    const paymentResponse = {
      success: true,
      paymentId: paymentId,
      redirectUrl: `${origin}/contribution-success?amount=${amount}&title=${encodeURIComponent(title)}&provider=${provider}`,
      message: `Payment request of ${amount} TZS sent to your ${provider} mobile number. Please check your phone to confirm.`
    };

    return new Response(JSON.stringify(paymentResponse), {
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
