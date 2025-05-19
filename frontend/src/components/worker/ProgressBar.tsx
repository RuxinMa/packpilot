import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  // Calculate percentage
  const percentage = Math.min(Math.round((current / total) * 100), 100);
  
  return (
    <div className="w-full mt-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700"
        >
          Progress
        </span>
        <span className="text-sm font-medium text-gray-700"
        >
          {current}/{total}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-4">
        <div 
          className="bg-indigo-500 h-4 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;