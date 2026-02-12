import { useState } from 'react';
import { useWorkoutStorage } from './hooks/useWorkoutStorage';
import { useProgressTracking } from './hooks/useProgressTracking';
import Dashboard from './components/Dashboard';
import WorkoutDaySelector from './components/WorkoutDaySelector';
import WorkoutScreen from './components/WorkoutScreen';
import WorkoutReview from './components/WorkoutReview';
import SettingsScreen from './components/SettingsScreen';
import { schedule } from './data/schedule';
import './styles/globals.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [reviewDay, setReviewDay] = useState(null);

  const { data, saveWorkout, markComplete, isCompleted, getWorkoutHistory, resetData, importData } = useWorkoutStorage();
  const stats = useProgressTracking(data.completedWorkouts);

  const handleStartWorkout = (dayNumber, workoutType, block) => {
    setSelectedWorkout({ dayNumber, workoutType, block });
    setCurrentView('workout');
  };

  const handleSelectDay = (dayNumber) => {
    const dayData = schedule.find(day => day.day === dayNumber);
    if (dayData && !dayData.rest) {
      setSelectedWorkout({ dayNumber, workoutType: dayData.type, block: dayData.block });
      setCurrentView('workout');
    }
  };

  const handleReviewDay = (dayNumber) => {
    setReviewDay(dayNumber);
    setCurrentView('review');
  };

  const handleSaveWorkout = (dayNumber, workoutData) => {
    saveWorkout(dayNumber, workoutData);
  };

  const handleCompleteWorkout = (dayNumber) => {
    markComplete(dayNumber);
    setCurrentView('dashboard');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-lg mx-auto px-4 py-8">
        {currentView === 'dashboard' && (
          <Dashboard
            stats={stats}
            completedWorkouts={data.completedWorkouts}
            onStartWorkout={handleStartWorkout}
            onViewAllWorkouts={() => setCurrentView('selector')}
            onOpenSettings={() => setCurrentView('settings')}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'selector' && (
          <WorkoutDaySelector
            schedule={schedule}
            completedWorkouts={data.completedWorkouts}
            nextDay={stats.nextDay}
            onSelectDay={handleSelectDay}
            onReviewDay={handleReviewDay}
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        )}

        {currentView === 'workout' && selectedWorkout && (
          <WorkoutScreen
            dayNumber={selectedWorkout.dayNumber}
            workoutType={selectedWorkout.workoutType}
            block={selectedWorkout.block}
            onSave={handleSaveWorkout}
            onComplete={handleCompleteWorkout}
            onCancel={handleBackToDashboard}
            workoutHistory={data.workoutHistory}
            completedWorkouts={data.completedWorkouts}
          />
        )}

        {currentView === 'review' && reviewDay && (
          <WorkoutReview
            dayNumber={reviewDay}
            workoutHistory={data.workoutHistory}
            completedWorkouts={data.completedWorkouts}
            onBack={() => setCurrentView('selector')}
          />
        )}

        {currentView === 'settings' && (
          <SettingsScreen
            data={data}
            onReset={resetData}
            onImport={importData}
            onBack={handleBackToDashboard}
          />
        )}
      </div>
    </div>
  );
}

export default App;
