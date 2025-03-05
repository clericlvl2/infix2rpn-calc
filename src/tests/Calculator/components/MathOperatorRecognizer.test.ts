import { MathOperatorRecognizer } from '@Calculator/components/MathOperatorRecognizer/MathOperatorRecognizer';
import type { TTokenizedExpression } from '@Calculator/types';
import { ErrorMessage } from '@shared/errors';
import type { IMathOperator } from '@shared/math/types';

describe('MathOperatorRecognizer', () => {
  const safelyGetArity = (val: string | IMathOperator): number => {
    return typeof val === 'string' ? NaN : val.arity;
  };

  const safelyGetSymbol = (val: string | IMathOperator): string => {
    return typeof val === 'string' ? '' : val.symbol;
  };

  const sampleOperators = [
    { symbol: '+', precedence: 1, arity: 2, associativity: 'left', action: jest.fn() },
    { symbol: '-', precedence: 1, arity: 2, associativity: 'left', action: jest.fn() },
    { symbol: '*', precedence: 2, arity: 2, associativity: 'left', action: jest.fn() },
    { symbol: '/', precedence: 2, arity: 2, associativity: 'left', action: jest.fn() },
    { symbol: '-', precedence: 3, arity: 1, associativity: 'right', action: jest.fn() },
  ];

  let recognizer: MathOperatorRecognizer;

  beforeEach(() => {
    recognizer = new MathOperatorRecognizer({
      supportedOperators: sampleOperators,
    });
  });

  describe('constructor', () => {
    it('should initialize with supported operators', () => {
      expect(recognizer).toBeInstanceOf(MathOperatorRecognizer);
    });
  });

  describe('recognize', () => {
    it('should recognize binary operators in a simple expression', () => {
      const tokenizedExpression = ['2', '+', '3'];
      const result = recognizer.recognize(tokenizedExpression);

      expect(result).toHaveLength(3);
      expect(result[0]).toBe('2');
      expect(result[1]).toEqual(expect.objectContaining({
        symbol: '+',
        precedence: 1,
        arity: 2,
      }));
      expect(result[2]).toBe('3');
    });

    it('should recognize multiple operators with different precedence', () => {
      const tokenizedExpression = ['2', '+', '3', '*', '4'];
      const result = recognizer.recognize(tokenizedExpression);

      expect(result).toHaveLength(5);
      expect(result[1]).toEqual(expect.objectContaining({
        symbol: '+',
        precedence: 1,
        arity: 2,
      }));
      expect(result[3]).toEqual(expect.objectContaining({
        symbol: '*',
        precedence: 2,
        arity: 2,
      }));
    });

    it('should recognize unary operators', () => {
      const tokenizedExpression = ['-', '5'];
      const result = recognizer.recognize(tokenizedExpression);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(expect.objectContaining({
        symbol: '-',
        precedence: 3,
        arity: 1,
      }));
      expect(result[1]).toBe('5');
    });

    it('should recognize unary operators after opening parenthesis', () => {
      const tokenizedExpression = ['(', '-', '5', ')'];
      const result = recognizer.recognize(tokenizedExpression);

      expect(result).toHaveLength(4);
      expect(result[1]).toEqual(expect.objectContaining({
        symbol: '-',
        precedence: 3,
        arity: 1,
      }));
    });

    it('should recognize unary operators after other operators', () => {
      const tokenizedExpression = ['2', '+', '-', '3'];
      const result = recognizer.recognize(tokenizedExpression);

      expect(result).toHaveLength(4);
      expect(result[1]).toEqual(expect.objectContaining({
        symbol: '+',
        precedence: 1,
        arity: 2,
      }));
      expect(result[2]).toEqual(expect.objectContaining({
        symbol: '-',
        precedence: 3,
        arity: 1,
      }));
    });

    it('should handle complex expressions with parentheses', () => {
      const tokenizedExpression = ['2', '*', '(', '3', '+', '4', ')', '/', '5'];
      const result = recognizer.recognize(tokenizedExpression);

      expect(result).toHaveLength(9);
      expect(result[1]).toEqual(expect.objectContaining({
        symbol: '*',
        precedence: 2,
        arity: 2,
      }));
      expect(result[4]).toEqual(expect.objectContaining({
        symbol: '+',
        precedence: 1,
        arity: 2,
      }));
      expect(result[7]).toEqual(expect.objectContaining({
        symbol: '/',
        precedence: 2,
        arity: 2,
      }));
    });

    it('should handle nested parentheses', () => {
      const tokenizedExpression = ['(', '(', '1', '+', '2', ')', '*', '3', ')'];
      const result = recognizer.recognize(tokenizedExpression);

      expect(result).toHaveLength(9);
      expect(result[3]).toEqual(expect.objectContaining({
        symbol: '+',
        precedence: 1,
        arity: 2,
      }));
      expect(result[6]).toEqual(expect.objectContaining({
        symbol: '*',
        precedence: 2,
        arity: 2,
      }));
    });
  });

  describe('error handling', () => {
    it('should throw error for unsupported operators', () => {
      const tokenizedExpression = ['2', '^', '3'];

      expect(() => {
        recognizer.recognize(tokenizedExpression);
      }).toThrow(ErrorMessage.HasNotSupportedOperators);
    });

    it('should throw error for invalid expression without right operand', () => {
      const tokenizedExpression = ['2', '+'];

      expect(() => {
        recognizer.recognize(tokenizedExpression);
      }).toThrow(ErrorMessage.Invalid);
    });

    it('should throw error for incorrect unary operator usage', () => {
      const tokenizedExpression = ['-', '+'];

      expect(() => {
        recognizer.recognize(tokenizedExpression);
      }).toThrow(ErrorMessage.IncorrectUnaryOperator);
    });
  });

  describe('private methods', () => {
    describe('recognizeOperators', () => {
      it('should correctly convert tokens to recognized operators', () => {
        const tokenizedExpression = ['2', '+', '3'];
        const result = recognizer.recognize(tokenizedExpression);

        expect(typeof result[0]).toBe('string');
        expect(result[1].constructor.name).toBe('Object');
        expect(typeof result[2]).toBe('string');
      });
    });

    describe('isUnrecognizedOperator', () => {
      it('should identify operators vs non-operators', () => {
        const tokenizedExpressionWithNumbers = ['1', '+', '2'];
        const result = recognizer.recognize(tokenizedExpressionWithNumbers);

        expect(result[0]).toBe('1');
        expect(typeof result[1]).toBe('object');
        expect(result[2]).toBe('2');

        const tokenizedExpressionWithParens = ['(', '1', '+', '2', ')'];
        const resultWithParens = recognizer.recognize(tokenizedExpressionWithParens);

        expect(resultWithParens[0]).toBe('(');
        expect(resultWithParens[1]).toBe('1');
        expect(typeof resultWithParens[2]).toBe('object');
        expect(resultWithParens[3]).toBe('2');
        expect(resultWithParens[4]).toBe(')');
      });
    });

    describe('determineArity', () => {
      it('should determine binary arity for operators between two numbers', () => {
        const tokenizedExpression = ['2', '+', '3'];
        const result = recognizer.recognize(tokenizedExpression);

        expect(safelyGetArity(result[1])).toBe(2);
      });

      it('should determine unary arity for operators at the beginning', () => {
        const tokenizedExpression = ['-', '3'];
        const result = recognizer.recognize(tokenizedExpression);

        expect(safelyGetArity(result[0])).toBe(1);
      });

      it('should determine unary arity for operators after opening parenthesis', () => {
        const tokenizedExpression = ['(', '-', '3', ')'];
        const result = recognizer.recognize(tokenizedExpression);

        expect(safelyGetArity(result[1])).toBe(1);
      });

      it('should determine unary arity for operators after other operators', () => {
        const tokenizedExpression = ['2', '+', '-', '3'];
        const result = recognizer.recognize(tokenizedExpression);

        expect(safelyGetArity(result[2])).toBe(1);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty expression', () => {
      const emptyTokenizedExpression: TTokenizedExpression = [];
      const result = recognizer.recognize(emptyTokenizedExpression);

      expect(result).toEqual([]);
    });

    it('should handle expression with only numbers', () => {
      const tokenizedExpression = ['5'];
      const result = recognizer.recognize(tokenizedExpression);

      expect(result).toEqual(['5']);
    });

    it('should handle consecutive unary operators', () => {
      const tokenizedExpression = ['-', '(', '-', '3', ')'];
      const result = recognizer.recognize(tokenizedExpression);

      expect(result).toHaveLength(5);
      expect(safelyGetArity(result[0])).toBe(1);
      expect(safelyGetArity(result[2])).toBe(1);
    });
  });

  describe('integration tests', () => {
    it('should correctly process a complex mathematical expression', () => {
      const tokenizedExpression = ['2', '*', '(', '-', '3', '+', '4', ')', '/', '5'];
      const result = recognizer.recognize(tokenizedExpression);

      expect(result).toHaveLength(10);
      expect(result[0]).toBe('2');
      expect(safelyGetSymbol(result[1])).toBe('*');
      expect(safelyGetArity(result[1])).toBe(2);
      expect(result[2]).toBe('(');
      expect(safelyGetSymbol(result[3])).toBe('-');
      expect(safelyGetArity(result[3])).toBe(1);
      expect(result[4]).toBe('3');
      expect(safelyGetSymbol(result[5])).toBe('+');
      expect(safelyGetArity(result[5])).toBe(2);
      expect(result[6]).toBe('4');
      expect(result[7]).toBe(')');
      expect(safelyGetSymbol(result[8])).toBe('/');
      expect(safelyGetArity(result[8])).toBe(2);
      expect(result[9]).toBe('5');
    });
  });
});
