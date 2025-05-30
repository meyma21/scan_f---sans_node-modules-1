import { CheckData, CheckImage } from '../types';
import { createWorker } from 'tesseract.js';

interface ProcessedCheckData {
  checkNumber: string;
  amount: number;
  amountInWords: string;
  payee: {
    name: string;
    identifier?: string;
  };
  issuer: {
    name: string;
    address?: string;
    phone?: string;
  };
  bankDetails: {
    bankCode: string;
    branchCode: string;
    accountNumber: string;
    routingNumber: string;
    ribKey: string;
    bankName: string;
    branchAddress?: string;
  };
  date: string;
  memo?: string;
  securityFeatures: {
    hasWatermark: boolean;
    hasMicrotext: boolean;
    hasUVFeatures: boolean;
  };
}

// Validation functions
const validateCheckNumber = (number: string): boolean => {
  // Check number should be numeric and have a specific length
  return /^\d{6,10}$/.test(number);
};

const validateAmount = (amount: number): boolean => {
  // Amount should be positive and have max 2 decimal places
  return amount > 0 && Number.isInteger(amount * 100);
};

const validateBankCode = (code: string): boolean => {
  // Bank code should be 3 digits
  return /^\d{3}$/.test(code);
};

const validateBranchCode = (code: string): boolean => {
  // Branch code should be 3 digits
  return /^\d{3}$/.test(code);
};

const validateAccountNumber = (number: string): boolean => {
  // Account number should be 16 digits
  return /^\d{16}$/.test(number);
};

const validateRIBKey = (key: string): boolean => {
  // RIB key should be 2 digits
  return /^\d{2}$/.test(key);
};

// Helper function to extract text from image using Tesseract.js
const extractTextFromImage = async (imageUrl: string): Promise<string> => {
  try {
    console.log('Starting OCR process for image:', imageUrl);
    const worker = await createWorker('fra'); // Use French language for better recognition
    console.log('Tesseract worker created');
    
    const { data: { text } } = await worker.recognize(imageUrl);
    console.log('Extracted text from image:', text);
    
    await worker.terminate();
    return text;
  } catch (error) {
    console.error('Error extracting text from image:', error);
    throw new Error('Failed to extract text from image');
  }
};

// Helper function to detect security features
const detectSecurityFeatures = async (imageUrl: string): Promise<{
  hasWatermark: boolean;
  hasMicrotext: boolean;
  hasUVFeatures: boolean;
}> => {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    const img = new Image();
    img.src = imageUrl;
    
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });

    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Simple security feature detection (this is a placeholder - you'll need to implement proper detection)
    const hasWatermark = detectWatermark(data, canvas.width, canvas.height);
    const hasMicrotext = detectMicrotext(data, canvas.width, canvas.height);
    const hasUVFeatures = detectUVFeatures(data, canvas.width, canvas.height);

    return {
      hasWatermark,
      hasMicrotext,
      hasUVFeatures
    };
  } catch (error) {
    console.error('Error detecting security features:', error);
    return {
      hasWatermark: false,
      hasMicrotext: false,
      hasUVFeatures: false
    };
  }
};

// Placeholder functions for security feature detection
const detectWatermark = (data: Uint8ClampedArray, width: number, height: number): boolean => {
  // Implement watermark detection logic
  return false;
};

const detectMicrotext = (data: Uint8ClampedArray, width: number, height: number): boolean => {
  // Implement microtext detection logic
  return false;
};

const detectUVFeatures = (data: Uint8ClampedArray, width: number, height: number): boolean => {
  // Implement UV features detection logic
  return false;
};

