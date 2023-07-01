import { Link } from 'react-router-dom';
import { CityListItem } from '../../../types/Cities';
import { formatDate } from './City';
import styles from './CityItem.module.css';
import { useCities } from '../../context/CitiesContext';

interface CityItemProps {
  city: CityListItem;
}

function CityItem({ city }: CityItemProps) {
  const { currentCity, deleteCity } = useCities();

  const { cityName, emoji, date, id, position } = city;

  function handleDelete(event: React.SyntheticEvent<HTMLButtonElement>) {
    event.preventDefault();
    if (id) {
      console.log('Delete', id);
      deleteCity(`${id}`);
    }
  }

  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity?.id ? styles['cityItem--active'] : ''
        }`}
        to={`${id}?lat=${position.lat}&lng=${position.lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDelete}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
