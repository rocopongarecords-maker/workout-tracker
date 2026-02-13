export const haptic = {
  light: () => navigator.vibrate?.(10),
  medium: () => navigator.vibrate?.(15),
  success: () => navigator.vibrate?.([50, 30, 50]),
  pr: () => navigator.vibrate?.([50, 30, 50]),
  timerReady: () => navigator.vibrate?.([30, 20, 30]),
  workoutComplete: () => navigator.vibrate?.([50, 30, 50, 30, 100]),
  error: () => navigator.vibrate?.([100, 50, 100]),
};
