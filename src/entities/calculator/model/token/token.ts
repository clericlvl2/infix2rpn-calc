import { ICommand } from './commands';
import { IOperation } from './operations/model';

export const EOF_VALUE = '' as const;

export enum TokenType {
    Number = 'number',
    Operation = 'operation',
    RawOperation = 'rawOperation',
    RParen = 'rightParen',
    LParen = 'leftParen',
    Variable = 'variable',
    Command = 'command',
    RawCommand = 'rawCommand',
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

export interface IRawCommandToken extends IAbstractToken {
    value: string;
    type: TokenType.RawCommand;
}

export interface ICommandToken extends IAbstractToken {
    value: ICommand;
    type: TokenType.Command;
}

export interface IRawOperationToken extends IAbstractToken {
    value: string;
    type: TokenType.RawOperation;
}

export interface IOperationToken extends IAbstractToken {
    value: IOperation;
    type: TokenType.Operation;
}

export interface IWhitespaceToken extends IAbstractToken {
    value: string;
    type: TokenType.Whitespace;
    skippable: true;
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

export type TokenTypeMap = {
    [TokenType.Number]: INumberToken;
    [TokenType.Operation]: IOperationToken;
    [TokenType.RawOperation]: IRawOperationToken;
    [TokenType.Command]: ICommandToken;
    [TokenType.RawCommand]: IRawCommandToken;
    [TokenType.RParen]: IRParenToken;
    [TokenType.LParen]: ILParenToken;
    [TokenType.Variable]: IAbstractToken;
    [TokenType.Whitespace]: IWhitespaceToken;
    [TokenType.EOF]: IEOFToken;
};

export type TLexerToken
    = | IRawOperationToken
        | IRawCommandToken
        | INumberToken
        | IWhitespaceToken
        | IEOFToken
        | ILParenToken
        | IRParenToken;

export type TRawToken
    = | IRawOperationToken
        | IRawCommandToken
        | INumberToken
        | ILParenToken
        | IRParenToken;

export type TParsedToken
    = | IOperationToken
        | ICommandToken
        | INumberToken
        | ILParenToken
        | IRParenToken;

export type TRPNToken
    = | IOperationToken
        | ICommandToken
        | INumberToken;

export type TStackToken = IOperationToken | ICommandToken | ILParenToken;
