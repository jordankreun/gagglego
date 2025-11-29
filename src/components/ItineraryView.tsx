import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Clock, 
  MapPin, 
  ExternalLink, 
  Utensils, 
  Baby,
  Sparkles,
  ShoppingBag,
  Share2
} from "lucide-react";
import { ItineraryChat } from "./ItineraryChat";
import { TravelConnector } from "./TravelConnector";
import { MealCard } from "./MealCard";
import { ShareTripDialog } from "./ShareTripDialog";
import { ExportTripButton } from "./ExportTripButton";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ItineraryItem {
  time: string;
  title: string;
  description: string;
  type: "activity" | "meal" | "nap" | "travel";
  link?: string;
  constraints?: string[];
  travelTime?: string;
  travelMode?: "walk" | "drive" | "stroller";
  returnsToNest?: boolean;
  isCarNap?: boolean;
  mealDetails?: any;
}

interface ItineraryViewProps {
  location: string;
  date: string;
  items: ItineraryItem[];
  onBack: () => void;
  tripId?: string | null;
  onItemsUpdate?: (items: ItineraryItem[]) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case "meal": return <Utensils className="w-5 h-5" />;
    case "nap": return <Baby className="w-5 h-5" />;
    case "activity": return <Sparkles className="w-5 h-5" />;
    case "travel": return <MapPin className="w-5 h-5" />;
    default: return <Clock className="w-5 h-5" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "meal": return "bg-secondary/10 text-secondary border-secondary/20";
    case "nap": return "bg-accent/10 text-accent border-accent/20";
    case "activity": return "bg-primary/10 text-primary border-primary/20";
    case "travel": return "bg-muted-foreground/10 text-muted-foreground border-muted-foreground/20";
    default: return "bg-muted text-muted-foreground";
  }
};

export const ItineraryView = ({ location, date, items, onBack, tripId, onItemsUpdate }: ItineraryViewProps) => {
  const [currentItems, setCurrentItems] = useState(items);
  const [completed, setCompleted] = useState<Set<number>>(new Set());
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareCode, setShareCode] = useState<string | undefined>();
  const { toast } = useToast();

  // Load initial progress and share code from trip data
  useEffect(() => {
    const loadProgress = async () => {
      if (tripId) {
        try {
          const { data, error } = await supabase
            .from('trips')
            .select('progress, share_code')
            .eq('id', tripId)
            .single();

          if (error) throw error;
          
          if (data?.progress && typeof data.progress === 'object' && 'completed' in data.progress) {
            const progressData = data.progress as { completed?: number[] };
            if (progressData.completed) {
              setCompleted(new Set(progressData.completed));
            }
          }
          if (data?.share_code) {
            setShareCode(data.share_code);
          }
        } catch (error) {
          console.error('Error loading progress:', error);
        }
      }
    };
    loadProgress();
  }, [tripId]);

  const toggleComplete = async (index: number) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompleted(newCompleted);

    // Persist to database
    if (tripId) {
      try {
        await supabase
          .from('trips')
          .update({ 
            progress: { completed: Array.from(newCompleted) },
            updated_at: new Date().toISOString()
          })
          .eq('id', tripId);
      } catch (error) {
        console.error('Error saving progress:', error);
        toast({
          title: "Failed to save progress",
          description: "Your changes may not be saved",
          variant: "destructive",
        });
      }
    }
  };

  const handleItineraryUpdate = (updatedItems: ItineraryItem[]) => {
    setCurrentItems(updatedItems);
    onItemsUpdate?.(updatedItems);
  };

  const completedCount = completed.size;
  const totalCount = currentItems.length;
  const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <section className="min-h-screen py-6 sm:py-10 md:py-12 px-3 sm:px-4">
      <div className="container max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={onBack} className="h-9 sm:h-10">← Back</Button>
            <div className="flex gap-2">
              <ExportTripButton location={location} date={date} itinerary={currentItems} />
              {tripId && (
                <Button variant="outline" size="sm" onClick={() => setShareDialogOpen(true)}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold break-words">{location}</h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">{date}</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <Badge variant="secondary">{completedCount}/{totalCount} completed</Badge>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        <div className="relative space-y-2 sm:space-y-3">
          <div className="absolute left-[23px] sm:left-[39px] top-6 bottom-6 w-px bg-border" />

          {currentItems.map((item, index) => (
            <div key={index}>
              {item.travelTime && index > 0 && (
                <TravelConnector
                  travelTime={item.travelTime}
                  travelMode={item.travelMode || "walk"}
                  returnsToNest={item.returnsToNest}
                  isCarNap={item.isCarNap}
                />
              )}

              {item.type === "meal" && item.mealDetails ? (
                <div className="ml-10 sm:ml-16">
                  <MealCard time={item.time} mealDetails={item.mealDetails} />
                </div>
              ) : (
                <div className="relative">
                  <Card className={`p-3 sm:p-4 md:p-5 ml-10 sm:ml-16 border-l-2 border-l-primary/30 hover:border-l-primary transition-colors ${completed.has(index) ? 'opacity-60' : ''}`}>
                    <div className="absolute -left-10 sm:-left-16 top-3 sm:top-5">
                      <div className={`w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 sm:border-4 border-background flex items-center justify-center ${getTypeColor(item.type)}`}>
                        <div className="scale-75 sm:scale-100">{getTypeIcon(item.type)}</div>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={completed.has(index)}
                          onCheckedChange={() => toggleComplete(index)}
                          className="mt-1"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-1 flex-wrap">
                            <Badge variant="outline" className="font-mono text-[10px] sm:text-xs">{item.time}</Badge>
                            <Badge className={`${getTypeColor(item.type)} text-[10px] sm:text-xs`}>{item.type}</Badge>
                          </div>
                          <h3 className={`font-semibold text-sm sm:text-base md:text-lg ${completed.has(index) ? 'line-through' : ''}`}>
                            {item.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-muted-foreground mt-1">{item.description}</p>
                          
                          {item.constraints && item.constraints.length > 0 && (
                            <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-2">
                              {item.constraints.map((constraint, i) => (
                                <Badge key={i} variant="secondary" className="text-[10px] sm:text-xs">{constraint}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        {item.link && (
                          <Button variant="ghost" size="sm" asChild className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                            <a href={item.link} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          ))}
        </div>

        <Card className="p-3 sm:p-4 bg-primary/5 border-primary/20">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Optimized for nap schedules, dietary needs, meal preferences, and family pacing
          </p>
        </Card>
      </div>

      <ItineraryChat 
        location={location}
        currentItinerary={currentItems}
        tripId={tripId}
        onItineraryUpdate={handleItineraryUpdate}
      />

      {tripId && (
        <ShareTripDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          tripId={tripId}
          shareCode={shareCode}
        />
      )}
    </section>
  );
};