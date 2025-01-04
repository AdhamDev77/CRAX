import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const websites = [
  { 
    id: 1, 
    name: 'Modern Portfolio',
    category: 'Portfolio',
    color: '#FF6B6B'
  },
  { 
    id: 2, 
    name: 'E-commerce Store',
    category: 'E-commerce',
    color: '#4ECDC4'
  },
  { 
    id: 3, 
    name: 'Blog Platform',
    category: 'Blog',
    color: '#45B7D1'
  },
  { 
    id: 4, 
    name: 'Restaurant Site',
    category: 'Business',
    color: '#96CEB4'
  }
];

const FloatingWebsiteShowcase = () => {
  const [hoveredId, setHoveredId] = useState(null);

  const calculatePosition = (index) => {
    const total = websites.length;
    const radius = 180; // Reduced radius for half-screen
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2;
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius * 0.5
    };
  };

  return (
    <div className="relative w-full h-[50vh] bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Hero content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20 px-4">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Build Beautiful Websites
        </motion.h1>
        <motion.p 
          className="text-lg text-gray-600 dark:text-gray-300 max-w-xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Create stunning web experiences with our modern templates and components
        </motion.p>
        <motion.button 
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started
        </motion.button>
      </div>

      {/* Background elements */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="absolute z-10 opacity-20"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          <Globe className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </motion.div>

        {websites.map((website, index) => {
          const position = calculatePosition(index);
          return (
            <motion.div
              key={website.id}
              className="absolute"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 0.15,
                scale: 1,
                x: position.x,
                y: position.y
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: index * 0.1
              }}
            >
              <motion.div
                className="w-48 h-72 rounded-xl bg-gradient-to-br"
                style={{
                  backgroundImage: `linear-gradient(to bottom right, ${website.color}66, ${website.color}99)`
                }}
                whileHover={{ scale: 1.05, opacity: 0.8 }}
              />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default FloatingWebsiteShowcase;