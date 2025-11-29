import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { AnimatedGoose } from '@/components/AnimatedGoose';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BrandIcons } from '@/components/icons/BrandIcons';

interface GooseStatusCardProps {
  title: string;
  estimatedSeconds: number;
  messages?: string[];
  onCancel?: () => void;
  gooseState?: 'idle' | 'thinking' | 'talking' | 'excited';
}

const DEFAULT_MESSAGES = [
  'Gathering the flock...',
  'Plotting the migration route...',
  'Checking the weather...',
  'Preparing for takeoff!',
];

export const GooseStatusCard = ({
  title,
  estimatedSeconds,
  messages = DEFAULT_MESSAGES,
  onCancel,
  gooseState = 'thinking',
}: GooseStatusCardProps) => {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(estimatedSeconds);

  useEffect(() => {
    // Update progress every 100ms
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        const increment = (100 / estimatedSeconds) / 10; // 10 updates per second
        const newProgress = Math.min(prev + increment, 100);
        return newProgress;
      });
    }, 100);

    // Update remaining seconds every second
    const countdownInterval = setInterval(() => {
      setRemainingSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(countdownInterval);
    };
  }, [estimatedSeconds]);

  useEffect(() => {
    // Update message based on progress
    const messageIndex = Math.min(
      Math.floor((progress / 100) * messages.length),
      messages.length - 1
    );
    setCurrentMessageIndex(messageIndex);
  }, [progress, messages.length]);

  const getGooseState = () => {
    if (progress < 25) return 'thinking';
    if (progress < 75) return gooseState;
    return 'excited';
  };

  const getProgressIcon = () => {
    if (progress < 25) return BrandIcons.HatchingEgg;
    if (progress < 50) return BrandIcons.Gosling;
    if (progress < 75) return BrandIcons.Goose;
    return BrandIcons.FlyingGoose;
  };

  const ProgressIcon = getProgressIcon();

  return (
    <Card className="w-full max-w-md mx-auto border-2 border-primary/20 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {onCancel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="h-8 text-xs text-muted-foreground hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Abort mission
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center items-center gap-4">
          <ProgressIcon size={40} className="text-primary" />
          <AnimatedGoose 
            size="lg" 
            state={getGooseState()} 
            enableConstantAnimation 
          />
        </div>

        <div className="space-y-3">
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium animate-fade-in">
              {messages[currentMessageIndex]}
            </span>
            <span className="text-xs text-muted-foreground tabular-nums">
              ~{remainingSeconds}s
            </span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            {progress < 30 && "Honking up a storm..."}
            {progress >= 30 && progress < 60 && "Wing flaps intensifying..."}
            {progress >= 60 && progress < 90 && "Almost ready to soar!"}
            {progress >= 90 && "Taking flight! 🦆"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
