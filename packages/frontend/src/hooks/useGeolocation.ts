import { useState, useEffect } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  isLoading: boolean;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

export const useGeolocation = (options: UseGeolocationOptions = {}) => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    isLoading: true,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        latitude: null,
        longitude: null,
        error: 'Geolocation is not supported by your browser',
        isLoading: false,
      });
      return;
    }

    const geoOptions: PositionOptions = {
      enableHighAccuracy: options.enableHighAccuracy ?? false,
      timeout: options.timeout ?? 10000,
      maximumAge: options.maximumAge ?? 0,
    };

    const onSuccess = (position: GeolocationPosition) => {
      setState({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        isLoading: false,
      });
    };

    const onError = (error: GeolocationPositionError) => {
      let errorMessage = 'Failed to get location';

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Location permission denied';
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Location information unavailable';
          break;
        case error.TIMEOUT:
          errorMessage = 'Location request timed out';
          break;
      }

      setState({
        latitude: null,
        longitude: null,
        error: errorMessage,
        isLoading: false,
      });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError, geoOptions);
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

  const refresh = () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          isLoading: false,
        });
      },
      (error) => {
        setState((prev) => ({
          ...prev,
          error: error.message,
          isLoading: false,
        }));
      }
    );
  };

  return { ...state, refresh };
};
