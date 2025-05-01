
// Mobile money provider configuration settings
export const providerConfig = {
  mpesa: {
    apiUrl: Deno.env.get("MPESA_API_URL") || "https://openapi.m-pesa.com/sandbox/v1/payment/singleStage/push",
    apiKey: Deno.env.get("MPESA_API_KEY") || "MPESA_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("MPESA_API_KEY") || "MPESA_DEMO_KEY"}`
    },
    businessCode: Deno.env.get("MPESA_BUSINESS_CODE") || "123456"
  },
  tigopesa: {
    apiUrl: Deno.env.get("TIGO_API_URL") || "https://api.tigo.com/v1/tigo/mobile-money/payment-requests",
    apiKey: Deno.env.get("TIGO_API_KEY") || "TIGO_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("TIGO_API_KEY") || "TIGO_DEMO_KEY"}`
    },
    businessCode: Deno.env.get("TIGO_BUSINESS_CODE") || "123456"
  },
  airtelmoney: {
    apiUrl: Deno.env.get("AIRTEL_API_URL") || "https://openapiuat.airtel.africa/merchant/v1/payments",
    apiKey: Deno.env.get("AIRTEL_API_KEY") || "AIRTEL_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("AIRTEL_API_KEY") || "AIRTEL_DEMO_KEY"}`
    },
    businessCode: Deno.env.get("AIRTEL_BUSINESS_CODE") || "123456"
  },
  halopesa: {
    apiUrl: Deno.env.get("HALOTEL_API_URL") || "https://api.halopesa.co.tz/api/v1/c2b",
    apiKey: Deno.env.get("HALOTEL_API_KEY") || "HALOTEL_DEMO_KEY",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${Deno.env.get("HALOTEL_API_KEY") || "HALOTEL_DEMO_KEY"}`
    },
    businessCode: Deno.env.get("HALOTEL_BUSINESS_CODE") || "123456"
  }
};
