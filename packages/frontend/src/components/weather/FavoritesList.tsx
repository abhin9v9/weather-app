import React from 'react';
import { FiTrash2, FiMapPin, FiChevronRight } from 'react-icons/fi';
import type { Favorite } from '../../types';

interface FavoritesListProps {
  favorites: Favorite[];
  onSelect: (favorite: Favorite) => void;
  onRemove: (id: string) => void;
  isRemoving?: string | null;
}

const FavoritesList: React.FC<FavoritesListProps> = ({
  favorites,
  onSelect,
  onRemove,
  isRemoving,
}) => {
  if (favorites.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <FiMapPin className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No favorite cities yet
        </h3>
        <p className="text-gray-500">
          Search for a city and click the heart icon to add it to your favorites.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">
          Favorite Cities
        </h3>
        <p className="text-sm text-gray-500">
          {favorites.length} {favorites.length === 1 ? 'city' : 'cities'} saved
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {favorites.map((favorite) => (
          <div
            key={favorite.id}
            className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors group"
          >
            <button
              onClick={() => onSelect(favorite)}
              className="flex-1 flex items-center text-left"
            >
              <div className="p-2 bg-primary-50 rounded-lg mr-4">
                <FiMapPin className="h-5 w-5 text-primary-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{favorite.city}</p>
                <p className="text-sm text-gray-500">{favorite.country}</p>
              </div>
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(favorite.id);
                }}
                disabled={isRemoving === favorite.id}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                aria-label="Remove from favorites"
              >
                {isRemoving === favorite.id ? (
                  <div className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiTrash2 className="h-5 w-5" />
                )}
              </button>
              <FiChevronRight className="h-5 w-5 text-gray-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FavoritesList;
