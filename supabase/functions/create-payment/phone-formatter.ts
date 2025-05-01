
// Format phone number according to provider requirements
export function formatPhoneNumber(phoneNumber: string): string {
  let formattedPhone = phoneNumber;
  
  if (phoneNumber.startsWith('0')) {
    formattedPhone = '255' + phoneNumber.substring(1); // Convert 07xx to 255xxx
  } else if (!phoneNumber.startsWith('255')) {
    formattedPhone = '255' + phoneNumber; // Add country code if not present
  }
  
  return formattedPhone;
}
