import React, { useEffect, useState } from 'react';
import { API_KEY } from '../../config/config';
import './WeatherCard.css';
import { format, parseISO } from 'date-fns'; // Import date-fns functions
import '../Card.css';

function WeatherCard() {
    const [city, setCity] = useState('');
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState('');

    const fetchWeather = async () => {
        try {
            const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`);
            if (!response.ok) {
                throw new Error('City not found');
            }
            const data = await response.json();
            setWeather(data);
            setError('');
        } catch (err) {
            setError(err.message);
            setWeather(null);
        }
    };

    useEffect(() => {
        if (city) {
            fetchWeather();
        }
    }, [city]);

    return (
        <div className="card">
            <div className="input-container">
                <input 
                    type="text" 
                    value={city}
                    onChange={(e) => setCity(e.target.value)} 
                    placeholder="Enter city" 
                />
            </div>
            <div className="card-header">Weather</div>
                
            {error && <p>{error}</p>}
            {weather && (
                <div className="card-body">
                    <div className="card-date">
                        <div className="day">{weather.current.last_updated ? format(parseISO(weather.current.last_updated), 'EEEE') : 'N/A'}</div>
                        <div className="date">{weather.current.last_updated ? format(parseISO(weather.current.last_updated), 'MMM d, yyyy') : 'N/A'}</div>
                    </div>
                    <div className="weather">
                        <div className="temp">
                            <div className="value">{weather.current.temp_c}</div>
                            <div className="unit">
                                <span>&#176;</span>C
                            </div>
                        </div>
                        <div className="weather-img">
                            <img src={`http://${weather.current.condition.icon}`} alt={weather.current.condition.text} />
                            <span className="status">{weather.current.condition.text}</span>
                        </div>
                    </div>
                    <div className="location">
                        <span className="place">{weather.location.name}, {weather.location.country}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WeatherCard;
