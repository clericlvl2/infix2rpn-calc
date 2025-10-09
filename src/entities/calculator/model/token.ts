import { IOperation } from './operations/model';

export const EOF_VALUE = '' as const;

export enum TokenType {
    Number = 'number',
    Operation = 'operation',
    RawOperation = 'rawOperation',
    RParen = 'rightParen',
    LParen = 'leftParen',
    Variable = 'variable',
    Function = 'function',
    Whitespace = 'whitespace',
    EOF = 'endOfFile',
}

export interface IAbstractToken {
    value: unknown;
    position: number;
    type: TokenType;
    skippable?: boolean;
}

export interface INumberToken extends IAbstractToken {
    value: string;
    type: TokenType.Number;
}

export interface IRawOperationToken extends IAbstractToken {
    value: string;
    type: TokenType.RawOperation;
}

export interface IWhitespaceToken extends IAbstractToken {
    value: string;
    type: TokenType.Whitespace;
    skippable: true;
}

export interface IOperationToken extends IAbstractToken {
    value: IOperation;
    type: TokenType.Operation;
}

export interface ILParenToken extends IAbstractToken {
    value: '(';
    type: TokenType.LParen;
}

export interface IRParenToken extends IAbstractToken {
    value: ')';
    type: TokenType.RParen;
}

export interface IEOFToken extends IAbstractToken {
    value: '';
    type: TokenType.EOF;
}

export type TRawToken
    = | IRawOperationToken
        | INumberToken
        | ILParenToken
        | IRParenToken;

export type TLexerToken
    = | IRawOperationToken
        | INumberToken
        | IWhitespaceToken
        | IEOFToken
        | ILParenToken
        | IRParenToken;

export type TParsedToken
    = | IOperationToken
        | INumberToken
        | ILParenToken
        | IRParenToken;

export type TRPNToken
    = | IOperationToken
        | INumberToken;

export const createToken = <T extends IAbstractToken>(value: T): Readonly<T> => Object.freeze<T>({ ...value });
