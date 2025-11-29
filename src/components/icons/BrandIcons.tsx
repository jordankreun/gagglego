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

// Goose Icon - Cute white goose with big eyes and rosy cheeks
export const GooseIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fluffy body */}
    <ellipse 
      cx="12" 
      cy="15" 
      rx="6" 
      ry="5" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Large head with cute proportions */}
    <circle 
      cx="12" 
      cy="7.5" 
      r="4.5" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Big expressive eye with highlight sparkle */}
    <circle cx="10.5" cy="7" r="1.8" fill="hsl(0 0% 29%)" />
    <circle cx="11" cy="6.5" r="0.7" fill="white" />
    
    {/* Friendly orange beak */}
    <ellipse 
      cx="15.5" 
      cy="7.5" 
      rx="2" 
      ry="1.2" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
    
    {/* Rosy cheek */}
    <circle cx="13" cy="9" r="1.2" fill="hsl(350 80% 75%)" opacity="0.5" />
    
    {/* Cute webbed feet */}
    <path 
      d="M9 19c-.5.5-1 1-1.5 1.5 M9 19c0 .7-.3 1.3-.8 1.8 M9 19c0 .7.3 1.3.8 1.8" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path 
      d="M14 19c.5.5 1 1 1.5 1.5 M14 19c0 .7.3 1.3.8 1.8 M14 19c0 .7-.3 1.3-.8 1.8" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="1.5"
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

// Gosling Icon - Adorable baby goose with huge eyes and fluffy body
export const GoslingIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Fluffy round body - baby proportions */}
    <ellipse 
      cx="12" 
      cy="14.5" 
      rx="5" 
      ry="4" 
      fill="hsl(45 90% 70%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Big head (chibi/kawaii style) */}
    <circle 
      cx="12" 
      cy="8.5" 
      r="4" 
      fill="hsl(45 90% 70%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Extra big cute eyes with sparkle */}
    <circle cx="10.2" cy="8" r="2" fill="hsl(0 0% 29%)" />
    <circle cx="10.7" cy="7.5" r="0.8" fill="white" />
    
    {/* Tiny adorable beak */}
    <ellipse 
      cx="14.5" 
      cy="8.5" 
      rx="1.3" 
      ry="0.8" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
    
    {/* Two rosy cheeks for maximum cuteness */}
    <circle cx="8.5" cy="9.5" r="1" fill="hsl(350 80% 75%)" opacity="0.4" />
    <circle cx="13.5" cy="9.8" r="0.9" fill="hsl(350 80% 75%)" opacity="0.4" />
    
    {/* Small fluffy wing suggestion */}
    <ellipse 
      cx="7.5" 
      cy="13.5" 
      rx="1.5" 
      ry="2" 
      fill="hsl(45 90% 65%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
    <ellipse 
      cx="16.5" 
      cy="13.5" 
      rx="1.5" 
      ry="2" 
      fill="hsl(45 90% 65%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
    
    {/* Stubby baby feet */}
    <path 
      d="M10 18c-.3.4-.6.8-.9 1.2 M10 18c-.1.5-.3 1-.5 1.4" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path 
      d="M14 18c.3.4.6.8.9 1.2 M14 18c.1.5.3 1 .5 1.4" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Flying Goose Icon - Goose in flight with wings spread
export const FlyingGooseIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body in flight */}
    <ellipse 
      cx="12" 
      cy="12" 
      rx="4" 
      ry="3" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Head */}
    <circle 
      cx="10" 
      cy="8" 
      r="2.5" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Eye */}
    <circle cx="9.2" cy="7.8" r="1" fill="hsl(0 0% 29%)" />
    <circle cx="9.5" cy="7.5" r="0.4" fill="white" />
    
    {/* Beak */}
    <ellipse 
      cx="7.5" 
      cy="8" 
      rx="1.2" 
      ry="0.7" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
    
    {/* Left wing extended */}
    <path 
      d="M8 11 L3 8 C2 7.5 2 9 3 10 L8 12" 
      fill="hsl(0 0% 95%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Right wing extended */}
    <path 
      d="M16 11 L21 8 C22 7.5 22 9 21 10 L16 12" 
      fill="hsl(0 0% 95%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    
    {/* Tail feathers */}
    <path 
      d="M15 13 L18 16 M15 13 L17 17 M15 13 L16 18" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Nesting Goose Icon - Goose sitting on nest
export const NestingGooseIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Nest base */}
    <ellipse 
      cx="12" 
      cy="18" 
      rx="7" 
      ry="2.5" 
      fill="hsl(30 30% 50%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Sitting body */}
    <ellipse 
      cx="12" 
      cy="13" 
      rx="5" 
      ry="4" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Head */}
    <circle 
      cx="12" 
      cy="8" 
      r="3" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Closed happy eye */}
    <path 
      d="M10.5 8 C10.5 7.5 11.5 7.5 11.5 8" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    
    {/* Beak */}
    <ellipse 
      cx="14" 
      cy="8" 
      rx="1.5" 
      ry="0.8" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
    
    {/* Wing tucked */}
    <ellipse 
      cx="9" 
      cy="12" 
      rx="1.5" 
      ry="2.5" 
      fill="hsl(0 0% 95%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
  </svg>
);

