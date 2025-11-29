import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { GaggleGoWordmark } from '@/components/GaggleGoWordmark';
import { AnimatedGoose } from '@/components/AnimatedGoose';
import { Download, Smartphone, Check, Sparkles, Zap, Globe, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePWA } from '@/hooks/usePWA';
import { InstallButton } from '@/components/InstallButton';
import { Badge } from '@/components/ui/badge';

export default function Install() {
  const { isInstallable, isInstalled, promptInstall } = usePWA();
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);
  }, []);

  const handleInstallClick = async () => {
    await promptInstall();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="container max-w-3xl">
        <Card className="p-8 sm:p-12 space-y-8 border-2">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <AnimatedGoose size="xl" state={isInstalled ? "excited" : "idle"} enableConstantAnimation />
            </div>
            <GaggleGoWordmark size="lg" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold">
              {isInstalled ? "You're All Set! 🎉" : "Install GaggleGO"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {isInstalled 
                ? "GaggleGO is installed and ready to use"
                : "Get the best experience with our installable web app"
              }
            </p>
          </div>

          {/* Installation Status */}
          {isInstalled ? (
            <div className="space-y-6">
              <div className="bg-accent/10 border-2 border-accent rounded-lg p-6 text-center space-y-4">
                <Check className="w-16 h-16 text-accent mx-auto" />
                <div className="space-y-2">
                  <h3 className="text-2xl font-display font-medium">Successfully Installed!</h3>
                  <p className="text-muted-foreground">
                    GaggleGO is now on your device. Launch it from your home screen for the best experience.
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild variant="hero" size="lg">
                  <Link to="/plan">
                    Start Planning Your Trip
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/">Back to Home</Link>
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Benefits */}
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant="secondary" className="text-xs sm:text-sm px-3 py-1 mb-4">
                    Why Install?
                  </Badge>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex gap-3 p-4 rounded-lg bg-muted/30 border">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Works Offline</p>
                      <p className="text-sm text-muted-foreground">
                        Access itineraries without internet
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 rounded-lg bg-muted/30 border">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Lightning Fast</p>
                      <p className="text-sm text-muted-foreground">
                        Instant loading from home screen
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 rounded-lg bg-muted/30 border">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Smartphone className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Native Experience</p>
                      <p className="text-sm text-muted-foreground">
                        Full screen, no browser UI
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-4 rounded-lg bg-muted/30 border">
                    <div className="shrink-0 w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1">Always Updated</p>
                      <p className="text-sm text-muted-foreground">
                        Automatic updates in background
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Install Instructions */}
              <div className="space-y-4">
                {isIOS ? (
                  <div className="bg-primary/5 rounded-lg p-6 space-y-4 border-2 border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-semibold text-lg">Install on iOS / Safari</h4>
                    </div>
                    <ol className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <Badge variant="outline" className="shrink-0 h-6 w-6 flex items-center justify-center p-0">1</Badge>
                        <span>Tap the <strong>Share button</strong> (box with arrow) in Safari</span>
                      </li>
                      <li className="flex gap-3">
                        <Badge variant="outline" className="shrink-0 h-6 w-6 flex items-center justify-center p-0">2</Badge>
                        <span>Scroll down and tap <strong>"Add to Home Screen"</strong></span>
                      </li>
                      <li className="flex gap-3">
                        <Badge variant="outline" className="shrink-0 h-6 w-6 flex items-center justify-center p-0">3</Badge>
                        <span>Tap <strong>"Add"</strong> in the top right corner</span>
                      </li>
                      <li className="flex gap-3">
                        <Badge variant="outline" className="shrink-0 h-6 w-6 flex items-center justify-center p-0">4</Badge>
                        <span>Find the GaggleGO icon on your home screen!</span>
                      </li>
                    </ol>
                  </div>
                ) : isInstallable ? (
                  <div className="space-y-4">
                    <InstallButton variant="hero" size="lg" />
                    <p className="text-center text-sm text-muted-foreground">
                      Click the button above to install with one tap
                    </p>
                  </div>
                ) : (
                  <div className="bg-primary/5 rounded-lg p-6 space-y-4 border-2 border-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                      <h4 className="font-semibold text-lg">Install on Android / Chrome</h4>
                    </div>
                    <ol className="space-y-3 text-sm">
                      <li className="flex gap-3">
                        <Badge variant="outline" className="shrink-0 h-6 w-6 flex items-center justify-center p-0">1</Badge>
                        <span>Tap the <strong>menu button</strong> (⋮) in your browser</span>
                      </li>
                      <li className="flex gap-3">
                        <Badge variant="outline" className="shrink-0 h-6 w-6 flex items-center justify-center p-0">2</Badge>
                        <span>Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong></span>
                      </li>
                      <li className="flex gap-3">
                        <Badge variant="outline" className="shrink-0 h-6 w-6 flex items-center justify-center p-0">3</Badge>
                        <span>Tap <strong>"Install"</strong> when prompted</span>
                      </li>
                      <li className="flex gap-3">
                        <Badge variant="outline" className="shrink-0 h-6 w-6 flex items-center justify-center p-0">4</Badge>
                        <span>Launch GaggleGO from your home screen or app drawer!</span>
                      </li>
                    </ol>
                  </div>
                )}
              </div>

              {/* Continue Without Installing */}
              <div className="text-center pt-4">
                <Button asChild variant="ghost">
                  <Link to="/plan">Continue in browser instead</Link>
                </Button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
