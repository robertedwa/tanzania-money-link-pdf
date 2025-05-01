
import { providerConfig } from "./provider-config.ts";

// Helper function to get access tokens for providers that need it
export async function getAccessToken(provider: string): Promise<string> {
  try {
    if (provider === 'airtelmoney') {
      const tokenUrl = Deno.env.get("AIRTEL_TOKEN_URL") || "https://openapiuat.airtel.africa/auth/oauth2/token";
      const clientId = Deno.env.get("AIRTEL_CLIENT_ID") || "your-client-id";
      const clientSecret = Deno.env.get("AIRTEL_CLIENT_SECRET") || "your-client-secret";
      
      const tokenResponse = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'client_credentials'
        })
      });
      
      const tokenData = await tokenResponse.json();
      return tokenData.access_token;
    }
    
    // For other providers that might need token generation
    return providerConfig[provider as keyof typeof providerConfig]?.apiKey;
  } catch (error) {
    console.error(`Error getting access token for ${provider}:`, error);
    throw new Error(`Failed to authenticate with ${provider} payment gateway`);
  }
}
