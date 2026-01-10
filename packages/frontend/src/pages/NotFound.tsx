import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiCloud } from 'react-icons/fi';
import { Layout } from '../components';
import { ROUTES } from '../utils';

const NotFound: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-8">
            <FiCloud className="h-24 w-24 text-gray-300 mx-auto mb-4" />
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <p className="text-xl text-gray-600">Page not found</p>
          </div>
          
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <FiHome className="mr-2" />
              Go Home
            </Link>
            <Link
              to={ROUTES.DASHBOARD}
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiCloud className="mr-2" />
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
