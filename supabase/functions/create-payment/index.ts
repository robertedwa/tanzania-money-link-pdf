
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "./cors.ts"
import { handlePaymentRequest } from "./payment-handler.ts"

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    return await handlePaymentRequest(req);
  } catch (error) {
    console.error('Payment error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message || 'An error occurred while processing your payment'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
})
