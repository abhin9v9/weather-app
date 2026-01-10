import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSun, FiMenu, FiX, FiUser, FiLogOut, FiHeart } from 'react-icons/fi';
import { useAuth } from '../../hooks';
import { useAppDispatch, useAppSelector, setMobileMenuOpen } from '../../store';
import { APP_NAME, ROUTES } from '../../utils';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, logout } = useAuth();
  const { isMobileMenuOpen } = useAppSelector((state) => state.ui);

  const toggleMobileMenu = () => {
    dispatch(setMobileMenuOpen(!isMobileMenuOpen));
  };

  const handleLogout = async () => {
    await logout();
    dispatch(setMobileMenuOpen(false));
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            to={isAuthenticated ? ROUTES.DASHBOARD : ROUTES.HOME}
            className="flex items-center space-x-2"
          >
            <div className="p-2 bg-primary-100 rounded-lg">
              <FiSun className="h-6 w-6 text-primary-600" />
            </div>
            <span className="font-bold text-xl text-gray-900">{APP_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to={ROUTES.DASHBOARD}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.FAVORITES}
                  className="text-gray-600 hover:text-primary-600 transition-colors flex items-center"
                >
                  <FiHeart className="mr-1" /> Favorites
                </Link>
                <div className="flex items-center space-x-4 pl-6 border-l border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <FiUser className="h-4 w-4 text-primary-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    aria-label="Logout"
                  >
                    <FiLogOut className="h-5 w-5" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <FiX className="h-6 w-6" />
            ) : (
              <FiMenu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 px-3 py-2 mb-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <FiUser className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    navigate(ROUTES.DASHBOARD);
                    dispatch(setMobileMenuOpen(false));
                  }}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Dashboard
                </button>
                <button
                  onClick={() => {
                    navigate(ROUTES.FAVORITES);
                    dispatch(setMobileMenuOpen(false));
                  }}
                  className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center"
                >
                  <FiHeart className="mr-2" /> Favorites
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.LOGIN}
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className="block px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  onClick={() => dispatch(setMobileMenuOpen(false))}
                  className="block px-3 py-2 bg-primary-600 text-white text-center rounded-lg hover:bg-primary-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
