import { Dumbbell, Calendar } from 'lucide-react';
import { getNextWorkout } from '../utils/getNextWorkout';
import ProgressIndicator from './ProgressIndicator';

const Dashboard = ({ stats, completedWorkouts, onStartWorkout, onViewAllWorkouts, onOpenSettings, onViewBadges, onViewAnalytics, onViewMeasurements, onViewPrograms, onViewExercises, earnedBadges, currentView, setCurrentView, schedule, getWorkoutName: getWorkoutNameProp, programName, totalWeeks }) => {
  const nextWorkout = getNextWorkout(completedWorkouts, schedule);

  const getBlockLabel = (block) => {
    if (block === 1) return 'Block 1 - Technique & Volume';
    if (block === 2) return 'Block 2 - Higher Effort';
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          {programName || "Legs-Push-Pull Tracker"}
        </h1>
        <p className="text-slate-400">
          Week {stats.currentWeek} of {totalWeeks || 16}
        </p>
      </div>

      {stats.allCompleted ? (
        <div className="bg-green-500/20 border-2 border-green-500 rounded-2xl p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Program Complete!
          </h2>
          <p className="text-slate-400">
            Congratulations! You've completed all 16 weeks.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-white mb-4">
              Your Next Workout
            </h2>
            
            {nextWorkout ? (
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Dumbbell size={32} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      {getWorkoutNameProp ? getWorkoutNameProp(nextWorkout.day) || nextWorkout.type : nextWorkout.type}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Day {nextWorkout.day}{nextWorkout.block ? ` • ${getBlockLabel(nextWorkout.block)}` : ''}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => onStartWorkout(nextWorkout.day, nextWorkout.type, nextWorkout.block)}
                  className="w-full py-4 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Calendar size={20} />
                  Start Workout
                </button>
              </div>
            ) : (
              <p className="text-slate-400">
                All workouts completed!
              </p>
            )}
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <ProgressIndicator
              percentage={stats.percentage}
              completed={stats.completed}
              total={stats.totalWorkouts}
            />
          </div>
        </>
      )}

      {/* Quick nav grid */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => onViewAllWorkouts()}
          className="py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Calendar
        </button>
        <button
          onClick={onViewAnalytics}
          className="py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
          </svg>
          Analytics
        </button>
        <button
          onClick={onViewMeasurements}
          className="py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21.3 8.7 8.7 21.3c-1 1-2.5 1-3.4 0l-2.6-2.6c-1-1-1-2.5 0-3.4L15.3 2.7c1-1 2.5-1 3.4 0l2.6 2.6c1 1 1 2.5 0 3.4Z" />
            <path d="m7.5 10.5 2 2" />
            <path d="m10.5 7.5 2 2" />
            <path d="m13.5 4.5 2 2" />
            <path d="m4.5 13.5 2 2" />
          </svg>
          Body
        </button>
        <button
          onClick={onViewBadges}
          className="py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 relative"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 9 8 12 8s5-4 7.5-4a2.5 2.5 0 0 1 0 5H18" />
            <path d="M18 9v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
          </svg>
          Badges
          {(earnedBadges || []).length > 0 && (
            <span className="absolute top-2 right-3 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              {(earnedBadges || []).length}
            </span>
          )}
        </button>
        <button
          onClick={onViewPrograms}
          className="py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
          </svg>
          Programs
        </button>
        <button
          onClick={onViewExercises}
          className="py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Exercises
        </button>
      </div>

      {/* Settings */}
      <button
        onClick={onOpenSettings}
        className="w-full py-3 bg-slate-800/50 text-slate-400 rounded-xl text-sm hover:bg-slate-700 hover:text-white transition-colors flex items-center justify-center gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
        Settings
      </button>
    </div>
  );
};

export default Dashboard;