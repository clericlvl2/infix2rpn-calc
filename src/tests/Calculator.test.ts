import { ErrorMessage } from '../common/errors';
import { Calculator } from '../Calculator/Calculator';
import { Operator } from '../Calculator/operators/constants';

/**
 * Calculator is not able to:
 * - work with large numbers
 * - work with long decimal numbers
 * - check invalid operators combinations
 * - check missing operands
 */
describe('Infix Calculator using RPN', () => {
  const OPERATORS = [Operator.Plus, Operator.Minus, Operator.Multiply, Operator.Divide, Operator.UnaryMinus];

  const calculator = new Calculator(OPERATORS);

  test('adds two numbers', () => {
    expect(calculator.calculate('3 + 4')).toBe(7);
  });

  test('subtracts two numbers', () => {
    expect(calculator.calculate('10 - 4')).toBe(6);
  });

  test('multiplies two numbers', () => {
    expect(calculator.calculate('3 * 5')).toBe(15);
  });

  test('divides two numbers', () => {
    expect(calculator.calculate('20 / 4')).toBe(5);
  });

  test('handles operators precedence', () => {
    expect(calculator.calculate('3 + 4 * 2')).toBe(11);
  });

  test('handles parentheses', () => {
    expect(calculator.calculate('(3 + 4) * 2')).toBe(14);
  });

  test('handles negative numbers', () => {
    expect(calculator.calculate('-5 + -5')).toBe(-10);
    expect(calculator.calculate('-5 * -5')).toBe(25);
    expect(calculator.calculate('-3 + 4')).toBe(1);
    expect(calculator.calculate('-1')).toBe(-1);
  });

  test('handles division by zero', () => {
    expect(() => calculator.calculate('4 / 0')).toThrow(ErrorMessage.DivisionByZero);
  });

  test('handles multiple operations', () => {
    expect(calculator.calculate('5 + (1 + 2) * 4 - 3')).toBe(14);
  });

  test('handles spaces and extra whitespace', () => {
    expect(calculator.calculate('  3   +   4  ')).toBe(7);
    expect(calculator.calculate('     5    +5  ')).toBe(10);
  });

  test('handles expression with missing operands', () => {
    expect(() => calculator.calculate('3 +')).toThrow(ErrorMessage.Invalid);
    expect(calculator.calculate('   3   4  + ')).toThrow(ErrorMessage.Invalid);
  });

  test('throws an error on unsupported operators', () => {
    expect(() => calculator.calculate('3 % 2')).toThrow(ErrorMessage.NotAllowedSymbols);
  });

  test('handles empty input', () => {
    expect(() => calculator.calculate('')).toThrowError(ErrorMessage.Invalid);
  });

  test('handles invalid operators combinations', () => {
    expect(() => calculator.calculate('5 ++ 5')).toThrowError(ErrorMessage.Invalid);
    expect(() => calculator.calculate('5 + + 5')).toThrowError(ErrorMessage.Invalid);
    expect(() => calculator.calculate('5 5 +')).toThrowError(ErrorMessage.Invalid);
  });

  test('handles zero correctly', () => {
    expect(calculator.calculate('0 + 0')).toBe(0);
    expect(calculator.calculate('0 * 0')).toBe(0);
  });

  test('should throw error on non-numeric input', () => {
    expect(() => calculator.calculate('5 + a')).toThrowError(ErrorMessage.NotAllowedSymbols);
    expect(() => calculator.calculate('5 + @')).toThrowError(ErrorMessage.NotAllowedSymbols);
  });

  test('handles very long expression', () => {
    const expression = '1 + '.repeat(10000) + '1';
    expect(calculator.calculate(expression)).toBe(10001);
  });

  test('handles nested operations', () => {
    expect(calculator.calculate('(3 + 2) * 2')).toBe(10);
    expect(calculator.calculate('((3 + 2) * 2)')).toBe(10);
    expect(calculator.calculate('((5 + 3) * 2) + 1')).toBe(17);
    expect(calculator.calculate('((2 + 3) * (2 + 3)) - 2')).toBe(23);
    expect(calculator.calculate('((1 + 2) * (3 + 4)) / (2 + 1)')).toBe(7);
    expect(calculator.calculate('((5 + 3) * (2 + 2)) - ((7 - 3) * 4)')).toBe(16);
    expect(calculator.calculate('((1 + (2 * 3)) * (4 - (5 / (1 + 1))))')).toBe(10.5);
    expect(calculator.calculate('((10 + 5) * (3 + 2)) / ((4 + 1) * 2)')).toBe(7.5);
  });

  test('handles nested operations with multiple unary minuses', () => {
    // Simple unary minuses
    expect(calculator.calculate('-5')).toBe(-5);

    // Combinations with binary operations
    expect(calculator.calculate('3 + -2')).toBe(1);
    expect(calculator.calculate('5 - -3')).toBe(8);
    expect(calculator.calculate('2 * -3')).toBe(-6);

    // Nested parentheses with unary minuses
    expect(calculator.calculate('(-5 + 3) * 2')).toBe(-4);
    expect(calculator.calculate('-(5 + 3)')).toBe(-8);
    expect(calculator.calculate('-(-5 + 2) * 3')).toBe(9);

    // Multiple nested minuses
    expect(calculator.calculate('((-(3 + 2)) * -4)')).toBe(20);
    expect(calculator.calculate('(-(2 + 3) * -(4 - 1))')).toBe(15);

    // Complex combinations
    expect(calculator.calculate('-( - ( -5 + 3 ) * 2 )')).toBe(-4);
    expect(calculator.calculate('((3 * -2) + -(5 - 7))')).toBe(-4);
    expect(calculator.calculate('(-(-(-5)) + -(3 * -2))')).toBe(1);
  });
});
