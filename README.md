# Legs-Push-Pull Workout Tracker

A React-based workout tracker for Jeff Nippard's 16-week Legs-Push-Pull program.

## Features

- 📊 Track all 42 workouts across 2 blocks (8 weeks each)
- 💪 Complete exercise database from the PDF
- 🔄 Automatic progression tracking
- 📱 Mobile-optimized for gym use
- 🌙 Dark theme
- 💾 Local storage - your data stays on your device
- 🎯 Smart "next workout" suggestions
- 📅 View all workouts on a calendar grid
- ⚡ Pre-fill weights from previous workouts

## Getting Started

### Prerequisites

You need Node.js and npm installed:
```bash
# Check if you have Node.js
node --version

# If not installed, visit https://nodejs.org/ to install
```

### Installation

1. Install dependencies:
```bash
cd /Volumes/Mac\ Mini\ T9/Opencode/Acad\ 2/workout-tracker
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Deployment to GitHub Pages

### Step 1: Initialize Git Repository

```bash
cd /Volumes/Mac\ Mini\ T9/Opencode/Acad\ 2/workout-tracker
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `workout-tracker`
3. Make it Public
4. Click "Create repository"

### Step 3: Push to GitHub

```bash
git remote add origin https://github.com/rocopongarecords-maker/workout-tracker.git
git branch -M main
git push -u origin main
```

### Step 4: Deploy to GitHub Pages

```bash
npm run deploy
```

Your app will be live at:
https://rocopongarecords-maker.github.io/workout-tracker/

## Project Structure

```
workout-tracker/
├── src/
│   ├── components/        # React components
│   │   ├── Dashboard.jsx
│   │   ├── WorkoutDaySelector.jsx
│   │   ├── WorkoutScreen.jsx
│   │   ├── ExerciseCard.jsx
│   │   ├── SetTracker.jsx
│   │   └── ProgressIndicator.jsx
│   ├── data/            # Workout data
│   │   ├── workoutData.js      # All exercises, sets, reps
│   │   └── schedule.js          # 42-day schedule
│   ├── hooks/           # Custom React hooks
│   │   ├── useWorkoutStorage.js
│   │   └── useProgressTracking.js
│   ├── utils/           # Utility functions
│   │   ├── getNextWorkout.js
│   │   └── getPreviousWorkout.js
│   ├── styles/          # Global styles
│   │   └── globals.css
│   ├── App.jsx
│   └── main.jsx
├── public/              # Static assets
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## How to Use

### Starting Your First Workout

1. Open the app
2. Click "Start Workout" on the dashboard
3. Enter weights and reps for each set
4. Click "Save" to save your progress
5. Click "Mark Complete" when finished

### Tracking Progress

- The dashboard shows your current progress percentage
- View "All Workouts" to see the 42-day calendar
- Click any workout day to do it out of order
- Completed workouts are highlighted in green
- Next workout is highlighted in yellow

### Pre-filled Weights

The app automatically remembers your last weight for each exercise and pre-fills it when you do the same exercise again. Just edit if you want to change it!

## Data Storage

Your workout data is saved in your browser's LocalStorage:
- ✅ Data persists even if you close the browser
- ✅ Works offline once loaded
- ⚠️ Clearing browser data will delete your workout history
- 💡 Tip: Bookmark the app for easy access

## Program Structure

### Block 1 (Weeks 1-8)
- Focus: Technique mastery and volume tolerance
- Lower intensity (%1RM targets)
- Gradual progression

### Block 2 (Weeks 9-16)
- Focus: Higher effort, proximity to failure
- Higher RPE targets
- Deload week at start of Block 2 (Day 29)

### Weekly Schedule
- Day 1: Legs #1
- Day 2: Push #1
- Day 3: Pull #1
- Day 4: Legs #2
- Day 5: Push #2
- Day 6: Pull #2
- Day 7: Rest

## Troubleshooting

### "npm: command not found"
- Install Node.js from https://nodejs.org/

### Can't see the app
- Make sure you're running `npm run dev`
- Check that http://localhost:3000 is open in your browser

### Data not saving
- Check browser console for errors
- Make sure LocalStorage is enabled in your browser

### GitHub Pages not updating
- Wait 1-2 minutes after deployment
- Clear browser cache and reload

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling and dark theme
- **Lucide React** - Icons
- **GitHub Pages** - Hosting

## License

This project is for personal use with Jeff Nippard's Legs-Push-Pull workout program.

## Support

For issues or questions, check the GitHub repository:
https://github.com/rocopongarecords-maker/workout-tracker

---

Happy lifting! 💪