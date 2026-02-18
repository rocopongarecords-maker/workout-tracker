import { useState } from 'react';
import { ArrowLeft, Globe, Lock, UserCheck, Loader2, Calendar, Dumbbell } from 'lucide-react';

const CATEGORIES = [
  { value: 'hypertrophy', label: 'Hypertrophy' },
  { value: 'strength', label: 'Strength' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'hyrox', label: 'Hyrox' },
  { value: 'bodyweight', label: 'Bodyweight' },
  { value: 'powerlifting', label: 'Powerlifting' },
];

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', color: 'green' },
  { value: 'intermediate', label: 'Intermediate', color: 'yellow' },
  { value: 'advanced', label: 'Advanced', color: 'red' },
];

const VISIBILITY_OPTIONS = [
  {
    value: 'public',
    label: 'Public',
    description: 'Anyone can find and subscribe to this program.',
    icon: Globe,
    iconColor: 'text-green-400',
  },
  {
    value: 'invite_only',
    label: 'Invite Only',
    description: 'Only people with your invite link can join.',
    icon: UserCheck,
    iconColor: 'text-blue-400',
  },
  {
    value: 'private',
    label: 'Private',
    description: 'Only you can see this program. Not listed anywhere.',
    icon: Lock,
    iconColor: 'text-slate-400',
  },
];

const PublishProgram = ({ program, marketplace, onBack, onPublished }) => {
  const [description, setDescription] = useState(program.description || '');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);

  const canPublish = description.trim() && category && difficulty;

  const handlePublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    setError(null);
    try {
      await marketplace.publish(program, description.trim(), category, difficulty, visibility);
      onPublished?.();
    } catch (e) {
      console.error('Failed to publish:', e);
      setError(e.message || 'Failed to publish program. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const workoutDays = program.workoutDays || [];

  return (
    <div className="space-y-6 pb-8">
      {/* Back button + Title */}
      <div>
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-4">
          <ArrowLeft size={20} /> Back
        </button>
        <h2 className="text-2xl font-bold text-white">Publish Program</h2>
        <p className="text-sm text-slate-400 mt-1">Share your program with the community</p>
      </div>

      {/* Program info card */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4">
        <h3 className="text-white font-semibold text-lg">{program.name}</h3>
        <div className="flex items-center gap-4 mt-2">
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Calendar size={14} />
            <span>{program.weeks || '?'} weeks</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Dumbbell size={14} />
            <span>{workoutDays.length} day{workoutDays.length !== 1 ? 's' : ''}/week</span>
          </div>
        </div>
      </div>

      {/* Description textarea */}
      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your program - goals, structure, who it's for..."
          rows={4}
          className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-white placeholder-slate-500 text-sm resize-none focus:outline-none focus:border-blue-500/50"
        />
        <p className="text-xs text-slate-500 mt-1">{description.length}/500 characters</p>
      </div>

      {/* Category picker */}
      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Category</label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                category === cat.value
                  ? 'bg-blue-600 text-white border border-blue-500'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Difficulty picker */}
      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Difficulty</label>
        <div className="grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((diff) => {
            const isSelected = difficulty === diff.value;
            const colorMap = {
              green: isSelected ? 'bg-green-600 text-white border-green-500' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-green-400',
              yellow: isSelected ? 'bg-yellow-600 text-white border-yellow-500' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-yellow-400',
              red: isSelected ? 'bg-red-600 text-white border-red-500' : 'bg-slate-800/50 text-slate-400 border-slate-700/50 hover:text-red-400',
            };
            return (
              <button
                key={diff.value}
                onClick={() => setDifficulty(diff.value)}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-colors ${colorMap[diff.color]}`}
              >
                {diff.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Visibility selector */}
      <div>
        <label className="text-sm font-medium text-slate-300 mb-2 block">Visibility</label>
        <div className="space-y-2">
          {VISIBILITY_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = visibility === option.value;
            return (
              <button
                key={option.value}
                onClick={() => setVisibility(option.value)}
                className={`w-full flex items-start gap-3 p-4 rounded-xl border transition-colors text-left ${
                  isSelected
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600'
                }`}
              >
                <Icon size={20} className={`mt-0.5 ${isSelected ? 'text-blue-400' : option.iconColor}`} />
                <div>
                  <p className={`font-medium text-sm ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{option.description}</p>
                </div>
                {/* Radio indicator */}
                <div className="ml-auto mt-0.5">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    isSelected ? 'border-blue-500' : 'border-slate-600'
                  }`}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {/* Publish button */}
      <button
        onClick={handlePublish}
        disabled={!canPublish || publishing}
        className={`w-full px-6 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
          canPublish && !publishing
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
            : 'bg-slate-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        {publishing ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Publishing...
          </>
        ) : (
          'Publish Program'
        )}
      </button>
    </div>
  );
};

export default PublishProgram;
