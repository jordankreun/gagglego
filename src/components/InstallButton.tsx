import { Button } from '@/components/ui/button';
import { Download, Check } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface InstallButtonProps {
  variant?: 'default' | 'ghost' | 'outline' | 'hero';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showBadge?: boolean;
}

export const InstallButton = ({ variant = 'ghost', size = 'sm', showBadge = false }: InstallButtonProps) => {
  const { isInstallable, isInstalled, promptInstall } = usePWA();

  if (isInstalled) {
    return (
      <Button variant={variant} size={size} disabled className="gap-2">
        <Check className="w-4 h-4" />
        <span className="hidden sm:inline">Installed</span>
      </Button>
    );
  }

  if (isInstallable) {
    return (
      <div className="relative">
        <Button 
          onClick={promptInstall} 
          variant={variant} 
          size={size}
          className="gap-2"
        >
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Install App</span>
          <span className="sm:hidden">Install</span>
        </Button>
        {showBadge && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs animate-pulse"
            variant="destructive"
          >
            !
          </Badge>
        )}
      </div>
    );
  }

  // For iOS or when prompt is not available
  return (
    <Button 
      asChild
      variant={variant} 
      size={size}
      className="gap-2"
    >
      <Link to="/install">
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden">Install</span>
      </Link>
    </Button>
  );
};
