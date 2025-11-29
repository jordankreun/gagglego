import { Button } from "@/components/ui/button";
import { Clock, Baby, Utensils, MapPin, Sparkles } from "lucide-react";

interface SmartSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
}

const suggestions = [
  { icon: Clock, text: "Move lunch earlier", emoji: "⏰" },
  { icon: Baby, text: "Add bathroom break", emoji: "🚻" },
  { icon: Utensils, text: "Find kid-friendly restaurant", emoji: "🍽️" },
  { icon: MapPin, text: "Find playground nearby", emoji: "🎡" },
  { icon: Sparkles, text: "Suggest indoor activity", emoji: "🏠" },
  { icon: Clock, text: "We're running late", emoji: "⏱️" },
];

export const SmartSuggestions = ({ onSuggestionClick, disabled }: SmartSuggestionsProps) => {
  return (
    <div className="p-3 border-t bg-muted/30">
      <p className="text-xs text-muted-foreground mb-2 font-medium">Quick actions:</p>
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSuggestionClick(suggestion.text)}
            disabled={disabled}
            className="justify-start h-auto py-2 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
          >
            <span className="mr-2">{suggestion.emoji}</span>
            <span className="truncate">{suggestion.text}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
