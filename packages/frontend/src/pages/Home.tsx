import React from 'react';
import { Link } from 'react-router-dom';
import { FiSun, FiCloud, FiDroplet, FiWind, FiHeart, FiShield } from 'react-icons/fi';
import { Layout } from '../components';
import { APP_NAME, ROUTES } from '../utils';

const Home: React.FC = () => {
  const features = [
    {
      icon: <FiSun className="h-8 w-8" />,
      title: 'Real-time Weather',
      description: 'Get accurate, up-to-date weather information for any city worldwide.',
    },
    {
      icon: <FiCloud className="h-8 w-8" />,
      title: '5-Day Forecast',
      description: 'Plan ahead with detailed forecasts including temperature, humidity, and more.',
    },
    {
      icon: <FiHeart className="h-8 w-8" />,
      title: 'Save Favorites',
      description: 'Keep track of your favorite cities for quick access to their weather.',
    },
    {
      icon: <FiShield className="h-8 w-8" />,
      title: 'Secure & Personal',
      description: 'Your data is protected with secure authentication and encryption.',
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-20" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Your Personal{' '}
              <span className="text-yellow-300">Weather</span> Dashboard
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Stay informed with real-time weather updates, forecasts, and personalized
              city tracking. Never get caught off guard by the weather again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={ROUTES.REGISTER}
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Get Started Free
              </Link>
              <Link
                to={ROUTES.LOGIN}
                className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/30"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>

        {/* Weather icons decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {APP_NAME} provides all the tools you need to stay on top of the weather.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <FiCloud className="h-10 w-10 text-yellow-300" />
              </div>
              <p className="text-4xl font-bold mb-2">200,000+</p>
              <p className="text-white/80">Cities Covered</p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <FiDroplet className="h-10 w-10 text-yellow-300" />
              </div>
              <p className="text-4xl font-bold mb-2">99.9%</p>
              <p className="text-white/80">Uptime</p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <FiWind className="h-10 w-10 text-yellow-300" />
              </div>
              <p className="text-4xl font-bold mb-2">Real-time</p>
              <p className="text-white/80">Data Updates</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Create your free account today and start tracking the weather in your favorite cities.
          </p>
          <Link
            to={ROUTES.REGISTER}
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors shadow-lg"
          >
            Create Free Account
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
