'use client';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import CityCard from '../components/CityCard';
import CityForm from '../components/CityForm';
import styles from '@/styles/home.module.scss';

export default function Home() {
  const { cities } = useSelector((state: RootState) => state.weather);
  // const dispatch = useDispatch<AppDispatch>();

  // Save cities to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('weatherCities', JSON.stringify(cities));
  }, [cities]);
  useEffect(() => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("[SW] registered", reg))
        .catch((err) => console.error("[SW] registration failed", err));
    });
  }
}, []);

  return (
    <main className={styles.main}>
      <section className={styles.header}>
        <h1>Weather App</h1>
        <p>Check the weather in your favorite cities</p>
        <CityForm />
      </section>

      <section className={styles.citiesGrid}>
        {cities.length === 0 ? (
          <p className={styles.noCities}>
            No cities added yet. Add a city to see the weather!
          </p>
        ) : (
          cities.map(city => (
            <CityCard key={city.id} city={city} />
          ))
        )}
      </section>
    </main>
  );
}
