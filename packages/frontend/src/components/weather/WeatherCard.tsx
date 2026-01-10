import React from 'react';
import {
  FiDroplet,
  FiWind,
  FiSunrise,
  FiSunset,
  FiEye,
  FiThermometer,
  FiHeart,
} from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import type { WeatherData } from '../../types';
import {
  formatTemperature,
  formatWindSpeed,
  formatVisibility,
  formatTime,
  getWeatherIconUrl,
  getWeatherBackground,
  getWindDirection,
} from '../../utils';

interface WeatherCardProps {
  weather: WeatherData;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  isAddingFavorite?: boolean;
  showDetails?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  weather,
  isFavorite = false,
  onToggleFavorite,
  isAddingFavorite = false,
  showDetails = true,
}) => {
  const backgroundGradient = getWeatherBackground(weather.icon);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${backgroundGradient} text-white shadow-xl`}
    >
      {/* Favorite button */}
      {onToggleFavorite && (
        <button
          onClick={onToggleFavorite}
          disabled={isAddingFavorite}
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors z-10"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? (
            <FaHeart className="h-5 w-5 text-red-400" />
          ) : (
            <FiHeart className="h-5 w-5" />
          )}
        </button>
      )}

      {/* Main content */}
      <div className="p-4 md:p-5">
        {/* Location */}
        <div className="mb-2">
          <h2 className="text-xl md:text-2xl font-bold">
            {weather.city}
          </h2>
          <p className="text-white/80 text-sm">{weather.country}</p>
        </div>

        {/* Temperature and icon */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-5xl md:text-6xl font-light">
              {formatTemperature(weather.temperature)}
            </p>
            <p className="text-white/80 capitalize text-sm mt-1">
              {weather.description}
            </p>
          </div>
          <img
            src={getWeatherIconUrl(weather.icon, '4x')}
            alt={weather.description}
            className="w-20 h-20 md:w-24 md:h-24"
          />
        </div>

        {/* Temperature range */}
        <div className="flex items-center space-x-3 mb-3 text-white/90 text-sm">
          <div className="flex items-center">
            <FiThermometer className="h-4 w-4 mr-1" />
            <span>H: {formatTemperature(weather.tempMax)}</span>
          </div>
          <div className="flex items-center">
            <FiThermometer className="h-4 w-4 mr-1" />
            <span>L: {formatTemperature(weather.tempMin)}</span>
          </div>
          <div className="text-white/70">
            Feels {formatTemperature(weather.feelsLike)}
          </div>
        </div>

        {/* Weather details grid */}
        {showDetails && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <FiDroplet className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-white/70">Humidity</p>
                <p className="font-semibold text-sm">{weather.humidity}%</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <FiWind className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-white/70">Wind</p>
                <p className="font-semibold text-sm">
                  {formatWindSpeed(weather.windSpeed)}{' '}
                  {getWindDirection(weather.windDeg)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <FiEye className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-white/70">Visibility</p>
                <p className="font-semibold text-sm">
                  {formatVisibility(weather.visibility)}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <FiThermometer className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-white/70">Pressure</p>
                <p className="font-semibold text-sm">{weather.pressure} hPa</p>
              </div>
            </div>
          </div>
        )}

        {/* Sunrise/Sunset */}
        {showDetails && (
          <div className="flex justify-center space-x-6 mt-3 pt-3 border-t border-white/20">
            <div className="flex items-center space-x-2">
              <FiSunrise className="h-4 w-4 text-yellow-300" />
              <div>
                <p className="text-xs text-white/70">Sunrise</p>
                <p className="font-semibold text-sm">
                  {formatTime(weather.sunrise, weather.timezone)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <FiSunset className="h-4 w-4 text-orange-300" />
              <div>
                <p className="text-xs text-white/70">Sunset</p>
                <p className="font-semibold text-sm">
                  {formatTime(weather.sunset, weather.timezone)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