// Sleeping Gosling Icon - Baby goose with closed eyes, Zzz
export const SleepingGoslingIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body */}
    <ellipse 
      cx="12" 
      cy="15" 
      rx="4.5" 
      ry="3.5" 
      fill="hsl(45 90% 70%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Head tilted */}
    <circle 
      cx="11" 
      cy="10" 
      r="3.5" 
      fill="hsl(45 90% 70%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Closed sleepy eyes */}
    <path 
      d="M9 10 C9 9.5 10 9.5 10 10" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    
    {/* Beak */}
    <ellipse 
      cx="13" 
      cy="10" 
      rx="1" 
      ry="0.6" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
    
    {/* Zzz */}
    <text 
      x="16" 
      y="7" 
      fontSize="6" 
      fill="hsl(0 0% 29%)" 
      fontWeight="bold"
      fontFamily="sans-serif"
    >
      Z
    </text>
    <text 
      x="18" 
      y="5" 
      fontSize="5" 
      fill="hsl(0 0% 29%)" 
      fontWeight="bold"
      fontFamily="sans-serif"
    >
      z
    </text>
    <text 
      x="19.5" 
      y="3" 
      fontSize="4" 
      fill="hsl(0 0% 29%)" 
      fontWeight="bold"
      fontFamily="sans-serif"
    >
      z
    </text>
  </svg>
);

// Eating Goose Icon - Goose with open beak near food
export const EatingGooseIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body */}
    <ellipse 
      cx="12" 
      cy="14" 
      rx="5" 
      ry="4" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Head */}
    <circle 
      cx="12" 
      cy="8" 
      r="3.5" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Eye looking down */}
    <circle cx="11" cy="8" r="1.3" fill="hsl(0 0% 29%)" />
    <circle cx="11" cy="8.5" r="0.5" fill="white" />
    
    {/* Open beak */}
    <path 
      d="M14 8 L17 7 L17 9 L14 8" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
    
    {/* Food crumbs */}
    <circle cx="18" cy="11" r="0.8" fill="hsl(30 60% 60%)" />
    <circle cx="16.5" cy="12.5" r="0.6" fill="hsl(30 60% 60%)" />
    <circle cx="19" cy="13" r="0.7" fill="hsl(30 60% 60%)" />
  </svg>
);

// Flock Icon - Group of 3+ birds flying in V formation
export const FlockIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Lead bird */}
    <path 
      d="M12 6 L10 8 L12 9 L14 8 Z" 
      fill="hsl(0 0% 29%)"
    />
    
    {/* Left formation bird */}
    <path 
      d="M7 10 L5 12 L7 13 L9 12 Z" 
      fill="hsl(0 0% 29%)"
    />
    
    {/* Right formation bird */}
    <path 
      d="M17 10 L15 12 L17 13 L19 12 Z" 
      fill="hsl(0 0% 29%)"
    />
    
    {/* Left rear bird */}
    <path 
      d="M5 15 L3 17 L5 18 L7 17 Z" 
      fill="hsl(0 0% 50%)"
    />
    
    {/* Right rear bird */}
    <path 
      d="M19 15 L17 17 L19 18 L21 17 Z" 
      fill="hsl(0 0% 50%)"
    />
    
    {/* Formation lines */}
    <path 
      d="M12 8 L7 12 M12 8 L17 12" 
      stroke="hsl(0 0% 70%)"
      strokeWidth="1"
      strokeDasharray="2,2"
    />
  </svg>
);

// Hatching Egg Icon - Egg with crack, gosling peeking out
export const HatchingEggIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Egg shell bottom */}
    <ellipse 
      cx="12" 
      cy="15" 
      rx="6" 
      ry="7" 
      fill="hsl(0 0% 95%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Crack pattern */}
    <path 
      d="M10 8 L12 10 L14 8 M8 12 L10 13 M14 13 L16 12" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    
    {/* Gosling head peeking */}
    <circle 
      cx="12" 
      cy="11" 
      r="2.5" 
      fill="hsl(45 90% 70%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.2"
    />
    
    {/* Big eye */}
    <circle cx="11.5" cy="11" r="1" fill="hsl(0 0% 29%)" />
    <circle cx="11.8" cy="10.7" r="0.4" fill="white" />
    
    {/* Tiny beak */}
    <path 
      d="M13.5 11 L14.5 11" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

