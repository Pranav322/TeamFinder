"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Search } from "lucide-react";
import Link from "next/link";

export function HeroParallaxDemo() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #000 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Find your
              <br />
              <span className="font-medium text-gray-700">perfect team</span>
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto font-light leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Connect with skilled developers, designers, and creators. 
              Build amazing projects together.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Link href="/postprojects">
                <motion.button
                  className="group flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-full font-medium hover:bg-gray-800 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Plus className="w-5 h-5" />
                  Start a Project
                </motion.button>
              </Link>
              
              <Link href="/projects">
                <motion.button
                  className="group flex items-center gap-2 px-8 py-4 border border-gray-300 text-gray-700 rounded-full font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Search className="w-5 h-5" />
                  Explore Projects
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Simple Stats */}
          <motion.div
            className="mt-20 pt-12 border-t border-gray-100"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">1,000+</div>
                <div className="text-sm text-gray-500">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">5,000+</div>
                <div className="text-sm text-gray-500">Team Members</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-light text-gray-900 mb-1">99%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Elements - Minimal */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-gray-300 rounded-full"
        animate={{
          y: [-10, 10, -10],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/3 w-1 h-1 bg-gray-400 rounded-full"
        animate={{
          y: [10, -10, 10],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-1.5 h-1.5 bg-gray-300 rounded-full"
        animate={{
          y: [-8, 8, -8],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
}
