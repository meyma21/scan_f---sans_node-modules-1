import { CheckData, CheckImage } from '../types';

export function transformSimulatorData(data: any): CheckData {
  const now = new Date().toISOString();
  const createImage = (base64: string, type: 'recto' | 'verso' | 'uv'): CheckImage => ({
    id: crypto.randomUUID(),
    url: `data:image/jpeg;base64,${base64}`,
    type,
    width: 800,  // valeur approximative par défaut
    height: 600, // idem
    createdAt: new Date().toISOString(),
  });

  return {
    id: crypto.randomUUID(),
    checkNumber: data.chequeNumber || 'Inconnu',
    amount: parseFloat(data.amount.replace('EUR', '').replace(',', '.')) || 0,
    amountInWords: 'Non détecté', // peut être généré si OCR disponible
    currency: 'MAD',
    payee: {
      name: data.payeeName || 'Non détecté',
      identifier: data.payeeId
    },
    issuer: {
      name: data.issuerName || 'Non détecté',
      address: data.issuerAddress,
      phone: data.issuerPhone
    },
    bankDetails: {
      bankCode: '007',
      branchCode: '123',
      accountNumber: data.cmc7 || '0000000000000000',
      routingNumber: '000000',
      ribKey: '00',
      bankName: 'Attijariwafa bank'
    },
    date: data.date || now.split('T')[0],
    memo: data.rawData || '',
    status: 'pending',
    securityFeatures: {
      hasWatermark: false,
      hasMicrotext: false,
      hasUVFeatures: false
    },
    images: [
      createImage(data.image1, 'recto'),
      createImage(data.image2, 'verso'),
      createImage(data.image3, 'uv'),
    ],
    createdAt: now,
    updatedAt: now
  };
}
