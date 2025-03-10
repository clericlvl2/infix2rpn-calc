import { Operator } from '@App/constants';
import { Calculator } from '@Calculator/Calculator';
import { ErrorMessage } from '@shared/errors';
import type { IMathOperator } from '@shared/math/types';

/**
 * Calculator is not able to:
 * - work with large numbers
 * - work with long decimal numbers
 * - check invalid operators combinations
 * - check missing operands
 */
describe('Infix Calculator using ReversePolishNotation', () => {
  const OPERATORS = [Operator.Plus, Operator.Minus, Operator.Multiply, Operator.Divide, Operator.UnaryMinus];

  const calculator = new Calculator({ supportedOperators: OPERATORS });

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

  test('massive whitespace variations', () => {
    const expression = '  5   +      4   *     ( 3    -      2 )  ';
    expect(calculator.calculate(expression)).toBe(9);
  });

  test('unicode and non-standard whitespace', () => {
    const unicodeSpaceExpression = '5\u2003+\u2002(3\u2001*\u20024)';
    expect(calculator.calculate(unicodeSpaceExpression)).toBe(17);
  });

  test('handles expression with missing operands', () => {
    expect(() => calculator.calculate('3 +')).toThrow(ErrorMessage.Invalid);
    expect(() => calculator.calculate('   3   4  + ')).toThrow(ErrorMessage.Invalid);
  });

  test('throws an error on unsupported operators', () => {
    expect(() => calculator.calculate('3 % 2')).toThrow(ErrorMessage.NotAllowedSymbols);
  });

  test('handles empty input', () => {
    expect(() => calculator.calculate('')).toThrow(ErrorMessage.Invalid);
  });

  test('handles zero correctly', () => {
    expect(calculator.calculate('0 + 0')).toBe(0);
    expect(calculator.calculate('0 * 0')).toBe(0);
  });

  test('should throw error on non-numeric input', () => {
    expect(() => calculator.calculate('5 + a')).toThrow(ErrorMessage.NotAllowedSymbols);
    expect(() => calculator.calculate('5 + @')).toThrow(ErrorMessage.NotAllowedSymbols);
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
    expect(calculator.calculate('-5')).toBe(-5);

    expect(calculator.calculate('3 + -2')).toBe(1);
    expect(calculator.calculate('5 - -3')).toBe(8);
    expect(calculator.calculate('2 * -3')).toBe(-6);

    expect(calculator.calculate('(-5 + 3) * 2')).toBe(-4);
    expect(calculator.calculate('-(5 + 3)')).toBe(-8);
    expect(calculator.calculate('-(-5 + 2) * 3')).toBe(9);

    expect(calculator.calculate('((-(3 + 2)) * -4)')).toBe(20);
    expect(calculator.calculate('(-(2 + 3) * -(4 - 1))')).toBe(15);

    expect(calculator.calculate('-( - ( -5 + 3 ) * 2 )')).toBe(-4);
    expect(calculator.calculate('((3 * -2) + -(5 - 7))')).toBe(-4);
    expect(calculator.calculate('(-(-(-5)) + -(3 * -2))')).toBe(1);
  });

  test('extremely long nested expression', () => {
    const complexExpression = '-(((((1 + 2) * 3) - 4) / 5) + (((6 - 7) * 8) / 9))'.repeat(100);
    expect(() => calculator.calculate(complexExpression)).not.toThrow();
  });

  test('maximum nesting depth', () => {
    const deepNestExpression = ''.padStart(100, '(') + '5' + ''.padEnd(100, ')');
    expect(calculator.calculate(deepNestExpression)).toBe(5);
  });


  test('multiple consecutive operators', () => {
    expect(() => calculator.calculate('3 * / 4')).toThrow(ErrorMessage.HasNotSupportedOperators);
  });

  test('unbalanced parentheses', () => {
    expect(() => calculator.calculate('(3 + 4')).toThrow(ErrorMessage.UnmatchedParentheses);
    expect(() => calculator.calculate('3 + 4)')).toThrow(ErrorMessage.UnmatchedParentheses);
  });

  test('misplaced parentheses', () => {
    expect(() => calculator.calculate(')3 + 4(')).toThrow(ErrorMessage.UnmatchedParentheses);
    expect(() => calculator.calculate('((3 + 4))')).not.toThrow();
  });
});

