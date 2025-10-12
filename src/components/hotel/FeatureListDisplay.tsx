"use client";

import React from 'react';
import { Check } from 'lucide-react';

export interface FeatureItem { // Exportando a interface
  text: string;
}

export interface FeatureCategory { // Exportando a interface
  title: string;
  items: FeatureItem[];
}

interface FeatureListDisplayProps {
  features: FeatureCategory[];
}

const FeatureListDisplay: React.FC<FeatureListDisplayProps> = ({ features }) => {
  return (
    <div className="space-y-6 p-6">
      {features.map((category, categoryIndex) => (
        <div key={categoryIndex}>
          <h3 className="font-semibold text-lg mb-3">{category.title}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="flex items-center text-gray-700">
                <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureListDisplay;