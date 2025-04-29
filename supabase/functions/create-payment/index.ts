
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
    const { amount, title, description = '', provider = '', phoneNumber = '' } = await req.json()
    
    // Enhanced validation
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

    if (!phoneNumber || !/^\d{9,12}$/.test(phoneNumber)) {
      throw new Error('Valid phone number is required')
    }

    // Origin for success/cancel URLs
    const origin = req.headers.get('origin') || 'http://localhost:5173'

    // Generate transaction ID
    const paymentId = crypto.randomUUID();
    
    // In a real implementation, this would integrate with mobile money APIs
    // For each provider (TigoPesa, M-Pesa, Airtel Money, etc.)
    
    // Example of how actual integration might work (pseudocode)
    let apiEndpoint;
    let apiKey;
    let requestData;
    
    switch(provider) {
      case 'mpesa':
        // M-Pesa specific configuration
        apiEndpoint = "https://api.mpesa.com/payments";
        apiKey = "MPESA_API_KEY"; // Would be stored in edge function secrets
        requestData = {
          amount: amount,
          phone: phoneNumber,
          reference: paymentId
        };
        break;
      case 'tigo':
        // Tigo Pesa specific configuration
        apiEndpoint = "https://api.tigo.com/payments";
        apiKey = "TIGO_API_KEY";
        requestData = {
          amount: amount,
          msisdn: phoneNumber,
          transactionId: paymentId
        };
        break;
      case 'airtel':
        // Airtel Money specific configuration
        apiEndpoint = "https://api.airtel.com/payments";
        apiKey = "AIRTEL_API_KEY";
        requestData = {
          amount: amount,
          phoneNumber: phoneNumber,
          transactionId: paymentId
        };
        break;
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
    
    // For now, we'll simulate a successful API response
    // In production, you would make an actual API call like this:
    // const response = await fetch(apiEndpoint, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${apiKey}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(requestData)
    // });
    // const result = await response.json();
    
    // Since we can't make real API calls without credentials, we'll simulate for now
    const paymentResponse = {
      success: true,
      paymentId: paymentId,
      redirectUrl: `${origin}/contribution-success?amount=${amount}&title=${encodeURIComponent(title)}&provider=${provider}`,
      message: `Payment request of ${amount.toLocaleString()} TZS has been sent to ${phoneNumber} via ${provider}. Please check your phone to confirm the transaction.`
    };

    console.log(`Payment initiated: ${amount} TZS via ${provider} to ${phoneNumber}`);

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
