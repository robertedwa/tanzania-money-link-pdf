
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// API configuration for mobile money providers
const providerConfig = {
  mpesa: {
    apiUrl: "https://api.m-pesa.com/v1/transactions/request",
    apiKey: Deno.env.get("MPESA_API_KEY") || "MPESA_DEMO_KEY", // Would use real API key in production
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("MPESA_API_KEY") || "MPESA_DEMO_KEY"}`
    }
  },
  tigo: {
    apiUrl: "https://api.tigo.co.tz/v1/payments/request",
    apiKey: Deno.env.get("TIGO_API_KEY") || "TIGO_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("TIGO_API_KEY") || "TIGO_DEMO_KEY"}`
    }
  },
  airtel: {
    apiUrl: "https://api.airtel.co.tz/v1/payments/request",
    apiKey: Deno.env.get("AIRTEL_API_KEY") || "AIRTEL_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("AIRTEL_API_KEY") || "AIRTEL_DEMO_KEY"}`
    }
  },
  halotel: {
    apiUrl: "https://api.halotel.co.tz/v1/payments/request",
    apiKey: Deno.env.get("HALOTEL_API_KEY") || "HALOTEL_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("HALOTEL_API_KEY") || "HALOTEL_DEMO_KEY"}`
    }
  }
};

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
    
    // Check if provider config exists
    if (!providerConfig[provider]) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    // Format phone number per provider requirements
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = '255' + phoneNumber.substring(1); // Convert 07xx to 255xxx
    } else if (!phoneNumber.startsWith('255')) {
      formattedPhone = '255' + phoneNumber; // Add country code if not present
    }
    
    console.log(`Processing payment: ${amount} TZS via ${provider} to ${formattedPhone}`);
    
    // Prepare provider-specific request data
    let requestData = {};
    switch(provider) {
      case 'mpesa':
        requestData = {
          amount: amount,
          phone: formattedPhone,
          reference: paymentId,
          description: title
        };
        break;
      case 'tigo':
        requestData = {
          amount: amount,
          msisdn: formattedPhone,
          transactionId: paymentId,
          description: title
        };
        break;
      case 'airtel':
        requestData = {
          amount: amount,
          phoneNumber: formattedPhone,
          transactionId: paymentId,
          description: title
        };
        break;
      case 'halotel':
        requestData = {
          amount: amount,
          phoneNumber: formattedPhone,
          reference: paymentId,
          narration: title
        };
        break;
    }
    
    // In a real implementation, we would make API calls to the actual mobile money providers
    // However, since we don't have actual API credentials, we'll simulate the API call
    
    console.log(`Making API request to ${providerConfig[provider].apiUrl}`);
    console.log(`Request data: ${JSON.stringify(requestData)}`);
    
    // This would be a real API call in production
    // const response = await fetch(providerConfig[provider].apiUrl, {
    //   method: 'POST',
    //   headers: providerConfig[provider].headers,
    //   body: JSON.stringify(requestData)
    // });
    // const result = await response.json();
    
    // Simulate successful API response for now
    // In production, we'd check the actual API response
    const paymentResponse = {
      success: true,
      paymentId: paymentId,
      provider: provider,
      phoneNumber: formattedPhone,
      amount: amount,
      redirectUrl: `${origin}/contribution-success?amount=${amount}&title=${encodeURIComponent(title)}&provider=${provider}`,
      message: `Payment request of ${amount.toLocaleString()} TZS has been sent to ${formattedPhone} via ${provider}. Please check your phone to confirm the transaction.`
    };

    console.log(`Payment initiated: ${amount} TZS via ${provider} to ${formattedPhone}`);

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
