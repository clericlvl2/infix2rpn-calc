import { isExist } from '@shared/lib/validation';
import { TokenType, TRawToken } from '../token';
import { matchTokenByType } from '../utils';
import { ArityType, IBinaryOperationArity, IUnaryOperationArity, SuffixType } from './model';

export class ArityDeterminer {
    static determineArity(
        leftOperand: TRawToken,
        rightOperand: TRawToken,
    ): IBinaryOperationArity | IUnaryOperationArity | null {
        const isLeftEmpty = !isExist(leftOperand);
        const isLeftOperand = isExist(leftOperand) && matchTokenByType(leftOperand, TokenType.Number);
        const isLeftLParen = isExist(leftOperand) && matchTokenByType(leftOperand, TokenType.LParen);
        const isLeftRParen = isExist(leftOperand) && matchTokenByType(leftOperand, TokenType.RParen);

        const isRightEmpty = !isExist(rightOperand);
        const isRightOperand = isExist(rightOperand) && (
            matchTokenByType(rightOperand, TokenType.Number) || matchTokenByType(rightOperand, TokenType.RawCommand)
        );
        const isRightLParen = isExist(rightOperand) && matchTokenByType(rightOperand, TokenType.LParen);
        const isRightRParen = isExist(rightOperand) && matchTokenByType(rightOperand, TokenType.RParen);

        //  Invalid Operation:
        //  "(" |  operation  |  _
        //   _  |  operation  | ")"
        //  "(" |  operation  | ")"
        const isInvalidOperation = (): boolean =>
            (isLeftLParen && isRightEmpty)
            || (isLeftEmpty && isRightRParen)
            || (isLeftLParen && isRightRParen);

        //  Binary Operation:
        //  num |  operation  | num
        //  ")" |  operation  | num
        //  num |  operation  | "("
        //  ")" |  operation  | "("
        const isBinaryOperation = (): boolean =>
            (isLeftOperand && isRightOperand)
            || (isLeftRParen && isRightOperand)
            || (isLeftOperand && isRightLParen)
            || (isLeftRParen && isRightLParen);

        //  Unary-post Operation:
        //  num |  operation  |  _
        //  ")" |  operation  |  _
        const isUnaryPostfixOperation = (): boolean => isLeftOperand || isLeftRParen;

        //  Unary-pre Operation:
        //   _  |  operation  | num
        //   _  |  operation  | "("
        const isUnaryPrefixOperation = (): boolean => isRightOperand || isRightLParen;

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
