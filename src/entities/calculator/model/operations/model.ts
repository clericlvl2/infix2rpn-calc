export enum ArityType {
    Unary = 1,
    Binary = 2,
    Ternary = 3,
}

export enum SuffixType {
    Pre = 'prefix',
    Post = 'postfix',
}

export enum AssociativityType {
    Left = 'left',
    Right = 'right',
}

export interface IBaseOperation {
    symbol: string;
    precedence: number;
    action: (...args: number[]) => number;
    associativity: AssociativityType;
}

export type IBinaryOperationArity = {
    arity: 2;
};

export type IUnaryOperationArity = {
    arity: 1;
    suffix: SuffixType.Pre | SuffixType.Post;
};

export type IOperation = IBaseOperation & (IBinaryOperationArity | IUnaryOperationArity);
