import React, { useState, useRef, useEffect } from 'react';
import { FiSearch, FiX, FiMapPin } from 'react-icons/fi';
import { useDebounce } from '../../hooks';
import { useLazySearchCitiesQuery } from '../../api';
import { useAppDispatch, useAppSelector, addToSearchHistory } from '../../store';
import { DEFAULT_CITIES } from '../../utils';

interface SearchBarProps {
  onSearch: (city: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  placeholder = 'Search for a city...',
}) => {
  const dispatch = useAppDispatch();
  const { searchHistory } = useAppSelector((state) => state.weather);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchCities, { data: searchResult, isFetching }] =
    useLazySearchCitiesQuery();

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      searchCities(debouncedQuery);
    }
  }, [debouncedQuery, searchCities]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query.trim());
    }
  };

  const handleSearch = (city: string) => {
    dispatch(addToSearchHistory(city));
    onSearch(city);
    setQuery('');
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <FiSearch className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="block w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white text-gray-900 placeholder-gray-400"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              <FiX className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Loading state */}
          {isFetching && (
            <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          )}

          {/* Search result */}
          {!isFetching && searchResult?.data && query.length >= 2 && (
            <button
              onClick={() =>
                handleSearch(`${searchResult.data?.name}, ${searchResult.data?.country}`)
              }
              className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors text-left"
            >
              <FiMapPin className="h-5 w-5 text-primary-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {searchResult.data.name}
                </p>
                <p className="text-xs text-gray-500">
                  {searchResult.data.state
                    ? `${searchResult.data.state}, `
                    : ''}
                  {searchResult.data.country}
                </p>
              </div>
            </button>
          )}

          {/* Search history */}
          {searchHistory.length > 0 && !query && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Recent Searches
                </p>
              </div>
              {searchHistory.slice(0, 5).map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(city)}
                  className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors text-left"
                >
                  <FiSearch className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-700">{city}</span>
                </button>
              ))}
            </>
          )}

          {/* Default cities */}
          {!query && searchHistory.length === 0 && (
            <>
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Popular Cities
                </p>
              </div>
              {DEFAULT_CITIES.map((city, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(city.name)}
                  className="w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors text-left"
                >
                  <FiMapPin className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-700">
                    {city.name}, {city.country}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
