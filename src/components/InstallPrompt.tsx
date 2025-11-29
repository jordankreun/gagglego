import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export const InstallPrompt = () => {
  const { isInstallable, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (!accepted) {
      setDismissed(true);
    }
  };

  return (
    <Card className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-96 p-4 shadow-2xl border-2 z-50 animate-fade-in">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>
      
      <div className="space-y-3">
        <div className="pr-6">
          <h4 className="font-display font-medium text-lg">Install GaggleGO</h4>
          <p className="text-sm text-muted-foreground">
            Get the app for offline access and faster loading
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={handleInstall} size="sm" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Install
          </Button>
          <Button asChild variant="ghost" size="sm">
            <Link to="/install">Learn More</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
};
