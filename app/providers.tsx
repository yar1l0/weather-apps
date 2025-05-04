'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import { useEffect } from 'react';
import { loadCitiesFromStorage, refreshCityWeather } from '../store/weatherSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StorageInitializer>
        {children}
      </StorageInitializer>
    </Provider>
  );
}

// Component to initialize data from localStorage
function StorageInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Load cities from localStorage
    try {
      const savedCities = localStorage.getItem('weatherCities');
      if (savedCities) {
        const cities = JSON.parse(savedCities);
        dispatch(loadCitiesFromStorage(cities));
        
        // Refresh weather data for all cities
        cities.forEach((city: { id: number }) => {
          dispatch(refreshCityWeather(city.id));
        });
      }
    } catch (error) {
      console.error('Failed to load cities from localStorage:', error);
    }
  }, [dispatch]);

  return <>{children}</>;
}