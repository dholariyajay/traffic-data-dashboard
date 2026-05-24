import { describe, it, expect } from 'vitest';
import { getDisplayRange, getPaginationRange } from '../utils/pagination';

describe('pagination utils', () => {
  it('returns all pages when total is small', () => {
    expect(getPaginationRange(2, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it('inserts ellipsis for large page counts', () => {
    expect(getPaginationRange(5, 10)).toEqual([1, 'ellipsis', 4, 5, 6, 'ellipsis', 10]);
  });

  it('calculates display range', () => {
    expect(getDisplayRange(2, 10, 45)).toEqual({ start: 11, end: 20 });
    expect(getDisplayRange(1, 10, 0)).toEqual({ start: 0, end: 0 });
  });
});
