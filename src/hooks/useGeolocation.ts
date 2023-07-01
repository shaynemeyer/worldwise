import { LatLngTuple } from 'leaflet';
import { useState } from 'react';

export function useGeolocation(defaultPosition: LatLngTuple | null = null) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    defaultPosition
      ? { lat: defaultPosition[0], lng: defaultPosition[1] }
      : null
  );
  const [error, setError] = useState<string | null>(null);

  function getPosition() {
    if (!navigator.geolocation)
      return setError('Your browser does not support geolocation');

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLoading(false);
      },
      (error) => {
        setError(error.message);
        setIsLoading(false);
      }
    );
  }

  return { isLoading, position, error, getPosition };
}
