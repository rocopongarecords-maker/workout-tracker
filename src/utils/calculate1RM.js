export const calculate1RM = (weight, reps) => {
  if (!weight || !reps) return null;

  const w = Number(weight);
  const r = Number(reps);

  if (w <= 0 || r <= 0) return null;

  return Math.round(w * (36 / (37 - r)));
};

export const format1RM = (weight, reps) => {
  const oneRM = calculate1RM(weight, reps);
  return oneRM ? `${oneRM} kg` : 'N/A';
};
