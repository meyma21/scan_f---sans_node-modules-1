// Check related types
export interface CheckImage {
  id: string;
  url: string;
  type: 'recto' | 'verso' | 'uv';
  width: number;
  height: number;
  createdAt: string;
}

export interface BankDetails {
  bankCode: string;      // 3 digits
  branchCode: string;    // 3 digits
  accountNumber: string; // 16 digits
  routingNumber: string; // Routing number
  ribKey: string;       // 2 digits
  bankName: string;
  branchAddress?: string;
}

export interface CheckData {
  id: string;
  checkNumber: string;
  amount: number;
  amountInWords: string;
  payee: {
    name: string;
    identifier?: string; // National ID or passport number
  };
  issuer: {
    name: string;
    address?: string;
    phone?: string;
  };
  bankDetails: BankDetails;
  date: string;
  memo?: string;
  status: CheckStatus;
  currency: string;
  securityFeatures: {
    hasWatermark: boolean;
    hasMicrotext: boolean;
    hasUVFeatures: boolean;
  };
  anomalies?: Anomaly[]; // List of detected anomalies in the check
  verificationDetails?: {
    verifiedAt?: string;
    verifiedBy?: string;
    notes?: string;
  };
  images: CheckImage[];
  createdAt: string;
  updatedAt: string;
}

export type CheckStatus = 
  | 'pending'
  | 'validated'
  | 'rejected'
  | 'needs_review';

export type AnomalyType = 
  | 'security'    // Problèmes de sécurité
  | 'amount'      // Problèmes de montant
  | 'date'        // Problèmes de date
  | 'signature'   // Problèmes de signature
  | 'format'      // Problèmes de format
  | 'other';      // Autres problèmes

export interface Anomaly {
  type: AnomalyType;
  message: string;
  severity: 'high' | 'medium' | 'low';
}

export const ANOMALY_COLORS: Record<AnomalyType, string> = {
  security: 'bg-red-100 text-red-800',
  amount: 'bg-orange-100 text-orange-800',
  date: 'bg-yellow-100 text-yellow-800',
  signature: 'bg-purple-100 text-purple-800',
  format: 'bg-blue-100 text-blue-800',
  other: 'bg-gray-100 text-gray-800'
};

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type UserRole = 
  | 'admin'
  | 'operator'
  | 'viewer';

// Application state types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface FilterOption {
  field: string;
  value: string | number | boolean;
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains';
}

export interface QueryOptions {
  pagination: Pagination;
  sort?: SortOption;
  filters?: FilterOption[];
  search?: string;
}