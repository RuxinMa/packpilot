import React from 'react';

interface HeaderProps {
  title: string;
  viewType: string;
}

const Header: React.FC<HeaderProps> = ({ title, viewType }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-3xl font-bold text-gray-800">
              {title}
            </h1>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-lg font-medium bg-blue-100 text-blue-800">
              {viewType} View
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;