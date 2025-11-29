import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GaggleGoWordmark } from '@/components/GaggleGoWordmark';
import { AnimatedGoose } from '@/components/AnimatedGoose';
import { Download, Smartphone, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function Install() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    await deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    // Clear the deferredPrompt
    setDeferredPrompt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        <Card className="p-8 sm:p-12 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AnimatedGoose size="xl" state="excited" />
            </div>
            <GaggleGoWordmark size="lg" />
            <p className="text-lg text-muted-foreground">
              Install GaggleGO on your device for the best experience
            </p>
          </div>

          {/* Installation Status */}
          {isInstalled ? (
            <div className="bg-accent/10 border-2 border-accent rounded-lg p-6 text-center space-y-4">
              <Check className="w-12 h-12 text-accent mx-auto" />
              <h3 className="text-xl font-display font-medium">App Installed!</h3>
              <p className="text-muted-foreground">
                GaggleGO is now installed on your device. You can access it from your home screen.
              </p>
              <Button asChild variant="default" size="lg">
                <Link to="/plan">Start Planning</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Benefits */}
              <div className="space-y-4">
                <h3 className="text-xl font-display font-medium">Why Install?</h3>
                <div className="grid gap-4">
                  <div className="flex gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Works Offline</p>
                      <p className="text-sm text-muted-foreground">
                        Access your itineraries even without internet
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Faster Loading</p>
                      <p className="text-sm text-muted-foreground">
                        Instant access from your home screen
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Full Screen Experience</p>
                      <p className="text-sm text-muted-foreground">
                        No browser UI, just your app
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Install Instructions */}
              <div className="space-y-4">
                {isIOS ? (
                  <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <h4 className="font-medium">Install on iOS</h4>
                    </div>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li>1. Tap the Share button <span className="inline-block">⎋</span> in Safari</li>
                      <li>2. Scroll down and tap "Add to Home Screen"</li>
                      <li>3. Tap "Add" in the top right</li>
                    </ol>
                  </div>
                ) : deferredPrompt ? (
                  <Button
                    onClick={handleInstallClick}
                    size="lg"
                    className="w-full"
                    variant="hero"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Install GaggleGO
                  </Button>
                ) : (
                  <div className="bg-muted/50 rounded-lg p-6 space-y-3">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-primary" />
                      <h4 className="font-medium">Install on Android</h4>
                    </div>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li>1. Tap the menu button (⋮) in your browser</li>
                      <li>2. Tap "Install app" or "Add to Home screen"</li>
                      <li>3. Follow the prompts to install</li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Continue Without Installing */}
              <div className="text-center">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/plan">Continue in browser</Link>
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
