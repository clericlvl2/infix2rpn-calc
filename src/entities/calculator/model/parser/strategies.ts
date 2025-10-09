import { InvalidOperationError } from '../errors';
import { ArityDeterminer } from '../operations/ArityDeterminer';
import { ArityType, IOperation } from '../operations/model';
import { createOperationKey } from '../operations/utils';
import { createToken, IOperationToken, IRawOperationToken, TokenType, TRawToken } from '../token';
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

    match(token: TRawToken): IRawOperationToken | null {
        return token.type === TokenType.RawOperation ? token : null;
    }

    create(
        token: IRawOperationToken,
        expression: TRawToken[],
        position: number,
    ): IOperationToken {
        const leftOperand = expression[position - 1]?.value;
        const rightOperand = expression[position + 1]?.value;

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
