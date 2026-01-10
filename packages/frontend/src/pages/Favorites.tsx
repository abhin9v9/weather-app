import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layout,
  Loader,
  FavoritesList,
  WeatherCard,
} from '../components';
import {
  useGetFavoritesQuery,
  useRemoveFavoriteMutation,
  useLazyGetWeatherByCityQuery,
} from '../api';
import type { Favorite } from '../types';
import { ROUTES } from '../utils';
import toast from 'react-hot-toast';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFavorite, setSelectedFavorite] = useState<Favorite | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // API hooks
  const { data: favoritesData, isLoading, error } = useGetFavoritesQuery();
  const [removeFavorite] = useRemoveFavoriteMutation();
  const [getWeather, { data: weatherData, isLoading: weatherLoading }] =
    useLazyGetWeatherByCityQuery();

  // Handle selecting a favorite
  const handleSelectFavorite = async (favorite: Favorite) => {
    setSelectedFavorite(favorite);
    await getWeather({ city: favorite.city });
  };

  // Handle removing a favorite
  const handleRemoveFavorite = async (id: string) => {
    setRemovingId(id);
    try {
      await removeFavorite(id).unwrap();
      toast.success('Removed from favorites');
      if (selectedFavorite?.id === id) {
        setSelectedFavorite(null);
      }
    } catch {
      toast.error('Failed to remove from favorites');
    } finally {
      setRemovingId(null);
    }
  };

  // Navigate to dashboard with city
  const handleViewInDashboard = () => {
    if (selectedFavorite) {
      navigate(`${ROUTES.DASHBOARD}?city=${encodeURIComponent(selectedFavorite.city)}`);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader size="lg" text="Loading favorites..." />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-red-600 font-medium">
              Failed to load favorites. Please try again later.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Favorite Cities
          </h1>
          <p className="text-gray-600">
            Quick access to weather in your saved cities
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Favorites list */}
          <div>
            <FavoritesList
              favorites={favoritesData?.data || []}
              onSelect={handleSelectFavorite}
              onRemove={handleRemoveFavorite}
              isRemoving={removingId}
            />
          </div>

          {/* Selected favorite weather */}
          <div>
            {weatherLoading && (
              <div className="bg-white rounded-xl shadow-md p-8 flex justify-center">
                <Loader size="lg" text="Loading weather..." />
              </div>
            )}

            {!weatherLoading && selectedFavorite && weatherData?.data && (
              <div>
                <WeatherCard
                  weather={weatherData.data}
                  showDetails={true}
                />
                <button
                  onClick={handleViewInDashboard}
                  className="mt-4 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  View Full Forecast
                </button>
              </div>
            )}

            {!selectedFavorite && !weatherLoading && favoritesData?.data && favoritesData.data.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-200">
                <p className="text-gray-500">
                  Select a city from your favorites to view its weather
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
