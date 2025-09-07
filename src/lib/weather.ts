
'use server';

// A mapping from WMO weather codes to human-readable descriptions
const weatherCodeMap: { [code: number]: string } = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
};


export interface WeatherData {
    current: {
        temperature: number;
        apparentTemperature: number;
        humidity: number;
        windSpeed: number;
        weatherCode: number;
        weatherDescription: string;
        visibility: number;
    };
    daily: {
        time: string[];
        weatherCode: number[];
        temperatureMax: number[];
        temperatureMin: number[];
        uvIndexMax: number[];
    };
}

export interface WeatherDataWithLocation extends WeatherData {
  error?: string;
  locationName: string;
}


// Fallback data in case the API fails
const getMockWeatherData = (errorMsg: string): WeatherDataWithLocation => ({
    locationName: "Springfield, IL (Mock Data)",
    error: errorMsg,
    current: {
        temperature: 72,
        apparentTemperature: 70,
        humidity: 55,
        windSpeed: 10,
        weatherCode: 2,
        weatherDescription: "Partly cloudy",
        visibility: 16093, // 10 miles in meters
    },
    daily: {
        time: ["2024-08-01", "2024-08-02", "2024-08-03", "2024-08-04", "2024-08-05", "2024-08-06", "2024-08-07"],
        weatherCode: [2, 1, 61, 3, 2, 1, 80],
        temperatureMax: [75, 78, 70, 72, 77, 80, 76],
        temperatureMin: [60, 62, 58, 55, 61, 63, 60],
        uvIndexMax: [5, 6, 4, 3, 7, 8, 5],
    },
});


export async function getWeatherData(lat: number, lon: number, locationName?: string): Promise<WeatherDataWithLocation> {
    const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,visibility&daily=weather_code,temperature_2m_max,temperature_2m_min,uv_index_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto`;

    try {
        const response = await fetch(apiUrl, { next: { revalidate: 3600 } }); // Revalidate every hour
        if (!response.ok) {
            throw new Error(`Weather API request failed with status ${response.status}`);
        }
        const data = await response.json();

        let finalLocationName = locationName;
        if (!finalLocationName) {
            const geoResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?latitude=${lat}&longitude=${lon}&count=1`);
            const geoData = await geoResponse.json();
            finalLocationName = geoData.results?.[0]?.name ? `${geoData.results[0].name}, ${geoData.results[0].admin1 || ''}`.replace(/, $/, '') : "Unknown Location";
        }


        return {
            locationName: finalLocationName,
            current: {
                temperature: data.current.temperature_2m,
                apparentTemperature: data.current.apparent_temperature,
                humidity: data.current.relative_humidity_2m,
                windSpeed: data.current.wind_speed_10m,
                weatherCode: data.current.weather_code,
                weatherDescription: weatherCodeMap[data.current.weather_code] || "Unknown",
                visibility: data.current.visibility,
            },
            daily: {
                time: data.daily.time,
                weatherCode: data.daily.weather_code,
                temperatureMax: data.daily.temperature_2m_max,
                temperatureMin: data.daily.temperature_2m_min,
                uvIndexMax: data.daily.uv_index_max,
            }
        };

    } catch (error) {
        console.error("Failed to fetch weather data:", error);
        return getMockWeatherData(error instanceof Error ? error.message : String(error));
    }
}


export async function getWeatherDataForCity(city: string): Promise<WeatherDataWithLocation> {
  try {
    const geoApiUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoApiUrl);
    if (!geoResponse.ok) {
      throw new Error(`Geocoding API request failed with status ${geoResponse.status}`);
    }
    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      throw new Error(`City "${city}" not found.`);
    }

    const { latitude, longitude } = geoData.results[0];
    const locationName = geoData.results[0]?.name ? `${geoData.results[0].name}, ${geoData.results[0].admin1 || ''}`.replace(/, $/, '') : "Unknown Location";

    return getWeatherData(latitude, longitude, locationName);
    
  } catch (error) {
    console.error(`Failed to get weather for city ${city}:`, error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { 
        ...getMockWeatherData(errorMessage), 
        error: errorMessage,
        locationName: "Error"
    };
  }
}
