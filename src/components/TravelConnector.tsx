import { Car, Footprints, Clock } from "lucide-react";

interface TravelConnectorProps {
  travelTime: string;
  travelMode: "walk" | "drive" | "stroller";
  returnsToNest?: boolean;
  isCarNap?: boolean;
}

export const TravelConnector = ({ travelTime, travelMode, returnsToNest, isCarNap }: TravelConnectorProps) => {
  const getIcon = () => {
    switch (travelMode) {
      case "drive":
        return <Car className="w-3 h-3" />;
      case "stroller":
        return <Footprints className="w-3 h-3" />;
      default:
        return <Footprints className="w-3 h-3" />;
    }
  };

  return (
    <div className="relative ml-10 sm:ml-16 my-1 sm:my-2">
      <div className="flex items-center gap-2 text-xs text-muted-foreground py-2 px-3 bg-muted/30 rounded-lg border border-dashed">
        <Clock className="w-3 h-3" />
        {getIcon()}
        <span>{travelTime} {travelMode === "stroller" ? "with stroller" : travelMode}</span>
        {returnsToNest && <span className="text-primary">→ Back to Nest</span>}
        {isCarNap && <span className="text-accent">🚗 Car nap time</span>}
      </div>
    </div>
  );
};