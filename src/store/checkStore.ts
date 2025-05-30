import { create } from 'zustand';
import { CheckData, CheckStatus, FilterOption, Pagination, SortOption, CheckImage } from '../types';
import { processCheckImage, createCheckData } from '../utils/imageProcessor';

interface CheckState {
  checks: CheckData[];
  validatedChecks: CheckData[];
  rejectedChecks: CheckData[];
  selectedCheckId: string | null;
  isLoading: boolean;
  error: string | null;
  pagination: Pagination;
  sort: SortOption;
  filters: FilterOption[];
  searchTerm: string;
  
  // Actions
  fetchChecks: () => Promise<void>;
  selectCheck: (id: string | null) => void;
  updateCheckStatus: (id: string, status: CheckStatus) => Promise<void>;
  deleteCheck: (id: string) => Promise<void>;
  setSortOption: (sort: SortOption) => void;
  setFilter: (filter: FilterOption) => void;
  removeFilter: (field: string) => void;
  clearFilters: () => void;
  setSearchTerm: (term: string) => void;
  setPage: (page: number) => void;
  processNewCheck: (images: CheckImage[]) => Promise<void>;
  validateCheck: (id: string) => Promise<void>;
  validateAllChecks: () => Promise<void>;
  getValidatedChecks: () => CheckData[];
  rejectCheck: (id: string) => Promise<void>;
  getRejectedChecks: () => CheckData[];
}

