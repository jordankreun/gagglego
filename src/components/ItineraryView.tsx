import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  MapPin, 
  ExternalLink, 
  Utensils, 
  Baby,
  Sparkles,
  ShoppingBag
} from "lucide-react";

interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  type: "activity" | "meal" | "nap" | "travel";
  link?: string;
  constraints?: string[];
}

interface ItineraryViewProps {
  location: string;
  date: string;
  items: ItineraryItem[];
  onBack: () => void;
}

const MOCK_ITEMS: ItineraryItem[] = [
  {
    time: "9:00 AM",
    title: "Arrival & Entry",
    description: "Meet at main entrance. Stroller parking available near Guest Services.",
    type: "travel",
    link: "https://example.com/park-map",
    constraints: ["Stroller-friendly", "Early arrival recommended"]
  },
  {
    time: "9:30 AM",
    title: "Morning Active Play",
    description: "Head to Adventure Zone - high energy activities while everyone's fresh. Short walking distance from entrance.",
    type: "activity",
    link: "https://example.com/adventure-zone",
    constraints: ["High energy", "Toddler-friendly"]
  },
  {
    time: "11:30 AM",
    title: "Lunch at Garden Café",
    description: "Family-friendly restaurant with gluten-free, halal, and plain options. Quiet seating area available.",
    type: "meal",
    link: "https://example.com/garden-cafe-menu",
    constraints: ["GF available", "Halal", "Plain options", "Quiet seating"]
  },
  {
    time: "1:00 PM",
    title: "The Quiet Hour",
    description: "Split paths: Nap time for little ones in designated quiet zones. Others can explore the peaceful botanical garden nearby.",
    type: "nap",
    constraints: ["Nap anchor", "Split activity"]
  },
  {
    time: "2:30 PM",
    title: "Moderate Activity - Discovery Trail",
    description: "Gentle walking trail with interactive exhibits. Paced for post-nap energy levels.",
    type: "activity",
    link: "https://example.com/discovery-trail",
    constraints: ["Moderate pace", "Educational", "Gift shop bypass available"]
  },
  {
    time: "4:00 PM",
    title: "Afternoon Snack",
    description: "Outdoor café with dietary-friendly options. Take your time, no rush.",
    type: "meal",
    link: "https://example.com/snack-cafe",
    constraints: ["All dietary needs met"]
  },
  {
    time: "5:00 PM",
    title: "Final Activity & Wind Down",
    description: "Low-key show or exhibit before heading out. Exit strategy planned to avoid gift shop route.",
    type: "activity",
    link: "https://example.com/evening-show",
    constraints: ["Low energy", "No gift shop route"]
  }
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case "meal":
      return <Utensils className="w-5 h-5" />;
    case "nap":
      return <Baby className="w-5 h-5" />;
    case "activity":
      return <Sparkles className="w-5 h-5" />;
    case "travel":
      return <MapPin className="w-5 h-5" />;
    default:
      return <Clock className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "meal":
      return "bg-secondary/10 text-secondary border-secondary/20";
    case "nap":
      return "bg-accent/10 text-accent border-accent/20";
    case "activity":
      return "bg-primary/10 text-primary border-primary/20";
    case "travel":
      return "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

export const ItineraryView = ({ location, date, items = MOCK_ITEMS, onBack }: ItineraryViewProps) => {
  return (
    <section className="min-h-screen py-12 px-4">
      <div className="container max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <Button variant="ghost" onClick={onBack} className="mb-4">
            ← Back to Setup
          </Button>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <MapPin className="w-8 h-8 text-primary" />
              <h2 className="text-4xl font-bold">{location}</h2>
            </div>
            <p className="text-muted-foreground text-lg">{date}</p>
          </div>

          <Card className="p-4 bg-accent/5 border-accent/20">
            <div className="flex items-start gap-3">
              <ShoppingBag className="w-5 h-5 text-accent mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">No Gift Shop Mode Active</p>
                <p className="text-sm text-muted-foreground">
                  Routes optimized to minimize commercial exposure
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Timeline */}
        <div className="relative space-y-4">
          {/* Timeline line */}
          <div className="absolute left-[47px] top-8 bottom-8 w-0.5 bg-border" />

          {items.map((item, index) => (
            <div key={index} className="relative">
              <Card className="p-6 ml-20 shadow-sm hover:shadow-md transition-all border-l-4 border-l-primary/20 hover:border-l-primary">
                {/* Time badge */}
                <div className="absolute -left-20 top-6">
                  <div className={`w-12 h-12 rounded-full border-4 border-background flex items-center justify-center ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono">
                            {item.time}
                          </Badge>
                          <Badge className={getTypeColor(item.type)}>
                            {item.type}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-semibold">{item.title}</h3>
                      </div>
                      
                      {item.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                            View Details
                          </a>
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>

                  {/* Constraints */}
                  {item.constraints && item.constraints.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.constraints.map((constraint, i) => (
                        <Badge key={i} variant="secondary" className="text-xs">
                          {constraint}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Footer */}
        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="text-center space-y-2">
            <p className="font-semibold">Your Village itinerary is ready!</p>
            <p className="text-sm text-muted-foreground">
              All timing optimized for nap schedules, dietary needs, and family pacing
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};
