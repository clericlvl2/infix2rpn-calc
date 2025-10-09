import { isExist, isStringDecimalNumber as isNumber } from '@shared/model/validation';
import { isLeftParen, isRightParen } from '../parentheses';
import { ArityType, IBinaryOperationArity, IUnaryOperationArity, SuffixType } from './model';

// todo breaks on varibles and functions
export class ArityDeterminer {
    static determineArity(
        leftOperand: string,
        rightOperand: string,
    ): IBinaryOperationArity | IUnaryOperationArity | null {
        const leftIsEmpty = !isExist(leftOperand);
        const leftIsNumber = isNumber(leftOperand);
        const leftIsOpening = isLeftParen(leftOperand);
        const leftIsClosing = isRightParen(leftOperand);

        const rightIsEmpty = !isExist(rightOperand);
        const rightIsNumber = isNumber(rightOperand);
        const rightIsLParen = isLeftParen(rightOperand);
        const rightIsRParen = isRightParen(rightOperand);

        //  Invalid Operation:
        //  "(" |  operation  |  _
        //   _  |  operation  | ")"
        //  "(" |  operation  | ")"
        const isInvalidOperation = (): boolean =>
            (leftIsOpening && rightIsEmpty)
            || (leftIsEmpty && rightIsRParen)
            || (leftIsOpening && rightIsRParen);

        //  Binary Operation:
        //  num |  operation  | num
        //  ")" |  operation  | num
        //  num |  operation  | "("
        //  ")" |  operation  | "("
        const isBinaryOperation = (): boolean =>
            (leftIsNumber && rightIsNumber)
            || (leftIsClosing && rightIsNumber)
            || (leftIsNumber && rightIsLParen)
            || (leftIsClosing && rightIsLParen);

        //  Unary-post Operation:
        //  num |  operation  |  _
        //  ")" |  operation  |  _
        const isUnaryPostfixOperation = (): boolean => leftIsNumber || leftIsClosing;

        //  Unary-pre Operation:
        //   _  |  operation  | num
        //   _  |  operation  | "("
        const isUnaryPrefixOperation = (): boolean => rightIsNumber || rightIsLParen;

        if (isInvalidOperation()) {
            return null;
        }

        if (isBinaryOperation()) {
            return { arity: ArityType.Binary };
        }

        if (isUnaryPostfixOperation()) {
            return { arity: ArityType.Unary, suffix: SuffixType.Post };
        }

        if (isUnaryPrefixOperation()) {
            return { arity: ArityType.Unary, suffix: SuffixType.Pre };
        }

        return null;
    }
}
