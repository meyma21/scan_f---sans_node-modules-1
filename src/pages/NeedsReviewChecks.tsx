import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useCheckStore } from '../store/checkStore';
import CheckCard from '../components/check/CheckCard';
import Pagination from '../components/common/Pagination';

const NeedsReviewChecks: React.FC = () => {
  const { checks, isLoading, pagination, setPage, setFilter } = useCheckStore();
  
  useEffect(() => {
    // Filter for checks that need review when component mounts
    setFilter({ field: 'status', value: 'needs_review', operator: 'eq' });
  }, [setFilter]);
  
  if (isLoading && checks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary-600">Loading checks that need review...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <AlertTriangle size={24} className="mr-2 text-warning-600" />
          Checks Needing Review
        </h1>
        <p className="text-gray-500 mt-1">Checks that require additional verification</p>
      </div>
      
      {checks.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <AlertTriangle size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Checks Needing Review</h3>
          <p className="text-gray-600">
            There are currently no checks flagged for review.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {checks.map((check) => (
              <CheckCard key={check.id} check={check} />
            ))}
          </div>
          
          <Pagination 
            pagination={pagination}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
};

export default NeedsReviewChecks;