import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// Map Pin Icon - Primary Blue
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
      fill="hsl(200 35% 55%)"
      stroke="hsl(200 40% 40%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle 
      cx="12" 
      cy="9" 
      r="2.5" 
      fill="white"
      stroke="hsl(200 40% 40%)"
      strokeWidth="1"
    />
  </svg>
);

// Luggage Icon - Olive Green
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
      rx="2" 
      fill="hsl(75 30% 50%)"
      stroke="hsl(75 35% 35%)"
      strokeWidth="1.5"
    />
    <rect 
      x="9" 
      y="4" 
      width="6" 
      height="4" 
      rx="1" 
      fill="hsl(75 30% 50%)"
      stroke="hsl(75 35% 35%)"
      strokeWidth="1.5"
    />
    <line 
      x1="12" 
      y1="11" 
      x2="12" 
      y2="17" 
      stroke="hsl(75 35% 35%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="8" cy="20" r="1" fill="hsl(75 35% 35%)" />
    <circle cx="16" cy="20" r="1" fill="hsl(75 35% 35%)" />
  </svg>
);

// Chat Bubble Icon - Primary Blue
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
      fill="hsl(200 35% 55%)"
      stroke="hsl(200 40% 40%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="9" cy="12" r="1" fill="white" />
    <circle cx="12" cy="12" r="1" fill="white" />
    <circle cx="15" cy="12" r="1" fill="white" />
  </svg>
);

// Calendar Icon - Yellow Accent
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
      rx="2" 
      fill="hsl(42 95% 60%)"
      stroke="hsl(42 90% 45%)"
      strokeWidth="1.5"
    />
    <line 
      x1="3" 
      y1="10" 
      x2="21" 
      y2="10" 
      stroke="hsl(42 90% 45%)"
      strokeWidth="1.5"
    />
    <line 
      x1="8" 
      y1="4" 
      x2="8" 
      y2="8" 
      stroke="hsl(42 90% 45%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line 
      x1="16" 
      y1="4" 
      x2="16" 
      y2="8" 
      stroke="hsl(42 90% 45%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <circle cx="8" cy="14" r="1" fill="hsl(42 90% 45%)" />
    <circle cx="12" cy="14" r="1" fill="hsl(42 90% 45%)" />
    <circle cx="16" cy="14" r="1" fill="hsl(42 90% 45%)" />
  </svg>
);

// Goose Flying Icon - Primary Blue
export const GooseIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M3 12c0-2 1.5-3.5 3.5-3.5h.5c1 0 2-.5 2.5-1.5l1-2c.5-1 1.5-1.5 2.5-1.5s2 .5 2.5 1.5l1 2c.5 1 1.5 1.5 2.5 1.5h.5c2 0 3.5 1.5 3.5 3.5" 
      stroke="hsl(200 35% 55%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle 
      cx="12" 
      cy="13" 
      r="4" 
      fill="hsl(200 35% 55%)"
      stroke="hsl(200 40% 40%)"
      strokeWidth="1.5"
    />
    <circle cx="11" cy="12" r="1" fill="white" />
    <path 
      d="M15 13c.5.5 1 1 2 1" 
      stroke="hsl(42 95% 60%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Users/Group Icon - Olive Green
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
      r="3" 
      fill="hsl(75 30% 50%)"
      stroke="hsl(75 35% 35%)"
      strokeWidth="1.5"
    />
    <path 
      d="M3 21c0-3.3 2.7-6 6-6s6 2.7 6 6" 
      stroke="hsl(75 35% 35%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle 
      cx="17" 
      cy="7" 
      r="2.5" 
      fill="hsl(75 30% 50%)"
      stroke="hsl(75 35% 35%)"
      strokeWidth="1.5"
    />
    <path 
      d="M21 21c0-2.5-2-4.5-4.5-4.5" 
      stroke="hsl(75 35% 35%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

// Food/Dining Icon - Yellow Accent
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
      stroke="hsl(42 90% 45%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <line 
      x1="5" 
      y1="12" 
      x2="5" 
      y2="22" 
      stroke="hsl(42 90% 45%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path 
      d="M18 2c0 2.8-1.6 5.2-4 6.3V22" 
      stroke="hsl(42 90% 45%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      fill="none"
    />
    <circle 
      cx="18" 
      cy="2" 
      r="1.5" 
      fill="hsl(42 95% 60%)"
    />
  </svg>
);

// Clock/Time Icon - Primary Blue
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
      fill="hsl(200 35% 55%)"
      stroke="hsl(200 40% 40%)"
      strokeWidth="1.5"
    />
    <path 
      d="M12 6v6l4 2" 
      stroke="white"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Map View Icon - Olive Green
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
      fill="hsl(75 30% 50%)"
      stroke="hsl(75 35% 35%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <line 
      x1="9" 
      y1="3" 
      x2="9" 
      y2="18" 
      stroke="hsl(75 35% 35%)"
      strokeWidth="1.5"
    />
    <line 
      x1="15" 
      y1="6" 
      x2="15" 
      y2="21" 
      stroke="hsl(75 35% 35%)"
      strokeWidth="1.5"
    />
  </svg>
);

// Heart/Favorite Icon - Yellow Accent
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
      fill="hsl(42 95% 60%)"
      stroke="hsl(42 90% 45%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
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
  Group: GroupIcon,
  Dining: DiningIcon,
  Clock: ClockIcon,
  MapView: MapViewIcon,
  Heart: HeartIcon,
};