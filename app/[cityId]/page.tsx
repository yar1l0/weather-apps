'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useRouter } from 'next/navigation';
import { RootState, AppDispatch } from '../../store/store';
import { fetchCityHourlyForecast, refreshCityWeather } from '../../store/weatherSlice';
import WeatherDetails from '../../components/WeatherDetails';
import Link from 'next/link';
import styles from '@/styles/IdPage.module.scss';

export default function CityPage() {
  const { cityId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { cities } = useSelector((state: RootState) => state.weather);
  
  // Convert cityId to number
  const id = parseInt(cityId as string, 10);
  
  // Find the city in the state
  const city = cities.find(c => c.id === id);
  
  useEffect(() => {
    // If city doesn't exist in the store, redirect to home
    if (!city && cities.length > 0) {
      router.push('/');
      return;
    }
    
    // Refresh weather data and fetch hourly forecast
    if (city) {
      dispatch(refreshCityWeather(city.id));
      dispatch(fetchCityHourlyForecast(city.id));
    }
  }, [cityId, dispatch, router, cities.length]);

  if (!city) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          ← Back to Cities
        </Link>
        <button 
          className={styles.refreshButton} 
          onClick={() => {
            dispatch(refreshCityWeather(city.id));
            dispatch(fetchCityHourlyForecast(city.id));
          }}
        >
          Refresh Data
        </button>
      </header>
      <WeatherDetails city={city} />
    </div>
  );
}