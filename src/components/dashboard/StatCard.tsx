import React from 'react';
import Card from '../ui/Card';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  className = '',
}) => {
  return (
    <Card className={`${className}`}>
      <div className="p-6">
        <div className="flex justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            
            {change && (
              <div className="flex items-center mt-2">
                {change.isPositive ? (
                  <span className="flex items-center text-success-600 text-sm">
                    <ArrowUpRight size={16} className="mr-1" />
                    {change.value}%
                  </span>
                ) : (
                  <span className="flex items-center text-error-600 text-sm">
                    <ArrowDownRight size={16} className="mr-1" />
                    {change.value}%
                  </span>
                )}
                <span className="text-gray-500 text-sm ml-1">vs last week</span>
              </div>
            )}
          </div>
          
          <div className="h-12 w-12 rounded-lg bg-primary-50 flex items-center justify-center text-primary-600">
            {icon}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;