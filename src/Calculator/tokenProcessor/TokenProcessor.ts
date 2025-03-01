import { ErrorMessage, throwError } from '../../common/errors';
import { isStrictStringifiedNumber as isNumber } from '../../common/utils';
import type { TParentheses } from '../parentheses/constants';
import { isParenthesis } from '../parentheses/utils';
import { MathOperator } from '../operators/MathOperator';
import type { TEnrichedExpression, TNumberToken } from '../types';
import { ExpressionTokenType } from './enums';

const isNumberToken = (chunk: TNumberToken | unknown): chunk is TNumberToken => isNumber(chunk);
const isOperatorToken = (chunk: MathOperator | unknown): chunk is MathOperator => chunk instanceof MathOperator;
const isBracketToken = (chunk: TParentheses | unknown): chunk is TParentheses => isParenthesis(chunk);

const TOKEN_TYPE_CHECKERS_MAP = {
  [ExpressionTokenType.Number]: isNumberToken,
  [ExpressionTokenType.Operator]: isOperatorToken,
  [ExpressionTokenType.Bracket]: isBracketToken,
};

type IExpressionTokenProcessor = {
  [key in ExpressionTokenType]: (token: any) => void;
}

interface ITokenProcessor<ExpressionToken> {
  supportedTokensTypes: ExpressionTokenType[];
  tokenProcessor: Partial<IExpressionTokenProcessor>;
}

export class TokenProcessor<ExpressionToken> {
  private readonly tokenProcessor: ITokenProcessor<ExpressionToken>['tokenProcessor'];
  private readonly tokensTypes: ExpressionTokenType[];

  constructor({
    supportedTokensTypes,
    tokenProcessor,
  }: ITokenProcessor<ExpressionToken>) {
    this.tokensTypes = supportedTokensTypes;
    this.tokenProcessor = {
      ...tokenProcessor,
      [ExpressionTokenType.Unknown]: this.processUnknownChunk.bind(this),
    };

    this.getType = this.getType.bind(this)
    this.process = this.process.bind(this)
  }

  public process(token: TEnrichedExpression[number]): void {
    const tokenType = this.getType(token);
    const processor = this.tokenProcessor[tokenType];

    // @ts-ignore
    processor(token);
  }

  private getType(token: TEnrichedExpression[number]): ExpressionTokenType {
    // @ts-ignore
    const found = this.tokensTypes.find(type => TOKEN_TYPE_CHECKERS_MAP[type](token));

    return found ?? ExpressionTokenType.Unknown;
  }

  private processUnknownChunk(): void {
    throwError(ErrorMessage.Invalid);
  }
}
