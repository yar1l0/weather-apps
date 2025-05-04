/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { City } from '../types/weather';
import HourlyChart from './HourlyChart';
import styles from '../styles/WeatherDetails.module.scss';

interface WeatherDetailsProps {
  city: City;
}

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ city }) => {
  if (!city.weather) return <div>Loading...</div>;

  const sunriseTime = new Date(city.weather.sys.sunrise * 1000).toLocaleTimeString();
  const sunsetTime = new Date(city.weather.sys.sunset * 1000).toLocaleTimeString();
  const updateTime = new Date(city.weather.dt * 1000).toLocaleString();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{city.name}, {city.weather.sys.country}</h1>
        <div className={styles.mainWeather}>
          <img 
            src={`http://openweathermap.org/img/wn/${city.weather.weather[0].icon}@4x.png`}
            alt={city.weather.weather[0].description}
          />
          <div className={styles.temperature}>
            {Math.round(city.weather.main.temp)}°C
          </div>
        </div>
        <p className={styles.description}>
          {city.weather.weather[0].description}
        </p>
      </div>

      <div className={styles.details}>
        <div className={styles.detailItem}>
          <span>Feels Like</span>
          <strong>{Math.round(city.weather.main.feels_like)}°C</strong>
        </div>
        <div className={styles.detailItem}>
          <span>Humidity</span>
          <strong>{city.weather.main.humidity}%</strong>
        </div>
        <div className={styles.detailItem}>
          <span>Wind</span>
          <strong>{city.weather.wind.speed} m/s</strong>
        </div>
        <div className={styles.detailItem}>
          <span>Pressure</span>
          <strong>{city.weather.main.pressure} hPa</strong>
        </div>
        <div className={styles.detailItem}>
          <span>Sunrise</span>
          <strong>{sunriseTime}</strong>
        </div>
        <div className={styles.detailItem}>
          <span>Sunset</span>
          <strong>{sunsetTime}</strong>
        </div>
      </div>

      {city.hourlyForecast && city.hourlyForecast.length > 0 && (
        <div className={styles.chartContainer}>
          <h2>Hourly Forecast</h2>
          <HourlyChart hourlyData={city.hourlyForecast} />
        </div>
      )}

      <p className={styles.updateTime}>Last updated: {updateTime}</p>
    </div>
  );
};

export default WeatherDetails;