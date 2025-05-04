/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { HourlyForecast } from '../types/weather';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from '../styles/HourlyChart.module.scss';

interface HourlyChartProps {
  hourlyData: HourlyForecast[];
}


const HourlyChart: React.FC<HourlyChartProps> = ({ hourlyData }) => {
  const chartData = hourlyData.map(hour => ({
    time: new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    temp: Math.round(hour.main.temp),
    description: hour.weather[0].description,
    icon: hour.weather[0].icon
  }));

  // Find min and max temperatures for chart bounds
  const minTemp = Math.min(...chartData.map(item => item.temp)) - 2;
  const maxTemp = Math.max(...chartData.map(item => item.temp)) + 2;

  // Custom tooltip component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={styles.tooltip}>
          <p>{`${label}`}</p>
          <p>{`Temperature: ${data.temp}°C`}</p>
          <p>{data.description}</p>
          <img 
            src={`http://openweathermap.org/img/wn/${data.icon}.png`} 
            alt={data.description} 
          />
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.chartWrapper}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="time" 
            padding={{ left: 20, right: 20 }}
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
          />
          <YAxis 
            domain={[minTemp, maxTemp]} 
            label={{ value: 'Temperature (°C)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="temp" 
            stroke="#1e90ff" 
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default HourlyChart;