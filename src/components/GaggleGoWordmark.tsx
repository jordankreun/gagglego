import { motion } from "framer-motion";

interface GaggleGoWordmarkProps {
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  animate?: boolean;
}

const sizeClasses = {
  sm: "text-2xl sm:text-3xl",
  md: "text-4xl sm:text-5xl",
  lg: "text-5xl sm:text-6xl md:text-7xl",
  xl: "text-6xl sm:text-7xl md:text-8xl",
  "2xl": "text-7xl sm:text-8xl md:text-9xl",
};

export const GaggleGoWordmark = ({ 
  size = "lg", 
  className = "",
  animate = true 
}: GaggleGoWordmarkProps) => {
  const letters = "Gaggle".split("");
  const goLetters = "GO".split("");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      rotate: -10,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      y: 0,
      rotate: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 200,
      },
    },
  };

  const goVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.5,
      rotate: -20
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring" as const,
        damping: 10,
        stiffness: 150,
        delay: 0.6,
      },
    },
  };

  if (!animate) {
    return (
      <h1 className={`font-display font-medium italic ${sizeClasses[size]} ${className}`}>
        <span className="text-foreground">Gaggle</span>
        <span className="text-accent">GO</span>
      </h1>
    );
  }

  return (
    <motion.h1
      className={`font-display font-medium italic ${sizeClasses[size]} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <span className="inline-flex">
        {letters.map((letter, index) => (
          <motion.span
            key={`gaggle-${index}`}
            variants={letterVariants}
            className="text-foreground inline-block"
          >
            {letter}
          </motion.span>
        ))}
      </span>
      <motion.span 
        className="inline-flex text-accent ml-0.5"
        variants={goVariants}
      >
        {goLetters.map((letter, index) => (
          <motion.span
            key={`go-${index}`}
            className="inline-block"
            whileHover={{ 
              scale: 1.1, 
              rotate: [0, -5, 5, 0],
              transition: { duration: 0.3 }
            }}
          >
            {letter}
          </motion.span>
        ))}
      </motion.span>
    </motion.h1>
  );
};
