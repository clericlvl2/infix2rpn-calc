export const ErrorMessage = {
  Invalid: 'Expression is invalid',
  NotAllowedSymbols: 'Expression has not allowed symbols',
  IncorrectUnaryOperator: 'Invalid unary operator found',
  UnmatchedBrackets: 'Expression has unmatched brackets',
  DivisionByZero: 'Divide by zero is not supported',
  CalculationError: 'Error while calculating happened',
} as const;

export const throwError = (message: string): void => {
  throw new Error(message);
};
