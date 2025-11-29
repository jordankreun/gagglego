import { motion } from "framer-motion";
import gooseMascot from "@/assets/goose-mascot-animated.png";
import { useState, useEffect } from "react";

interface AnimatedGooseProps {
  size?: "sm" | "md" | "lg" | "xl";
  state?: "idle" | "thinking" | "talking" | "excited";
  className?: string;
  enableConstantAnimation?: boolean;
}

const sizeClasses = {
  sm: "w-12 h-12",
  md: "w-16 h-16",
  lg: "w-24 h-24",
  xl: "w-32 h-32",
};

export const AnimatedGoose = ({ size = "md", state = "idle", className = "", enableConstantAnimation = false }: AnimatedGooseProps) => {
  const [blink, setBlink] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Periodic blinking animation
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000 + Math.random() * 2000);

    return () => clearInterval(blinkInterval);
  }, []);

  // Get animation config based on state
  const getAnimation = () => {
    switch (state) {
      case "thinking":
        return {
          y: [0, -8, 0],
          rotate: [-5, 5, -5],
          transition: {
            repeat: Infinity,
            duration: 1.5,
          },
        };
      case "talking":
        return {
          y: [0, -3, 0, -3, 0],
          scale: [1, 1.05, 1, 1.05, 1],
          transition: {
            repeat: Infinity,
            duration: 0.8,
          },
        };
      case "excited":
        return {
          y: [0, -12, 0],
          rotate: [-8, 8, -8],
          scale: [1, 1.1, 1],
          transition: {
            repeat: Infinity,
            duration: 0.6,
          },
        };
      default: // idle
        return {
          y: [0, -4, 0],
          rotate: [0, -2, 0, 2, 0],
          transition: {
            repeat: Infinity,
            duration: 2,
          },
        };
    }
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]} ${className} cursor-pointer`}
      animate={enableConstantAnimation ? getAnimation() : {}}
      whileHover={enableConstantAnimation ? {} : { scale: 1.05 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.img
        src={gooseMascot}
        alt="Gaggle Go Goose"
        className="w-full h-full object-contain"
        animate={{
          scaleY: blink ? 0.95 : 1,
        }}
        transition={{ duration: 0.1 }}
      />
      
      {/* Honk speech bubble on hover */}
      {isHovered && (
        <motion.div
          className="absolute -top-8 -right-8 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-sm font-bold whitespace-nowrap shadow-lg"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ 
            type: "spring" as const, 
            stiffness: 500, 
            damping: 15 
          }}
        >
          HONK!
          <div className="absolute -bottom-1 left-4 w-3 h-3 bg-accent transform rotate-45" />
        </motion.div>
      )}
      
      {/* Thinking indicator */}
      {state === "thinking" && (
        <motion.div
          className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            repeat: Infinity,
            duration: 1,
          }}
        />
      )}
    </motion.div>
  );
};
