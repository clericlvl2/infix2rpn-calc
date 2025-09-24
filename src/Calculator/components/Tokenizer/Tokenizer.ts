import {TokenBuffer} from './TokenBuffer';
import {createToken, determineTokenType, isOperator} from "@Calculator/components/Tokenizer/utils";
import {ErrorMessage} from "@lib/errors";
import {
  IExpressionToken,
  INumberToken,
  IRawOperationToken,
  TExpressionTokenType,
  Token,
  TokenType
} from "@Calculator/components/Tokenizer/model";
import {isParenthesis, TParentheses} from "@lib/math/parentheses";
import {isStrictStringifiedNumber} from "@lib/validation";

export class Tokenizer {
  private tokenBuffer = new TokenBuffer();
  private tokenBufferType: TExpressionTokenType | null = null;

  public tokenize(input: string): Token[] {
    const tokenizedExpression: Token[] = [];

    for (let i = 0; i < input.length; i++) {
      const chunk = input[i];
      const chunkType = determineTokenType(chunk);

      const hasNextChunk = i + 1 < input.length;
      const isEmptyChunk = !chunk.trim().length;
      const isParenthesisChunkType = chunkType === TokenType.Parenthesis;
      const isChunkTypeDiffersFromBuffer = this.isBufferExist() && this.tokenBufferType !== chunkType

      if (isEmptyChunk) {
        continue;
      }

      if (!this.isValidChunkType(chunkType)) {
        throw new Error(ErrorMessage.NotAllowedSymbols);
      }

      if (isChunkTypeDiffersFromBuffer) {
        const token = this.collectTokenAndClearBuffer();

        tokenizedExpression.push(token);
      }

      this.tokenBuffer.add(chunk);
      this.tokenBufferType = chunkType;

      if (isParenthesisChunkType || !hasNextChunk) {
        const token = this.collectTokenAndClearBuffer();

        tokenizedExpression.push(token);
      }
    }

    return tokenizedExpression;
  }

  private isValidChunkType(chunkType: TokenType | null ): chunkType is TExpressionTokenType {
    return chunkType !== null && chunkType !== TokenType.Unknown;
  }

  private collectTokenAndClearBuffer(): Readonly<IExpressionToken> {
    if (!this.isValidChunkType(this.tokenBufferType)) {
      throw new Error(ErrorMessage.NotAllowedSymbols);
    }

    const token = createToken<IExpressionToken>({
      value: this.tokenBuffer.collect(),
      type: this.tokenBufferType
    });

    this.tokenBuffer.clear();
    this.tokenBufferType = null;

    return token;
  }

  private isBufferExist() {
    return this.tokenBuffer.size() && this.tokenBufferType !== null;
  }
}
