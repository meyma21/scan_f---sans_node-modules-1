import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  bordered = true,
}) => {
  const baseStyles = 'bg-white rounded-lg overflow-hidden';
  const borderStyles = bordered ? 'border border-gray-200' : '';
  const hoverStyles = hoverable ? 'hover:shadow-lg transition-shadow duration-300' : '';
  const cursorStyles = onClick ? 'cursor-pointer' : '';
  
  const combinedClassName = `
    ${baseStyles}
    ${borderStyles}
    ${hoverStyles}
    ${cursorStyles}
    ${className}
  `.trim();
  
  return (
    <div 
      className={combinedClassName}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 flex justify-between items-start border-b border-gray-200 ${className}`}>
      <div>
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;