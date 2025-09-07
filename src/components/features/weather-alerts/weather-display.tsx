
"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Sun, Cloud, CloudRain, CloudSnow, Sunrise, Sunset, Eye } from "lucide-react";
import type { WeatherData } from "@/lib/weather";
import { format } from 'date-fns';

// A mapping from WMO weather codes to icons and descriptions
const weatherCodeMap: { [code: number]: { description: string; icon: React.ElementType } } = {
  0: { description: "Clear sky", icon: Sun },
  1: { description: "Mainly clear", icon: Sun },
  2: { description: "Partly cloudy", icon: Cloud },
  3: { description: "Overcast", icon: Cloud },
  45: { description: "Fog", icon: Cloud },
  48: { description: "Depositing rime fog", icon: Cloud },
  51: { description: "Light drizzle", icon: CloudRain },
  53: { description: "Moderate drizzle", icon: CloudRain },
  55: { description: "Dense drizzle", icon: CloudRain },
  61: { description: "Slight rain", icon: CloudRain },
  63: { description: "Moderate rain", icon: CloudRain },
  65: { description: "Heavy rain", icon: CloudRain },
  71: { description: "Slight snow fall", icon: CloudSnow },
  73: { description: "Moderate snow fall", icon: CloudSnow },
  75: { description: "Heavy snow fall", icon: CloudSnow },
  80: { description: "Slight rain showers", icon: CloudRain },
  81: { description: "Moderate rain showers", icon: CloudRain },
  82: { description: "Violent rain showers", icon: CloudRain },
  85: { description: "Slight snow showers", icon: CloudSnow },
  86: { description: "Heavy snow showers", icon: CloudSnow },
  95: { description: "Thunderstorm", icon: CloudRain }, // Assuming CloudRain for simplicity
};

const WeatherIcon = ({ code, size = "md" }: { code: number; size?: "sm" | "md" | "lg" }) => {
  const iconSize = size === "lg" ? "h-20 w-20" : size === "md" ? "h-12 w-12" : "h-8 w-8";
  const { icon: Icon, description } = weatherCodeMap[code] || { icon: Cloud, description: "Cloudy" };
  return <Icon className={`${iconSize} text-blue-400`} aria-label={description} />;
};


export function WeatherDisplay({ weatherData }: { weatherData: WeatherData }) {
  if (weatherData.error) {
    return (
      <div className="text-destructive text-center">
        Failed to load weather data. Please try again later.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Weather Card */}
      <Card className="shadow-md bg-gradient-to-br from-primary/20 to-background">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Current Weather</CardTitle>
          <WeatherIcon code={weatherData.current.weatherCode} size="md" />
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold">{Math.round(weatherData.current.temperature)}°F</div>
          <p className="text-lg text-muted-foreground">{weatherData.current.weatherDescription}</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Thermometer className="h-4 w-4" /> Feels like</span>
              <span>{Math.round(weatherData.current.apparentTemperature)}°F</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Droplets className="h-4 w-4" /> Humidity</span>
              <span>{weatherData.current.humidity}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Wind className="h-4 w-4" /> Wind</span>
              <span>{Math.round(weatherData.current.windSpeed)} mph</span>
            </div>
             <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Sun className="h-4 w-4" /> UV Index</span>
              <span>{Math.round(weatherData.daily.uvIndexMax[0])} of 11</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Eye className="h-4 w-4" /> Visibility</span>
              <span>{(weatherData.current.visibility / 1609).toFixed(1)} mi</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {weatherData.daily.time.map((date, index) => (
            <div key={date} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
              <span className="font-medium w-12">{format(new Date(date), 'EEE')}</span>
              <WeatherIcon code={weatherData.daily.weatherCode[index]} size="sm"/>
              <span className="text-muted-foreground w-24 text-right">{Math.round(weatherData.daily.temperatureMin[index])}° / {Math.round(weatherData.daily.temperatureMax[index])}°</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
