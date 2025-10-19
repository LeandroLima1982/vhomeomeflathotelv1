import React from 'react';
import { Star } from 'lucide-react';

const Logo = ({ textColor = 'text-gray-900', starColor = 'text-yellow-500' }) => {
  return (
    <div className="flex flex-col">
      <span className={`text-lg font-light ${textColor}`}>Flat Hotel</span>
      <div className="flex items-center gap-0.5">
        {[...Array(4)].map((_, i) => (
          <Star key={i} className={`h-4 w-4 fill-current ${starColor}`} />
        ))}
      </div>
    </div>
  );
};

export default Logo;