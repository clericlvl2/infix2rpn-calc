import { Tokenizer } from '@Calculator/components/Tokenizer/Tokenizer';
import * as ValidationModule from '../../../shared/validation';

describe('Tokenizer', () => {
  let tokenizer: Tokenizer;
  let isStrictStringifiedNumberSpy: jest.SpyInstance;

  beforeEach(() => {
    tokenizer = new Tokenizer();

    isStrictStringifiedNumberSpy = jest.spyOn(ValidationModule, 'isStrictStringifiedNumber')
      .mockImplementation((value: unknown): value is string => {
        return typeof value === 'string' && /^\d+$/.test(value);
      });
  });

  afterEach(() => {
    isStrictStringifiedNumberSpy.mockRestore();
  });

  describe('Basic Tokenization', () => {
    it('should tokenize simple addition expression', () => {
      const expression = '5+3';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual(['5', '+', '3']);
    });

    it('should tokenize expression with multiple digits', () => {
      const expression = '42+13';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual(['42', '+', '13']);
    });

    it('should tokenize complex expression', () => {
      const expression = '5+3*2';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual(['5', '+', '3', '*', '2']);
    });
  });

  describe('Token Handling', () => {
    it('should handle decimal numbers correctly', () => {
      isStrictStringifiedNumberSpy.mockImplementation((value: unknown): value is string => {
        return typeof value === 'string' && /^\d+$/.test(value);
      });

      const expression = '5.5+3.7';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual(['5', '.', '5', '+', '3', '.', '7']);
    });

    it('should handle negative numbers', () => {
      isStrictStringifiedNumberSpy.mockImplementation((value: unknown): value is string => {
        return typeof value === 'string' && /^-?\d+$/.test(value);
      });

      const expression = '-5+3';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual(['-', '5', '+', '3']);
    });

    it('should handle parentheses', () => {
      const expression = '(5+3)*2';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual(['(', '5', '+', '3', ')', '*', '2']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty expression', () => {
      const expression = '';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual([]);
    });

    it('should handle single number', () => {
      const expression = '42';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual(['42']);
    });

    it('should handle expression with spaces', () => {
      isStrictStringifiedNumberSpy.mockImplementation((value: unknown): value is string => {
        return typeof value === 'string' && /^\d+$/.test(value.trim());
      });

      const expression = '5 + 3';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual(['5', '+', '3']);
    });
  });

  describe('Boundary Conditions', () => {
    it('should handle consecutive operators', () => {
      const expression = '5++3';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual(['5', '+', '+', '3']);
    });

    it('should handle mixed operators', () => {
      const expression = '5+-3';
      const result = tokenizer.tokenizeExpression(expression);
      expect(result).toEqual(['5', '+', '-', '3']);
    });
  });

  describe('Validation Function Interaction', () => {
    it('should call isStrictStringifiedNumber for each chunk', () => {
      const expression = '42+13';
      tokenizer.tokenizeExpression(expression);

      expect(isStrictStringifiedNumberSpy).toHaveBeenCalledTimes(expression.length);
    });
  });

  describe('Performance Considerations', () => {
    it('should handle long expressions efficiently', () => {
      const expression = '1+2+3+4+5+6+7+8+9+0+'.repeat(100);
      const result = tokenizer.tokenizeExpression(expression);

      expect(result.length).toBeGreaterThan(0);
      result.forEach(token => {
        expect(['0','1','2','3','4','5','6','7','8','9','+'].includes(token)).toBeTruthy();
      });
    });
  });

  describe('Type Guard Verification', () => {
    it('should correctly identify string numbers', () => {
      const isNumber = ValidationModule.isStrictStringifiedNumber('123');
      expect(isNumber).toBe(true);

      const isNotNumber = ValidationModule.isStrictStringifiedNumber('abc');
      expect(isNotNumber).toBe(false);
    });
  });
});