export const useCheckStore = create<CheckState>((set, get) => ({
  checks: [],
  validatedChecks: [],
  rejectedChecks: [],
  selectedCheckId: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
  sort: {
    field: 'createdAt',
    direction: 'desc',
  },
  filters: [],
  searchTerm: '',
  
  fetchChecks: async () => {
    set({ isLoading: true, error: null });
    try {
      // In a real app, this would be an API call to get stored checks
      // For now, we'll just return the current checks
      const { checks } = get();
      
      // Apply pagination
      const { page, limit } = get().pagination;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      // Apply sorting
      const { field, direction } = get().sort;
      const sortedData = [...checks].sort((a, b) => {
        const aValue = a[field as keyof CheckData];
        const bValue = b[field as keyof CheckData];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
      
      // Apply filtering
      const filteredChecks = sortedData.filter((check: CheckData) => {
        const searchLower = get().searchTerm.toLowerCase();
        
        if (searchLower) {
          const matchesSearch = 
            check.checkNumber.toLowerCase().includes(searchLower) ||
            check.payee.name.toLowerCase().includes(searchLower) ||
            check.issuer.name.toLowerCase().includes(searchLower) ||
            check.bankDetails.accountNumber.includes(searchLower);
          
          if (!matchesSearch) return false;
        }
        
        return get().filters.every((filter: FilterOption) => {
          const value = check[filter.field as keyof CheckData];
          
          if (value !== undefined && typeof value === 'string' && filter.operator === 'contains' && filter.value !== undefined) {
            return value.toLowerCase().includes(filter.value.toString().toLowerCase());
          }
          
          if (value === undefined || filter.value === undefined) return false;
          
          switch (filter.operator) {
            case 'eq': return value === filter.value;
            case 'neq': return value !== filter.value;
            case 'gt': return value > filter.value;
            case 'gte': return value >= filter.value;
            case 'lt': return value < filter.value;
            case 'lte': return value <= filter.value;
            default: return false;
          }
        });
      });
      
      set({ 
        checks: filteredChecks.slice(startIndex, endIndex),
        isLoading: false,
        pagination: {
          ...get().pagination,
          total: filteredChecks.length
        },
      });
    } catch (error) {
      console.error('Error fetching checks:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch checks' 
      });
    }
  },
  
  selectCheck: (id: string | null) => {
    set({ selectedCheckId: id });
  },
  
  updateCheckStatus: async (id: string, status: CheckStatus) => {
    set({ isLoading: true, error: null });
    try {
      const { checks, validatedChecks, rejectedChecks } = get();
      let checkToUpdate = checks.find(check => check.id === id);
      let updatedChecks = checks.filter(check => check.id !== id);
      let updatedValidatedChecks = [...validatedChecks];
      let updatedRejectedChecks = [...rejectedChecks];

      if (checkToUpdate) {
        checkToUpdate = { ...checkToUpdate, status, updatedAt: new Date().toISOString() };
        if (status === 'validated') {
          // Move to validated list
          updatedValidatedChecks = [checkToUpdate, ...validatedChecks];
          updatedRejectedChecks = updatedRejectedChecks.filter(check => check.id !== id);
        } else if (status === 'rejected') {
          // Move to rejected list
          updatedRejectedChecks = [checkToUpdate, ...rejectedChecks];
          updatedValidatedChecks = updatedValidatedChecks.filter(check => check.id !== id);
        } else {
          // Keep in or move back to main checks list
          updatedChecks = [checkToUpdate, ...updatedChecks];
          updatedValidatedChecks = updatedValidatedChecks.filter(check => check.id !== id);
          updatedRejectedChecks = updatedRejectedChecks.filter(check => check.id !== id);
        }
      }

      set({ 
        checks: updatedChecks, 
        validatedChecks: updatedValidatedChecks, 
        rejectedChecks: updatedRejectedChecks, 
        isLoading: false 
      });
      // Refresh the displayed checks after status update
      get().fetchChecks();
    } catch (error) {
      console.error('Error updating check status:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to update check status' 
      });
    }
  },
  
  deleteCheck: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const updatedChecks = get().checks.filter(check => check.id !== id);
      const updatedValidatedChecks = get().validatedChecks.filter(check => check.id !== id);
      const updatedRejectedChecks = get().rejectedChecks.filter(check => check.id !== id);
      set({ 
        checks: updatedChecks, 
        validatedChecks: updatedValidatedChecks, 
        rejectedChecks: updatedRejectedChecks, 
        isLoading: false 
      });
      get().fetchChecks(); // Refresh the displayed checks after deletion
    } catch (error) {
      console.error('Error deleting check:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to delete check' 
      });
    }
  },
  
  setSortOption: (sort: SortOption) => {
    set({ sort });
    get().fetchChecks();
  },
  
  setFilter: (filter: FilterOption) => {
    const filters = get().filters.filter(f => f.field !== filter.field);
    set({ filters: [...filters, filter] });
    get().fetchChecks();
  },
  
  removeFilter: (field: string) => {
    set({ filters: get().filters.filter(f => f.field !== field) });
    get().fetchChecks();
  },
  
  clearFilters: () => {
    set({ filters: [] });
    get().fetchChecks();
  },
  
  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
    get().fetchChecks();
  },
  
  setPage: (page: number) => {
    set({ pagination: { ...get().pagination, page } });
    get().fetchChecks();
  },

  processNewCheck: async (images: CheckImage[]) => {
    set({ isLoading: true, error: null });
    try {
      // Process the first image (recto) to extract check data
      const processedData = await processCheckImage(images[0]);
      
      // Create new check data
      const newCheck = await createCheckData(images, processedData);
      
      // Add the new check to the store
      const currentChecks = get().checks;
      set({
        checks: [newCheck, ...currentChecks],
        isLoading: false,
        pagination: {
          ...get().pagination,
          total: get().pagination.total + 1
        }
      });
    } catch (error) {
      console.error('Error processing new check:', error);
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to process check' 
      });
    }
  },

  validateCheck: async (id: string) => {
    const { updateCheckStatus } = get();
    await updateCheckStatus(id, 'validated');
  },

  validateAllChecks: async () => {
    const { checks, updateCheckStatus } = get();
    for (const check of checks) {
      // Only validate checks that are not already validated or rejected
      if (check.status !== 'validated' && check.status !== 'rejected') {
        await updateCheckStatus(check.id, 'validated');
      }
    }
  },

  getValidatedChecks: () => get().validatedChecks,

  rejectCheck: async (id: string) => {
    const { updateCheckStatus } = get();
    await updateCheckStatus(id, 'rejected');
  },

  getRejectedChecks: () => get().rejectedChecks,
}));