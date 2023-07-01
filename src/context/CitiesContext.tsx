import { createContext, useContext, useEffect, useState } from 'react';
import { CityListItem } from '../../types/Cities';

const BASE_URL = 'http://localhost:9000';

interface CitiesContextProps {
  cities: Array<CityListItem>;
  isLoading: boolean;
  currentCity?: CityListItem;
  getCity: (id: string) => Promise<CityListItem | void>;
}

const CitiesContext = createContext<CitiesContextProps>({
  cities: [],
  isLoading: false,
  currentCity: undefined,
  getCity: async () => undefined,
});

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [cities, setCities] = useState<CityListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCity, setCurrentCity] = useState<CityListItem>();

  useEffect(() => {
    async function fetchCities() {
      try {
        setIsLoading(true);
        const result = await fetch(`${BASE_URL}/cities`);
        const data = await result.json();
        setCities([...data]);
      } catch (err) {
        alert('Error fetching cities');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCities();
  }, []);

  async function getCity(id: string) {
    try {
      setIsLoading(true);
      const result = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await result.json();
      setCurrentCity(data);
    } catch (err) {
      alert('Error fetching city');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider value={{ cities, isLoading, currentCity, getCity }}>
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error('CitiesContext was used outside the CitiesProvider');
  }
  return context;
}

export { CitiesProvider, useCities };
