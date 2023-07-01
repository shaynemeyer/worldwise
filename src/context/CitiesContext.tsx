import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { CityListItem } from '../../types/Cities';

const BASE_URL = 'http://localhost:9000';

interface CitiesContextProps {
  cities: Array<CityListItem>;
  isLoading: boolean;
  currentCity?: CityListItem;
  getCity: (id: string) => Promise<CityListItem | void>;
  createCity: (newCity: CityListItem) => void;
  deleteCity: (id: string) => void;
}

const CitiesContext = createContext<CitiesContextProps>({
  cities: [],
  isLoading: false,
  currentCity: undefined,
  getCity: async () => undefined,
  createCity: () => undefined,
  deleteCity: () => undefined,
});

interface CitiesState {
  cities: Array<CityListItem>;
  isLoading: boolean;
  currentCity?: CityListItem;
}

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: undefined,
} as CitiesState;

type CitiesLoading = { type: 'loading' };
type CitiesLoaded = { type: 'cities/loaded'; payload: Array<CityListItem> };

type CitiesAction = CitiesLoading | CitiesLoaded;

function reducer(state: CitiesState, action: CitiesAction) {
  switch (action.type) {
    case 'loading':
      return { ...state, isLoading: true };
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    // case 'cities/created':

    // case 'cities/deleted':

    // case 'rejected:
  }
}

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  // const [cities, setCities] = useState<CityListItem[]>([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState<CityListItem>();

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        const result = await fetch(`${BASE_URL}/cities`);
        const data = await result.json();

        dispatch({
          type: 'cities/loaded',
          payload: data,
        });
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

  async function createCity(newCity: CityListItem) {
    try {
      setIsLoading(true);
      const result = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });
      const data = await result.json();

      setCities([...cities, data]);
    } catch (err) {
      alert('Error creating city');
    } finally {
      setIsLoading(false);
    }
  }

  async function deleteCity(id: string) {
    try {
      setIsLoading(true);
      const result = await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      setCities(cities.filter((city) => city.id !== Number(id)));
    } catch (err) {
      alert('Error deleting city');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
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
