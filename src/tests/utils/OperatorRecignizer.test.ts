import { RecognizedMathOperator } from '../../Calculator/operators/MathOperator';
import { OperatorRecognizer } from '../../Calculator/operators/OperatorRecognizer';
import { ErrorMessage } from '../../common/errors';

describe('OperatorRecognizer', () => {
  let operatorRecognizer: OperatorRecognizer;

  beforeEach(() => {
    operatorRecognizer = new OperatorRecognizer();
  });

  describe('recognizeMathOperators', () => {
    it('should recognize binary operators correctly', () => {
      const tokenizedExpression = ['1', '+', '2'];
      const result = operatorRecognizer.recognizeOperators(tokenizedExpression);

      expect(result.length).toBe(3);
      expect(result[0]).toBe('1');
      expect(result[1]).toBeInstanceOf(RecognizedMathOperator);
      expect((result[1] as RecognizedMathOperator).symbol).toBe('+');
      expect((result[1] as RecognizedMathOperator).arity).toBe(2);
      expect(result[2]).toBe('2');
    });

    it('should recognize unary operators at the beginning of expression', () => {
      const tokenizedExpression = ['-', '5'];
      const result = operatorRecognizer.recognizeOperators(tokenizedExpression);

      expect(result.length).toBe(2);
      expect(result[0]).toBeInstanceOf(RecognizedMathOperator);
      expect((result[0] as RecognizedMathOperator).symbol).toBe('-');
      expect((result[0] as RecognizedMathOperator).arity).toBe(1);
      expect(result[1]).toBe('5');
    });

    it('should recognize unary operators after left bracket', () => {
      const tokenizedExpression = ['(', '-', '5', ')'];
      const result = operatorRecognizer.recognizeOperators(tokenizedExpression);

      expect(result.length).toBe(4);
      expect(result[0]).toBe('(');
      expect(result[1]).toBeInstanceOf(RecognizedMathOperator);
      expect((result[1] as RecognizedMathOperator).symbol).toBe('-');
      expect((result[1] as RecognizedMathOperator).arity).toBe(1);
      expect(result[2]).toBe('5');
      expect(result[3]).toBe(')');
    });

    it('should recognize unary operators after another operator', () => {
      const tokenizedExpression = ['2', '+', '-', '3'];
      const result = operatorRecognizer.recognizeOperators(tokenizedExpression);

      expect(result.length).toBe(4);
      expect(result[0]).toBe('2');
      expect(result[1]).toBeInstanceOf(RecognizedMathOperator);
      expect((result[1] as RecognizedMathOperator).symbol).toBe('+');
      expect((result[1] as RecognizedMathOperator).arity).toBe(2);
      expect(result[2]).toBeInstanceOf(RecognizedMathOperator);
      expect((result[2] as RecognizedMathOperator).symbol).toBe('-');
      expect((result[2] as RecognizedMathOperator).arity).toBe(1);
      expect(result[3]).toBe('3');
    });

    it('should handle complex expressions correctly', () => {
      const tokenizedExpression = ['1', '+', '2', '*', '(', '3', '-', '4', ')', '/', '-', '5'];
      const result = operatorRecognizer.recognizeOperators(tokenizedExpression);

      expect(result.length).toBe(12);
      // Check a few key items
      expect(result[1]).toBeInstanceOf(RecognizedMathOperator); // +
      expect((result[1] as RecognizedMathOperator).arity).toBe(2);
      expect(result[3]).toBeInstanceOf(RecognizedMathOperator); // *
      expect((result[3] as RecognizedMathOperator).arity).toBe(2);
      expect(result[6]).toBeInstanceOf(RecognizedMathOperator); // -
      expect((result[6] as RecognizedMathOperator).arity).toBe(2);
      expect(result[9]).toBeInstanceOf(RecognizedMathOperator); // /
      expect((result[9] as RecognizedMathOperator).arity).toBe(2);
      expect(result[10]).toBeInstanceOf(RecognizedMathOperator); // -
      expect((result[10] as RecognizedMathOperator).arity).toBe(1);
    });

    it('should handle an empty expression', () => {
      const tokenizedExpression: string[] = [];
      const result = operatorRecognizer.recognizeOperators(tokenizedExpression);
      expect(result).toEqual([]);
    });

    it('should handle expression with only numbers and brackets', () => {
      const tokenizedExpression = ['1', '(', '2', ')'];
      const result = operatorRecognizer.recognizeOperators(tokenizedExpression);
      expect(result).toEqual(['1', '(', '2', ')']);
    });
  });

  describe('enrichMathOperators', () => {
    it('should enrich recognized operators', () => {
      // Create a recognized expression
      const recognizedExpression = [
        '1',
        new RecognizedMathOperator({ symbol: '+', arity: 2 }),
        '2',
      ];

      // Create enriched operators to match against
      const mockOperator = {
        symbol: '+',
        arity: 2,
        precedence: 1,
        action: jest.fn(),
      };

      const result = operatorRecognizer.enrichOperators(recognizedExpression, [mockOperator]);

      expect(result.length).toBe(3);
      expect(result[0]).toBe('1');
      expect(result[1]).toBe(mockOperator);
      expect(result[2]).toBe('2');
    });

    it('should throw error for unsupported operators', () => {
      const recognizedExpression = [
        '1',
        new RecognizedMathOperator({ symbol: '+', arity: 2 }),
        '2',
      ];

      // No operators provided that match
      const mockOperator = {
        symbol: '-',
        arity: 2,
        precedence: 1,
        action: jest.fn(),
      };

      expect(() => {
        operatorRecognizer.enrichOperators(recognizedExpression, [mockOperator]);
      }).toThrow(ErrorMessage.HasNotSupportedOperators);
    });

    it('should handle non-operator tokens', () => {
      const recognizedExpression = [
        '1',
        '(',
        '2',
        ')',
        new RecognizedMathOperator({ symbol: '+', arity: 2 }),
        '3',
      ];

      const mockOperator = {
        symbol: '+',
        arity: 2,
        precedence: 1,
        action: jest.fn(),
      };

      const result = operatorRecognizer.enrichOperators(recognizedExpression, [mockOperator]);

      expect(result.length).toBe(6);
      expect(result[0]).toBe('1');
      expect(result[1]).toBe('(');
      expect(result[2]).toBe('2');
      expect(result[3]).toBe(')');
      expect(result[4]).toBe(mockOperator);
      expect(result[5]).toBe('3');
    });

    it('should handle multiple operators of different types', () => {
      const recognizedExpression = [
        '1',
        new RecognizedMathOperator({ symbol: '+', arity: 2 }),
        '2',
        new RecognizedMathOperator({ symbol: '*', arity: 2 }),
        '3',
        new RecognizedMathOperator({ symbol: '-', arity: 1 }),
        '4',
      ];

      const plusOperator = {
        symbol: '+',
        arity: 2,
        precedence: 1,
        action: jest.fn(),
      };

      const multiplyOperator = {
        symbol: '*',
        arity: 2,
        precedence: 2,
        action: jest.fn(),
      };

      const minusUnaryOperator = {
        symbol: '-',
        arity: 1,
        precedence: 3,
        action: jest.fn(),
      };

      const result = operatorRecognizer.enrichOperators(
        recognizedExpression,
        [plusOperator, multiplyOperator, minusUnaryOperator],
      );

      expect(result.length).toBe(7);
      expect(result[1]).toBe(plusOperator);
      expect(result[3]).toBe(multiplyOperator);
      expect(result[5]).toBe(minusUnaryOperator);
    });

    it('should distinguish between unary and binary operators with the same symbol', () => {
      const recognizedExpression = [
        '1',
        new RecognizedMathOperator({ symbol: '-', arity: 2 }),
        new RecognizedMathOperator({ symbol: '-', arity: 1 }),
        '2',
      ];

      const minusBinaryOperator = {
        symbol: '-',
        arity: 2,
        precedence: 1,
        action: jest.fn(),
      };

      const minusUnaryOperator = {
        symbol: '-',
        arity: 1,
        precedence: 3,
        action: jest.fn(),
      };

      const result = operatorRecognizer.enrichOperators(
        recognizedExpression,
        [minusBinaryOperator, minusUnaryOperator],
      );

      expect(result.length).toBe(4);
      expect(result[1]).toBe(minusBinaryOperator);
      expect(result[2]).toBe(minusUnaryOperator);
    });
  });

  describe('determineArity', () => {
    // This is a private method, but we can test its behavior through recognizeMathOperators

    it('should throw error for incorrect unary operator usage', () => {
      const tokenizedExpression = ['-', '+'];

      expect(() => {
        operatorRecognizer.recognizeOperators(tokenizedExpression);
      }).toThrow(ErrorMessage.IncorrectUnaryOperator);
    });

    it('should throw error when unary operator is followed by another operator', () => {
      const tokenizedExpression = ['(', '-', '*', '2', ')'];

      expect(() => {
        operatorRecognizer.recognizeOperators(tokenizedExpression);
      }).toThrow(ErrorMessage.IncorrectUnaryOperator);
    });

    it('should correctly identify unary operators at the start of expression', () => {
      const tokenizedExpression = ['-', '5'];
      const result = operatorRecognizer.recognizeOperators(tokenizedExpression);

      expect((result[0] as RecognizedMathOperator).arity).toBe(1);
    });

    it('should correctly identify binary operators between operands', () => {
      const tokenizedExpression = ['5', '-', '3'];
      const result = operatorRecognizer.recognizeOperators(tokenizedExpression);

      expect((result[1] as RecognizedMathOperator).arity).toBe(2);
    });
  });
});
