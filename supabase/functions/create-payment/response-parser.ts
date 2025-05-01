
// Parse provider response based on the provider format
export function parseProviderResponse(provider: string, result: any, paymentId: string) {
  let isSuccessful = false;
  let transactionCode = '';
  let statusMessage = '';
  
  switch(provider) {
    case 'mpesa':
      isSuccessful = result.ResponseCode === "0" || result.output_ResponseCode === "0";
      transactionCode = result.CheckoutRequestID || result.output_CheckoutRequestID || paymentId;
      statusMessage = result.ResponseDescription || result.output_ResponseDesc || 
        "Your M-Pesa payment request has been initiated. Please check your phone to complete the payment.";
      break;
    
    case 'tigopesa':
      isSuccessful = result.responseCode === "0" || result.status === "SUCCESS";
      transactionCode = result.transactionId || result.reference || paymentId;
      statusMessage = result.responseDescription || result.message || 
        "Your Tigo Pesa payment request has been initiated. Please check your phone to complete the payment.";
      break;
    
    case 'airtelmoney':
      isSuccessful = result.status === "SUCCESS" || result.status === "PENDING" || 
                     result.message?.toLowerCase().includes("success");
      transactionCode = result.transactionId || result.reference || paymentId;
      statusMessage = result.message || result.status || 
        "Your Airtel Money payment request has been initiated. Please check your phone to complete the payment.";
      break;
    
    case 'halopesa':
      isSuccessful = result.statusCode === "0" || result.status === "SUCCESS";
      transactionCode = result.transactionId || result.reference || paymentId;
      statusMessage = result.message || result.description || 
        "Your Halopesa payment request has been initiated. Please check your phone to complete the payment.";
      break;
    
    default:
      isSuccessful = result.success || result.status === "SUCCESS" || result.statusCode === "0";
      transactionCode = result.transactionId || paymentId;
      statusMessage = result.message || "Your payment request has been initiated. Please check your phone.";
  }
  
  return { isSuccessful, transactionCode, statusMessage };
}
