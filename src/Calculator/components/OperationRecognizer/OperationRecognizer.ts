import {ErrorMessage} from '@lib/errors';
import {isClosingParenthesis, isOpeningParenthesis} from '@lib/math/parentheses';
import {Arity, IOperation} from '@lib/math/operation/model';
import {isExist, isStrictStringifiedNumber as isNumber} from '@lib/validation';
import {Token, TokenType} from "@Calculator/components/Tokenizer/model";
import {createOperationId} from "@lib/math/operation/createOperation";

export class OperationRecognizer {
  private operationsMap = new Map<string, IOperation>();

  constructor(private operationsList: IOperation[]) {
    this.initOperationsMap();
  }

  private initOperationsMap() {
    this.operationsList.forEach(supportedOperator => {
      const key = createOperationId(supportedOperator.symbol,supportedOperator.arity);

      this.operationsMap.set(key, supportedOperator);
    });
  }

  public recognize(tokenizedExpression: Token[]): Token[] {
    return this.recognizeOperations(tokenizedExpression);
  }

  private recognizeOperations(tokenizedExpression: Token[]): Token[] {
    const recognizedExpression: Token[] = [];

    tokenizedExpression.forEach((token, index, expression) => {
      if (token.type !== TokenType.Operation) {
        recognizedExpression.push(token);
        return;
      }

      const leftOperand = expression[index - 1]?.value;
      const rightOperand = expression[index + 1]?.value;

      const symbol = token.value;
      const arity = this.determineArity(leftOperand, rightOperand);
      const key = createOperationId(symbol, arity);

      if (!this.operationsMap.has(key)) {
        throw new Error(ErrorMessage.HasNotSupportedOperators);
      }

      const recognizedOperationToken = new Token(
        this.operationsMap.get(key),
        TokenType.Operation
      )

      recognizedExpression.push(recognizedOperationToken);
    });

    return recognizedExpression;
  }

  private determineArity(leftOperand: string, rightOperand: string): Arity {
    const leftIsEmpty = isExist(leftOperand);
    const rightIsEmpty = isExist(rightOperand);

    const leftIsNumber = isNumber(leftOperand);
    const rightIsNumber = isNumber(rightOperand);

    const leftIsOpening = isOpeningParenthesis(leftOperand);
    const rightIsOpening = isOpeningParenthesis(rightOperand);
    const leftIsClosing = isClosingParenthesis(leftOperand);
    const rightIsClosing = isClosingParenthesis(rightOperand);

    // Invalid:
    // "(" |  _
    //  _  | ")"
    // "(" | ")"
    const isInvalid = (): boolean =>
      (leftIsOpening && !rightIsEmpty) ||
      (!leftIsEmpty && rightIsClosing) ||
      (leftIsOpening && rightIsClosing);

    // Binary:
    // num | num
    // ")" | num
    // num | "("
    // ")" | "("
    const isBinary = (): boolean =>
      (leftIsNumber && rightIsNumber) ||
      (leftIsClosing && rightIsNumber) ||
      (leftIsNumber && rightIsOpening) ||
      (leftIsClosing && rightIsOpening);

    // Unary-post:
    // num | _
    // ")" | _
    const isUnaryPost = (): boolean => leftIsNumber || leftIsClosing;

    // Unary-pre:
    // _ | num
    // _ | "("
    const isUnaryPre = (): boolean => rightIsNumber || rightIsOpening;

    if (isInvalid()) {
      throw new Error(ErrorMessage.Invalid);
    }

    if (isBinary()) {
      return Arity.Binary;
    }

    if (isUnaryPost()) {
      return Arity.UnaryPost;
    }

    if (isUnaryPre()) {
      return Arity.UnaryPre;
    }

    return Arity.Unary;
  }
}
