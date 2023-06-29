import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Product from './pages/Product';
import Pricing from './pages/Pricing';
import Homepage from './pages/Homepage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import AppLayout from './pages/AppLayout';
import CityList from './components/City/CityList';
import { useEffect, useState } from 'react';
import { CityListItem } from '../types/Cities';

const BASE_URL = "http://localhost:9000";

function App() {
  const [cities, setCities] = useState<CityListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="login" element={<Login />} />
        <Route path='app' element={<AppLayout />}>
          <Route index element={<CityList cities={cities} isLoading={isLoading}/>} />
          <Route path="cities" element={<CityList cities={cities} isLoading={isLoading} />} />
          <Route path="countries" element={<p>List of countries</p>} />
          <Route path="form" element={<p>Form</p>} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
