import { describe, expect, it } from 'vitest';
import { add } from './lib';

describe('add', () => {
  it('should add numbers', () => {
    expect(add(1, 2)).toEqual(3);
  });
});
