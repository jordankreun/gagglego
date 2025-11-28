import { BrandIcons } from '@/components/icons/BrandIcons';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const IconShowcase = () => {
  const icons = [
    { name: 'Map Pin', Component: BrandIcons.MapPin, description: 'Location marker' },
    { name: 'Luggage', Component: BrandIcons.Luggage, description: 'Travel gear' },
    { name: 'Chat', Component: BrandIcons.Chat, description: 'Messaging' },
    { name: 'Calendar', Component: BrandIcons.Calendar, description: 'Schedule' },
    { name: 'Goose', Component: BrandIcons.Goose, description: 'Brand mascot' },
    { name: 'Group', Component: BrandIcons.Group, description: 'Family groups' },
    { name: 'Dining', Component: BrandIcons.Dining, description: 'Food & restaurants' },
    { name: 'Clock', Component: BrandIcons.Clock, description: 'Time & naps' },
    { name: 'Map View', Component: BrandIcons.MapView, description: 'Navigation' },
    { name: 'Heart', Component: BrandIcons.Heart, description: 'Favorites' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            <span className="text-primary">Gaggle</span>
            <span className="text-accent">GO</span> Icons
          </h1>
          <p className="text-xl text-muted-foreground">
            Custom icon set matching our brand guidelines
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {icons.map(({ name, Component, description }) => (
            <Card key={name} className="hover:shadow-lg transition-all hover:-translate-y-1">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-3">
                  <Component size={48} />
                </div>
                <CardTitle className="text-lg font-display">{name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-sm">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Size Variations */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Size Variations</CardTitle>
            <CardDescription>Icons scale to any size while maintaining quality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-8 justify-center">
              <div className="text-center space-y-2">
                <BrandIcons.MapPin size={16} />
                <p className="text-xs text-muted-foreground">16px</p>
              </div>
              <div className="text-center space-y-2">
                <BrandIcons.Chat size={24} />
                <p className="text-xs text-muted-foreground">24px</p>
              </div>
              <div className="text-center space-y-2">
                <BrandIcons.Luggage size={32} />
                <p className="text-xs text-muted-foreground">32px</p>
              </div>
              <div className="text-center space-y-2">
                <BrandIcons.Calendar size={48} />
                <p className="text-xs text-muted-foreground">48px</p>
              </div>
              <div className="text-center space-y-2">
                <BrandIcons.Goose size={64} />
                <p className="text-xs text-muted-foreground">64px</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card>
          <CardHeader>
            <CardTitle className="font-display">Brand Colors</CardTitle>
            <CardDescription>Icons use our brand color palette</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <div className="w-full h-24 bg-primary rounded-2xl flex items-center justify-center">
                  <BrandIcons.MapPin size={40} />
                </div>
                <p className="font-semibold text-primary">Primary Blue</p>
                <p className="text-xs text-muted-foreground">hsl(200 35% 55%)</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-full h-24 bg-accent rounded-2xl flex items-center justify-center">
                  <BrandIcons.Calendar size={40} />
                </div>
                <p className="font-semibold" style={{ color: 'hsl(42 90% 45%)' }}>Golden Yellow</p>
                <p className="text-xs text-muted-foreground">hsl(42 95% 60%)</p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-full h-24 bg-secondary rounded-2xl flex items-center justify-center">
                  <BrandIcons.Group size={40} />
                </div>
                <p className="font-semibold text-secondary">Olive Green</p>
                <p className="text-xs text-muted-foreground">hsl(75 30% 50%)</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IconShowcase;