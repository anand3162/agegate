import { describe, it, expect } from 'vitest';
import { getRecommendation, getAgeRange, AGE_THRESHOLD } from './recommendation';

describe('getRecommendation', () => {
  it('returns Check ID for age under threshold', () => {
    expect(getRecommendation(20)).toBe('Check ID');
  });

  it('returns Looks Clear for age at threshold', () => {
    expect(getRecommendation(AGE_THRESHOLD)).toBe('Looks Clear');
  });

  it('returns Looks Clear for age above threshold', () => {
    expect(getRecommendation(30)).toBe('Looks Clear');
  });
});

describe('getAgeRange', () => {
  it('returns range centered on detected age', () => {
    expect(getAgeRange(25)).toBe('23–27');
  });
});
