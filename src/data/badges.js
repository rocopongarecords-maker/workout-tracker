export const badges = [
  // ── Milestone Badges ──
  {
    id: 'first_workout',
    name: 'First Rep',
    description: 'Complete your first workout',
    icon: '🏋️',
    category: 'milestone',
    tier: 'bronze'
  },
  {
    id: 'workouts_10',
    name: 'Getting Serious',
    description: 'Complete 10 workouts',
    icon: '💪',
    category: 'milestone',
    tier: 'bronze'
  },
  {
    id: 'workouts_25',
    name: 'Dedicated',
    description: 'Complete 25 workouts',
    icon: '🔥',
    category: 'milestone',
    tier: 'silver'
  },
  {
    id: 'workouts_50',
    name: 'Iron Will',
    description: 'Complete 50 workouts',
    icon: '⚡',
    category: 'milestone',
    tier: 'gold'
  },
  {
    id: 'block1_complete',
    name: 'Block 1 Done',
    description: 'Complete all Block 1 workouts (weeks 1-8)',
    icon: '📦',
    category: 'milestone',
    tier: 'gold'
  },
  {
    id: 'block2_complete',
    name: 'Block 2 Done',
    description: 'Complete all Block 2 workouts (weeks 9-16)',
    icon: '📦',
    category: 'milestone',
    tier: 'gold'
  },
  {
    id: 'program_complete',
    name: 'Program Graduate',
    description: 'Complete all 96 workouts in the 16-week program',
    icon: '🎓',
    category: 'milestone',
    tier: 'platinum'
  },

  // ── Consistency Badges ──
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Complete 3 consecutive workout days',
    icon: '🔗',
    category: 'consistency',
    tier: 'bronze'
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Complete 7 consecutive workout days',
    icon: '📅',
    category: 'consistency',
    tier: 'silver'
  },
  {
    id: 'full_week',
    name: 'Perfect Week',
    description: 'Complete all 6 workouts in a single week',
    icon: '✅',
    category: 'consistency',
    tier: 'silver'
  },
  {
    id: 'full_weeks_4',
    name: 'Month of Iron',
    description: 'Complete 4 perfect weeks',
    icon: '🗓️',
    category: 'consistency',
    tier: 'gold'
  },

  // ── Strength Badges ──
  {
    id: 'first_pr',
    name: 'New Record',
    description: 'Set your first personal record',
    icon: '🏆',
    category: 'strength',
    tier: 'bronze'
  },
  {
    id: 'prs_10',
    name: 'PR Machine',
    description: 'Set 10 personal records',
    icon: '🥇',
    category: 'strength',
    tier: 'silver'
  },
  {
    id: 'prs_25',
    name: 'Record Breaker',
    description: 'Set 25 personal records',
    icon: '💎',
    category: 'strength',
    tier: 'gold'
  },

  // ── Volume Badges ──
  {
    id: 'volume_10k',
    name: '10K Club',
    description: 'Lift 10,000 kg total volume',
    icon: '🪨',
    category: 'volume',
    tier: 'bronze'
  },
  {
    id: 'volume_50k',
    name: '50K Lifter',
    description: 'Lift 50,000 kg total volume',
    icon: '🏔️',
    category: 'volume',
    tier: 'silver'
  },
  {
    id: 'volume_100k',
    name: 'Hundred Tonner',
    description: 'Lift 100,000 kg total volume',
    icon: '🌋',
    category: 'volume',
    tier: 'gold'
  },
  {
    id: 'volume_500k',
    name: 'Half Million',
    description: 'Lift 500,000 kg total volume',
    icon: '🚀',
    category: 'volume',
    tier: 'platinum'
  },

  // ── Explorer Badges ──
  {
    id: 'all_types',
    name: 'Well Rounded',
    description: 'Complete all 6 workout types (Legs1, Legs2, Push1, Push2, Pull1, Pull2)',
    icon: '🧭',
    category: 'explorer',
    tier: 'silver'
  },
  {
    id: 'first_superset',
    name: 'Superset!',
    description: 'Complete a workout that includes supersets',
    icon: '⚡',
    category: 'explorer',
    tier: 'bronze'
  }
];

export const badgeCategories = [
  { id: 'milestone', name: 'Milestones', icon: '🏅' },
  { id: 'consistency', name: 'Consistency', icon: '📅' },
  { id: 'strength', name: 'Strength', icon: '💪' },
  { id: 'volume', name: 'Volume', icon: '🪨' },
  { id: 'explorer', name: 'Explorer', icon: '🧭' }
];

export const tierColors = {
  bronze: { bg: 'bg-amber-900/20', border: 'border-amber-700/50', text: 'text-amber-500' },
  silver: { bg: 'bg-slate-600/20', border: 'border-slate-400/50', text: 'text-slate-300' },
  gold: { bg: 'bg-yellow-900/20', border: 'border-yellow-500/50', text: 'text-yellow-400' },
  platinum: { bg: 'bg-purple-900/20', border: 'border-purple-400/50', text: 'text-purple-400' }
};
