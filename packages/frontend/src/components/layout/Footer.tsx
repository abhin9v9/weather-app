import React from 'react';
import { FiGithub, FiHeart } from 'react-icons/fi';
import { APP_NAME } from '../../utils';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-gray-500 text-sm">
            <span>© {currentYear} {APP_NAME}.</span>
            <span className="hidden sm:inline">All rights reserved.</span>
          </div>

          <div className="flex items-center space-x-4 text-gray-400">
            <span className="text-sm flex items-center">
              Made with <FiHeart className="mx-1 text-red-400" /> using React
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:text-gray-600 transition-colors"
              aria-label="GitHub"
            >
              <FiGithub className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-400">
          Weather data provided by{' '}
          <a
            href="https://openweathermap.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-500 hover:text-primary-600"
          >
            OpenWeatherMap
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
