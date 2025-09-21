import { RPNCalculator } from '@Calculator/components/ReversePolishNotation/RPNCalculator';
import { ExpressionTokenType } from '@Calculator/components/TokenProcessor/enums';
import { TokenProcessor } from '@Calculator/components/TokenProcessor/TokenProcessor';
import { Stack } from '@lib/data/Stack';
import { ErrorMessage } from '@lib/errors';
import type { IMathOperator } from '@lib/math/types';

jest.mock('../../../lib/data/Stack', () => {
  return {
    Stack: jest.fn().mockImplementation(() => ({
      size: jest.fn(),
      pop: jest.fn(),
      push: jest.fn(),
      popTo: jest.fn(),
    })),
  };
});

jest.mock('../../../lib/errors', () => ({
  ErrorMessage: {
    CalculationError: 'Calculation error',
  },
  throwError: jest.fn((message) => {
    throw new Error(message);
  }),
}));

jest.mock('../../../Calculator/components/TokenProcessor/TokenProcessor', () => {
  return {
    TokenProcessor: jest.fn().mockImplementation(({ tokenProcessor }) => ({
      process: jest.fn((token) => {
        if (typeof token === 'string') {
          tokenProcessor[ExpressionTokenType.Number](token);
        } else {
          tokenProcessor[ExpressionTokenType.Operator](token);
        }
      }),
    })),
  };
});

describe('RPNCalculator', () => {
  let calculator: RPNCalculator;
  let mockStack: jest.Mocked<Stack<number>>;
  let mockTokenProcessor: { process: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    calculator = new RPNCalculator();

    mockStack = (calculator['stack'] as unknown) as jest.Mocked<Stack<number>>;
    mockTokenProcessor = (calculator['tokenProcessor'] as unknown) as { process: jest.Mock };
  });

  describe('constructor', () => {
    it('should initialize with a stack and token processor', () => {
      expect(Stack).toHaveBeenCalled();
      expect(TokenProcessor).toHaveBeenCalledWith({
        supportedTokensTypes: [
          ExpressionTokenType.Number,
          ExpressionTokenType.Operator,
        ],
        tokenProcessor: expect.any(Object),
      });
    });
  });

  describe('calculate', () => {
    it('should process the entire expression and return the final result', () => {
      mockStack.size.mockReturnValue(0);
      mockStack.pop.mockReturnValue(42);

      const mockAddOperator: IMathOperator = {
        symbol: '+',
        precedence: 2,
        arity: 2,
        action: jest.fn().mockReturnValue(5),
      };
      const expression = ['2', '3', mockAddOperator];

      const result = calculator.calculate(expression);

      expect(mockTokenProcessor.process).toHaveBeenCalledTimes(3);
      expect(result).toBe(42);
    });

    it('should throw an error if stack does not have exactly one item', () => {
      mockStack.size.mockReturnValue(2);

      const mockAddOperator: IMathOperator = {
        symbol: '+',
        precedence: 2,
        arity: 2,
        action: jest.fn().mockReturnValue(5),
      };
      const expression = ['2', '3', mockAddOperator];

      expect(() => {
        calculator.calculate(expression);
      }).toThrow(ErrorMessage.CalculationError);
    });
  });

  describe('processToken', () => {
    it('should push parsed number to stack', () => {
      const expression = ['42'];
      calculator.calculate(expression);

      expect(mockStack.push).toHaveBeenCalledWith(42);
    });

    it('should handle floating point numbers', () => {
      const expression = ['3.14'];
      calculator.calculate(expression);

      expect(mockStack.push).toHaveBeenCalledWith(3.14);
    });
  });

  describe('processOperator', () => {
    it('should execute operator with correct number of arguments', () => {
      mockStack.popTo.mockImplementation((target) => {
        target.push(2);
        target.push(3);
      });

      const mockMultiplyOperator = {
        symbol: '*',
        precedence: 2,
        arity: 2,
        action: jest.fn().mockReturnValue(6),
      };

      const expression = ['2', '3', mockMultiplyOperator];
      calculator.calculate(expression);

      expect(mockStack.popTo).toHaveBeenCalledWith(expect.any(Array), 2);
      expect(mockMultiplyOperator.action).toHaveBeenCalledWith(3, 2);
      expect(mockStack.push).toHaveBeenCalledWith(6);
    });

    it('should handle unary operators', () => {
      mockStack.popTo.mockImplementation((target) => {
        target.push(5);
      });

      const mockNegateOperator = {
        symbol: '-',
        precedence: 3,
        arity: 1,
        action: jest.fn().mockReturnValue(-5),
      };

      const expression = ['5', mockNegateOperator];
      calculator.calculate(expression);

      expect(mockStack.popTo).toHaveBeenCalledWith(expect.any(Array), 1);
      expect(mockNegateOperator.action).toHaveBeenCalledWith(5);
      expect(mockStack.push).toHaveBeenCalledWith(-5);
    });
  });

  describe('Integration Tests', () => {
    it('should correctly calculate a simple addition', () => {
      const mockAddOperator: IMathOperator = {
        symbol: '+',
        precedence: 2,
        arity: 2,
        action: (a: number, b: number) => a + b,
      };

      const expression = ['2', '3', mockAddOperator];
      mockStack.size.mockReturnValue(0);
      mockStack.pop.mockReturnValue(5);

      const result = calculator.calculate(expression);
      expect(result).toBe(5);
    });

    it('should correctly calculate a complex expression', () => {
      const mockAddOperator: IMathOperator = {
        symbol: '+',
        precedence: 2,
        arity: 2,
        action: (a: number, b: number) => a + b,
      };
      const mockMultiplyOperator = {
        symbol: '*',
        precedence: 2,
        arity: 2,
        action: (a: number, b: number) => a * b,
      };

      const expression = ['2', '3', mockAddOperator, '4', mockMultiplyOperator];
      mockStack.size.mockReturnValue(0);
      mockStack.pop.mockReturnValue(20);

      const result = calculator.calculate(expression);
      expect(result).toBe(20);
    });
  });

  describe('Error Handling', () => {
    it('should throw error if calculation leaves multiple items on stack', () => {
      mockStack.size.mockReturnValue(2);

      const mockAddOperator: IMathOperator = {
        symbol: '+',
        precedence: 2,
        arity: 2,
        action: (a: number, b: number) => a + b,
      };

      const expression = ['2', '3', mockAddOperator];

      expect(() => {
        calculator.calculate(expression);
      }).toThrow(ErrorMessage.CalculationError);
    });
  });
});
