export const Paren = {
    Left: '(',
    Right: ')',
} as const;

export type TParenObject = typeof Paren;
export type TParen = TParenObject[keyof TParenObject];

export const isLeftParen = (str: unknown): str is TParenObject['Left'] => str === Paren.Left;
export const isRightParen = (str: unknown): str is TParenObject['Right'] => str === Paren.Right;
export const isParen = (str: unknown): str is TParen => isLeftParen(str) || isRightParen(str);
