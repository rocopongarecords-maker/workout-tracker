export const DEMO_COACHES = [
  {
    id: 'demo-coach-1',
    isDemo: true,
    authorName: 'Alex Rivera',
    authorEmoji: '🏋️',
    bio: 'NSCA-certified strength coach with 8 years of experience helping athletes build serious strength and muscle. Specialises in hypertrophy programming, powerlifting prep, and progressive overload. Former competitive powerlifter with a 200kg squat. I take a science-based approach — no bro-science, no fluff.',
    specialties: ['hypertrophy', 'strength', 'powerlifting'],
    certifications: ['NSCA-CSCS', 'Precision Nutrition L1'],
    avg_rating: 4.9,
    rating_count: 47,
    experience_years: 8,
    accepting_clients: true,
    active_clients: 12,
    pricing_info: 'Free demo',
    location: 'San Francisco, CA',
    program_count: 6,
  },
  {
    id: 'demo-coach-2',
    isDemo: true,
    authorName: 'Sam Chen',
    authorEmoji: '🧘',
    bio: 'Functional fitness and body recomposition specialist. I help busy people lose fat, build lean muscle, and feel energetic — without spending 2 hours in the gym every day. ACE-certified with a PN Level 2 nutrition credential. My clients see real, sustainable results within 8 weeks.',
    specialties: ['weightLoss', 'endurance', 'nutrition'],
    certifications: ['ACE-CPT', 'PN Level 2'],
    avg_rating: 4.7,
    rating_count: 31,
    experience_years: 5,
    accepting_clients: true,
    active_clients: 8,
    pricing_info: 'Free demo',
    location: 'Austin, TX',
    program_count: 4,
  },
];

const DEMO_AUTO_RESPONSES = [
  "Thanks for reaching out! I've reviewed your profile and I'm excited to work with you. I'll put together a personalised plan after going through your questionnaire responses. 💪",
  "Great to connect! I'll be reviewing your goals and current fitness level shortly. Expect a detailed plan from me within 24 hours.",
  "Welcome aboard! I'll check in with you regularly to make sure you're progressing well. Don't hesitate to ask me anything — that's what I'm here for.",
];

const DEMO_CHAT_KEY = (relationshipId) => `demo_chat_${relationshipId}`;
const DEMO_RELATIONSHIP_KEY = (coachId) => `demo_rel_${coachId}`;

export const getDemoMessages = (relationshipId) => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_CHAT_KEY(relationshipId)) || '[]');
  } catch {
    return [];
  }
};

export const saveDemoMessage = (relationshipId, message) => {
  const existing = getDemoMessages(relationshipId);
  const updated = [...existing, message];
  try {
    localStorage.setItem(DEMO_CHAT_KEY(relationshipId), JSON.stringify(updated));
  } catch {}
  return updated;
};

export const getDemoRelationship = (coachId) => {
  try {
    return JSON.parse(localStorage.getItem(DEMO_RELATIONSHIP_KEY(coachId)) || 'null');
  } catch {
    return null;
  }
};

export const setDemoRelationship = (coachId, data) => {
  try {
    localStorage.setItem(DEMO_RELATIONSHIP_KEY(coachId), JSON.stringify(data));
  } catch {}
};

export const getDemoAutoResponse = (coachId) => {
  const index = coachId === 'demo-coach-1' ? 0 : 1;
  return DEMO_AUTO_RESPONSES[index];
};

