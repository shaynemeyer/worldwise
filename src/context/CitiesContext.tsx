import {
  createContext,
  useContext,
  useEffect,
  useReducer,
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
  error: string;
}

const CitiesContext = createContext<CitiesContextProps>({
  cities: [],
  isLoading: false,
  currentCity: undefined,
  getCity: async () => undefined,
  createCity: () => undefined,
  deleteCity: () => undefined,
  error: ""
});

interface CitiesState {
  cities: Array<CityListItem>;
  isLoading: boolean;
  currentCity?: CityListItem;
  error: string;
}

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: undefined,
  error: ''
} as CitiesState;

type CitiesLoading = { type: 'loading' };
type CitiesLoaded = { type: 'cities/loaded'; payload: Array<CityListItem> };
type CityLoaded = { type: 'city/loaded'; payload: CityListItem };
type CityCreated = { type: 'city/created'; payload: CityListItem };
type CityDeleted = { type: 'city/deleted'; payload: number };
type Rejected = { type: 'rejected'; payload: string };

type CitiesAction = CitiesLoading | CitiesLoaded | CityLoaded | CityCreated | CityDeleted | Rejected;

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
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload
      }
    case 'city/created':
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload
      }
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter(c => c.id !== action.payload),
        currentCity: undefined
      }
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload
      }
    default:
      throw new Error('Action unknown');
  }
}

function CitiesProvider({ children }: { children: React.ReactNode }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

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
      } catch  {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      } 
    }

    fetchCities();
  }, []);

  async function getCity(id: string) {
    if (currentCity && Number(id) === currentCity.id) return;

    dispatch({ type: "loading" });
    
    try {
      
      const result = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await result.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error loading the city...",
      });
    } 
  }

  async function createCity(newCity: CityListItem) {
    dispatch({ type: "loading" });
    try {
      const result = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCity),
      });
      const data = await result.json();

      dispatch({ type: "city/created", payload: data });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  async function deleteCity(id: string) {
    dispatch({ type: "loading" });

    try {
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: "city/deleted", payload: Number(id) });
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
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
