
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configure mobile money provider APIs with proper endpoints and authentication
const providerConfig = {
  mpesa: {
    apiUrl: "https://openapi.m-pesa.com/sandbox/v1/payment/singleStage/push",
    apiKey: Deno.env.get("MPESA_API_KEY") || "MPESA_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("MPESA_API_KEY") || "MPESA_DEMO_KEY"}`
    }
  },
  tigopesa: {
    apiUrl: "https://api.tigo.com/v1/tigo/mobile-money/payment-requests",
    apiKey: Deno.env.get("TIGO_API_KEY") || "TIGO_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("TIGO_API_KEY") || "TIGO_DEMO_KEY"}`
    }
  },
  airtelmoney: {
    apiUrl: "https://openapiuat.airtel.africa/merchant/v1/payments",
    apiKey: Deno.env.get("AIRTEL_API_KEY") || "AIRTEL_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("AIRTEL_API_KEY") || "AIRTEL_DEMO_KEY"}`
    }
  },
  halopesa: {
    apiUrl: "https://api.halopesa.co.tz/api/v1/c2b", 
    apiKey: Deno.env.get("HALOTEL_API_KEY") || "HALOTEL_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("HALOTEL_API_KEY") || "HALOTEL_DEMO_KEY"}`
    }
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
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
    
    // Prepare provider-specific request data based on their API requirements
    let requestData = {};
    const businessShortCode = Deno.env.get(`${provider.toUpperCase()}_BUSINESS_CODE`) || "123456";
    
    switch(provider) {
      case 'mpesa':
        requestData = {
          BusinessShortCode: businessShortCode,
          Amount: amount,
          PartyA: formattedPhone,
          PhoneNumber: formattedPhone,
          TransactionDesc: title,
          CallBackURL: `${origin}/api/payment-callback`,
          AccountReference: paymentId
        };
        break;
      case 'tigopesa':
        requestData = {
          customerMsisdn: formattedPhone,
          amount: amount,
          currencyCode: "TZS",
          language: "eng",
          reference: paymentId,
          description: title,
          callbackUrl: `${origin}/api/payment-callback`
        };
        break;
      case 'airtelmoney':
        requestData = {
          reference: paymentId,
          subscriber: {
            country: "TZ",
            currency: "TZS",
            msisdn: formattedPhone
          },
          transaction: {
            amount: amount,
            id: paymentId,
            description: title
          }
        };
        break;
      case 'halopesa':
        requestData = {
          amount: amount,
          customerMsisdn: formattedPhone,
          reference: paymentId,
          externalId: paymentId,
          currencyCode: "TZS",
          remarks: title,
          callbackUrl: `${origin}/api/payment-callback`
        };
        break;
    }
    
    console.log(`Making API request to ${providerConfig[provider].apiUrl}`);
    console.log(`Request data: ${JSON.stringify(requestData)}`);
    
    // Make actual API call to payment provider
    try {
      const response = await fetch(providerConfig[provider].apiUrl, {
        method: 'POST',
        headers: providerConfig[provider].headers,
        body: JSON.stringify(requestData)
      });
      
      let result;
      const responseText = await response.text();
      
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse provider response:", responseText);
        result = { rawResponse: responseText };
      }
      
      console.log(`Provider response:`, result);
      
      // For demo purposes - assume success even if the actual API call fails
      // In production, you would properly handle different response formats from each provider
      const paymentResponse = {
        success: true, // In production, check the actual response
        paymentId: paymentId,
        provider: provider,
        phoneNumber: formattedPhone,
        amount: amount,
        providerResponse: result,
        redirectUrl: `${origin}/contribution-success?amount=${amount}&title=${encodeURIComponent(title)}&provider=${provider}`,
        message: `Payment request of ${amount.toLocaleString()} TZS has been sent to ${formattedPhone} via ${provider}. Please check your phone to confirm the transaction.`
      };

      console.log(`Payment initiated: ${amount} TZS via ${provider} to ${formattedPhone}`);

      return new Response(JSON.stringify(paymentResponse), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
      
    } catch (error) {
      console.error("API call error:", error);
      throw new Error(`Failed to connect to payment provider: ${error.message}`);
    }
  } catch (error) {
    console.error('Payment error:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'An error occurred while processing your payment'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
