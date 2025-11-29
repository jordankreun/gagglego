import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, ThermometerSun } from "lucide-react";

interface WeatherCardProps {
  date: string;
  temperature: {
    max: number;
    min: number;
  };
  condition: string;
  precipitation: number;
  icon: string;
}

export const WeatherCard = ({ date, temperature, condition, precipitation, icon }: WeatherCardProps) => {
  const dateObj = new Date(date);
  const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
  const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  return (
    <Card className="p-3 hover:border-primary/30 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-semibold text-sm">{dayName}</div>
          <div className="text-xs text-muted-foreground">{monthDay}</div>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>
      
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <ThermometerSun className="w-4 h-4 text-orange-500" />
          <span className="text-sm font-medium">
            {temperature.max}° / {temperature.min}°F
          </span>
        </div>
        
        <div className="text-xs text-muted-foreground">{condition}</div>
        
        {precipitation > 30 && (
          <div className="flex items-center gap-1 text-xs">
            <CloudRain className="w-3 h-3 text-blue-500" />
            <span className="text-blue-600">{precipitation}% rain</span>
          </div>
        )}
      </div>
    </Card>
  );
};
