import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X, Smartphone } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { Link } from 'react-router-dom';

export const PWABanner = () => {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if user is on mobile
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();

    // Check if user has dismissed before
    const hasBeenDismissed = localStorage.getItem('pwa-banner-dismissed');
    if (hasBeenDismissed) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleInstall = async () => {
    const accepted = await promptInstall();
    if (accepted) {
      localStorage.setItem('pwa-banner-dismissed', 'true');
    }
  };

  // Don't show if already installed, dismissed, or not installable
  if (isInstalled || dismissed || (!isInstallable && !isMobile)) {
    return null;
  }

  return (
    <div className="sticky top-0 z-50 bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Smartphone className="w-5 h-5 text-primary-foreground shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-primary-foreground truncate">
                Install GaggleGO for the best experience
              </p>
              <p className="text-xs text-primary-foreground/80 hidden sm:block">
                Works offline • Faster loading • Home screen access
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {isInstallable ? (
              <Button 
                onClick={handleInstall} 
                size="sm" 
                variant="secondary"
                className="text-xs font-semibold"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
            ) : (
              <Button 
                asChild
                size="sm" 
                variant="secondary"
                className="text-xs font-semibold"
              >
                <Link to="/install">Learn How</Link>
              </Button>
            )}
            <button
              onClick={handleDismiss}
              className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
