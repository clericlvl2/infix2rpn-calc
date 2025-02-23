import { parseAndReplaceUnaryMinus } from '../../Calculator/RPN/parseAndReplaceUnaryMinus';

describe('parseAndReplaceUnaryMinus', () => {
  test('Корректные случаи', () => {
    expect(parseAndReplaceUnaryMinus('-5')).toBe('%5');
    expect(parseAndReplaceUnaryMinus('(-5)')).toBe('(%5)');
    expect(parseAndReplaceUnaryMinus('5+%3')).toBe('5+%3');
    expect(parseAndReplaceUnaryMinus('5--3')).toBe('5-%3');
    expect(parseAndReplaceUnaryMinus('-5+-5')).toBe('%5+%5');
  });

  test('Бинарные минусы', () => {
    expect(parseAndReplaceUnaryMinus('5-3')).toBe('5-3');
    expect(parseAndReplaceUnaryMinus('10-5)')).toBe('10-5)');
  });

  test('Ошибки', () => {
    expect(() => parseAndReplaceUnaryMinus('-*5')).toThrow();
  });
});
