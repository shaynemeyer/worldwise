import { CityListItem } from '../../../types/Cities';
import { useCities } from '../../context/CitiesContext';
import Message from '../Message/Message';
import Spinner from '../Spinner/Spinner';
import CityItem from './CityItem';
import styles from './CityList.module.css';

function CityList() {
  const { cities, isLoading } = useCities();

  if (isLoading) return <Spinner />;

  if (!cities.length)
    return <Message message="Add your first city by clicking on the map" />;

  return (
    <ul className={styles.cityList}>
      {cities.map((city: CityListItem) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
