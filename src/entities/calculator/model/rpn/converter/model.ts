import { Stack } from '@shared/lib/Stack';
import { IAbstractToken } from '../../token/token';

export interface IInfixRPNConverterStrategy {
    match(token: IAbstractToken): boolean;

    process(
        token: IAbstractToken,
        stack: Stack<IAbstractToken>,
        notation: IAbstractToken[]
    ): void;
}
