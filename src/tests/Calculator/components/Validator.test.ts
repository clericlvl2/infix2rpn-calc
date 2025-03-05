import { Validator } from '@Calculator/components/Validator';
import { ErrorMessage } from '@shared/errors';

describe('Validator', () => {
  const sampleOperators = [
    { symbol: '+', precedence: 1, arity: 2, associativity: 'left', action: jest.fn() },
    { symbol: '-', precedence: 1, arity: 2, associativity: 'left', action: jest.fn() },
    { symbol: '*', precedence: 2, arity: 2, associativity: 'left', action: jest.fn() },
    { symbol: '/', precedence: 2, arity: 2, associativity: 'left', action: jest.fn() },
    { symbol: '^', precedence: 3, arity: 2, associativity: 'right', action: jest.fn() },
  ];

  let validator: Validator;

  beforeEach(() => {
    jest.clearAllMocks();

    validator = new Validator({ supportedOperators: sampleOperators });
  });

  describe('constructor', () => {
    it('should initialize with supported operators', () => {
      expect(validator).toBeInstanceOf(Validator);
    });

    it('should call regexEscape for each operator symbol', () => {
      const regexEscapeSpy = jest.spyOn<
        { regexEscape: (string: string) => string },
        'regexEscape'
      >(require('../../../shared/utils'), 'regexEscape');

      new Validator({ supportedOperators: sampleOperators });

      expect(regexEscapeSpy).toHaveBeenCalledTimes(7);
      expect(regexEscapeSpy).toHaveBeenCalledWith('(');
      expect(regexEscapeSpy).toHaveBeenCalledWith(')');
      expect(regexEscapeSpy).toHaveBeenCalledWith('+');
      expect(regexEscapeSpy).toHaveBeenCalledWith('-');
      expect(regexEscapeSpy).toHaveBeenCalledWith('*');
      expect(regexEscapeSpy).toHaveBeenCalledWith('/');
      expect(regexEscapeSpy).toHaveBeenCalledWith('^');

      regexEscapeSpy.mockRestore();

    });
  });

  describe('checkString', () => {
    it('should not throw for valid string input', () => {
      expect(() => validator.checkString('2+2')).not.toThrow();
    });

    it('should throw for non-string input', () => {

      expect(() => validator.checkString(123 as unknown as string)).toThrow(ErrorMessage.Invalid);
    });
  });

  describe('checkEmptyString', () => {
    it('should not throw for non-empty string', () => {
      expect(() => validator.checkEmptyString('2+2')).not.toThrow();
    });

    it('should throw for empty string', () => {

      expect(() => validator.checkEmptyString('')).toThrow(ErrorMessage.Invalid);
    });
  });

  describe('checkNotAllowedSymbols', () => {
    it('should not throw for expression with only allowed symbols', () => {
      const regexTestSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValueOnce(true);

      expect(() => validator.checkNotAllowedSymbols('2+2')).not.toThrow();

      regexTestSpy.mockRestore();
    });

    it('should throw for expression with disallowed symbols', () => {
      const regexTestSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValueOnce(false);

      expect(() => validator.checkNotAllowedSymbols('2+2$')).toThrow(ErrorMessage.NotAllowedSymbols);

      regexTestSpy.mockRestore();
    });
  });

  describe('checkParentheses', () => {
    it('should not throw for expression with matched parentheses', () => {
      expect(() => validator.checkParentheses('(2+2)')).not.toThrow();
    });

    it('should not throw for expression with multiple matched parentheses', () => {
      expect(() => validator.checkParentheses('((2+2)*(3-1))')).not.toThrow();
    });

    it('should throw for expression with unmatched opening parenthesis', () => {
      expect(() => validator.checkParentheses('(2+2')).toThrow(ErrorMessage.UnmatchedParentheses);
    });

    it('should throw for expression with unmatched closing parenthesis', () => {
      expect(() => validator.checkParentheses('2+2)')).toThrow(ErrorMessage.UnmatchedParentheses);
    });

    it('should throw for expression with mismatched number of parentheses', () => {
      expect(() => validator.checkParentheses('((2+2)')).toThrow(ErrorMessage.UnmatchedParentheses);
    });
  });

  describe('createAllowedSymbolsRegex (private method)', () => {
    it('should create a regex that matches allowed symbols', () => {
      const originalTest = RegExp.prototype.test;
      const regexTestSpy = jest.spyOn(RegExp.prototype, 'test').mockImplementation(function (this: RegExp, str: string) {
        return originalTest.call(this, str);
      });

      expect(() => validator.checkNotAllowedSymbols('2+2')).not.toThrow();
      expect(() => validator.checkNotAllowedSymbols('3.14*(2-1)')).not.toThrow();
      expect(() => validator.checkNotAllowedSymbols('1+2*3/4^5')).not.toThrow();

      regexTestSpy.mockRestore();
    });

    it('should create a regex that rejects disallowed symbols', () => {
      const originalTest = RegExp.prototype.test;
      const regexTestSpy = jest.spyOn(RegExp.prototype, 'test').mockImplementation(function (this: RegExp, str: string) {
        return originalTest.call(this, str);
      });

      expect(() => validator.checkNotAllowedSymbols('2+2$')).toThrow(ErrorMessage.NotAllowedSymbols);
      expect(() => validator.checkNotAllowedSymbols('sin(x)')).toThrow(ErrorMessage.NotAllowedSymbols);
      expect(() => validator.checkNotAllowedSymbols('x=2+2')).toThrow(ErrorMessage.NotAllowedSymbols);

      regexTestSpy.mockRestore();
    });
  });

  describe('Integration Tests', () => {
    it('should validate a complete valid expression', () => {
      const regexTestSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValue(true);

      const expression = '(2+3)*(4/2)';

      expect(() => {
        validator.checkString(expression);
        validator.checkEmptyString(expression);
        validator.checkNotAllowedSymbols(expression);
        validator.checkParentheses(expression);
      }).not.toThrow();

      regexTestSpy.mockRestore();
    });

    it('should fail validation for an invalid expression with multiple issues', () => {
      const expression = '(2+$)';

      expect(() => {
        validator.checkString(expression);
        validator.checkEmptyString(expression);
        validator.checkNotAllowedSymbols(expression);
      }).toThrow(ErrorMessage.NotAllowedSymbols);
    });
  });

  describe('Edge Cases', () => {
    it('should handle expression with only numbers', () => {
      const regexTestSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValue(true);

      expect(() => validator.checkNotAllowedSymbols('123')).not.toThrow();

      regexTestSpy.mockRestore();
    });

    it('should handle expression with only operators', () => {
      const regexTestSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValue(true);

      expect(() => validator.checkNotAllowedSymbols('+')).not.toThrow();

      regexTestSpy.mockRestore();
    });

    it('should handle expression with only parentheses', () => {
      expect(() => validator.checkParentheses('()')).not.toThrow();
    });

    it('should handle expression with decimal numbers', () => {
      const regexTestSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValue(true);

      expect(() => validator.checkNotAllowedSymbols('3.14')).not.toThrow();

      regexTestSpy.mockRestore();
    });

    it('should handle deeply nested parentheses', () => {
      const deeplyNested = '('.repeat(100) + '0' + ')'.repeat(100);

      expect(() => validator.checkParentheses(deeplyNested)).not.toThrow();
    });

    it('should handle expressions with special characters in operators', () => {
      const specialOperators = [
        { symbol: '√', precedence: 3, arity: 1, associativity: 'right', action: jest.fn() },
      ];

      const specialValidator = new Validator({ supportedOperators: specialOperators });

      const regexTestSpy = jest.spyOn(RegExp.prototype, 'test').mockReturnValue(true);

      expect(() => specialValidator.checkNotAllowedSymbols('√4')).not.toThrow();

      regexTestSpy.mockRestore();
    });
  });
});
