import { RPNConverter } from '@Calculator/components/ReversePolishNotation/RPNConverter';
import { IMathOperator } from '@shared/math/types';
import { TEnrichedExpression } from '@Calculator/types';

const MOCK_PLUS: IMathOperator = {
  symbol: '+',
  precedence: 1,
  arity: 2,
  action: (a, b) => a + b
};

const MOCK_MULTIPLY: IMathOperator = {
  symbol: '*',
  precedence: 2,
  arity: 2,
  action: (a, b) => a * b
};

describe('RPNConverter', () => {
  let rpnConverter: RPNConverter;

  beforeEach(() => {
    rpnConverter = new RPNConverter();
  });

  describe('Basic Arithmetic Conversion', () => {
    it('should convert simple addition expression', () => {
      const tokens: TEnrichedExpression = ['5', MOCK_PLUS, '3'];

      const result = rpnConverter.convert(tokens);
      expect(result).toEqual(['5', '3', MOCK_PLUS]);
    });

    it('should convert mixed arithmetic expression', () => {
      const tokens: TEnrichedExpression = ['5', MOCK_PLUS, '3', MOCK_MULTIPLY, '2'];

      const result = rpnConverter.convert(tokens);
      expect(result).toEqual(['5', '3', '2', MOCK_MULTIPLY, MOCK_PLUS]);
    });
  });

  describe('Parentheses Handling', () => {
    it('should handle simple parenthesized expression', () => {
      const tokens: TEnrichedExpression = ['(', '5', MOCK_PLUS, '3', ')'];

      const result = rpnConverter.convert(tokens);
      expect(result).toEqual(['5', '3', MOCK_PLUS]);
    });

    it('should handle nested parentheses', () => {
      const tokens: TEnrichedExpression = ['(', '5', MOCK_PLUS, '(', '3', MOCK_MULTIPLY, '2', ')', ')'];

      const result = rpnConverter.convert(tokens);
      expect(result).toEqual(['5', '3', '2', MOCK_MULTIPLY, MOCK_PLUS]);
    });
  });

  describe('Operator Precedence', () => {
    it('should respect operator precedence without parentheses', () => {
      const tokens: TEnrichedExpression = ['5', MOCK_PLUS, '3', MOCK_MULTIPLY, '2'];

      const result = rpnConverter.convert(tokens);
      expect(result).toEqual(['5', '3', '2', MOCK_MULTIPLY, MOCK_PLUS]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty expression', () => {
      const tokens: TEnrichedExpression = [];

      const result = rpnConverter.convert(tokens);
      expect(result).toEqual([]);
    });

    it('should handle single number', () => {
      const tokens: TEnrichedExpression = ['42'];

      const result = rpnConverter.convert(tokens);
      expect(result).toEqual(['42']);
    });
  });

  describe('Error Scenarios', () => {
    it('should handle mismatched parentheses', () => {
      const tokens: TEnrichedExpression = ['(', '5'];

      expect(() => rpnConverter.convert(tokens)).not.toThrow();
    });
  });
});
