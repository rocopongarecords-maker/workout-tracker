import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { useWorkoutStorage } from './hooks/useWorkoutStorage';
import { useProgressTracking } from './hooks/useProgressTracking';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { useActiveProgram } from './hooks/useActiveProgram';
import { checkBadges } from './utils/checkBadges';
import ErrorBoundary from './components/ErrorBoundary';
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
import OfflineBanner from './components/OfflineBanner';
import LoadingSkeleton from './components/LoadingSkeleton';
import ExerciseLibrary from './components/ExerciseLibrary';
import ProgramSelector from './components/ProgramSelector';
import ProgramBuilder from './components/ProgramBuilder';
import OnboardingScreen from './components/OnboardingScreen';
import './styles/globals.css';

function App() {
  const auth = useAuth();
  const isOnline = useOnlineStatus();
  const [guestMode, setGuestMode] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [reviewDay, setReviewDay] = useState(null);
  const [summaryDay, setSummaryDay] = useState(null);
  const [sessionPRs, setSessionPRs] = useState(0);
  const [newBadges, setNewBadges] = useState([]);

  const storage = useWorkoutStorage(auth.user);
  const { data, saveWorkout, markComplete, isCompleted, getWorkoutHistory, resetData, importData, addBadges, incrementPRs, saveWeight, saveSkinfold, saveCustomProgram, deleteCustomProgram, setActiveProgram, markOnboardingComplete, syncing, migrationNeeded, migrateLocalData, dismissMigration } = storage;

  const program = useActiveProgram(data.activeProgram, data.customPrograms);
  const { schedule, getExercisesForDay, getWorkoutName } = program;
  const stats = useProgressTracking(data.completedWorkouts, schedule);

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

  // Loading state — show skeleton matching dashboard layout
  if (auth.loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-lg mx-auto px-4 py-8">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // Show onboarding for new users (no workouts completed, onboarding not dismissed)
  const isNewUser = !data.onboardingComplete && data.completedWorkouts.length === 0;
  if (isNewUser && currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="max-w-lg mx-auto px-4 py-8">
          <OnboardingScreen
            onComplete={markOnboardingComplete}
            onSelectProgram={setActiveProgram}
            programs={data.customPrograms}
          />
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
      totalPRs: data.totalPRs || 0,
      schedule,
      weightLog: data.weightLog
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
      {/* Offline banner */}
      {!isOnline && <OfflineBanner />}

      <div className={`max-w-lg mx-auto px-4 py-8 ${!isOnline ? 'pt-16' : ''}`}>
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
            onViewPrograms={() => setCurrentView('programs')}
            onViewExercises={() => setCurrentView('exercises')}
            earnedBadges={data.earnedBadges}
            currentView={currentView}
            setCurrentView={setCurrentView}
            schedule={schedule}
            getWorkoutName={getWorkoutName}
            programName={program.programName}
            totalWeeks={program.totalWeeks}
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
            getExercisesForDay={getExercisesForDay}
            getWorkoutName={getWorkoutName}
          />
        )}

        {currentView === 'review' && reviewDay && (
          <WorkoutReview
            dayNumber={reviewDay}
            workoutHistory={data.workoutHistory}
            completedWorkouts={data.completedWorkouts}
            onBack={() => setCurrentView('selector')}
            onEdit={() => handleEditWorkout(reviewDay)}
            getWorkoutName={getWorkoutName}
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
            getWorkoutName={getWorkoutName}
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
            schedule={schedule}
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

        {currentView === 'exercises' && (
          <ExerciseLibrary
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'programs' && (
          <ProgramSelector
            programs={data.customPrograms}
            activeProgram={data.activeProgram}
            onSelectProgram={setActiveProgram}
            onCreateProgram={() => setCurrentView('program-builder')}
            onDeleteProgram={deleteCustomProgram}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'program-builder' && (
          <ProgramBuilder
            onSave={(program) => {
              saveCustomProgram(program);
              setCurrentView('programs');
            }}
            onBack={() => setCurrentView('programs')}
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

const AppWithErrorBoundary = () => (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

export default AppWithErrorBoundary;
