import { type Weather } from "../../hooks/useWeather";
import { formatTemperature } from "../../utils";

type WeatherDetailProps = {
    weather: Weather;
}

export default function WeatherDetail({weather} : WeatherDetailProps) {
  return ( 
    <div>
        <h2>Clima de: {weather.name}</h2>
        <p>Temperatura: {formatTemperature(weather.main.temp)}&Deg;C</p>
        <div>
            <p>Min: <span>{formatTemperature(weather.main.temp_min)}</span></p>
            <p>Max: <span>{formatTemperature(weather.main.temp_max)}</span></p>
        </div>
    </div>
  )
}
