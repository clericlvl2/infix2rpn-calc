import { ErrorMessage, throwError } from '../../../shared/errors';
import type { TEnrichedExpression } from '../../types';
import { ExpressionTokenType } from './enums';
import { isNumberToken, isOperatorToken, isParenthesisToken } from './utils';

const TOKEN_TYPE_CHECKERS_MAP = {
  [ExpressionTokenType.Number]: isNumberToken,
  [ExpressionTokenType.Operator]: isOperatorToken,
  [ExpressionTokenType.Parenthesis]: isParenthesisToken,
};

type IExpressionTokenProcessor = {
  [key in ExpressionTokenType]: (token: any) => void;
}

interface ITokenProcessor {
  supportedTokensTypes: ExpressionTokenType[];
  tokenProcessor: Partial<IExpressionTokenProcessor>;
}

export class TokenProcessor {
  private readonly tokenProcessor: ITokenProcessor['tokenProcessor'];
  private readonly tokensTypes: ExpressionTokenType[];

  constructor({
    supportedTokensTypes,
    tokenProcessor,
  }: ITokenProcessor) {
    this.tokensTypes = supportedTokensTypes;
    this.tokenProcessor = {
      ...tokenProcessor,
      [ExpressionTokenType.Unknown]: this.processUnknownChunk.bind(this),
    };

    this.getType = this.getType.bind(this);
    this.process = this.process.bind(this);
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
