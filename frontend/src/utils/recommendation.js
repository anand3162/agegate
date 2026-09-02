export const AGE_THRESHOLD = 25;

export function getRecommendation(age) {
  return age >= AGE_THRESHOLD ? 'Looks Clear' : 'Check ID';
}

export function getAgeRange(age) {
  return `${age - 2}–${age + 2}`;
}
