import { CheckData, CheckStatus } from '../types';

// Generate a random date within the last 30 days
const getRandomRecentDate = (): string => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * 30);
  now.setDate(now.getDate() - daysAgo);
  return now.toISOString();
};

// Mock check data for development
export const generateMockChecks = (count: number): CheckData[] => {
  return Array.from({ length: count }, (_, i) => {
    const id = `check-${i + 1}`;
    const createdAt = getRandomRecentDate();
    const updatedAt = new Date(new Date(createdAt).getTime() + 1000 * 60 * 60).toISOString();
    
    return {
      id,
      checkNumber: '3.756.48',
      amount: 3756.48,
      amountInWords: 'Trois Mille Sept Cent Cinquante Six (Dhs) Et Quarante Huit (Cts)',
      currency: 'MAD',
      payee: {
        name: 'LYDEC',
        identifier: undefined
      },
      issuer: {
        name: 'Attijariwafa bank',
        address: 'AGENCE MEDIOUNA EXPANSION, 1075, ROUTE DE MEDIOUNA, CASABLANCA',
        phone: undefined
      },
      bankDetails: {
        bankCode: '007',
        branchCode: '001',
        accountNumber: '1234567891',
        ribKey: '01',
        bankName: 'Attijariwafa bank',
        branchAddress: 'AGENCE MEDIOUNA EXPANSION, 1075, ROUTE DE MEDIOUNA, CASABLANCA'
      },
      date: '2019-05-15',
      status: i === 0 ? 'pending' : getRandomStatus(),
      memo: 'NON ENDOSSABLE',
      securityFeatures: {
        hasWatermark: true,
        hasMicrotext: true,
        hasUVFeatures: true
      },
      images: [
        {
          id: `${id}-recto`,
          url: '/cheque-recto.png', // You'll need to add this image to your public folder
          type: 'recto',
          width: 1200,
          height: 800,
          createdAt,
        },
        {
          id: `${id}-verso`,
          url: '/cheque-verso.png', // You'll need to add this image to your public folder
          type: 'verso',
          width: 1200,
          height: 800,
          createdAt,
        },
        {
          id: `${id}-uv`,
          url: '/cheque-uv.png', // You'll need to add this image to your public folder
          type: 'uv',
          width: 1200,
          height: 800,
          createdAt,
        },
      ],
      createdAt,
      updatedAt,
    };
  });
};

// Random status generator (for checks after the first one)
const getRandomStatus = (): CheckStatus => {
  const statuses: CheckStatus[] = ['pending', 'validated', 'rejected', 'needs_review'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Export a set of mock checks
export const mockChecks = generateMockChecks(20);