/* eslint-disable @next/next/no-img-element */
import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { refreshCityWeather, removeCity } from "../store/weatherSlice";
import { City } from "../types/weather";
import Link from "next/link";
import styles from "@/styles/CityCard.module.scss";

interface CityCardProps {
  city: City;
}

const CityCard: React.FC<CityCardProps> = ({ city }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(refreshCityWeather(city.id));
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(removeCity(city.id));
  };

  if (!city.weather) {
    return <div className={styles.card}>Loading...</div>;
  }

  return (
    <Link href={`/${city.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <button
          className={styles.removeButton}
          onClick={handleRemove}
          aria-label="Remove city"
        >
          ×
        </button>
        <h2>
          {city.name}, {city.weather.sys.country}
        </h2>
        <div className={styles.weatherInfo}>
          <img
            src={`http://openweathermap.org/img/wn/${city.weather.weather[0].icon}@2x.png`}
            alt={city.weather.weather[0].description}
          />
          <div className={styles.temperature}>
            {Math.round(city.weather.main.temp)}°C
          </div>
        </div>
        <p>{city.weather.weather[0].description}</p>
        <div className={styles.details}>
          <div>
            <span>Humidity: {city.weather.main.humidity}%</span>
            <span>Wind: {city.weather.wind.speed} m/s</span>
          </div>
        </div>
        <button className={styles.refreshButton} onClick={handleRefresh}>
          Refresh Weather
        </button>
      </div>
    </Link>
  );
};

export default CityCard;
