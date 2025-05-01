
import { formatPhoneNumber } from "./phone-formatter.ts";
import { providerConfig } from "./provider-config.ts";

// Build provider-specific payment request data
export function buildRequestData(
  provider: string, 
  paymentId: string, 
  formattedPhone: string, 
  amount: number, 
  title: string,
  callbackUrl: string
) {
  const businessCode = providerConfig[provider as keyof typeof providerConfig]?.businessCode;
  
  switch(provider) {
    case 'mpesa':
      return {
        BusinessShortCode: businessCode,
        Amount: amount,
        PartyA: formattedPhone,
        PhoneNumber: formattedPhone,
        TransactionDesc: title,
        CallBackURL: callbackUrl,
        AccountReference: paymentId
      };
    
    case 'tigopesa':
      return {
        customerMsisdn: formattedPhone,
        amount: amount,
        currencyCode: "TZS",
        language: "eng",
        reference: paymentId,
        description: title,
        callbackUrl: callbackUrl
      };
    
    case 'airtelmoney':
      return {
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
    
    case 'halopesa':
      return {
        amount: amount,
        customerMsisdn: formattedPhone,
        reference: paymentId,
        externalId: paymentId,
        currencyCode: "TZS",
        remarks: title,
        callbackUrl: callbackUrl
      };
    
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}