// Main function to process check image
export const processCheckImage = async (image: CheckImage): Promise<ProcessedCheckData> => {
  try {
    console.log('Processing check image:', image);
    
    // Extract text from the image
    const extractedText = await extractTextFromImage(image.url);
    console.log('Raw extracted text:', extractedText);

    // Parse the extracted text to identify different fields
    const lines = extractedText.split('\n').map(line => line.trim()).filter(Boolean);
    console.log('Parsed lines:', lines);

    // First try to get data from the raw scanner data if available
    let checkNumber = '';
    let amount = 0;
    let amountInWords = '';
    let payeeName = '';
    let bankDetails = {
      bankCode: '',
      branchCode: '',
      accountNumber: '',
      ribKey: ''
    };

    // Try to extract from raw data first
    if (image.rawData) {
      try {
        const rawData = JSON.parse(image.rawData);
        console.log('Parsed raw data:', rawData);

        // Extract check number
        if (rawData.chequeNumber) {
          checkNumber = rawData.chequeNumber;
        }

        // Extract amount
        if (rawData.amount) {
          const amountMatch = rawData.amount.match(/(\d+[.,]\d{2})/);
          if (amountMatch) {
            amount = parseFloat(amountMatch[1].replace(',', '.'));
          }
        }

        // Extract CMC7 data if available
        if (rawData.cmc7) {
          const cmc7Match = rawData.cmc7.match(/CMC7-(\d+)/);
          if (cmc7Match) {
            // CMC7 format: BBBBBGGGGGCCCCCCCCCCKK
            const cmc7 = cmc7Match[1];
            if (cmc7.length >= 23) {
              bankDetails.bankCode = cmc7.substring(0, 5);
              bankDetails.branchCode = cmc7.substring(5, 10);
              bankDetails.accountNumber = cmc7.substring(10, 21);
              bankDetails.ribKey = cmc7.substring(21, 23);
            }
          }
        }
      } catch (error) {
        console.warn('Error parsing raw data:', error);
      }
    }

    // If we don't have data from raw data, try OCR
    if (!checkNumber || !amount) {
      // Extract check number (trying multiple patterns)
      if (!checkNumber) {
        const checkNumberPatterns = [
          /N°\s*(\d{6,10})/,
          /(\d{6,10})/,
          /Cheque\s*(\d{6,10})/,
          /Chèque\s*(\d{6,10})/
        ];

        for (const pattern of checkNumberPatterns) {
          const match = extractedText.match(pattern);
          if (match) {
            checkNumber = match[1];
            break;
          }
        }
      }

      // Extract amount (trying multiple patterns)
      if (!amount) {
        const amountPatterns = [
          /EUR\s*(\d+[.,]\d{2})/,
          /(\d+[.,]\d{2})\s*EUR/,
          /(\d+[.,]\d{2})/
        ];

        for (const pattern of amountPatterns) {
          const match = extractedText.match(pattern);
          if (match) {
            amount = parseFloat(match[1].replace(',', '.'));
            break;
          }
        }
      }

      // Extract amount in words
      const amountWordsMatch = extractedText.match(/([A-Za-zÀ-ÿ\s]+)\s*EUR/);
      amountInWords = amountWordsMatch ? amountWordsMatch[1].trim() : '';

      // Extract payee name
      const payeePatterns = [
        /Payez\s*à\s*([A-Za-zÀ-ÿ\s]+)/,
        /Bénéficiaire\s*:\s*([A-Za-zÀ-ÿ\s]+)/,
        /([A-Za-zÀ-ÿ\s]+)\s*EUR/
      ];

      for (const pattern of payeePatterns) {
        const match = extractedText.match(pattern);
        if (match) {
          payeeName = match[1].trim();
          break;
        }
      }

      // Extract bank details if not already set
      if (!bankDetails.bankCode) {
        const bankCodeMatch = extractedText.match(/(?:Banque|Code\s*banque)\s*:?\s*(\d{3})/);
        const branchCodeMatch = extractedText.match(/(?:Guichet|Code\s*guichet)\s*:?\s*(\d{3})/);
        const accountNumberMatch = extractedText.match(/(?:Compte|N°\s*compte)\s*:?\s*(\d{16})/);
        const ribKeyMatch = extractedText.match(/(?:Clé|Clé\s*RIB)\s*:?\s*(\d{2})/);

        bankDetails = {
          bankCode: bankCodeMatch?.[1] || '000',
          branchCode: branchCodeMatch?.[1] || '000',
          accountNumber: accountNumberMatch?.[1] || '0000000000000000',
          ribKey: ribKeyMatch?.[1] || '00'
        };
      }
    }

    console.log('Extracted data:', {
      checkNumber,
      amount,
      amountInWords,
      payeeName,
      bankDetails
    });

    // Detect security features
    const securityFeatures = await detectSecurityFeatures(image.url);
    console.log('Detected security features:', securityFeatures);

    // Create the processed data
    const processedData = {
      checkNumber: checkNumber || '000000000',
      amount: amount || 0,
      amountInWords: amountInWords || 'Zéro',
      payee: {
        name: payeeName || 'Unknown',
      },
      issuer: {
        name: '', // This would need to be extracted from the check
      },
      bankDetails: {
        bankCode: bankDetails.bankCode,
        branchCode: bankDetails.branchCode,
        accountNumber: bankDetails.accountNumber,
        routingNumber: '', // This might not be present on French checks
        ribKey: bankDetails.ribKey,
        bankName: '', // This would need to be looked up based on the bank code
      },
      date: new Date().toISOString(),
      securityFeatures,
    };

    console.log('Processed check data:', processedData);
    return processedData;

  } catch (error) {
    console.error('Error processing check image:', error);
    throw error;
  }
};

export const createCheckData = async (
  images: CheckImage[],
  processedData: ProcessedCheckData
): Promise<CheckData> => {
  return {
    id: crypto.randomUUID(),
    checkNumber: processedData.checkNumber,
    amount: processedData.amount,
    amountInWords: processedData.amountInWords,
    payee: processedData.payee,
    issuer: processedData.issuer,
    bankDetails: processedData.bankDetails,
    date: processedData.date,
    memo: processedData.memo,
    status: 'pending',
    currency: 'EUR',
    securityFeatures: processedData.securityFeatures,
    images,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}; 