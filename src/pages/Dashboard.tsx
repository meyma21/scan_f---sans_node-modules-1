import React, { useEffect, useState } from 'react';
import { FileCheck, AlertTriangle, FileX, ClipboardList } from 'lucide-react';
import { useCheckStore } from '../store/checkStore';
import StatCard from '../components/dashboard/StatCard';
import RecentChecks from '../components/dashboard/RecentChecks';
import { CheckData } from '../types';
import { formatCurrency } from '../utils/formatters';

const Dashboard: React.FC = () => {
  const { checks, isLoading } = useCheckStore();
  const [stats, setStats] = useState({
    total: 0,
    validated: 0,
    needsReview: 0,
    rejected: 0,
    totalAmount: 0,
  });
  
  const [checksByStatus, setChecksByStatus] = useState<{
    pending: CheckData[];
    validated: CheckData[];
    needs_review: CheckData[];
    rejected: CheckData[];
  }>({
    pending: [],
    validated: [],
    needs_review: [],
    rejected: [],
  });
  
  useEffect(() => {
    if (checks.length > 0) {
      // Calculate stats
      const validated = checks.filter(check => check.status === 'validated');
      const needsReview = checks.filter(check => check.status === 'needs_review');
      const rejected = checks.filter(check => check.status === 'rejected');
      const pending = checks.filter(check => check.status === 'pending');
      
      const totalAmount = checks.reduce((sum, check) => sum + check.amount, 0);
      
      setStats({
        total: checks.length,
        validated: validated.length,
        needsReview: needsReview.length,
        rejected: rejected.length,
        totalAmount,
      });
      
      setChecksByStatus({
        pending,
        validated,
        needs_review: needsReview,
        rejected,
      });
    }
  }, [checks]);
  
  if (isLoading && checks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-primary-600">Loading dashboard...</div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of check scanning activity</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Checks"
          value={stats.total}
          icon={<ClipboardList size={24} />}
          change={{ value: 12, isPositive: true }}
        />
        
        <StatCard
          title="Validated"
          value={stats.validated}
          icon={<FileCheck size={24} />}
          change={{ value: 8, isPositive: true }}
          className="bg-gradient-to-br from-success-50 to-white"
        />
        
        <StatCard
          title="Needs Review"
          value={stats.needsReview}
          icon={<AlertTriangle size={24} />}
          change={{ value: 5, isPositive: false }}
          className="bg-gradient-to-br from-warning-50 to-white"
        />
        
        <StatCard
          title="Rejected"
          value={stats.rejected}
          icon={<FileX size={24} />}
          change={{ value: 2, isPositive: true }}
          className="bg-gradient-to-br from-error-50 to-white"
        />
      </div>
      
      <div>
        <StatCard
          title="Total Amount Processed"
          value={formatCurrency(stats.totalAmount)}
          icon={<div className="text-lg font-bold">$</div>}
          className="bg-gradient-to-br from-primary-50 to-white"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentChecks
          checks={checksByStatus.needs_review}
          title="Checks Needing Review"
          icon={<AlertTriangle size={18} className="text-warning-600" />}
          linkTo="/review"
        />
        
        <RecentChecks
          checks={checksByStatus.pending}
          title="Pending Checks"
          icon={<ClipboardList size={18} className="text-primary-600" />}
          linkTo="/pending"
        />
      </div>
    </div>
  );
};

export default Dashboard;