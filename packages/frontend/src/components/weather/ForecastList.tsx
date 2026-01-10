import React from 'react';
import type { ForecastData } from '../../types';
import {
  formatTemperature,
  formatDayName,
  formatDate,
  getWeatherIconUrl,
} from '../../utils';

interface ForecastListProps {
  forecast: ForecastData;
}

const ForecastList: React.FC<ForecastListProps> = ({ forecast }) => {
  // Group forecast by day (take one entry per day, around noon)
  const dailyForecast = forecast.list.filter((_item, index) => {
    // Get one forecast per day (every 8 items = 24 hours with 3-hour intervals)
    return index % 8 === 4; // Pick the noon forecast
  }).slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <h3 className="text-base font-semibold text-gray-900">5-Day Forecast</h3>
        <p className="text-xs text-gray-500">
          {forecast.city}, {forecast.country}
        </p>
      </div>
      
      <div className="divide-y divide-gray-100">
        {dailyForecast.map((item, index) => (
          <div
            key={item.dt}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors"
          >
            {/* Day */}
            <div className="flex-1">
              <p className="font-medium text-gray-900 text-sm">
                {index === 0 ? 'Today' : formatDayName(item.dt)}
              </p>
              <p className="text-xs text-gray-500">{formatDate(item.dt)}</p>
            </div>

            {/* Weather icon and description */}
            <div className="flex items-center space-x-2 flex-1 justify-center">
              <img
                src={getWeatherIconUrl(item.icon, '2x')}
                alt={item.description}
                className="w-10 h-10"
              />
              <span className="text-xs text-gray-600 capitalize hidden sm:block">
                {item.description}
              </span>
            </div>

            {/* Precipitation chance */}
            {item.pop > 0 && (
              <div className="text-xs text-blue-500 w-12 text-center">
                💧 {item.pop}%
              </div>
            )}

            {/* Temperature range */}
            <div className="flex items-center space-x-3 flex-1 justify-end">
              <span className="font-semibold text-gray-900 text-sm">
                {formatTemperature(item.tempMax)}
              </span>
              <span className="text-gray-400 text-sm">
                {formatTemperature(item.tempMin)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastList;
