import React from 'react';
import { Eye, FileCheck, AlertCircle, FileX, DollarSign, Calendar, Ban as Bank } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CheckData } from '../../types';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { formatCurrency, formatDate, truncateText } from '../../utils/formatters';

interface CheckCardProps {
  check: CheckData;
}

const CheckCard: React.FC<CheckCardProps> = ({ check }) => {
  const getStatusBadge = () => {
    switch (check.status) {
      case 'validated':
        return <Badge variant="success" className="flex items-center"><FileCheck size={14} className="mr-1" /> Validated</Badge>;
      case 'pending':
        return <Badge variant="primary" className="flex items-center"><Eye size={14} className="mr-1" /> Pending</Badge>;
      case 'needs_review':
        return <Badge variant="warning" className="flex items-center"><AlertCircle size={14} className="mr-1" /> Needs Review</Badge>;
      case 'rejected':
        return <Badge variant="error" className="flex items-center"><FileX size={14} className="mr-1" /> Rejected</Badge>;
      default:
        return null;
    }
  };
  
  const rectoImage = check.images.find(img => img.type === 'recto');
  
  return (
    <Link to={`/check/${check.id}`}>
      <Card 
        hoverable 
        className="group transition-all duration-300 h-full"
      >
        <div className="relative h-48 overflow-hidden">
          {rectoImage && (
            <img 
              src={rectoImage.url} 
              alt="Check front"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300" 
            />
          )}
          <div className="absolute top-0 right-0 m-2">
            {getStatusBadge()}
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-white font-semibold">{truncateText(check.payee, 20)}</p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">#{check.checkNumber}</span>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar size={14} className="mr-1" />
              {formatDate(check.date)}
            </div>
          </div>
          
          <div className="flex items-center mb-2">
            <DollarSign size={16} className="text-accent-600 mr-1" />
            <span className="font-bold text-gray-800">{formatCurrency(check.amount)}</span>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Bank size={14} className="mr-1" />
            <span>{truncateText(check.drawee, 25)}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CheckCard;