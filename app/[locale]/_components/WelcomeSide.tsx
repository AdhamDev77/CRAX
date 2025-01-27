import React from 'react';
import { Layout, Rocket, Palette, Code } from 'lucide-react';
import { motion } from 'framer-motion';

const BackgroundAnimation = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl animate-pulse bg-gradient-to-r from-violet-400/30 to-purple-400/30 dark:from-purple-900/30 dark:to-fuchsia-900/30" />
    <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl animate-pulse animation-delay-2000 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 dark:from-cyan-900/30 dark:to-blue-900/30" />
    <div className="absolute w-[500px] h-[500px] rounded-full blur-3xl animate-pulse animation-delay-4000 bg-gradient-to-r from-indigo-400/30 to-blue-400/30 dark:from-violet-900/30 dark:to-indigo-900/30" />
  </div>
);

const neonGlow = {
  textShadow: '0 0 10px rgba(167, 139, 250, 0.5), 0 0 20px rgba(167, 139, 250, 0.3)'
};

const FeatureCard = ({ icon: Icon, title, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    transition={{ duration: 0.5 }}
    className="rounded-xl p-6 border backdrop-blur-xl transition-colors bg-white/10 border-white/20 dark:bg-black/40 dark:border-purple-500/20 hover:dark:border-purple-500/40"
  >
    <div className="rounded-lg p-3 w-fit bg-gradient-to-br from-violet-600/20 to-indigo-600/20 dark:from-purple-900/40 dark:to-indigo-900/40">
      <Icon className="w-6 h-6 text-white dark:text-purple-400" />
    </div>
    <h3 className="text-lg font-semibold mt-4 text-white dark:text-purple-300" style={neonGlow}>
      {title}
    </h3>
    <p className="mt-2 text-sm text-white/70 dark:text-gray-400">
      {description}
    </p>
  </motion.div>
);

const WelcomeSide = () => {
  return (
    <div className="hidden lg:flex w-1/2 relative overflow-hidden p-12 flex-col justify-between bg-gradient-to-br from-violet-600 to-indigo-700 dark:from-gray-900 dark:to-black">
      <BackgroundAnimation />

      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex items-center space-x-2"
        >
          <Layout className="w-8 h-8 text-white dark:text-purple-400" />
          <span className="text-2xl font-bold tracking-wider text-white dark:text-purple-300" style={neonGlow}>
            CRAX
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-bold mt-12 mb-4 text-white dark:text-purple-200"
          style={neonGlow}
        >
          Build Stunning Websites Without Code
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-lg mb-12 text-white/80 dark:text-gray-400"
        >
          Create professional, functional websites for any profession in minutes - no coding required
        </motion.p>
      </div>

      <div className="relative grid grid-cols-1 gap-6 mt-8">
        <FeatureCard
          icon={Rocket}
          title="Lightning Fast Setup"
          description="Launch your professional website in minutes with our intuitive drag-and-drop builder"
        />
        <FeatureCard
          icon={Palette}
          title="Professional Templates"
          description="Choose from hundreds of customizable templates designed for every profession"
        />
        <FeatureCard
          icon={Code}
          title="Fully Functional"
          description="Get all the features you need: forms, booking systems, galleries, and more - no technical skills required"
        />
      </div>
    </div>
  );
};

export default WelcomeSide;