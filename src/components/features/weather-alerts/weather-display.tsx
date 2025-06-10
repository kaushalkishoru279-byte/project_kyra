"use client";

import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Wind, Sun, Cloud, CloudRain, CloudSnow } from "lucide-react";

// Mock weather data
const currentWeatherData = {
  location: "Springfield, IL",
  temperature: 72, // Fahrenheit
  condition: "Partly Cloudy",
  icon: "https://placehold.co/128x128.png", // Replace with actual weather icon logic
  iconHint: "cloud sun",
  humidity: 55, // Percentage
  windSpeed: 10, // mph
  feelsLike: 70,
  uvIndex: 5,
};

const forecastData = [
    { day: "Mon", tempHigh: 75, tempLow: 60, icon: "https://placehold.co/64x64.png", iconHint: "sun cloud" },
    { day: "Tue", tempHigh: 78, tempLow: 62, icon: "https://placehold.co/64x64.png", iconHint: "sun" },
    { day: "Wed", tempHigh: 70, tempLow: 58, icon: "https://placehold.co/64x64.png", iconHint: "rain cloud" },
    { day: "Thu", tempHigh: 72, tempLow: 55, icon: "https://placehold.co/64x64.png", iconHint: "cloud" },
];

const WeatherIcon = ({ condition, size = "md" }: { condition: string, size?: "sm" | "md" | "lg" }) => {
  const iconSize = size === "lg" ? "h-20 w-20" : size === "md" ? "h-12 w-12" : "h-8 w-8";
  if (condition.includes("Cloudy")) return <Cloud className={`${iconSize} text-blue-400`} />;
  if (condition.includes("Rain")) return <CloudRain className={`${iconSize} text-blue-500`} />;
  if (condition.includes("Snow")) return <CloudSnow className={`${iconSize} text-sky-300`} />;
  if (condition.includes("Sun") || condition.includes("Clear")) return <Sun className={`${iconSize} text-yellow-400`} />;
  return <Cloud className={`${iconSize} text-gray-400`} />;
};


export function WeatherDisplay() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Current Weather Card */}
      <Card className="shadow-md bg-gradient-to-br from-primary/20 to-background">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xl font-semibold">Current Weather</CardTitle>
          <WeatherIcon condition={currentWeatherData.condition} size="md" />
        </CardHeader>
        <CardContent>
          <div className="text-6xl font-bold">{currentWeatherData.temperature}°F</div>
          <p className="text-lg text-muted-foreground">{currentWeatherData.condition}</p>
          <div className="mt-4 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Thermometer className="h-4 w-4" /> Feels like</span>
              <span>{currentWeatherData.feelsLike}°F</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Droplets className="h-4 w-4" /> Humidity</span>
              <span>{currentWeatherData.humidity}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Wind className="h-4 w-4" /> Wind</span>
              <span>{currentWeatherData.windSpeed} mph</span>
            </div>
             <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-muted-foreground"><Sun className="h-4 w-4" /> UV Index</span>
              <span>{currentWeatherData.uvIndex} of 10</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast Card */}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">4-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {forecastData.map(dayForecast => (
            <div key={dayForecast.day} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
              <span className="font-medium w-12">{dayForecast.day}</span>
              <Image 
                src={dayForecast.icon} 
                alt="weather icon" 
                data-ai-hint={dayForecast.iconHint}
                width={32} 
                height={32} 
              />
              <span className="text-muted-foreground w-20 text-right">{dayForecast.tempLow}°F / {dayForecast.tempHigh}°F</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
