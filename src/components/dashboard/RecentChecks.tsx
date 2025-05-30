import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card, { CardHeader, CardBody, CardFooter } from '../ui/Card';
import { CheckData } from '../../types';
import CheckCard from '../check/CheckCard';

interface RecentChecksProps {
  checks: CheckData[];
  title: string;
  icon: React.ReactNode;
  linkTo: string;
}

const RecentChecks: React.FC<RecentChecksProps> = ({ checks, title, icon, linkTo }) => {
  return (
    <Card className="h-full">
      <CardHeader
        title={
          <div className="flex items-center">
            <span className="mr-2">{icon}</span>
            {title}
          </div>
        }
        subtitle={`${checks.length} checks`}
      />
      
      <CardBody className="p-4">
        {checks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No checks found
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checks.slice(0, 6).map((check) => (
              <CheckCard key={check.id} check={check} />
            ))}
          </div>
        )}
      </CardBody>
      
      <CardFooter>
        <Link 
          to={linkTo}
          className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
        >
          View all <ArrowRight size={16} className="ml-1" />
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RecentChecks;