import { useMemo, useState } from "react";
import axios from "axios"
import { z } from "zod";
// import {object, string, number, Output, parse} from "valibot"
import type { SearchType } from "../types";


//Type guard o assertion function para verificar que el resultado de la consulta es del tipo WeatherResult, si no es del tipo WeatherResult se lanza un error.
// function isWeatherResponse(weather: unknown): weather is Weather {
//  return(
//     Boolean(weather) &&
//     typeof weather === 'object' &&
//     typeof (weather as Weather).name === 'string' &&
//     typeof (weather as Weather).main.temp === 'number' &&
//     typeof (weather as Weather).main.temp_min === 'number' &&
//     typeof (weather as Weather).main.temp_max === 'number'
//  )
// }

//Zod

const Weather = z.object({
    name: z.string(),
    main: z.object({
        temp: z.number(),
        temp_min: z.number(),
        temp_max: z.number()
    })
});

export type Weather = z.infer<typeof Weather>;

//Valibot

// const WeatherSchema = object({
//     name: string(),
//     main: object({
//         temp: number(),
//         temp_min: number(),
//         temp_max: number()
//     }) 
// })

// type Weather = Output<typeof WeatherSchema>;

const initialState: Weather = {
        name : '',
        main: {
            temp: 0,
            temp_min: 0,
            temp_max: 0
        }
}

export default function useWeather() {

    const [weather, setWeather] = useState<Weather>(initialState);
    const [loading, setLoading] = useState<boolean>(false); 
    const [notFound, setNotFound] = useState<boolean>(false);


    const fetchWeather = async (search: SearchType) => {
        setLoading(true);
        setWeather(initialState);
       try {
        
        const appId = import.meta.env.VITE_API_KEY;

        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${search.city},${search.country},${search.country}&appid=${appId}`

        const {data} = await axios.get(geoUrl);

        console.log(data);

        //Comprobar si existe la ciudad consultada, si no existe se lanza un error.
        if(!data[0]){
            setNotFound(true);
            return;
        }

        const lat = data[0].lat; 
        const lon = data[0].lon;

        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${appId}`;

        //Castear el resultado a WeatherResult para que TypeScript sepa que tipo de datos va a recibir
        // const {data: wheatherResult } = await axios.get<WeatherResult>(weatherUrl);
        // console.log(wheatherResult.main.temp);
        // console.log(wheatherResult.name); 

        //Type guard para verificar que el resultado de la consulta es del tipo WeatherResult por medio de la funcion isWeatherResponse, si no es del tipo WeatherResult se lanza un error.
        // const {data: wheatherResult } = await axios.get(weatherUrl);
        // const result = isWeatherResponse(wheatherResult)

        // console.log(result);

        //Zod

        const {data: wheatherResult } = await axios.get(weatherUrl);
        const result = Weather.safeParse(wheatherResult); 
        console.log(result);
        if(result.success){
            setWeather(result.data); 
        } else{
            console.log('Respuesta no valida');
        }

        //Valibot

        // const {data: wheatherResult } = await axios.get(weatherUrl);
        // const result = parse(WeatherSchema, wheatherResult);
        
        // if(result){
        //     console.log(result.name);
        //     console.log(result.main.temp); 
        // } else{
        //     console.log('Respuesta no valida');
        // }

    } catch (error) {
        console.log(error);
       } finally{
        setLoading(false);
       }
    }

    const hasWeatherData = useMemo(() => weather.name , [weather]);

    return{
        weather,
        loading,
        notFound,
        fetchWeather,
        hasWeatherData
    }
}