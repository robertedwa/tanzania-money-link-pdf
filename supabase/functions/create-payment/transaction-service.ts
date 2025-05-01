
import { providerConfig } from "./provider-config.ts";

// Transaction status check function
export async function checkTransactionStatus(provider: string, transactionId: string) {
  try {
    const config = providerConfig[provider as keyof typeof providerConfig];
    
    if (!config) {
      throw new Error(`Unsupported provider: ${provider}`);
    }
    
    let statusUrl;
    
    switch(provider) {
      case 'mpesa':
        statusUrl = `${config.apiUrl.replace('/push', '/status')}/${transactionId}`;
        break;
      case 'tigopesa':
        statusUrl = `${config.apiUrl.replace('payment-requests', 'transactions')}/${transactionId}`;
        break;
      case 'airtelmoney':
        statusUrl = `${config.apiUrl}/status/${transactionId}`;
        break;
      case 'halopesa':
        statusUrl = `${config.apiUrl.replace('c2b', 'query')}/${transactionId}`;
        break;
      default:
        throw new Error(`Unsupported provider for status check: ${provider}`);
    }
    
    const response = await fetch(statusUrl, {
      method: 'GET',
      headers: config.headers
    });
    
    return await response.json();
  } catch (error) {
    console.error(`Error checking transaction status for ${provider}:`, error);
    return { status: 'UNKNOWN', error: error.message };
  }
}