describe('Calculator with Different Operator Sets', () => {
  const basicArithmeticOperators: IMathOperator[] = [
    {
      symbol: '+',
      arity: 2,
      precedence: 1,
      action: (a, b) => a + b
    },
    {
      symbol: '-',
      arity: 2,
      precedence: 1,
      action: (a, b) => a - b
    },
    {
      symbol: '*',
      arity: 2,
      precedence: 2,
      action: (a, b) => a * b
    },
    {
      symbol: '/',
      arity: 2,
      precedence: 2,
      action: (a, b) => {
        if (b === 0) throw new Error(ErrorMessage.DivisionByZero);
        return a / b;
      }
    }
  ];

  const powerOperators: IMathOperator[] = [
    ...basicArithmeticOperators,
    {
      symbol: '^',
      arity: 2,
      precedence: 3,
      action: (a, b) => Math.pow(a, b)
    }
  ];

  const advancedOperators: IMathOperator[] = [
    ...basicArithmeticOperators,
    {
      symbol: '%',
      arity: 2,
      precedence: 2,
      action: (a, b) => a % b
    },
    {
      symbol: '>',
      arity: 2,
      precedence: 1,
      action: (a, b) => a > b ? 1 : 0
    },
    {
      symbol: '<',
      arity: 2,
      precedence: 1,
      action: (a, b) => a < b ? 1 : 0
    }
  ];

  const bitwiseOperators: IMathOperator[] = [
    ...basicArithmeticOperators,
    {
      symbol: '&',
      arity: 2,
      precedence: 1,
      action: (a, b) => Math.floor(a) & Math.floor(b)
    },
    {
      symbol: '|',
      arity: 2,
      precedence: 1,
      action: (a, b) => Math.floor(a) | Math.floor(b)
    }
  ];

  describe('Basic Arithmetic Operator Set', () => {
    const calculator = new Calculator({ supportedOperators: basicArithmeticOperators });

    test('supports standard arithmetic operations', () => {
      expect(calculator.calculate('10 + 5')).toBe(15);
      expect(calculator.calculate('20 - 8')).toBe(12);
      expect(calculator.calculate('6 * 7')).toBe(42);
      expect(calculator.calculate('30 / 5')).toBe(6);
    });

    test('handles order of operations', () => {
      expect(calculator.calculate('2 + 3 * 4')).toBe(14);
      expect(calculator.calculate('(2 + 3) * 4')).toBe(20);
    });

    test('rejects unsupported operators', () => {
      expect(() => calculator.calculate('2 ^ 3')).toThrow(ErrorMessage.NotAllowedSymbols);
      expect(() => calculator.calculate('2 > 1')).toThrow(ErrorMessage.NotAllowedSymbols);
    });
  });

  describe('Power Operator Set', () => {
    const calculator = new Calculator({ supportedOperators: powerOperators });

    test('supports power operation', () => {
      expect(calculator.calculate('2 ^ 3')).toBe(8);
      expect(calculator.calculate('3 ^ 2')).toBe(9);
    });

    test('combines power with other operations', () => {
      expect(calculator.calculate('2 ^ 3 + 1')).toBe(9);
      expect(calculator.calculate('(2 ^ 3) * 2')).toBe(16);
    });
  });

  describe('Advanced Operator Set', () => {
    const calculator = new Calculator({ supportedOperators: advancedOperators });

    test('supports modulo operation', () => {
      expect(calculator.calculate('10 % 3')).toBe(1);
      expect(calculator.calculate('15 % 4')).toBe(3);
    });

    test('supports comparison operations', () => {
      expect(calculator.calculate('5 > 3')).toBe(1);
      expect(calculator.calculate('2 < 4')).toBe(1);
      expect(calculator.calculate('3 > 5')).toBe(0);
    });

    test('combines comparison with arithmetic', () => {
      expect(calculator.calculate('(5 > 3) + 2')).toBe(3);
      expect(calculator.calculate('10 % 3 * 2')).toBe(2);
    });
  });

  describe('Bitwise Operator Set', () => {
    const calculator = new Calculator({ supportedOperators: bitwiseOperators });

    test('supports bitwise AND operation', () => {
      expect(calculator.calculate('5 & 3')).toBe(1);
      expect(calculator.calculate('12 & 10')).toBe(8);
    });

    test('supports bitwise OR operation', () => {
      expect(calculator.calculate('5 | 3')).toBe(7);
      expect(calculator.calculate('12 | 10')).toBe(14);
    });

    test('combines bitwise operations with arithmetic', () => {
      expect(calculator.calculate('(5 & 3) + (12 | 10)')).toBe(15);
      expect(calculator.calculate('5 & 3 * 2')).toBe(4);
    });
  });

  describe('Mixed Operator Set Scenarios', () => {
    test('throws error when mixing unsupported operators', () => {
      const basicCalculator = new Calculator({ supportedOperators: basicArithmeticOperators });

      expect(() => basicCalculator.calculate('2 ^ 3')).toThrow(ErrorMessage.NotAllowedSymbols);
      expect(() => basicCalculator.calculate('5 > 3')).toThrow(ErrorMessage.NotAllowedSymbols);
    });

    test('allows dynamic operator set configuration', () => {
      const mixedOperators = [
        ...basicArithmeticOperators,
        {
          symbol: '^',
          arity: 2,
          precedence: 3,
          action: (a: number, b: number) => Math.pow(a, b)
        }
      ];

      const calculator = new Calculator({ supportedOperators: mixedOperators });
      expect(calculator.calculate('2 ^ 3 + 1')).toBe(9);
    });
  });
});
