export const ErrorMessage = {
  Invalid: 'Expression is invalid',
  NotAllowedSymbols: 'Expression has not allowed symbols',
  IncorrectUnaryOperator: 'Invalid unary operator found',
  HasNotSupportedOperators: 'Expression has not supported operators',
  UnmatchedParentheses: 'Expression has unmatched parentheses',
  DivisionByZero: 'Divide by zero is not supported',
  CalculationError: 'Error while calculating happened',
} as const;

export const throwError = (message: string): void => {
  throw new Error(message);
};
