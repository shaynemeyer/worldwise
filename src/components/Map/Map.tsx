import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Map.module.css';
function Map() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return (
    <div className={styles.mapContainer} onClick={() => navigate('form')}>
      <h1>Map</h1>
      {lat && lng ? (
        <h1>
          Position: {lat}, {lng}
        </h1>
      ) : null}

      <button
        onClick={() => {
          setSearchParams({
            lat: '40.7127',
            lng: '-73.9874',
          });
        }}
      >
        Change position
      </button>
    </div>
  );
}

export default Map;
