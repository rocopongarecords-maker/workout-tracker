import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, Search, Star, Users, Loader2, BookOpen, Dumbbell, ShoppingBag } from 'lucide-react';

const CATEGORIES = ['All', 'Hypertrophy', 'Strength', 'Endurance', 'Hyrox', 'Bodyweight', 'Powerlifting'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-500/20 text-green-400',
  intermediate: 'bg-yellow-500/20 text-yellow-400',
  advanced: 'bg-red-500/20 text-red-400',
};

const CATEGORY_COLORS = {
  hypertrophy: 'bg-purple-500/20 text-purple-400',
  strength: 'bg-orange-500/20 text-orange-400',
  endurance: 'bg-cyan-500/20 text-cyan-400',
  hyrox: 'bg-amber-500/20 text-amber-400',
  bodyweight: 'bg-emerald-500/20 text-emerald-400',
  powerlifting: 'bg-red-500/20 text-red-400',
};

const MarketplaceBrowse = ({ marketplace, onSelectProgram, onViewCreatorDashboard, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const debounceRef = useRef(null);

  // Load featured programs on mount
  useEffect(() => {
    marketplace.loadFeatured();
  }, []);

  // Debounced search
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim()) {
        marketplace.search(value.trim());
      } else {
        const cat = selectedCategory === 'All' ? undefined : selectedCategory.toLowerCase();
        const diff = selectedDifficulty === 'All' ? undefined : selectedDifficulty.toLowerCase();
        marketplace.loadFeatured(cat, diff);
      }
    }, 300);
  }, [marketplace, selectedCategory, selectedDifficulty]);

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    const cat = category === 'All' ? undefined : category.toLowerCase();
    const diff = selectedDifficulty === 'All' ? undefined : selectedDifficulty.toLowerCase();
    marketplace.loadFeatured(cat, diff);
  };

  const handleDifficultyFilter = (difficulty) => {
    setSelectedDifficulty(difficulty);
    const cat = selectedCategory === 'All' ? undefined : selectedCategory.toLowerCase();
    const diff = difficulty === 'All' ? undefined : difficulty.toLowerCase();
    marketplace.loadFeatured(cat, diff);
  };

  const programs = marketplace.searchResults || marketplace.featured || [];

  return (
    <div className="space-y-6 pb-8">
      {/* Back button + Title */}
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
          <ArrowLeft size={20} /> Back
        </button>
        <h2 className="text-2xl font-bold text-white">Program Marketplace</h2>
        <p className="text-sm text-slate-400 mt-1">Discover and subscribe to community programs</p>
      </div>

      {/* My Programs / Creator Dashboard card */}
      <button
        onClick={onViewCreatorDashboard}
        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 flex items-center justify-between hover:border-blue-500/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <BookOpen size={20} className="text-blue-400" />
          </div>
          <div className="text-left">
            <p className="text-white font-semibold">My Programs</p>
            <p className="text-sm text-slate-400">
              {marketplace.myPublished?.length || 0} published program{(marketplace.myPublished?.length || 0) !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Search input */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search programs..."
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl pl-10 pr-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Category filter capsules */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryFilter(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Difficulty filter row */}
      <div className="flex gap-2">
        {DIFFICULTIES.map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => handleDifficultyFilter(difficulty)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedDifficulty === difficulty
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:text-white'
            }`}
          >
            {difficulty}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {marketplace.loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={32} className="text-blue-400 animate-spin" />
        </div>
      )}

      {/* Empty state */}
      {!marketplace.loading && programs.length === 0 && (
        <div className="text-center py-12">
          <ShoppingBag size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Programs Found</h3>
          <p className="text-slate-400 text-sm">
            {searchQuery ? 'Try a different search term or adjust your filters.' : 'Be the first to publish a program!'}
          </p>
        </div>
      )}

      {/* Program cards grid */}
      {!marketplace.loading && programs.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {programs.map((program) => {
            const categoryKey = (program.category || '').toLowerCase();
            const difficultyKey = (program.difficulty || '').toLowerCase();

            return (
              <button
                key={program.id}
                onClick={() => onSelectProgram(program)}
                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 text-left hover:border-blue-500/30 transition-colors"
              >
                {/* Header: Name + Author */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold truncate">{program.name}</h3>
                    <p className="text-sm text-slate-400">
                      {program.is_builtin ? (
                        <span className="text-amber-400 font-medium">ZWAR</span>
                      ) : (
                        <span>{program.authorEmoji || '👤'} {program.authorName || 'Anonymous'}</span>
                      )}
                    </p>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center gap-1 ml-2">
                    <Star size={14} className="text-yellow-400 fill-yellow-400" />
                    <span className="text-sm text-white font-medium">
                      {program.avg_rating ? program.avg_rating.toFixed(1) : '--'}
                    </span>
                  </div>
                </div>

                {/* Subscribers */}
                <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                  <Users size={12} />
                  <span>{program.subscriber_count || 0} subscriber{(program.subscriber_count || 0) !== 1 ? 's' : ''}</span>
                </div>

                {/* Pills + Details */}
                <div className="flex flex-wrap items-center gap-2">
                  {program.category && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${CATEGORY_COLORS[categoryKey] || 'bg-slate-700/50 text-slate-300'}`}>
                      {program.category}
                    </span>
                  )}
                  {program.difficulty && (
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${DIFFICULTY_COLORS[difficultyKey] || 'bg-slate-700/50 text-slate-300'}`}>
                      {program.difficulty}
                    </span>
                  )}
                  <span className="text-xs text-slate-500">
                    {program.weeks || '?'} weeks
                  </span>
                  <span className="text-xs text-slate-500">
                    {program.days_per_week || '?'} days/week
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MarketplaceBrowse;
