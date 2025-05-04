import { HourlyForecast, WeatherData } from "@/types/weather";

const API_KEY = '45fb8ac15c85d0d789b820131ab50410';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const fetchWeatherByCity = async (cityName: string): Promise<WeatherData> => {
  const response = await fetch(
    `${BASE_URL}/weather?q=${cityName}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('City not found or API error');
  }
  
  return await response.json();
};

export const fetchHourlyForecast = async (cityId: number): Promise<HourlyForecast[]> => {
  const response = await fetch(
    `${BASE_URL}/forecast?id=${cityId}&units=metric&appid=${API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch hourly forecast');
  }
  
  const data = await response.json();
  // Filter to get only today's forecast (next 24 hours)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return data.list.filter((item: HourlyForecast) => {
    const date = new Date(item.dt * 1000);
    return date < tomorrow;
  });
};