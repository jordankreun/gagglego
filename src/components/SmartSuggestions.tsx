import { Button } from "@/components/ui/button";
import { BrandIcons } from "@/components/icons/BrandIcons";

interface SmartSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
  disabled?: boolean;
}

const suggestions = [
  { Icon: BrandIcons.SleepingGosling, text: "Move lunch earlier" },
  { Icon: BrandIcons.WaddlingGoose, text: "Add bathroom break" },
  { Icon: BrandIcons.EatingGoose, text: "Find kid-friendly restaurant" },
  { Icon: BrandIcons.ExcitedGosling, text: "Find playground nearby" },
  { Icon: BrandIcons.NestingGoose, text: "Suggest indoor activity" },
  { Icon: BrandIcons.AlertGoose, text: "We're running late" },
];

export const SmartSuggestions = ({ onSuggestionClick, disabled }: SmartSuggestionsProps) => {
  return (
    <div className="p-3 border-t bg-muted/30">
      <p className="text-xs text-muted-foreground mb-2 font-medium">Quick actions:</p>
      <div className="grid grid-cols-2 gap-2">
        {suggestions.map((suggestion, index) => {
          const Icon = suggestion.Icon;
          return (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => onSuggestionClick(suggestion.text)}
              disabled={disabled}
              className="justify-start h-auto py-2 text-xs hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
            >
              <Icon size={14} className="mr-2 flex-shrink-0" />
              <span className="truncate">{suggestion.text}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};
