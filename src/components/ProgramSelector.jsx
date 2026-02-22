import { useState, useEffect, useRef, useCallback } from 'react';

const BUILT_IN_PROGRAMS = [
  {
    id: 'jeff_nippard_lpp',
    name: "16-Week Legs-Push-Pull",
    description: '16-week evidence-based program with 6 training days per week. Block 1 focuses on technique & volume, Block 2 on higher effort.',
    weeks: 16,
    daysPerWeek: 6,
    category: 'Hypertrophy',
    difficulty: 'Intermediate',
    isDefault: true,
    isBuiltIn: true
  },
  {
    id: 'jeff_nippard_fullbody',
    name: "Full Body Program",
    description: '12-week full body program, 4 days per week. Each session hits all major muscle groups. Block 1: volume, Block 2: intensity.',
    weeks: 12,
    daysPerWeek: 4,
    category: 'Hypertrophy',
    difficulty: 'Beginner',
    isDefault: true,
    isBuiltIn: true
  },
  {
    id: 'hyrox_prep',
    name: "Hyrox Race Prep",
    description: '10-week Hyrox preparation program. Combines strength training with race-specific stations (Ski Erg, Sled Push/Pull, Wall Ball, etc.).',
    weeks: 10,
    daysPerWeek: 4,
    category: 'Hyrox',
    difficulty: 'Intermediate',
    isDefault: true,
    isBuiltIn: true
  }
];

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

const ProgramSelector = ({
  programs,
  activeProgram,
  onSelectProgram,
  onCreateProgram,
  onDeleteProgram,
  onViewProgramDetail,
  onBack,
  marketplace
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const debounceRef = useRef(null);

  // Load community programs on mount
  useEffect(() => {
    if (marketplace) {
      marketplace.loadFeatured();
    }
  }, []);

  // Debounced search for community programs
  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
    if (!marketplace) return;
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
    if (!marketplace) return;
    const cat = category === 'All' ? undefined : category.toLowerCase();
    const diff = selectedDifficulty === 'All' ? undefined : selectedDifficulty.toLowerCase();
    marketplace.loadFeatured(cat, diff);
  };

  const handleDifficultyFilter = (difficulty) => {
    setSelectedDifficulty(difficulty);
    if (!marketplace) return;
    const cat = selectedCategory === 'All' ? undefined : selectedCategory.toLowerCase();
    const diff = difficulty === 'All' ? undefined : difficulty.toLowerCase();
    marketplace.loadFeatured(cat, diff);
  };

  const activeProgramId = activeProgram || 'jeff_nippard_lpp';

  // Build unified program list
  const customPrograms = (programs || []).map(p => ({ ...p, isCustom: true }));
  const communityPrograms = (marketplace?.searchResults || marketplace?.featured || []);

  // Filter built-in + custom by search/category/difficulty
  const filterLocal = (p) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!(p.name || '').toLowerCase().includes(q) && !(p.description || '').toLowerCase().includes(q)) return false;
    }
    if (selectedCategory !== 'All') {
      const pCat = (p.category || '').toLowerCase();
      if (pCat && pCat !== selectedCategory.toLowerCase()) return false;
    }
    if (selectedDifficulty !== 'All') {
      const pDiff = (p.difficulty || '').toLowerCase();
      if (pDiff && pDiff !== selectedDifficulty.toLowerCase()) return false;
    }
    return true;
  };

  const filteredBuiltIn = BUILT_IN_PROGRAMS.filter(filterLocal);
  const filteredCustom = customPrograms.filter(filterLocal);

  // Remove community programs that duplicate built-in or custom IDs
  const builtInIds = new Set(BUILT_IN_PROGRAMS.map(p => p.id));
  const customIds = new Set(customPrograms.map(p => p.id));
  const filteredCommunity = communityPrograms.filter(p => !builtInIds.has(p.id) && !customIds.has(p.id));

  const hasResults = filteredBuiltIn.length > 0 || filteredCustom.length > 0 || filteredCommunity.length > 0;
  const isSearching = searchQuery.trim().length > 0 || selectedCategory !== 'All' || selectedDifficulty !== 'All';

  // Active program details for the header
  const activeDetails = BUILT_IN_PROGRAMS.find(p => p.id === activeProgramId)
    || customPrograms.find(p => p.id === activeProgramId);

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="btn-back">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <h2 className="text-xl font-bold text-white">Programs</h2>
        <div className="w-16" />
      </div>

      {/* Active program card */}
      {activeDetails && (
        <div className="glass-card border-blue-500/30 shadow-glow-blue overflow-hidden">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-bold rounded-full">
                ACTIVE
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Current Program</span>
            </div>
            <h3 className="text-sm font-bold text-white">{activeDetails.name}</h3>
            <div className="flex gap-3 mt-1">
              <span className="text-[10px] text-slate-400">{activeDetails.weeks} weeks</span>
              <span className="text-[10px] text-slate-400">{activeDetails.daysPerWeek || activeDetails.workoutDays?.length || '?'} days/week</span>
              <span className="text-[10px] text-slate-400">
                {activeDetails.isBuiltIn ? 'by ZWAR' : activeDetails.isCoached ? `by ${activeDetails.coachName || 'Coach'}` : activeDetails.isCustom ? 'by you' : ''}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search programs..."
          className="w-full bg-app-surface/50 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-blue-500/50"
        />
      </div>

      {/* Category filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => handleCategoryFilter(category)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-app-surface/50 text-slate-400 hover:text-white'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Difficulty filter chips */}
      <div className="flex gap-2">
        {DIFFICULTIES.map((difficulty) => (
          <button
            key={difficulty}
            onClick={() => handleDifficultyFilter(difficulty)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedDifficulty === difficulty
                ? 'bg-blue-600 text-white'
                : 'bg-app-surface/50 text-slate-400 hover:text-white'
            }`}
          >
            {difficulty}
          </button>
        ))}
      </div>

      {/* Loading indicator for community programs */}
      {marketplace?.loading && (
        <div className="flex items-center justify-center py-4">
          <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Program list */}
      <div className="space-y-3">
        {/* Built-in programs */}
        {filteredBuiltIn.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            isActive={activeProgramId === program.id}
            onSelect={() => onSelectProgram(program.id)}
            onViewDetail={onViewProgramDetail ? () => onViewProgramDetail(program) : null}
            tag="ZWAR"
            tagColor="text-amber-400"
          />
        ))}

        {/* Custom programs */}
        {filteredCustom.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            isActive={activeProgramId === program.id}
            onSelect={() => onSelectProgram(program.id)}
            onDelete={() => onDeleteProgram(program.id)}
            tag={program.isCoached ? `${program.coachName || 'Coach'}'s Plan` : 'My Program'}
            tagColor={program.isCoached ? 'text-emerald-400' : 'text-blue-400'}
          />
        ))}

        {/* Community programs */}
        {filteredCommunity.map((program) => (
          <ProgramCard
            key={program.id}
            program={program}
            isActive={false}
            onViewDetail={onViewProgramDetail ? () => onViewProgramDetail(program) : null}
            tag={program.is_builtin ? 'ZWAR' : (program.authorName || 'Community')}
            tagColor={program.is_builtin ? 'text-amber-400' : 'text-slate-400'}
            showRating
            showSubscribers
          />
        ))}
      </div>

      {/* Empty state */}
      {!marketplace?.loading && !hasResults && isSearching && (
        <div className="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-slate-600 mb-3">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
          </svg>
          <p className="text-sm text-slate-400">No programs match your search.</p>
        </div>
      )}

      {/* Create custom program */}
      <button
        onClick={onCreateProgram}
        className="w-full py-4 glass-card-interactive text-blue-400 font-semibold flex items-center justify-center gap-2 border-2 border-dashed border-white/[0.08]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Create Custom Program
      </button>
    </div>
  );
};

