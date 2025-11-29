import { useState, useEffect } from "react";

interface WeatherData {
  date: string;
  temperature: {
    max: number;
    min: number;
  };
  condition: string;
  precipitation: number;
  icon: string;
}

// Free weather API using Open-Meteo (no API key required)
export const useWeather = (location: string, startDate?: Date, endDate?: Date) => {
  const [weather, setWeather] = useState<WeatherData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!location || !startDate) return;

      setLoading(true);
      setError(null);

      try {
        // First, geocode the location to get coordinates
        const geoResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
          { headers: { 'User-Agent': 'GaggleGO/1.0' } }
        );
        const geoData = await geoResponse.json();

        if (!geoData || geoData.length === 0) {
          throw new Error("Location not found");
        }

        const { lat, lon } = geoData[0];

        // Get weather forecast
        const start = startDate.toISOString().split('T')[0];
        const end = endDate ? endDate.toISOString().split('T')[0] : start;

        const weatherResponse = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code&temperature_unit=fahrenheit&start_date=${start}&end_date=${end}&timezone=auto`
        );
        const weatherData = await weatherResponse.json();

        if (weatherData.error) {
          throw new Error(weatherData.reason || "Weather fetch failed");
        }

        // Map weather codes to conditions
        const getCondition = (code: number): { condition: string; icon: string } => {
          if (code === 0) return { condition: "Clear", icon: "☀️" };
          if (code <= 3) return { condition: "Partly Cloudy", icon: "⛅" };
          if (code <= 48) return { condition: "Foggy", icon: "🌫️" };
          if (code <= 67) return { condition: "Rainy", icon: "🌧️" };
          if (code <= 77) return { condition: "Snowy", icon: "❄️" };
          if (code <= 82) return { condition: "Showers", icon: "🌦️" };
          if (code <= 86) return { condition: "Snow Showers", icon: "🌨️" };
          return { condition: "Stormy", icon: "⛈️" };
        };

        const forecast: WeatherData[] = weatherData.daily.time.map((date: string, i: number) => {
          const { condition, icon } = getCondition(weatherData.daily.weather_code[i]);
          return {
            date,
            temperature: {
              max: Math.round(weatherData.daily.temperature_2m_max[i]),
              min: Math.round(weatherData.daily.temperature_2m_min[i]),
            },
            condition,
            precipitation: weatherData.daily.precipitation_probability_max[i],
            icon,
          };
        });

        setWeather(forecast);
      } catch (err) {
        console.error("Weather fetch error:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch weather");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location, startDate, endDate]);

  return { weather, loading, error };
};
