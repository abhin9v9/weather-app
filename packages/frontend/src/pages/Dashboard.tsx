import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiRefreshCw, FiMapPin } from 'react-icons/fi';
import {
  Layout,
  Loader,
  SearchBar,
  WeatherCard,
  ForecastList,
} from '../components';
import {
  useLazyGetWeatherByCityQuery,
  useLazyGetForecastByCityQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetFavoritesQuery,
} from '../api';
import { useAppDispatch, setCurrentWeather, setForecast, addToSearchHistory } from '../store';
import { useGeolocation } from '../hooks';
import toast from 'react-hot-toast';

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const { latitude, longitude, error: geoError, isLoading: geoLoading } = useGeolocation();

  // API hooks
  const [getWeather, { data: weatherData, isLoading: weatherLoading, error: weatherError }] =
    useLazyGetWeatherByCityQuery();
  const [getForecast, { data: forecastData, isLoading: forecastLoading }] =
    useLazyGetForecastByCityQuery();
  const { data: favoritesData } = useGetFavoritesQuery();
  const [addFavorite, { isLoading: isAddingFavorite }] = useAddFavoriteMutation();
  const [removeFavorite] = useRemoveFavoriteMutation();

  // Check if current city is a favorite
  const isFavorite = favoritesData?.data?.some(
    (fav) => fav.city.toLowerCase() === weatherData?.data?.city.toLowerCase()
  );

  const currentFavorite = favoritesData?.data?.find(
    (fav) => fav.city.toLowerCase() === weatherData?.data?.city.toLowerCase()
  );

  // Fetch weather for a city
  const handleSearch = async (city: string) => {
    setSelectedCity(city);
    dispatch(addToSearchHistory(city));
    await Promise.all([
      getWeather({ city }),
      getForecast({ city }),
    ]);
  };

  // Toggle favorite
  const handleToggleFavorite = async () => {
    if (!weatherData?.data) return;

    if (isFavorite && currentFavorite) {
      try {
        await removeFavorite(currentFavorite.id).unwrap();
        toast.success('Removed from favorites');
      } catch {
        toast.error('Failed to remove from favorites');
      }
    } else {
      try {
        await addFavorite({
          city: weatherData.data.city,
          country: weatherData.data.country,
          lat: weatherData.data.coordinates.lat,
          lon: weatherData.data.coordinates.lon,
        }).unwrap();
        toast.success('Added to favorites');
      } catch {
        toast.error('Failed to add to favorites');
      }
    }
  };

  // Refresh weather data
  const handleRefresh = () => {
    if (selectedCity) {
      handleSearch(selectedCity);
    }
  };

  // Update store when weather data changes
  useEffect(() => {
    if (weatherData?.data) {
      dispatch(setCurrentWeather(weatherData.data));
    }
  }, [weatherData, dispatch]);

  useEffect(() => {
    if (forecastData?.data) {
      dispatch(setForecast(forecastData.data));
    }
  }, [forecastData, dispatch]);

  // Get city from URL or default on load
  useEffect(() => {
    const cityFromUrl = searchParams.get('city');
    if (cityFromUrl && !selectedCity) {
      handleSearch(cityFromUrl);
    } else if (!selectedCity) {
      handleSearch('London');
    }
  }, [searchParams]);

  const isLoading = weatherLoading || forecastLoading;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Search and location */}
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <SearchBar onSearch={handleSearch} />
          
          <div className="flex gap-2">
            <button
              onClick={() => {
                if (latitude && longitude) {
                  // For now, just use a default city since we don't have coords API in search
                  toast.success('Using your location');
                }
              }}
              disabled={geoLoading || !!geoError}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FiMapPin className="h-5 w-5" />
              <span className="hidden sm:inline">Location</span>
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={isLoading || !selectedCity}
              className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <FiRefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader size="lg" text="Loading weather data..." />
          </div>
        )}

        {/* Error state */}
        {weatherError && !isLoading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-red-600 font-medium">
              Failed to load weather data. Please try again.
            </p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-red-600 hover:text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {/* Weather content */}
        {!isLoading && !weatherError && weatherData?.data && (
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Current weather */}
            <div>
              <WeatherCard
                weather={weatherData.data}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                isAddingFavorite={isAddingFavorite}
              />
            </div>

            {/* Forecast */}
            {forecastData?.data && (
              <div>
                <ForecastList forecast={forecastData.data} />
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