// Unified program card component
const ProgramCard = ({ program, isActive, onSelect, onDelete, onViewDetail, tag, tagColor, showRating, showSubscribers }) => {
  const categoryKey = (program.category || '').toLowerCase();
  const difficultyKey = (program.difficulty || '').toLowerCase();
  const handleClick = onViewDetail || onSelect;

  return (
    <div
      onClick={handleClick}
      className={`glass-card overflow-hidden transition-all cursor-pointer hover:border-blue-500/30 ${
        isActive ? 'border-blue-500/30 shadow-glow-blue' : ''
      }`}
    >
      <div className="p-4">
        {/* Name + tag + active badge */}
        <div className="flex items-start justify-between mb-1">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-bold text-white">{program.name}</h3>
              {isActive && (
                <span className="px-2 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-[10px] font-bold rounded-full">
                  ACTIVE
                </span>
              )}
            </div>
            <p className={`text-[11px] font-medium mt-0.5 ${tagColor || 'text-slate-400'}`}>
              {program.authorEmoji ? `${program.authorEmoji} ` : ''}{tag}
            </p>
          </div>
          {/* Rating */}
          {showRating && program.avg_rating > 0 && (
            <div className="flex items-center gap-1 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-yellow-400">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              <span className="text-xs text-white font-medium">{program.avg_rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {program.description && (
          <p className="text-xs text-slate-400 mt-1 line-clamp-2">{program.description}</p>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {program.category && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${CATEGORY_COLORS[categoryKey] || 'bg-app-surface-light/50 text-slate-300'}`}>
              {program.category}
            </span>
          )}
          {program.difficulty && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${DIFFICULTY_COLORS[difficultyKey] || 'bg-app-surface-light/50 text-slate-300'}`}>
              {program.difficulty}
            </span>
          )}
          <span className="text-[10px] text-slate-500">
            {program.weeks || '?'} weeks
          </span>
          <span className="text-[10px] text-slate-500">
            {program.daysPerWeek || program.days_per_week || program.workoutDays?.length || '?'} days/week
          </span>
          {showSubscribers && (program.subscriber_count || 0) > 0 && (
            <span className="text-[10px] text-slate-500">
              {program.subscriber_count} subscriber{program.subscriber_count !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Actions for local programs (switch / delete) */}
        {(onSelect || onDelete) && !onViewDetail && (
          <div className="flex gap-2 mt-3">
            {onSelect && !isActive && (
              <button
                onClick={(e) => { e.stopPropagation(); onSelect(); }}
                className="flex-1 py-2 btn-primary text-sm"
              >
                Switch to This
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="px-3 py-2 btn-danger text-sm"
              >
                Delete
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgramSelector;