// Waddling Goose Icon - Goose walking with feet visible
export const WaddlingGooseIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body tilted forward */}
    <ellipse 
      cx="13" 
      cy="12" 
      rx="5" 
      ry="4" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
      transform="rotate(-10 13 12)"
    />
    
    {/* Head tilted */}
    <circle 
      cx="10" 
      cy="8" 
      r="3" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Eye */}
    <circle cx="9" cy="7.5" r="1" fill="hsl(0 0% 29%)" />
    <circle cx="9.3" cy="7.3" r="0.4" fill="white" />
    
    {/* Beak */}
    <ellipse 
      cx="7.5" 
      cy="8" 
      rx="1.3" 
      ry="0.7" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
    
    {/* Walking legs */}
    <path 
      d="M11 15 L11 18 M11 18 L10 19 M11 18 L12 19" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path 
      d="M15 15 L15 19 M15 19 L14 20 M15 19 L16 20" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

// Driving Goose Icon - Goose with aviator goggles
export const DrivingGooseIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body */}
    <ellipse 
      cx="12" 
      cy="14" 
      rx="5" 
      ry="4" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Head */}
    <circle 
      cx="12" 
      cy="8" 
      r="3.5" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Aviator goggles */}
    <ellipse 
      cx="10.5" 
      cy="7.5" 
      rx="1.8" 
      ry="1.5" 
      fill="hsl(200 70% 80%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.2"
      opacity="0.7"
    />
    <ellipse 
      cx="13.5" 
      cy="7.5" 
      rx="1.8" 
      ry="1.5" 
      fill="hsl(200 70% 80%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.2"
      opacity="0.7"
    />
    <path 
      d="M9 7.5 L8 7 M15 7.5 L16 7" 
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    
    {/* Beak */}
    <ellipse 
      cx="12" 
      cy="10" 
      rx="1.5" 
      ry="0.8" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
  </svg>
);

// Excited Gosling Icon - Gosling with wings up, sparkles
export const ExcitedGoslingIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body bouncing */}
    <ellipse 
      cx="12" 
      cy="15" 
      rx="4.5" 
      ry="3.5" 
      fill="hsl(45 90% 70%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Head */}
    <circle 
      cx="12" 
      cy="9" 
      r="3.5" 
      fill="hsl(45 90% 70%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Wide excited eyes */}
    <circle cx="10.5" cy="9" r="1.5" fill="hsl(0 0% 29%)" />
    <circle cx="11" cy="8.5" r="0.6" fill="white" />
    <circle cx="13.5" cy="9" r="1.5" fill="hsl(0 0% 29%)" />
    <circle cx="14" cy="8.5" r="0.6" fill="white" />
    
    {/* Happy beak */}
    <path 
      d="M12 10.5 C11.5 11 12.5 11 12 10.5" 
      stroke="hsl(28 82% 51%)"
      strokeWidth="1.2"
      strokeLinecap="round"
      fill="hsl(28 82% 51%)"
    />
    
    {/* Wings up */}
    <ellipse 
      cx="8" 
      cy="13" 
      rx="1.5" 
      ry="2.5" 
      fill="hsl(45 90% 65%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
      transform="rotate(-30 8 13)"
    />
    <ellipse 
      cx="16" 
      cy="13" 
      rx="1.5" 
      ry="2.5" 
      fill="hsl(45 90% 65%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
      transform="rotate(30 16 13)"
    />
    
    {/* Sparkles */}
    <path 
      d="M6 8 L6.5 9 L7 8 L6.5 7 Z M18 7 L18.5 8 L19 7 L18.5 6 Z M16 4 L16.3 4.7 L17 4 L16.3 3.3 Z" 
      fill="hsl(42 95% 60%)"
      stroke="hsl(42 95% 60%)"
    />
  </svg>
);

// Alert Goose Icon - Goose with neck extended, looking
export const AlertGooseIcon = ({ className = "", size = 24 }: IconProps) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Body */}
    <ellipse 
      cx="12" 
      cy="16" 
      rx="5" 
      ry="4" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Extended neck */}
    <ellipse 
      cx="12" 
      cy="10" 
      rx="2" 
      ry="4" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Alert head */}
    <circle 
      cx="12" 
      cy="5" 
      r="2.5" 
      fill="hsl(0 0% 98%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1.5"
    />
    
    {/* Wide alert eye */}
    <circle cx="11.5" cy="5" r="1.2" fill="hsl(0 0% 29%)" />
    <circle cx="11.8" cy="4.7" r="0.5" fill="white" />
    
    {/* Beak pointed */}
    <ellipse 
      cx="14" 
      cy="5" 
      rx="1.5" 
      ry="0.7" 
      fill="hsl(28 82% 51%)"
      stroke="hsl(0 0% 29%)"
      strokeWidth="1"
    />
    
    {/* Alert lines */}
    <path 
      d="M16 4 L18 3 M16 6 L18 7" 
      stroke="hsl(28 82% 51%)"
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
  FlyingGoose: FlyingGooseIcon,
  NestingGoose: NestingGooseIcon,
  SleepingGosling: SleepingGoslingIcon,
  EatingGoose: EatingGooseIcon,
  Flock: FlockIcon,
  HatchingEgg: HatchingEggIcon,
  WaddlingGoose: WaddlingGooseIcon,
  DrivingGoose: DrivingGooseIcon,
  ExcitedGosling: ExcitedGoslingIcon,
  AlertGoose: AlertGooseIcon,
};
