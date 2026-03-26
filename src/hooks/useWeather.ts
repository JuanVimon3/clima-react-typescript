import axios from "axios"
import type { SearchType, Weather } from "../types";


//Type guard o assertion function para verificar que el resultado de la consulta es del tipo WeatherResult, si no es del tipo WeatherResult se lanza un error.
function isWeatherResponse(weather: unknown): weather is Weather {
 return(
    Boolean(weather) &&
    typeof weather === 'object' &&
    typeof (weather as Weather).name === 'string' &&
    typeof (weather as Weather).main.temp === 'number' &&
    typeof (weather as Weather).main.temp_min === 'number' &&
    typeof (weather as Weather).main.temp_max === 'number'
 )
}

export default function useWeather() {

    const fetchWeather = async (search: SearchType) => {
       try {
        
        const appId = import.meta.env.VITE_API_KEY;

        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country},${search.country}&appid=${appId}`

        const {data} = await axios.get(geoUrl);

        console.log(data);

        const lat = data[0].lat; 
        const lon = data[0].lon;

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

        //Castear el resultado a WeatherResult para que TypeScript sepa que tipo de datos va a recibir
        // const {data: wheatherResult } = await axios.get<WeatherResult>(weatherUrl);
        // console.log(wheatherResult.main.temp);
        // console.log(wheatherResult.name); 

        //Type guard para verificar que el resultado de la consulta es del tipo WeatherResult por medio de la funcion isWeatherResponse, si no es del tipo WeatherResult se lanza un error.
        const {data: wheatherResult } = await axios.get(weatherUrl);
        const result = isWeatherResponse(wheatherResult)

        console.log(result);
    } catch (error) {
        console.log(error);
       }
    }

    return{
        fetchWeather
    }
}