export const generateCoachedProgram = (coachId, answers) => {
  const coach = DEMO_COACHES.find(c => c.id === coachId);
  if (!coach) return null;

  const goal = answers.goal || '';
  const frequency = answers.frequency || '3–4 days';
  const equipment = answers.equipment || [];

  const hasBarbell = equipment.some(e => e.includes('Full gym') || e.includes('Home gym'));
  const hasDumbbells = hasBarbell || equipment.some(e => e.includes('Dumbbells'));

  const is6Day = frequency.includes('5–6');
  const is4or5Day = frequency.includes('4–5');
  const isHighFreq = is6Day || is4or5Day;

  const isStrength = goal.includes('strength') || goal.includes('Powerlifting');
  const isHypertrophy = goal.includes('muscle') || goal.includes('Hypertrophy');
  const usePPL = (isStrength || isHypertrophy) && isHighFreq;

  const sets = isHighFreq ? 4 : 3;

  const pushEx = hasBarbell ? [
    { name: 'Barbell Bench Press', sets, reps: '6-10', type: 'primary', restTime: '2-3 min' },
    { name: 'Overhead Press', sets, reps: '8-12', type: 'primary', restTime: '2 min' },
    { name: 'Incline Dumbbell Press', sets, reps: '10-12', type: 'isolation', restTime: '90 sec' },
    { name: 'Cable Fly', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
    { name: 'Tricep Pushdown', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
    { name: 'Lateral Raise', sets, reps: '15-20', type: 'isolation', restTime: '60 sec' },
  ] : hasDumbbells ? [
    { name: 'Dumbbell Bench Press', sets, reps: '8-12', type: 'primary', restTime: '2 min' },
    { name: 'Dumbbell Shoulder Press', sets, reps: '10-12', type: 'primary', restTime: '90 sec' },
    { name: 'Incline Dumbbell Press', sets, reps: '10-12', type: 'isolation', restTime: '90 sec' },
    { name: 'Lateral Raise', sets, reps: '15-20', type: 'isolation', restTime: '60 sec' },
    { name: 'Dumbbell Tricep Extension', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
  ] : [
    { name: 'Push-Up', sets, reps: '15-20', type: 'primary', restTime: '60 sec' },
    { name: 'Pike Push-Up', sets, reps: '10-15', type: 'primary', restTime: '60 sec' },
    { name: 'Diamond Push-Up', sets, reps: '10-12', type: 'isolation', restTime: '60 sec' },
    { name: 'Tricep Dip', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
  ];

  const pullEx = hasBarbell ? [
    { name: 'Barbell Row', sets, reps: '6-10', type: 'primary', restTime: '2-3 min' },
    { name: 'Pull-Up', sets, reps: '6-10', type: 'primary', restTime: '2 min' },
    { name: 'Cable Row', sets, reps: '10-12', type: 'isolation', restTime: '90 sec' },
    { name: 'Face Pull', sets, reps: '15-20', type: 'isolation', restTime: '60 sec' },
    { name: 'Barbell Curl', sets, reps: '10-12', type: 'isolation', restTime: '60 sec' },
    { name: 'Hammer Curl', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
  ] : hasDumbbells ? [
    { name: 'Dumbbell Row', sets, reps: '8-12', type: 'primary', restTime: '90 sec' },
    { name: 'Pull-Up', sets, reps: '6-10', type: 'primary', restTime: '2 min' },
    { name: 'Dumbbell Pullover', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
    { name: 'Dumbbell Curl', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
    { name: 'Hammer Curl', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
  ] : [
    { name: 'Pull-Up', sets, reps: '6-10', type: 'primary', restTime: '2 min' },
    { name: 'Inverted Row', sets, reps: '10-15', type: 'primary', restTime: '90 sec' },
    { name: 'Chin-Up', sets, reps: '8-12', type: 'isolation', restTime: '90 sec' },
  ];

  const legsEx = hasBarbell ? [
    { name: 'Barbell Squat', sets, reps: '5-8', type: 'primary', restTime: '3 min' },
    { name: 'Romanian Deadlift', sets, reps: '8-10', type: 'primary', restTime: '2 min' },
    { name: 'Leg Press', sets, reps: '10-12', type: 'isolation', restTime: '2 min' },
    { name: 'Leg Curl', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
    { name: 'Leg Extension', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
    { name: 'Calf Raise', sets, reps: '15-20', type: 'isolation', restTime: '60 sec' },
  ] : hasDumbbells ? [
    { name: 'Dumbbell Goblet Squat', sets, reps: '10-12', type: 'primary', restTime: '2 min' },
    { name: 'Dumbbell Romanian Deadlift', sets, reps: '10-12', type: 'primary', restTime: '90 sec' },
    { name: 'Dumbbell Lunge', sets, reps: '10-12', type: 'isolation', restTime: '90 sec' },
    { name: 'Dumbbell Step-Up', sets, reps: '12-15', type: 'isolation', restTime: '60 sec' },
    { name: 'Calf Raise', sets, reps: '15-20', type: 'isolation', restTime: '60 sec' },
  ] : [
    { name: 'Squat', sets, reps: '15-20', type: 'primary', restTime: '90 sec' },
    { name: 'Bulgarian Split Squat', sets, reps: '12-15', type: 'primary', restTime: '90 sec' },
    { name: 'Hip Thrust', sets, reps: '15-20', type: 'isolation', restTime: '60 sec' },
    { name: 'Calf Raise', sets, reps: '20-25', type: 'isolation', restTime: '60 sec' },
  ];

  const fullBodyA = hasBarbell ? [
    { name: 'Barbell Squat', sets, reps: '6-8', type: 'primary', restTime: '3 min' },
    { name: 'Barbell Bench Press', sets, reps: '6-10', type: 'primary', restTime: '2 min' },
    { name: 'Barbell Row', sets, reps: '6-10', type: 'primary', restTime: '2 min' },
    { name: 'Overhead Press', sets: 3, reps: '8-12', type: 'isolation', restTime: '90 sec' },
    { name: 'Romanian Deadlift', sets: 3, reps: '8-10', type: 'isolation', restTime: '2 min' },
  ] : hasDumbbells ? [
    { name: 'Dumbbell Goblet Squat', sets, reps: '10-12', type: 'primary', restTime: '2 min' },
    { name: 'Dumbbell Bench Press', sets, reps: '10-12', type: 'primary', restTime: '90 sec' },
    { name: 'Dumbbell Row', sets, reps: '10-12', type: 'primary', restTime: '90 sec' },
    { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', type: 'isolation', restTime: '90 sec' },
    { name: 'Dumbbell Romanian Deadlift', sets: 3, reps: '10-12', type: 'isolation', restTime: '90 sec' },
  ] : [
    { name: 'Squat', sets, reps: '15-20', type: 'primary', restTime: '90 sec' },
    { name: 'Push-Up', sets, reps: '15-20', type: 'primary', restTime: '60 sec' },
    { name: 'Pull-Up', sets, reps: '6-10', type: 'primary', restTime: '90 sec' },
    { name: 'Hip Thrust', sets: 3, reps: '15-20', type: 'isolation', restTime: '60 sec' },
  ];

  const fullBodyB = hasBarbell ? [
    { name: 'Deadlift', sets, reps: '4-6', type: 'primary', restTime: '3 min' },
    { name: 'Incline Barbell Press', sets, reps: '8-10', type: 'primary', restTime: '2 min' },
    { name: 'Pull-Up', sets, reps: '6-10', type: 'primary', restTime: '2 min' },
    { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', type: 'isolation', restTime: '90 sec' },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '10-12', type: 'isolation', restTime: '90 sec' },
  ] : hasDumbbells ? [
    { name: 'Dumbbell Romanian Deadlift', sets, reps: '10-12', type: 'primary', restTime: '90 sec' },
    { name: 'Incline Dumbbell Press', sets, reps: '10-12', type: 'primary', restTime: '90 sec' },
    { name: 'Pull-Up', sets, reps: '6-10', type: 'primary', restTime: '90 sec' },
    { name: 'Dumbbell Shoulder Press', sets: 3, reps: '10-12', type: 'isolation', restTime: '90 sec' },
    { name: 'Dumbbell Lunge', sets: 3, reps: '12-15', type: 'isolation', restTime: '60 sec' },
  ] : [
    { name: 'Hip Thrust', sets, reps: '15-20', type: 'primary', restTime: '60 sec' },
    { name: 'Pike Push-Up', sets, reps: '10-15', type: 'primary', restTime: '60 sec' },
    { name: 'Inverted Row', sets, reps: '10-15', type: 'primary', restTime: '90 sec' },
    { name: 'Bulgarian Split Squat', sets: 3, reps: '12-15', type: 'isolation', restTime: '60 sec' },
  ];

  let workoutDays;
  let weeks;

  if (usePPL) {
    weeks = 10;
    workoutDays = is6Day ? [
      { dayOfWeek: 1, name: 'Push', exercises: pushEx },
      { dayOfWeek: 2, name: 'Pull', exercises: pullEx },
      { dayOfWeek: 3, name: 'Legs', exercises: legsEx },
      { dayOfWeek: 4, name: 'Push', exercises: pushEx },
      { dayOfWeek: 5, name: 'Pull', exercises: pullEx },
      { dayOfWeek: 6, name: 'Legs', exercises: legsEx },
    ] : [
      { dayOfWeek: 1, name: 'Push', exercises: pushEx },
      { dayOfWeek: 2, name: 'Pull', exercises: pullEx },
      { dayOfWeek: 4, name: 'Legs', exercises: legsEx },
      { dayOfWeek: 5, name: 'Push', exercises: pushEx },
      { dayOfWeek: 6, name: 'Pull', exercises: pullEx },
    ];
  } else {
    weeks = 8;
    workoutDays = [
      { dayOfWeek: 1, name: 'Full Body A', exercises: fullBodyA },
      { dayOfWeek: 3, name: 'Full Body B', exercises: fullBodyB },
      { dayOfWeek: 5, name: 'Full Body A', exercises: fullBodyA },
    ];
  }

  const goalLabel = isStrength ? 'Strength' : goal.includes('fat') ? 'Fat Loss' : goal.includes('recomp') ? 'Recomp' : 'Hypertrophy';
  const splitLabel = usePPL ? 'Push/Pull/Legs' : 'Full Body';
  const firstName = coach.authorName.split(' ')[0];

  return {
    id: `coached-${coachId}-${Date.now()}`,
    name: `${firstName}'s ${goalLabel} Plan`,
    description: `Personalised ${splitLabel} program (${weeks} weeks), generated by ${coach.authorName} based on your goals and equipment.`,
    weeks,
    category: goalLabel,
    difficulty: isHighFreq ? 'Intermediate' : 'Beginner',
    authorEmoji: coach.authorEmoji,
    isCoached: true,
    coachId,
    coachName: coach.authorName,
    createdAt: new Date().toISOString(),
    workoutDays,
  };
};

export const DEMO_QUESTIONNAIRE = {
  questions: [
    {
      id: 'goal',
      text: 'What is your primary fitness goal?',
      type: 'single_select',
      options: ['Build muscle / Hypertrophy', 'Lose body fat', 'Increase strength / Powerlifting', 'Improve endurance', 'Body recomposition'],
    },
    {
      id: 'experience',
      text: 'How long have you been training consistently?',
      type: 'single_select',
      options: ['Less than 6 months', '6–12 months', '1–2 years', '2–4 years', '4+ years'],
    },
    {
      id: 'frequency',
      text: 'How many days per week can you train?',
      type: 'single_select',
      options: ['2–3 days', '3–4 days', '4–5 days', '5–6 days'],
    },
    {
      id: 'equipment',
      text: 'What equipment do you have access to?',
      type: 'multi_select',
      options: ['Full gym (barbells, machines, cables)', 'Dumbbells only', 'Home gym setup', 'Resistance bands', 'Bodyweight only'],
    },
    {
      id: 'notes',
      text: 'Anything else your coach should know? (injuries, preferences, schedule)',
      type: 'text',
    },
  ],
};
