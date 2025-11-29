import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Check, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface SaveButtonProps {
  tripId?: string | null;
  itineraryItems: any[];
  onSave?: () => void;
}

export const SaveButton = ({ tripId, itineraryItems, onSave }: SaveButtonProps) => {
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  const handleSave = async () => {
    if (!tripId) {
      toast({
        title: "Cannot save",
        description: "No trip ID found",
        variant: "destructive",
      });
      return;
    }

    setSaveStatus("saving");

    try {
      await supabase
        .from('trips')
        .update({ 
          itinerary: itineraryItems as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', tripId);

      setLastSaved(new Date());
      setSaveStatus("saved");
      onSave?.();

      toast({
        title: "Trip saved!",
        description: "Your itinerary has been saved successfully",
      });

      // Reset to idle after 3 seconds
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error('Error saving trip:', error);
      setSaveStatus("idle");
      toast({
        title: "Save failed",
        description: "Could not save your trip. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTimeAgo = () => {
    if (!lastSaved) return null;
    
    const now = new Date();
    const diffMs = now.getTime() - lastSaved.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return lastSaved.toLocaleDateString();
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-2">
      <Button
        onClick={handleSave}
        disabled={saveStatus === "saving" || !tripId}
        className="h-14 px-6 rounded-full shadow-lg bg-secondary hover:bg-secondary/90"
        size="lg"
      >
        {saveStatus === "saving" && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
        {saveStatus === "saved" && <Check className="w-5 h-5 mr-2" />}
        {saveStatus === "idle" && <Save className="w-5 h-5 mr-2" />}
        <span className="font-semibold">
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "Saved!"}
          {saveStatus === "idle" && "Save Trip"}
        </span>
      </Button>
      
      {lastSaved && (
        <Badge variant="secondary" className="ml-2 text-xs">
          Last saved: {getTimeAgo()}
        </Badge>
      )}
    </div>
  );
};
