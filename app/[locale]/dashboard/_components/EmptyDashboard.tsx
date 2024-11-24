import React from 'react';
import { motion } from 'framer-motion';
import { Layout, Plus, Sparkles, ArrowRight, Palette, Rocket } from 'lucide-react';

const EmptyDashboard = () => {
  return (
    <div className="relative w-full max-w-3xl mx-auto my-12 px-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute w-[500px] h-[500px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-violet-400/10 to-purple-400/10 blur-3xl" />
        <div className="absolute w-[300px] h-[300px] left-1/4 top-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-blue-400/10 to-cyan-400/10 blur-3xl" />
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-xl"
      >
        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4">
          <motion.div
            initial={{ rotate: -15, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Sparkles className="w-8 h-8 text-violet-500" />
          </motion.div>
        </div>

        <div className="text-center space-y-6">
          {/* Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="inline-flex p-4 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-2xl shadow-lg"
          >
            <Layout className="w-12 h-12 text-white" />
          </motion.div>

          {/* Title */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              Start Your Website Journey
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Create your first stunning website with our easy-to-use builder
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            {[
              { icon: Rocket, title: "Quick Setup", desc: "Launch in minutes" },
              { icon: Palette, title: "Pro Templates", desc: "Customizable designs" },
              { icon: Layout, title: "Full Features", desc: "All you need" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
              >
                <feature.icon className="w-6 h-6 text-violet-500 mb-2" />
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-violet-500/25 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Your First Website
            <ArrowRight className="w-4 h-4 ml-1" />
          </motion.button>

          {/* Additional text */}
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Get started in minutes with our professional templates
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default EmptyDashboard;