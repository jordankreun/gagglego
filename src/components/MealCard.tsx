import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ExternalLink, 
  RefreshCw, 
  Star,
  Clock,
  ChefHat,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { BrandIcons } from "@/components/icons/BrandIcons";

interface DietaryFitScore {
  overallScore: number;
  grade: string;
  perRestriction: {
    restriction: string;
    stars: number;
    note: string;
  }[];
  warnings: string[];
}

interface MealDetails {
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  restaurantName: string;
  cuisine: string;
  estimatedCost: "$" | "$$" | "$$$";
  waitTime: string;
  reservationLink?: string;
  menuLink?: string;
  dietaryFit: DietaryFitScore;
  kidMenu: boolean;
  highchairs: boolean;
  changingTable: boolean;
  outdoorSeating: boolean;
  quickService: boolean;
}

interface MealCardProps {
  time: string;
  mealDetails: MealDetails;
  onSwap?: () => void;
}

const getMealIcon = (mealType: string) => {
  switch (mealType) {
    case "breakfast": return BrandIcons.EatingGoose;
    case "lunch": return BrandIcons.EatingGoose;
    case "dinner": return BrandIcons.EatingGoose;
    case "snack": return BrandIcons.Gosling;
    default: return BrandIcons.EatingGoose;
  }
};

export const MealCard = ({ time, mealDetails, onSwap }: MealCardProps) => {
  const { 
    mealType, 
    restaurantName, 
    cuisine, 
    estimatedCost, 
    waitTime,
    menuLink,
    reservationLink,
    dietaryFit,
    kidMenu,
    highchairs,
    changingTable,
    outdoorSeating,
    quickService
  } = mealDetails;

  const getGradeColor = (score: number) => {
    if (score >= 90) return "text-green-600 dark:text-green-400";
    if (score >= 80) return "text-green-500 dark:text-green-500";
    if (score >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <Card className="p-4 md:p-5 border-2 border-secondary/30 hover:border-secondary transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {(() => {
            const MealIcon = getMealIcon(mealType);
            return <MealIcon size={32} className={
              mealType === "breakfast" ? "text-yellow-500" :
              mealType === "lunch" ? "text-orange-500" :
              mealType === "dinner" ? "text-indigo-500" :
              "text-secondary"
            } />;
          })()}
          <div>
            <Badge variant="outline" className="font-mono text-xs mb-1">{time}</Badge>
            <h3 className="font-semibold text-lg">{restaurantName}</h3>
            <p className="text-xs text-muted-foreground">{cuisine} • {estimatedCost} • {waitTime}</p>
          </div>
        </div>
        <BrandIcons.Dining size={20} className="text-secondary" />
      </div>

      {/* Dietary Fit Ranking */}
      <div className="mb-4 p-3 bg-muted/30 rounded-lg border">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground">DIETARY FIT</span>
            <span className={`text-2xl font-bold ${getGradeColor(dietaryFit.overallScore)}`}>
              {dietaryFit.overallScore}%
            </span>
            <Badge variant={dietaryFit.overallScore >= 80 ? "default" : "destructive"} className="text-xs">
              {dietaryFit.grade}
            </Badge>
          </div>
          {dietaryFit.overallScore >= 80 ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-600" />
          )}
        </div>

        <Progress value={dietaryFit.overallScore} className="h-2 mb-3" />

        {/* Per-Restriction Breakdown */}
        <div className="space-y-2">
          {dietaryFit.perRestriction.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs">
              <span className="font-medium">{item.restriction}</span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < item.stars ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>
                {item.note && (
                  <span className="text-muted-foreground">• {item.note}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Warnings */}
        {dietaryFit.warnings.length > 0 && (
          <div className="mt-3 p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded border border-yellow-300 dark:border-yellow-700">
            {dietaryFit.warnings.map((warning, idx) => (
              <p key={idx} className="text-xs text-yellow-800 dark:text-yellow-200 flex items-start gap-1">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>{warning}</span>
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Family-Friendly Features */}
      <div className="flex flex-wrap gap-2 mb-4">
        {kidMenu && (
          <Badge variant="secondary" className="text-xs flex items-center gap-1 w-fit">
            <BrandIcons.Gosling size={12} />
            Kid Menu
          </Badge>
        )}
        {highchairs && (
          <Badge variant="secondary" className="text-xs">🪑 Highchairs</Badge>
        )}
        {changingTable && (
          <Badge variant="secondary" className="text-xs">👶 Changing Table</Badge>
        )}
        {outdoorSeating && (
          <Badge variant="secondary" className="text-xs">🌳 Outdoor</Badge>
        )}
        {quickService && (
          <Badge variant="secondary" className="text-xs">⚡ Quick Service</Badge>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {menuLink && (
          <Button variant="outline" size="sm" asChild className="flex-1">
            <a href={menuLink} target="_blank" rel="noopener noreferrer">
              <ChefHat className="w-3 h-3 mr-1" />
              Menu
            </a>
          </Button>
        )}
        {reservationLink && (
          <Button variant="outline" size="sm" asChild className="flex-1">
            <a href={reservationLink} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-3 h-3 mr-1" />
              Reserve
            </a>
          </Button>
        )}
        {onSwap && (
          <Button variant="ghost" size="sm" onClick={onSwap} className="flex-1">
            <RefreshCw className="w-3 h-3 mr-1" />
            Swap
          </Button>
        )}
      </div>
    </Card>
  );
};