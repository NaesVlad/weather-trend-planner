import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import { processForecast, getInsight } from './utils';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './App.css'; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);

  const handleSearch = async () => {
    const API_KEY = 'cd0760ecb1356c829b3e920a794c6187'; 
    try {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
      if (!response.ok) throw new Error("City not found"); 
      const data = await response.json();
      
      const daily = processForecast(data);
      setWeather({
        name: data.city.name,
        temp: data.list[0].main.temp,
        condition: data.list[0].weather[0].main,
        daily: daily,
        insight: getInsight(daily, data.list[0].main.temp)
      });
    } catch (err) { alert(err.message); }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', fontFamily: 'Arial' }}>
      <h1 style={{ textAlign: 'center' }}>Weather Trend Planner</h1>
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span>Enter city: </span>
        <input 
          type="text" 
          placeholder="e.g. London" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
          style={{ padding: '8px', border: '1px solid black', flex: 1 }}
        />
        <button 
          onClick={handleSearch} 
          style={{ padding: '8px 20px', border: '1px solid black', cursor: 'pointer', background: '#eee' }}
        >
          Search
        </button>
      </div>

      {weather && (
        <div className="results-container">
          <div style={{ border: '1px solid black', padding: '15px', marginBottom: '20px' }}>
            <h2 style={{ textDecoration: 'underline', marginTop: 0 }}>{weather.name}</h2> 
            <p><strong>Temperature:</strong> {Math.round(weather.temp)}°C</p> 
            <p><strong>Condition:</strong> {weather.condition}</p> 
          </div>

          <div style={{ border: '1px solid black', padding: '15px', marginBottom: '20px' }}>
            <h3 style={{ textDecoration: 'underline', marginTop: 0 }}>Temperature Trend</h3>
            <div style={{ height: '300px' }}>
              <Line 
                data={{
                  labels: weather.daily.map(d => d.date),
                  datasets: [{ 
                    label: 'Temp (°C)', 
                    data: weather.daily.map(d => d.temp), 
                    borderColor: '#000000',
                    backgroundColor: '#000000',
                    borderWidth: 2,
                    pointRadius: 4,
                    tension: 0.1
                  }]
                }} 
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>

          <div style={{ border: '1px solid black', padding: '15px', background: '#f9f9f9' }}>
            <p style={{ margin: 0 }}><strong>Insight:</strong> {weather.insight}</p> 
          </div>
        </div>
      )}
    </div>
  );
}

export default App;