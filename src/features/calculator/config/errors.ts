export const ErrorMessage = {
    InvalidExpressionPassed: 'Invalid expression passed, string required',
    EmptyExpressionPassed: 'Empty expression passed',
    InvalidSymbolFound: 'Invalid symbol found',
    InvalidOperationFound: 'Invalid operation found',
    InvalidUnaryOperationFound: 'Invalid unary operation found',
    UnmatchedParenthesesFound: 'Unmatched parentheses found',
    DivisionByZeroFound: 'Division by zero detected. Result is infinity',
    CalculationErrorFound: 'An unexpected error occurred during calculations',
} as const;
