export enum ArityType {
    Unary = 1,
    Binary = 2,
}

export enum SuffixType {
    Pre = 'prefix',
    Post = 'postfix',
}

export enum AssociativityType {
    Left = 'left',
    Right = 'right',
}

export interface IAction {
    action: (...args: number[]) => number;
}

export interface IArity {
    arity: number;
    suffix?: SuffixType;
}

export interface IBaseOperation extends IAction {
    symbol: string;
    precedence: number;
    associativity: AssociativityType;
}

export interface IBinaryOperationArity extends IArity {
    arity: 2;
}

export interface IUnaryOperationArity extends IArity {
    arity: 1;
    suffix: SuffixType.Pre | SuffixType.Post;
}

export type IOperation = IBaseOperation & (IBinaryOperationArity | IUnaryOperationArity);
