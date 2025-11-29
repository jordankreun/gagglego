import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { Link } from 'react-router-dom';
import { FlyingGooseIcon } from '@/components/icons/BrandIcons';

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
    <div className="sticky top-0 z-50 bg-accent shadow-md animate-fade-in">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FlyingGooseIcon className="w-6 h-6 text-white shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                Take your flock on the go! Install GaggleGO
              </p>
              <p className="text-xs text-white/90 hidden sm:block">
                Works offline • Lightning fast • Always ready to fly
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            {isInstallable ? (
              <Button 
                onClick={handleInstall} 
                size="sm" 
                variant="outline"
                className="text-xs font-semibold bg-white text-accent border-white hover:bg-white/90 hover:text-accent"
              >
                <Download className="w-3 h-3 mr-1" />
                Install
              </Button>
            ) : (
              <Button 
                asChild
                size="sm" 
                variant="outline"
                className="text-xs font-semibold bg-white text-accent border-white hover:bg-white/90 hover:text-accent"
              >
                <Link to="/install">Learn How</Link>
              </Button>
            )}
            <button
              onClick={handleDismiss}
              className="text-white hover:text-white/80 transition-colors"
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
