import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { City } from '../types/weather';
import { fetchWeatherByCity, fetchHourlyForecast } from '../services/weatherAPI';
import { store } from './store';

interface WeatherState {
  cities: City[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: WeatherState = {
  cities: [],
  status: 'idle',
  error: null
};

export const fetchCityWeather = createAsyncThunk(
  'weather/fetchCityWeather',
  async (cityName: string) => {
    const data = await fetchWeatherByCity(cityName);
    return data;
  }
);

export const refreshCityWeather = createAsyncThunk(
  'weather/refreshCityWeather',
  async (cityId: number) => {
    const city = store.getState().weather.cities.find(c => c.id === cityId);
    if (!city) throw new Error('City not found');
    
    const data = await fetchWeatherByCity(city.name);
    return data;
  }
);

export const fetchCityHourlyForecast = createAsyncThunk(
  'weather/fetchCityHourlyForecast',
  async (cityId: number) => {
    const forecast = await fetchHourlyForecast(cityId);
    return { cityId, forecast };
  }
);

const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    loadCitiesFromStorage(state, action: PayloadAction<City[]>) {
      state.cities = action.payload;
    },
    removeCity(state, action: PayloadAction<number>) {
      state.cities = state.cities.filter(city => city.id !== action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCityWeather.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCityWeather.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // Check if the city already exists
        const cityExists = state.cities.some(city => city.id === action.payload.id);
        
        if (!cityExists) {
          state.cities.push({
            id: action.payload.id,
            name: action.payload.name,
            weather: action.payload
          });
        }
      })
      .addCase(fetchCityWeather.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      })
      .addCase(refreshCityWeather.fulfilled, (state, action) => {
        const index = state.cities.findIndex(city => city.id === action.payload.id);
        if (index !== -1) {
          state.cities[index].weather = action.payload;
        }
      })
      .addCase(fetchCityHourlyForecast.fulfilled, (state, action) => {
        const index = state.cities.findIndex(city => city.id === action.payload.cityId);
        if (index !== -1) {
          state.cities[index].hourlyForecast = action.payload.forecast;
        }
      });
  }
});

export const { loadCitiesFromStorage, removeCity } = weatherSlice.actions;
export default weatherSlice.reducer;