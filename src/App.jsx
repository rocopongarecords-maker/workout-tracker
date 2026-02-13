import { useState } from 'react';
import { useWorkoutStorage } from './hooks/useWorkoutStorage';
import { useProgressTracking } from './hooks/useProgressTracking';
import { checkBadges } from './utils/checkBadges';
import Dashboard from './components/Dashboard';
import WorkoutDaySelector from './components/WorkoutDaySelector';
import WorkoutScreen from './components/WorkoutScreen';
import WorkoutReview from './components/WorkoutReview';
import WorkoutSummary from './components/WorkoutSummary';
import SettingsScreen from './components/SettingsScreen';
import BadgeScreen from './components/BadgeScreen';
import BadgeAward from './components/BadgeAward';
import { schedule } from './data/schedule';
import './styles/globals.css';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [reviewDay, setReviewDay] = useState(null);
  const [summaryDay, setSummaryDay] = useState(null);
  const [sessionPRs, setSessionPRs] = useState(0);
  const [newBadges, setNewBadges] = useState([]);

  const { data, saveWorkout, markComplete, isCompleted, getWorkoutHistory, resetData, importData, addBadges, incrementPRs } = useWorkoutStorage();
  const stats = useProgressTracking(data.completedWorkouts);

  const handleStartWorkout = (dayNumber, workoutType, block) => {
    setSelectedWorkout({ dayNumber, workoutType, block });
    setSessionPRs(0);
    setCurrentView('workout');
  };

  const handleSelectDay = (dayNumber) => {
    const dayData = schedule.find(day => day.day === dayNumber);
    if (dayData && !dayData.rest) {
      setSelectedWorkout({ dayNumber, workoutType: dayData.type, block: dayData.block });
      setSessionPRs(0);
      setCurrentView('workout');
    }
  };

  const handleEditWorkout = (dayNumber) => {
    const dayData = schedule.find(day => day.day === dayNumber);
    if (dayData) {
      setSelectedWorkout({ dayNumber, workoutType: dayData.type, block: dayData.block, editing: true });
      setSessionPRs(0);
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

    // Check for new badges after completing
    const earnedIds = (data.earnedBadges || []).map(b => b.id);
    const completedAfter = [...new Set([...data.completedWorkouts, dayNumber])];
    const newlyEarned = checkBadges({
      completedWorkouts: completedAfter,
      workoutHistory: data.workoutHistory,
      earnedBadges: earnedIds,
      totalPRs: data.totalPRs || 0
    });

    if (newlyEarned.length > 0) {
      addBadges(newlyEarned);
      setNewBadges(newlyEarned);
    }

    setSummaryDay(dayNumber);
    setCurrentView('summary');
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
            onViewBadges={() => setCurrentView('badges')}
            earnedBadges={data.earnedBadges}
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
            editing={selectedWorkout.editing}
            onSave={handleSaveWorkout}
            onComplete={handleCompleteWorkout}
            onCancel={handleBackToDashboard}
            workoutHistory={data.workoutHistory}
            completedWorkouts={data.completedWorkouts}
            onPR={() => {
              setSessionPRs(prev => prev + 1);
              incrementPRs();
            }}
          />
        )}

        {currentView === 'review' && reviewDay && (
          <WorkoutReview
            dayNumber={reviewDay}
            workoutHistory={data.workoutHistory}
            completedWorkouts={data.completedWorkouts}
            onBack={() => setCurrentView('selector')}
            onEdit={() => handleEditWorkout(reviewDay)}
          />
        )}

        {currentView === 'summary' && summaryDay && (
          <WorkoutSummary
            dayNumber={summaryDay}
            workoutHistory={data.workoutHistory}
            completedWorkouts={data.completedWorkouts}
            prsHit={sessionPRs}
            newBadges={newBadges}
            onContinue={handleBackToDashboard}
          />
        )}

        {currentView === 'badges' && (
          <BadgeScreen
            earnedBadges={data.earnedBadges}
            onBack={handleBackToDashboard}
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

      {newBadges.length > 0 && currentView === 'summary' && (
        <BadgeAward
          badgeIds={newBadges}
          onDone={() => setNewBadges([])}
        />
      )}
    </div>
  );
}

export default App;
