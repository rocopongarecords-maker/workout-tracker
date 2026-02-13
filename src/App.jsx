import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useWorkoutStorage } from './hooks/useWorkoutStorage';
import { useProgressTracking } from './hooks/useProgressTracking';
import { checkBadges } from './utils/checkBadges';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import WorkoutDaySelector from './components/WorkoutDaySelector';
import WorkoutScreen from './components/WorkoutScreen';
import WorkoutReview from './components/WorkoutReview';
import WorkoutSummary from './components/WorkoutSummary';
import SettingsScreen from './components/SettingsScreen';
import BadgeScreen from './components/BadgeScreen';
import BadgeAward from './components/BadgeAward';
import AnalyticsScreen from './components/AnalyticsScreen';
import MeasurementsScreen from './components/MeasurementsScreen';
import MigrationBanner from './components/MigrationBanner';
import { schedule } from './data/schedule';
import './styles/globals.css';

function App() {
  const auth = useAuth();
  const [guestMode, setGuestMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [reviewDay, setReviewDay] = useState(null);
  const [summaryDay, setSummaryDay] = useState(null);
  const [sessionPRs, setSessionPRs] = useState(0);
  const [newBadges, setNewBadges] = useState([]);

  const storage = useWorkoutStorage(auth.user);
  const { data, saveWorkout, markComplete, isCompleted, getWorkoutHistory, resetData, importData, addBadges, incrementPRs, saveWeight, saveSkinfold, syncing, migrationNeeded, migrateLocalData, dismissMigration } = storage;
  const stats = useProgressTracking(data.completedWorkouts);

  // Show auth screen if Supabase is configured, user is not logged in, and not in guest mode
  if (auth.isConfigured && !auth.user && !guestMode && !auth.loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <AuthScreen
          onSignIn={auth.signIn}
          onSignUp={auth.signUp}
          onGoogleSignIn={auth.signInWithGoogle}
          onResetPassword={auth.resetPassword}
          onContinueAsGuest={() => setGuestMode(true)}
          error={auth.error}
        />
      </div>
    );
  }

  // Loading state
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

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
        {/* Migration banner */}
        {migrationNeeded && (
          <MigrationBanner
            onMigrate={migrateLocalData}
            onDismiss={dismissMigration}
            syncing={syncing}
          />
        )}

        {/* Sync indicator */}
        {syncing && (
          <div className="fixed top-0 left-0 right-0 z-50">
            <div className="h-1 bg-blue-500 animate-pulse" />
          </div>
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            stats={stats}
            completedWorkouts={data.completedWorkouts}
            onStartWorkout={handleStartWorkout}
            onViewAllWorkouts={() => setCurrentView('selector')}
            onOpenSettings={() => setCurrentView('settings')}
            onViewBadges={() => setCurrentView('badges')}
            onViewAnalytics={() => setCurrentView('analytics')}
            onViewMeasurements={() => setCurrentView('measurements')}
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

        {currentView === 'analytics' && (
          <AnalyticsScreen
            workoutHistory={data.workoutHistory}
            completedWorkouts={data.completedWorkouts}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'measurements' && (
          <MeasurementsScreen
            weightLog={data.weightLog}
            skinfoldLog={data.skinfoldLog}
            onSaveWeight={saveWeight}
            onSaveSkinfold={saveSkinfold}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'settings' && (
          <SettingsScreen
            data={data}
            user={auth.user}
            onSignOut={auth.signOut}
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
