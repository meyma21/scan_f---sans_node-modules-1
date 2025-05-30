import React, { useState } from 'react';
import { FileCheck, AlertTriangle, FileX, Check, AlertCircle, X, Loader2 } from 'lucide-react';
import { CheckData, CheckStatus } from '../../types';
import Button from '../ui/Button';
import { useCheckStore } from '../../store/checkStore';

interface CheckStatusActionsProps {
  check: CheckData;
}

const CheckStatusActions: React.FC<CheckStatusActionsProps> = ({ check }) => {
  const { updateCheckStatus } = useCheckStore();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusChange = async (newStatus: CheckStatus) => {
    setIsUpdating(true);
    try {
      await updateCheckStatus(check.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Define which actions are available based on current status
  const availableActions = () => {
    switch (check.status) {
      case 'pending':
        return (
          <>
            <Button
              variant="success"
              leftIcon={<Check size={16} />}
              onClick={() => handleStatusChange('validated')}
              disabled={isUpdating}
            >
              Validate
            </Button>
            <Button
              variant="warning"
              leftIcon={<AlertCircle size={16} />}
              onClick={() => handleStatusChange('needs_review')}
              disabled={isUpdating}
            >
              Flag for Review
            </Button>
            <Button
              variant="error"
              leftIcon={<X size={16} />}
              onClick={() => handleStatusChange('rejected')}
              disabled={isUpdating}
            >
              Reject
            </Button>
          </>
        );
      
      case 'needs_review':
        return (
          <>
            <Button
              variant="success"
              leftIcon={<Check size={16} />}
              onClick={() => handleStatusChange('validated')}
              disabled={isUpdating}
            >
              Validate
            </Button>
            <Button
              variant="error"
              leftIcon={<X size={16} />}
              onClick={() => handleStatusChange('rejected')}
              disabled={isUpdating}
            >
              Reject
            </Button>
          </>
        );
      
      case 'validated':
        return (
          <>
            <Button
              variant="warning"
              leftIcon={<AlertCircle size={16} />}
              onClick={() => handleStatusChange('needs_review')}
              disabled={isUpdating}
            >
              Flag for Review
            </Button>
            <Button
              variant="error"
              leftIcon={<X size={16} />}
              onClick={() => handleStatusChange('rejected')}
              disabled={isUpdating}
            >
              Reject
            </Button>
          </>
        );
      
      case 'rejected':
        return (
          <>
            <Button
              variant="primary"
              leftIcon={<AlertCircle size={16} />}
              onClick={() => handleStatusChange('needs_review')}
              disabled={isUpdating}
            >
              Move to Review
            </Button>
          </>
        );
      
      default:
        return null;
    }
  };
  
  const getStatusBadge = () => {
    switch (check.status) {
      case 'validated':
        return <span className="flex items-center text-success-700"><FileCheck size={18} className="mr-1" /> Validated</span>;
      case 'pending':
        return <span className="flex items-center text-primary-700"><AlertCircle size={18} className="mr-1" /> Pending Validation</span>;
      case 'needs_review':
        return <span className="flex items-center text-warning-700"><AlertTriangle size={18} className="mr-1" /> Needs Review</span>;
      case 'rejected':
        return <span className="flex items-center text-error-700"><FileX size={18} className="mr-1" /> Rejected</span>;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
        <div className="text-lg font-medium mb-2 sm:mb-0">
          {getStatusBadge()}
        </div>
        
        {isUpdating && (
          <div className="flex items-center text-primary-600">
            <Loader2 size={16} className="animate-spin mr-2" />
            <span>Updating status...</span>
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {availableActions()}
      </div>
    </div>
  );
};

export default CheckStatusActions;