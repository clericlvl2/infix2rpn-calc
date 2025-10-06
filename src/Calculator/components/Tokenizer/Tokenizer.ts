import {createToken, isOperator} from "@Calculator/components/Tokenizer/utils";
import {ErrorMessage} from "@lib/errors";
import {
    IAbstractToken,
  INumberToken,
  IParenthesisToken,
  IRawOperationToken,
  Token,
  TokenType
} from "@Calculator/components/Tokenizer/model";
import {isParenthesis} from "@lib/math/parentheses";
import {isStrictStringifiedNumber} from "@lib/validation";

function warn(x: number) {
  if (Number.isSafeInteger(x)) {
    return "Precision safe.";
  }
  return "Precision may be lost!";
}

console.log(warn(2 ** 53));
// Expected output: "Precision may be lost!"

console.log(warn(2 ** 53 - 1));
// Expected output: "Precision safe."

interface PatternMatcher {
  match(input: string, position: string): string | null
}

interface TokenFactory {
  create(lexeme: string): IAbstractToken
}

// class NumberTokenStrategy implements PatternMatcher, TokenFactory {
//   match(input: string, position: string): string | null {
//
//
//     if (isStrictStringifiedNumber(chunk)) {
//       let numberBuffer = chunk;
//
//       while (
//         i + 1 < input.length &&
//         isStrictStringifiedNumber(numberBuffer + input[i+1])) {
//         numberBuffer += input[++i];
//       }
//
//       yield createToken<INumberToken>({
//         value: parseFloat(numberBuffer),
//         type: TokenType.Number
//       })
//
//       continue;
//     }
//   }
//
//   create(lexeme: string, position: number): INumberToken {
//     return {
//         value: lexeme,
//         type: TokenType.Number,
//         position
//       }
//   }
//
// }




const determineTokenType = (chunk: string) => {
  if (isStrictStringifiedNumber(chunk)) {
    return TokenType.Number;
  }

  if (isParenthesis(chunk)) {
    return TokenType.Parenthesis;
  }

  if (isOperator(chunk)) {
    return TokenType.RawOperation;
  }

  return TokenType.Unknown
}

//
// function* tokenize(input: string): Generator<Token> {
//   for (let i = 0; i < input.length; i++) {
//     const chunk = input[i];
//
//     if (isStrictStringifiedNumber(chunk)) {
//       let numberBuffer = chunk;
//
//       while (
//         i + 1 < input.length &&
//         isStrictStringifiedNumber(numberBuffer + input[i+1])) {
//         numberBuffer += input[++i];
//       }
//
//       yield createToken<INumberToken>({
//         value: parseFloat(numberBuffer),
//         type: TokenType.Number
//       })
//
//       continue;
//     }
//
//     if (isParenthesis(chunk)) {
//       yield createToken<IParenthesisToken>({
//         value: chunk,
//         type: TokenType.Parenthesis
//       })
//
//       continue;
//     }
//
//     const abc = chunk;
//
//     if (isOperator(chunk)) {
//       let symbolBuffer = chunk;
//
//       while (i + 1 < input.length && isOperator(input[i+1])) {
//         symbolBuffer += input[++i];
//       }
//
//       yield createToken<IRawOperationToken>({
//         value: chunk,
//         type: TokenType.RawOperation
//       })
//
//       continue;
//     }
//
//     throw new Error(ErrorMessage.NotAllowedSymbols);
//   }
//
// }

export class Tokenizer {
  private * lexerGenerator(input: string): Generator<Token> {}

  public tokenize(input: string): Token[] {
    const tokenizedExpression: Token[] = [];



    return [];
  }
}
