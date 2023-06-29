import { CityListItem } from '../../../types/Cities';
import Message from '../Message/Message';
import Spinner from '../Spinner/Spinner';
import styles from './CountryList.module.css';
import CountryItem from './CountryItem';

interface CountryListProps {
  cities: CityListItem[];
  isLoading: boolean;
}

interface CountryItemType{
  country: string;
  emoji: string;
}

function CountryList({ cities, isLoading} : CountryListProps) {
  
  if (isLoading) return <Spinner />;

  if (!cities.length) return <Message message='Add your first city by clicking on the map' />;
  
  const countries = cities.reduce((arr: CountryItemType[], city) => {
    if (!arr.map((el: CityListItem) => el.country).includes(city.country)) {
      return [...arr, { country: city.country, emoji: city.emoji}] as unknown as CountryItemType;
    }

    return arr as unknown as CountryItemType[];
  },  []) as unknown as Array<CountryItemType>;

  return (
    <ul className={styles.countryList}>
      {countries.map((country) => <CountryItem country={country} key={country.country} />)}
    </ul>
  )
}

export default CountryList