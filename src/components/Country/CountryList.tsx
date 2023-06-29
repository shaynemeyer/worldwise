import { CityListItem } from '../../../types/Cities';
import Message from '../Message/Message';
import Spinner from '../Spinner/Spinner';
import styles from './CountryList.module.css';
import CountryItem from './CountryItem';

interface CountryListProps {
  cities: CityListItem[];
  isLoading: boolean;
}

interface CountryItemType {
  country: string;
  emoji: string;
}

function CountryList({ cities, isLoading }: CountryListProps) {
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
