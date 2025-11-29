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
    constraints: ["Moderate pace", "Educational", "Alternative exit available"]
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
    description: "Low-key show or exhibit before heading out. Direct exit route planned.",
    type: "activity",
    link: "https://example.com/evening-show",
    constraints: ["Low energy", "Direct exit route"]
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

export const ItineraryView = ({ location, date, items, onBack }: ItineraryViewProps) => {
  const displayItems = items.length > 0 ? items : MOCK_ITEMS;
  return (
    <section className="min-h-screen py-12 px-4">
      <div className="container max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-6">
          <Button variant="ghost" onClick={onBack}>
            ← Back
          </Button>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-6 h-6 text-primary" />
              <h2 className="text-3xl font-display font-bold">{location}</h2>
            </div>
            <p className="text-muted-foreground">{date}</p>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Gift shop routes minimized</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative space-y-3">
          <div className="absolute left-[39px] top-6 bottom-6 w-px bg-border" />

          {displayItems.map((item, index) => (
            <div key={index} className="relative">
              <Card className="p-5 ml-16 border-l-2 border-l-primary/30 hover:border-l-primary transition-colors">
                {/* Time badge */}
                <div className="absolute -left-16 top-5">
                  <div className={`w-10 h-10 rounded-full border-4 border-background flex items-center justify-center ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="font-mono text-xs">
                            {item.time}
                          </Badge>
                          <Badge className={`${getTypeColor(item.type)} text-xs`}>
                            {item.type}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                      </div>
                      
                      {item.link && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>

                  {item.constraints && item.constraints.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
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
        <Card className="p-4 bg-primary/5 border-primary/20">
          <p className="text-center text-sm text-muted-foreground">
            Optimized for nap schedules, dietary needs, and family pacing
          </p>
        </Card>
      </div>
    </section>
  );
};
