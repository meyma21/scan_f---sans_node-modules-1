import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useCheckStore } from '../store/checkStore';
import Button from '../components/ui/Button';
import CheckImageViewer from '../components/check/CheckImageViewer';
import CheckDetailPanel from '../components/check/CheckDetailPanel';
import CheckStatusActions from '../components/check/CheckStatusActions';

const CheckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { checks, isLoading } = useCheckStore();
  
  const check = checks.find(c => c.id === id);
  
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary-600">Loading check details...</div>
      </div>
    );
  }
  
  if (!check) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Check Not Found</h2>
        <p className="text-gray-600 mb-6">The check you're looking for doesn't exist or has been removed.</p>
        <Button
          variant="primary"
          leftIcon={<ArrowLeft size={16} />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            className="mb-2"
          >
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Check #{check.checkNumber}</h1>
          <p className="text-gray-500 mt-1">ID: {check.id}</p>
        </div>
      </div>
      
      <CheckStatusActions check={check} />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <CheckImageViewer images={check.images} />
        </div>
        
        <div className="lg:col-span-2">
          <CheckDetailPanel check={check} />
        </div>
      </div>
    </div>
  );
};

export default CheckDetail;