/**
 * Jackson-Pollock 3-site body fat calculation.
 * Men: chest, abdomen, thigh
 * Women: triceps, suprailiac, thigh
 *
 * @param {Object} sites - { chest, abdomen, thigh } (men) or { triceps, suprailiac, thigh } (women)
 * @param {number} age - age in years
 * @param {'male'|'female'} sex
 * @returns {number|null} body fat percentage
 */
export const calculateBF3Site = (sites, age, sex) => {
  let sumOfSkinfolds;

  if (sex === 'male') {
    const { chest, abdomen, thigh } = sites;
    if (!chest || !abdomen || !thigh) return null;
    sumOfSkinfolds = Number(chest) + Number(abdomen) + Number(thigh);
  } else {
    const { triceps, suprailiac, thigh } = sites;
    if (!triceps || !suprailiac || !thigh) return null;
    sumOfSkinfolds = Number(triceps) + Number(suprailiac) + Number(thigh);
  }

  const bodyDensity = sex === 'male'
    ? 1.10938 - (0.0008267 * sumOfSkinfolds) + (0.0000016 * sumOfSkinfolds * sumOfSkinfolds) - (0.0002574 * age)
    : 1.0994921 - (0.0009929 * sumOfSkinfolds) + (0.0000023 * sumOfSkinfolds * sumOfSkinfolds) - (0.0001392 * age);

  return siriEquation(bodyDensity);
};

/**
 * Jackson-Pollock 7-site body fat calculation.
 * Sites: chest, midaxillary, triceps, subscapular, abdomen, suprailiac, thigh
 *
 * @param {Object} sites - all 7 site measurements in mm
 * @param {number} age - age in years
 * @param {'male'|'female'} sex
 * @returns {number|null} body fat percentage
 */
export const calculateBF7Site = (sites, age, sex) => {
  const { chest, midaxillary, triceps, subscapular, abdomen, suprailiac, thigh } = sites;
  const vals = [chest, midaxillary, triceps, subscapular, abdomen, suprailiac, thigh];
  if (vals.some(v => !v || Number(v) <= 0)) return null;

  const sumOfSkinfolds = vals.reduce((sum, v) => sum + Number(v), 0);

  const bodyDensity = sex === 'male'
    ? 1.112 - (0.00043499 * sumOfSkinfolds) + (0.00000055 * sumOfSkinfolds * sumOfSkinfolds) - (0.00028826 * age)
    : 1.097 - (0.00046971 * sumOfSkinfolds) + (0.00000056 * sumOfSkinfolds * sumOfSkinfolds) - (0.00012828 * age);

  return siriEquation(bodyDensity);
};

/**
 * Siri equation: converts body density to body fat percentage.
 */
const siriEquation = (bodyDensity) => {
  if (bodyDensity <= 0) return null;
  const bf = ((495 / bodyDensity) - 450);
  return Math.round(bf * 10) / 10;
};
