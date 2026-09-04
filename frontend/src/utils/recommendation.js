export const AGE_THRESHOLD = 25;

export function getRecommendation(age) {
  return age >= AGE_THRESHOLD ? 'Looks Clear' : 'Check ID';
}

export function getAgeRange(age) {
  if (age < 17) return 'Under 17';
  if (age < 20) return '17–20';
  if (age < 24) return '20–24';
  if (age < 28) return '24–28';
  return '28+';
}
