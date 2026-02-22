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
import FreeWorkoutScreen from './components/FreeWorkoutScreen';
import OnboardingScreen from './components/OnboardingScreen';
import MarketplaceDetail from './components/MarketplaceDetail';
import PublishProgram from './components/PublishProgram';
import ProgramFeed from './components/ProgramFeed';
import CreatorDashboard from './components/CreatorDashboard';
import InviteJoin from './components/InviteJoin';
import { useMarketplace } from './hooks/useMarketplace';
import { useCoach } from './hooks/useCoach';
import CoachDiscovery from './components/CoachDiscovery';
import CoachProfile from './components/CoachProfile';
import CoachChat from './components/CoachChat';
import CoachQuestionnaire from './components/CoachQuestionnaire';
import CoachDashboard from './components/CoachDashboard';
import TabBar from './components/TabBar';
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
  const { data, saveWorkout, markComplete, isCompleted, getWorkoutHistory, resetData, importData, addBadges, incrementPRs, saveWeight, saveSkinfold, saveMood, saveCustomProgram, deleteCustomProgram, setActiveProgram, markOnboardingComplete, saveFreeWorkout, syncing, migrationNeeded, migrateLocalData, dismissMigration } = storage;

  const marketplace = useMarketplace(auth.user);
  const coach = useCoach(auth.user);
  const [marketplaceProgram, setMarketplaceProgram] = useState(null);
  const [publishProgram, setPublishProgram] = useState(null);
  const [feedProgramId, setFeedProgramId] = useState(null);
  const [feedProgramName, setFeedProgramName] = useState('');
  const [inviteToken, setInviteToken] = useState(null);
  const [selectedCoachId, setSelectedCoachId] = useState(null);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState(null);

  const program = useActiveProgram(data.activeProgram, data.customPrograms);
  const { schedule, getExercisesForDay, getWorkoutName } = program;
  const stats = useProgressTracking(data.completedWorkouts, schedule);

  // Parse invite token from URL on mount
  useState(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('invite');
    if (token) {
      setInviteToken(token);
      setCurrentView('invite-join');
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  });

  // Show auth screen if Supabase is configured, user is not logged in, and not in guest mode
  if (auth.isConfigured && !auth.user && !guestMode && !auth.loading) {
    return (
      <div className="min-h-screen bg-app-bg text-white">
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
      <div className="min-h-screen bg-app-bg text-white">
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
      <div className="min-h-screen bg-app-bg text-white">
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

  // Views that hide the tab bar (full-screen experiences with their own bottom bars)
  const hideTabBarViews = ['workout', 'summary', 'free-workout'];
  const showTabBar = !hideTabBarViews.includes(currentView);

  const handleTabSelect = (tabId) => {
    // 'community' tab maps to the coach discovery view
    if (tabId === 'community') {
      setCurrentView('coach-discovery');
    } else {
      setCurrentView(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-white">
      {/* Offline banner */}
      {!isOnline && <OfflineBanner />}

      {/* Global brand bar — hidden during active workout and summary */}
      {!['workout', 'summary', 'free-workout'].includes(currentView) && (
        <div className="flex items-center gap-2 max-w-lg mx-auto px-4 py-2.5 border-b border-white/[0.08]">
          <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[11px] font-black">Z</span>
          </div>
          <span className="text-xs font-bold text-white/70 tracking-widest uppercase">ZeroWait</span>
        </div>
      )}

      <div className={`max-w-lg mx-auto px-4 ${['workout', 'summary', 'free-workout'].includes(currentView) ? 'pt-6' : 'pt-2'} ${showTabBar ? 'pb-24' : 'pb-8'} ${!isOnline ? 'pt-16' : ''}`}>
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
            onLogFreeWorkout={() => setCurrentView('free-workout')}
            earnedBadges={data.earnedBadges}
            currentView={currentView}
            setCurrentView={setCurrentView}
            schedule={schedule}
            getWorkoutName={getWorkoutName}
            programName={program.programName}
            totalWeeks={program.totalWeeks}
            getExercisesForDay={getExercisesForDay}
            totalPRs={data.totalPRs}
            workoutHistory={data.workoutHistory}
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
            getWorkoutName={getWorkoutName}
            programName={program.programName}
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
            weightLog={data.weightLog}
          />
        )}

        {currentView === 'measurements' && (
          <MeasurementsScreen
            weightLog={data.weightLog}
            skinfoldLog={data.skinfoldLog}
            onSaveWeight={saveWeight}
            onSaveSkinfold={saveSkinfold}
            moodLog={data.moodLog}
            onSaveMood={saveMood}
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
            onViewProgramDetail={(prog) => {
              setMarketplaceProgram(prog);
              setCurrentView('marketplace-detail');
            }}
            onBack={handleBackToDashboard}
            marketplace={marketplace}
          />
        )}

        {currentView === 'program-builder' && (
          <ProgramBuilder
            onSave={(prog) => {
              saveCustomProgram(prog);
              setCurrentView('programs');
            }}
            onPublish={(prog) => {
              setPublishProgram(prog);
              setCurrentView('publish-program');
            }}
            onBack={() => setCurrentView('programs')}
          />
        )}

        {currentView === 'free-workout' && (
          <FreeWorkoutScreen
            onSave={saveFreeWorkout}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'marketplace-detail' && marketplaceProgram && (
          <MarketplaceDetail
            program={marketplaceProgram}
            marketplace={marketplace}
            saveCustomProgram={saveCustomProgram}
            userId={auth.user?.id}
            onViewFeed={(programId, programName) => {
              setFeedProgramId(programId);
              setFeedProgramName(programName);
              setCurrentView('program-feed');
            }}
            onShare={() => {}}
            onBack={() => setCurrentView('programs')}
          />
        )}

        {currentView === 'publish-program' && publishProgram && (
          <PublishProgram
            program={publishProgram}
            marketplace={marketplace}
            onBack={() => setCurrentView('program-builder')}
            onPublished={() => {
              setPublishProgram(null);
              setCurrentView('programs');
            }}
          />
        )}

        {currentView === 'program-feed' && feedProgramId && (
          <ProgramFeed
            programId={feedProgramId}
            programName={feedProgramName}
            marketplace={marketplace}
            userId={auth.user?.id}
            onBack={() => setCurrentView('marketplace-detail')}
          />
        )}

        {currentView === 'creator-dashboard' && (
          <CreatorDashboard
            marketplace={marketplace}
            onSelectProgram={(prog) => {
              setMarketplaceProgram(prog);
              setCurrentView('marketplace-detail');
            }}
            onBack={() => setCurrentView('programs')}
          />
        )}

        {currentView === 'invite-join' && inviteToken && (
          <InviteJoin
            token={inviteToken}
            marketplace={marketplace}
            saveCustomProgram={saveCustomProgram}
            onBack={() => {
              setInviteToken(null);
              setCurrentView('dashboard');
            }}
            onJoined={() => {
              setInviteToken(null);
              setCurrentView('dashboard');
            }}
          />
        )}

        {currentView === 'coach-discovery' && (
          <CoachDiscovery
            coach={coach}
            onSelectCoach={(coachId) => {
              setSelectedCoachId(coachId);
              setCurrentView('coach-profile');
            }}
            onOpenChat={(relationshipId) => {
              setSelectedRelationshipId(relationshipId);
              setCurrentView('coach-chat');
            }}
            onBack={handleBackToDashboard}
          />
        )}

        {currentView === 'coach-profile' && selectedCoachId && (
          <CoachProfile
            coachId={selectedCoachId}
            coach={coach}
            userId={auth.user?.id}
            onOpenQuestionnaire={(coachId, relationshipId) => {
              setSelectedCoachId(coachId);
              setSelectedRelationshipId(relationshipId);
              setCurrentView('coach-questionnaire');
            }}
            onOpenChat={(relationshipId) => {
              setSelectedRelationshipId(relationshipId);
              setCurrentView('coach-chat');
            }}
            onBack={() => setCurrentView('coach-discovery')}
          />
        )}

        {currentView === 'coach-chat' && selectedRelationshipId && (
          <CoachChat
            relationshipId={selectedRelationshipId}
            coach={coach}
            userId={auth.user?.id}
            onBack={() => setCurrentView('coach-discovery')}
          />
        )}

        {currentView === 'coach-questionnaire' && selectedCoachId && selectedRelationshipId && (
          <CoachQuestionnaire
            coachId={selectedCoachId}
            relationshipId={selectedRelationshipId}
            coach={coach}
            onProgramCreated={(program) => {
              saveCustomProgram(program);
              setActiveProgram(program.id);
            }}
            onComplete={() => {
              if (selectedCoachId?.startsWith('demo-')) {
                setCurrentView('programs');
              } else {
                setCurrentView('coach-discovery');
              }
            }}
            onBack={() => setCurrentView('coach-profile')}
          />
        )}

        {currentView === 'coach-dashboard' && (
          <CoachDashboard
            coach={coach}
            userId={auth.user?.id}
            onOpenChat={(relationshipId) => {
              setSelectedRelationshipId(relationshipId);
              setCurrentView('coach-chat');
            }}
            onBuildProgram={() => setCurrentView('program-builder')}
            onBack={handleBackToDashboard}
          />
        )}
      </div>

      {/* Tab Bar */}
      {showTabBar && (
        <TabBar
          currentView={currentView}
          onSelectTab={handleTabSelect}
        />
      )}

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
