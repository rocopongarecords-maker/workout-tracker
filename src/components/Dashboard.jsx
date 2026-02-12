import { Dumbbell, Calendar } from 'lucide-react';
import { getNextWorkout } from '../utils/getNextWorkout';
import { workoutData } from '../data/workoutData';
import ProgressIndicator from './ProgressIndicator';

const Dashboard = ({ stats, completedWorkouts, onStartWorkout, onViewAllWorkouts, currentView, setCurrentView }) => {
  const nextWorkout = getNextWorkout(completedWorkouts);

  const getWorkoutName = (type, block) => {
    const blockKey = `block${block}`;
    return workoutData[blockKey][type]?.name || type;
  };

  const getBlockLabel = (block) => {
    if (block === 1) return 'Block 1 - Technique & Volume';
    if (block === 2) return 'Block 2 - Higher Effort';
    return '';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-white mb-2">
          Legs-Push-Pull Tracker
        </h1>
        <p className="text-slate-400">
          Week {stats.currentWeek} of 16
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
                      {getWorkoutName(nextWorkout.type, nextWorkout.block)}
                    </h3>
                    <p className="text-slate-400 text-sm">
                      Day {nextWorkout.day} • {getBlockLabel(nextWorkout.block)}
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

      <button
        onClick={() => onViewAllWorkouts()}
        className="w-full py-4 bg-slate-800 text-white rounded-xl font-semibold hover:bg-slate-700 transition-colors"
      >
        View All Workouts
      </button>
    </div>
  );
};

export default Dashboard;