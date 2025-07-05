import React, { useState, useMemo, useEffect } from 'react';
import { X, Search, ChevronDown, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from '../../../../../lib/utils';
import { ComponentPreview } from './ComponentPreview';

interface Section {
  id: string;
  name: string;
  description: string;
  category: string;
  subCategory?: string;
  content: any;
  zones?: any;
  thumbnail?: string;
}

interface SectionsPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  sections: Section[];
  onSectionSelect: (section: Section) => void;
  loading?: boolean;
}

export const SectionsPreviewModal = ({ 
  isOpen, 
  onClose, 
  sections, 
  onSectionSelect, 
  loading = false 
}: SectionsPreviewModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Group sections by category and subcategory
  const groupedSections = useMemo(() => {
    const filtered = sections.filter(section => 
      section.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      section.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (section.subCategory && section.subCategory.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const grouped: Record<string, Record<string, Section[]>> = {};
    
    filtered.forEach(section => {
      if (!grouped[section.category]) {
        grouped[section.category] = {};
      }
      
      const subCat = section.subCategory || 'General';
      if (!grouped[section.category][subCat]) {
        grouped[section.category][subCat] = [];
      }
      
      grouped[section.category][subCat].push(section);
    });

    return grouped;
  }, [sections, searchTerm]);

  const categories = Object.keys(groupedSections);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredSections = useMemo(() => {
    if (!selectedCategory) return sections;
    return sections.filter(section => section.category === selectedCategory);
  }, [sections, selectedCategory]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ x: '100%', opacity: 0, scale: 0.95 }}
            animate={{ x: 0, opacity: 1, scale: 1 }}
            exit={{ x: '100%', opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.320, 1] }}
            className="fixed left-0 top-0 h-full w-full max-w-7xl bg-white shadow-2xl z-50 flex rounded-l-3xl overflow-hidden"
          >
            {/* Left Sidebar - Categories */}
            <div className="w-80 bg-gradient-to-br from-slate-50 via-white to-slate-50 border-r border-gray-200 flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Section Library
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Discover and select from our collection</p>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200 group hover:scale-110"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                  </button>
                </div>
                
                {/* Search */}
                <div className="relative">
                  <div className="flex items-center gap-3 w-full px-4 py-3 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent bg-white shadow-sm transition-all duration-200">
                    <Search className="text-gray-400 w-5 h-5 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search sections..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 outline-none text-sm bg-transparent"
                    />
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-2">
                  {/* All Categories */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedCategory(null)}
                    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 text-left group ${
                      selectedCategory === null 
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg' 
                        : 'text-gray-700 hover:bg-white hover:shadow-md bg-white/50'
                    }`}
                  >
                    <div className="flex-1">
                      <span className="font-bold text-base">All Sections</span>
                      <p className="text-sm opacity-80 mt-0.5">Browse entire collection</p>
                    </div>
                    <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                      selectedCategory === null 
                        ? 'bg-white/20 backdrop-blur-sm text-white' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {sections.length}
                    </span>
                  </motion.button>

                  {/* Category List */}
                  {categories.map(category => {
                    const isExpanded = expandedCategories.has(category);
                    const categoryCount = Object.values(groupedSections[category]).flat().length;
                    
                    return (
                      <div key={category} className="space-y-1">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setSelectedCategory(category);
                            toggleCategory(category);
                          }}
                          className={cn(
                            "w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-200 text-left group",
                            selectedCategory === category
                              ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg"
                              : "text-gray-700 hover:bg-white hover:shadow-md hover:bg-gray-100 bg-white/50"
                          )}
                        >
                          <div className="flex-1">
                            <span className="font-bold text-base">{category}</span>
                            <p className="text-sm opacity-80 mt-0.5">
                              {categoryCount} section{categoryCount !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-bold px-3 py-1.5 rounded-full ${
                              selectedCategory === category 
                                ? 'bg-white/20 backdrop-blur-sm text-white' 
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {categoryCount}
                            </span>
                            {isExpanded ? (
                              <ChevronDown className="w-4 h-4 opacity-70" />
                            ) : (
                              <ChevronRight className="w-4 h-4 opacity-70" />
                            )}
                          </div>
                        </motion.button>

                        {/* Subcategories */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-16 space-y-1 pb-2">
                                {Object.keys(groupedSections[category]).map(subCategory => {
                                  const subCategoryCount = groupedSections[category][subCategory].length;
                                  return (
                                    <motion.button
                                      key={subCategory}
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.99 }}
                                      onClick={() => setSelectedCategory(category)}
                                      className={`w-full flex items-center justify-between px-4 py-3 text-sm rounded-xl transition-all duration-200 text-left group ${
                                        selectedCategory === category 
                                          ? "text-blue-700 hover:bg-blue-100" 
                                          : 'text-gray-600 hover:bg-white hover:text-gray-900'
                                      }`}
                                    >
                                      <span className="font-semibold">{subCategory}</span>
                                      <span className={`text-xs px-2 py-1 rounded-full group-hover:bg-white/50 ${
                                        selectedCategory === category 
                                          ? "bg-blue-50 text-blue-700" 
                                          : 'bg-gray-100 text-gray-500'
                                      }`}>
                                        {subCategoryCount}
                                      </span>
                                    </motion.button>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Content - Sections Grid */}
            <div className="flex-1 flex flex-col bg-gradient-to-br from-gray-50 to-white">
              {/* Content Header */}
              <div className="p-6 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedCategory ? `${selectedCategory} Sections` : 'All Sections'}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedCategory 
                        ? `${Object.values(groupedSections[selectedCategory] || {}).flat().length} sections in this category`
                        : `${sections.length} sections available`
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-gray-500">
                      {searchTerm && (
                        <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1.5 rounded-full font-semibold">
                          "{searchTerm}"
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sections Grid */}
              <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-purple-600 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                      </div>
                      <p className="text-gray-700 font-semibold text-lg">Loading sections...</p>
                      <p className="text-sm text-gray-500 mt-1">Preparing your amazing sections</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(selectedCategory ? 
                      Object.values(groupedSections[selectedCategory] || {}).flat() : 
                      Object.values(groupedSections).flatMap(cat => Object.values(cat).flat())
                    ).map((section, index) => {
                      return (
                        <motion.div
                          key={section.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          whileHover={{ scale: 1.03, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          className="bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:border-gray-300 transition-all duration-300 cursor-pointer group"
                          onClick={() => onSectionSelect(section)}
                        >
                          {/* Preview */}
                          <div className="relative overflow-hidden">
                            <ComponentPreview 
                              comp={section} 
                              designWidth={800}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          
                          {/* Content */}
                          <div className="p-6">
                            <div className="flex items-center gap-2 mb-4">
                              <span className="inline-flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-full bg-gray-50 text-gray-700 border border-gray-200">
                                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600"></div>
                                {section.category}
                              </span>
                              {section.subCategory && (
                                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full font-semibold">
                                  {section.subCategory}
                                </span>
                              )}
                            </div>
                            <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors text-lg line-clamp-1">
                              {section.name}
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                              {section.description}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Empty State */}
                {!loading && Object.keys(groupedSections).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center mb-6">
                      <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">No sections found</h3>
                    <p className="text-gray-500 text-center max-w-md leading-relaxed">
                      We couldn't find any sections matching your search. Try different keywords or explore our categories.
                    </p>
                    {searchTerm && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSearchTerm('')}
                        className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl hover:shadow-lg transition-all duration-200 font-semibold"
                      >
                        Clear Search
                      </motion.button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};