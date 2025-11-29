import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Map Pin Icon - Charcoal with Orange accent
export const MapPinIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle 
      cx="12" 
      cy="9" 
      r="2.5" 
      fill="white"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
  </svg>
);

// Luggage Icon - Charcoal with Orange accent
export const LuggageIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect 
      x="5" 
      y="8" 
      width="14" 
      height="12" 
      rx="3" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <rect 
      x="9" 
      y="4" 
      width="6" 
      height="5" 
      rx="2" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <circle cx="8" cy="20.5" r="1.5" fill="hsl(0 0% 29%)" />
    <circle cx="16" cy="20.5" r="1.5" fill="hsl(0 0% 29%)" />
  </svg>
);

// Chat Bubble Icon - Charcoal with Orange accent
export const ChatIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="12" r="1.5" fill="white" />
    <circle cx="12" cy="12" r="1.5" fill="white" />
    <circle cx="15" cy="12" r="1.5" fill="white" />
  </svg>
);

// Calendar Icon - Charcoal with Orange accent
export const CalendarIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect 
      x="3" 
      y="6" 
      width="18" 
      height="15" 
      rx="3" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <line 
      x1="3" 
      y1="10.5" 
      x2="21" 
      y2="10.5" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <line 
      x1="8" 
      y1="3" 
      x2="8" 
      y2="8" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <line 
      x1="16" 
      y1="3" 
      x2="16" 
      y2="8" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="8" cy="15" r="1.5" fill="white" />
    <circle cx="12" cy="15" r="1.5" fill="white" />
    <circle cx="16" cy="15" r="1.5" fill="white" />
  </svg>
);

// Goose Icon - Charcoal with Orange beak
export const GooseIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse 
      cx="12" 
      cy="13" 
      rx="5" 
      ry="4.5" 
      fill="hsl(0 0% 29%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <circle 
      cx="12" 
      cy="8" 
      r="3.5" 
      fill="hsl(0 0% 29%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <circle cx="11" cy="7.5" r="1" fill="white" />
    <path 
      d="M15 8.5c.8.4 1.5.8 2.5 1" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path 
      d="M8 14c-1.5 1-2.5 2-2.5 3.5" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path 
      d="M16 14c1.5 1 2.5 2 2.5 3.5" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

// Users/Group Icon - Charcoal with Orange accent
export const GroupIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle 
      cx="9" 
      cy="7" 
      r="3.5" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <path 
      d="M2.5 21c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <circle 
      cx="17" 
      cy="7.5" 
      r="3" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <path 
      d="M21.5 21c0-2.8-2.2-5-5-5" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// Food/Dining Icon - Charcoal with Orange accent
export const DiningIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M8 2v8c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V2" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <line 
      x1="5" 
      y1="12" 
      x2="5" 
      y2="22" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path 
      d="M18 2c0 2.8-1.6 5.2-4 6.3V22" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="2"
      strokeLinecap="round"
      fill="none"
    />
    <circle 
      cx="18" 
      cy="2" 
      r="2" 
      fill="hsl(0 0% 29%)"
    />
  </svg>
);

// Clock/Time Icon - Charcoal with Orange accent
export const ClockIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle 
      cx="12" 
      cy="12" 
      r="9" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <path 
      d="M12 6v6l4 2" 
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="1.5" fill="white" />
  </svg>
);

// Map View Icon - Charcoal with Orange accent
export const MapViewIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3V6z" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line 
      x1="9" 
      y1="3" 
      x2="9" 
      y2="18" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <line 
      x1="15" 
      y1="6" 
      x2="15" 
      y2="21" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
  </svg>
);

// Heart/Favorite Icon - Charcoal with Orange fill
export const HeartIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Gosling Icon - Smaller, cuter version of Goose for kids
export const GoslingIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <ellipse 
      cx="12" 
      cy="14" 
      rx="4" 
      ry="3.5" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <circle 
      cx="12" 
      cy="9.5" 
      r="3" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="2"
    />
    <circle cx="11.2" cy="9" r="0.8" fill="hsl(0 0% 29%)" />
    <path 
      d="M14.5 9.5c.6.3 1.2.5 1.8.7" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path 
      d="M9 15c-1.2.8-2 1.5-2 2.5" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path 
      d="M15 15c1.2.8 2 1.5 2 2.5" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Export all icons
export const BrandIcons = {
  MapPin: MapPinIcon,
  Luggage: LuggageIcon,
  Chat: ChatIcon,
  Calendar: CalendarIcon,
  Goose: GooseIcon,
  Gosling: GoslingIcon,
  Group: GroupIcon,
  Dining: DiningIcon,
  Clock: ClockIcon,
  MapView: MapViewIcon,
  Heart: HeartIcon,
};
