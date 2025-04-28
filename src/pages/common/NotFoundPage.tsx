import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import NotFoundSVG from '../../assets/not_found.svg';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header title="Page Not Found" viewType="Error" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="bg-white shadow-md rounded-lg border border-gray-200 p-8 flex flex-col items-center justify-center min-h-[calc(100vh-240px)]">
          <div className="text-center">
             <img 
              src={NotFoundSVG} 
              alt="Page not found" 
              className="mx-auto w-60 h-60"
            />
            <h2 className="mt-4 text-3xl font-medium text-gray-800"
            >
              Page Not Found
            </h2>
            <p className="mt-6 text-base text-gray-500">
              The page you're looking for doesn't exist or has been moved.
            </p>
            <div className="mt-10">
              <Link 
                to="/login" 
                className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;