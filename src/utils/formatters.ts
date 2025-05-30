/**
 * Formats a number as a currency string with MAD
 */
export const formatCurrency = (amount: number, currency: string = 'MAD'): string => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formats a date string to a human-readable format
 */
export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

/**
 * Formats a date string to include time
 */
export const formatDateTime = (dateString: string): string => {
  return new Intl.DateTimeFormat('fr-MA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateString));
};

/**
 * Formats a Moroccan bank account number with proper spacing
 */
export const formatAccountNumber = (accountNumber: string): string => {
  if (!accountNumber) return '';
  return accountNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
};

/**
 * Formats a Moroccan RIB (Relevé d'Identité Bancaire)
 */
export const formatRIB = (bankDetails: {
  bankCode: string;
  branchCode: string;
  accountNumber: string;
  ribKey: string;
}): string => {
  return `${bankDetails.bankCode} ${bankDetails.branchCode} ${formatAccountNumber(
    bankDetails.accountNumber
  )} ${bankDetails.ribKey}`;
};

/**
 * Truncates text with ellipsis if it exceeds maxLength
 */
export const truncateText = (text: string | undefined, maxLength: number): string => {
  if (!text || typeof text !== 'string') return '';
  return text.length <= maxLength ? text : `${text.slice(0, maxLength)}...`;
};