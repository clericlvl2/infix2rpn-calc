import { InvalidCommandError, InvalidOperationError } from '../errors';
import { ArityDeterminer } from '../token/operations/ArityDeterminer';
import { ICommand } from '../token/commands';
import { ArityType, IOperation } from '../token/operations/model';
import { createOperationKey } from '../token/operations/operations';
import {
    ICommandToken,
    IOperationToken,
    IRawCommandToken,
    IRawOperationToken,
    TokenType,
    TRawToken,
} from '../token/token';
import { createToken, matchTokenByType } from '../token/utils';
import { IParserStrategy } from './model';

export class RawOperationParserStrategy implements IParserStrategy {
    private operationsMap = new Map<string, IOperation>();

    constructor(private operationsList: IOperation[]) {
        this.initOperationsMap();
    }

    private initOperationsMap() {
        this.operationsList.forEach((op) => {
            const suffix = op.arity === ArityType.Unary ? op?.suffix : undefined;

            this.operationsMap.set(
                createOperationKey(
                    op.symbol,
                    op.arity,
                    suffix,
                ),
                op,
            );
        });
    }

    match(token: TRawToken): token is IRawOperationToken {
        return matchTokenByType(token, TokenType.RawOperation);
    }

    create(
        token: IRawOperationToken,
        expression: TRawToken[],
        position: number,
    ): IOperationToken {
        const leftOperand = expression[position - 1];
        const rightOperand = expression[position + 1];

        const symbol = token.value;
        const arityObj = ArityDeterminer.determineArity(leftOperand, rightOperand);

        if (!arityObj) {
            throw new InvalidOperationError(symbol, position);
        }

        const arity = arityObj.arity;
        const suffix = arity === ArityType.Unary ? arityObj.suffix : undefined;
        const key = createOperationKey(symbol, arity, suffix);
        const operation = this.operationsMap.get(key);

        if (!operation) {
            throw new InvalidOperationError(symbol, position);
        }

        return createToken<IOperationToken>({
            value: operation,
            type: TokenType.Operation,
            position: token.position,
        });
    }
}

export class RawCommandParserStrategy implements IParserStrategy {
    private commandsMap = new Map<string, ICommand>();

    constructor(private commandsList: ICommand[]) {
        this.initCommandsMap();
    }

    private initCommandsMap() {
        this.commandsList.forEach(cmd => this.commandsMap.set(cmd.symbol, cmd));
    }

    match(token: TRawToken): token is IRawCommandToken {
        return matchTokenByType(token, TokenType.RawCommand);
    }

    create(
        token: IRawCommandToken,
        _: TRawToken[],
        position: number,
    ): ICommandToken {
        const commandName = token.value;
        const command = this.commandsMap.get(commandName);

        if (!command) {
            throw new InvalidCommandError(commandName, position);
        }

        return createToken<ICommandToken>({
            value: command,
            type: TokenType.Command,
            position: token.position,
        });
    }
}
