import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore, { MockStoreEnhanced } from 'redux-mock-store';
import thunk from 'redux-thunk';
import CityForm from '../../components/CityForm';

import { fetchCityWeather } from '../../store/weatherSlice';
import '@testing-library/jest-dom';
import { Store, UnknownAction } from '@reduxjs/toolkit';

// Mock Redux action
jest.mock('../../store/weatherSlice', () => ({
  fetchCityWeather: jest.fn(() => ({ type: 'mock/fetchCityWeather' })),
}));

const middlewares = [thunk];
const mockStore = configureStore(middlewares);

describe('CityForm Component', () => {
  let store: MockStoreEnhanced<unknown, {}> | Store<unknown, UnknownAction, unknown>;

  beforeEach(() => {
    store = mockStore({
      weather: {
        cities: [],
        status: 'idle',
        error: null,
      },
    });
    store.dispatch = jest.fn().mockResolvedValue({ payload: { id: 123 } });
    (fetchCityWeather as unknown as jest.Mock).mockClear();
  });

  test('renders form correctly', () => {
    render(
      <Provider store={store}>
        <CityForm />
      </Provider>
    );

    expect(screen.getByPlaceholderText('Enter city name')).toBeInTheDocument();
    expect(screen.getByText('Add City')).toBeInTheDocument();
  });

  test('updates input value on change', () => {
    render(
      <Provider store={store}>
        <CityForm />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter city name');
    fireEvent.change(input, { target: { value: 'London' } });
    
    expect(input).toHaveValue('London');
  });

  test('dispatches fetchCityWeather action on form submission', async () => {
    render(
      <Provider store={store}>
        <CityForm />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter city name');
    fireEvent.change(input, { target: { value: 'London' } });
    
    const button = screen.getByText('Add City');
    fireEvent.click(button);

    expect(fetchCityWeather).toHaveBeenCalledWith('London');
    expect(store.dispatch).toHaveBeenCalled();
    
    // Wait for state updates after successful dispatch
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  test('displays error message when API request fails', async () => {
    store.dispatch = jest.fn().mockRejectedValue(new Error('City not found'));
    
    render(
      <Provider store={store}>
        <CityForm />
      </Provider>
    );

    const input = screen.getByPlaceholderText('Enter city name');
    fireEvent.change(input, { target: { value: 'InvalidCity' } });
    
    const button = screen.getByText('Add City');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('City not found or API error. Please try again.')).toBeInTheDocument();
    });
  });

  test('does not submit form with empty input', () => {
    render(
      <Provider store={store}>
        <CityForm />
      </Provider>
    );
    
    const button = screen.getByText('Add City');
    fireEvent.click(button);

    expect(fetchCityWeather).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});