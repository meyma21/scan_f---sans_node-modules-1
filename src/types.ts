import { CheckStatus } from './types/index';

export type SortOption = {
  field: string;
  direction: 'asc' | 'desc';
};

export type FilterOption = {
  field: string;
  value: string;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

export type CheckImage = {
  id: string;
  type: 'recto' | 'verso' | 'uv';
  base64: string;
  createdAt: string;
  updatedAt: string;
};

export type CheckData = {
  id: string;
  checkNumber: string;
  status: CheckStatus;
  recto: CheckImage;
  verso: CheckImage;
  uv: CheckImage;
  createdAt: string;
  updatedAt: string;
};
