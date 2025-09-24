import { isExist } from '@shared/model/validation';

export class Stack<Item> {
    private stack: Item[];

    constructor(stack: Item[] = []) {
        this.stack = stack;
    }

    size(): number {
        return this.stack.length;
    }

    push(item: Item): void {
        this.stack.push(item);
    }

    pop(): Item | undefined {
        return this.stack.pop();
    }

    readTop(): Item | undefined {
        const length = this.stack.length;

        return length ? this.stack[length - 1] : undefined;
    }

    clear() {
        this.stack = [];
    }

    popTo(target: unknown[], count: number): void {
        const potentialStackSize = this.size() - count;
        const newStackSize = potentialStackSize < 0 ? 0 : potentialStackSize;

        while (this.size() > newStackSize) {
            const item = this.pop();

            if (isExist(item)) {
                target.push(item);
            }
        }
    }

    popTopTo(target: unknown[]): void {
        return this.popTo(target, 1);
    }

    popAllTo(target: unknown[]): void {
        return this.popTo(target, this.size());
    }
}
