import { ErrorMessage } from '../common/errors';
import { Calculator } from '../Calculator/Calculator';
import { Operator } from '../Calculator/operators/constants';

describe('Infix Calculator using RPN', () => {
  const OPERATORS = [Operator.Plus, Operator.Minus, Operator.Multiply, Operator.Divide];

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

  // test("handles large numbers", () => {
  //   expect(calculator.calculate("1e+20 + 2e+20")).toBe(3e+20);
  // });
  //
  // test("handles very large number calculations", () => {
  //   expect(calculator.calculate("9999999999999999999 + 1")).toBe(10000000000000000000);
  // });

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

  // test("handles long decimal numbers", () => {
  //   expect(calculator.calculate("3.1415926535 + 2.7182818284")).toBeCloseTo(5.8598744819, 10);
  // });
  //
  // test("handles very large multiplication", () => {
  //   expect(calculator.calculate("1e+100 * 1e+100")).toBeCloseTo(1e+200);
  // });

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

  // test("handles floating point precision errors", () => {
  //   expect(calculator.calculate("0.1 + 0.2")).toBeCloseTo(0.3, 10);
  // });
});
