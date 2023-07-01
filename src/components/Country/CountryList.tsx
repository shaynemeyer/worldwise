import Message from '../Message/Message';
import Spinner from '../Spinner/Spinner';
import styles from './CountryList.module.css';
import CountryItem from './CountryItem';
import { useCities } from '../../context/CitiesContext';

interface CountryItemType {
  country: string;
  emoji: string;
}

function CountryList() {
  const { cities, isLoading } = useCities();
  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />;

  const countries: CountryItemType[] = [];

  cities.forEach((city) => {
    if (!countries.map((c) => c.country).includes(city.country)) {
      countries.push({ country: city.country, emoji: city.emoji });
    }
  });

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => (
        <CountryItem country={country} key={country.country} />
      ))}
    </ul>
  );
}

export default CountryList;
