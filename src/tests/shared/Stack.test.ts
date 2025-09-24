import { Stack } from '@shared/lib/Stack';
import { describe, expect, it } from 'vitest';

describe('Stack', () => {
    describe('Initialization', () => {
        it('should create an empty stack when no initial array is provided', () => {
            const stack = new Stack();
            expect(stack.size()).toBe(0);
        });

        it('should create a stack with initial items', () => {
            const initialItems = [1, 2, 3];
            const stack = new Stack(initialItems);
            expect(stack.size()).toBe(3);
        });
    });

    describe('Size Method', () => {
        it('should return correct size after operations', () => {
            const stack = new Stack<number>();
            expect(stack.size()).toBe(0);

            stack.push(1);
            expect(stack.size()).toBe(1);

            stack.push(2);
            expect(stack.size()).toBe(2);

            stack.pop();
            expect(stack.size()).toBe(1);
        });
    });

    describe('Push Method', () => {
        it('should add items to the stack', () => {
            const stack = new Stack<string>();
            stack.push('first');
            stack.push('second');

            expect(stack.size()).toBe(2);
        });

        it('should work with different types', () => {
            const stack = new Stack<number | string | boolean>();
            stack.push(1);
            stack.push('two');
            stack.push(true);

            expect(stack.size()).toBe(3);
        });
    });

    describe('Pop Method', () => {
        it('should remove and return the last item', () => {
            const stack = new Stack<number>();
            stack.push(1);
            stack.push(2);

            const popped = stack.pop();
            expect(popped).toBe(2);
            expect(stack.size()).toBe(1);
        });

        it('should return undefined for an empty stack', () => {
            const stack = new Stack<number>();
            const popped = stack.pop();
            expect(popped).toBeUndefined();
        });
    });

    describe('ReadTop Method', () => {
        it('should return the top item without removing it', () => {
            const stack = new Stack<number>();
            stack.push(1);
            stack.push(2);

            const top = stack.readTop();
            expect(top).toBe(2);
            expect(stack.size()).toBe(2);
        });

        it('should return undefined for an empty stack', () => {
            const stack = new Stack<number>();
            const top = stack.readTop();
            expect(top).toBeUndefined();
        });
    });

    describe('Clear Method', () => {
        it('should remove all items from the stack', () => {
            const stack = new Stack<number>();
            stack.push(1);
            stack.push(2);

            stack.clear();
            expect(stack.size()).toBe(0);
            expect(stack.readTop()).toBeUndefined();
        });
    });

    describe('PopTo Method', () => {
        it('should pop specified number of items to target array', () => {
            const stack = new Stack<number>([1, 2, 3, 4, 5]);
            const target: number[] = [];

            stack.popTo(target, 3);

            expect(target).toEqual([5, 4, 3]);
            expect(stack.size()).toBe(2);
        });

        it('should handle popping more items than stack size', () => {
            const stack = new Stack<number>([1, 2]);
            const target: number[] = [];

            stack.popTo(target, 5);

            expect(target).toEqual([2, 1]);
            expect(stack.size()).toBe(0);
        });

        it('should work with mixed type arrays', () => {
            const stack = new Stack<number | string>([1, 'two', 3]);
            const target: (number | string)[] = [];

            stack.popTo(target, 2);

            expect(target).toEqual([3, 'two']);
            expect(stack.size()).toBe(1);
        });
    });

    describe('PopTopTo Method', () => {
        it('should pop the top item to target array', () => {
            const stack = new Stack<number>([1, 2, 3]);
            const target: number[] = [];

            stack.popTopTo(target);

            expect(target).toEqual([3]);
            expect(stack.size()).toBe(2);
        });

        it('should handle empty stack', () => {
            const stack = new Stack<number>();
            const target: number[] = [];

            stack.popTopTo(target);

            expect(target).toEqual([]);
            expect(stack.size()).toBe(0);
        });
    });

    describe('PopAllTo Method', () => {
        it('should pop all items to target array', () => {
            const stack = new Stack<number>([1, 2, 3]);
            const target: number[] = [];

            stack.popAllTo(target);

            expect(target).toEqual([3, 2, 1]);
            expect(stack.size()).toBe(0);
        });

        it('should handle empty stack', () => {
            const stack = new Stack<number>();
            const target: number[] = [];

            stack.popAllTo(target);

            expect(target).toEqual([]);
            expect(stack.size()).toBe(0);
        });
    });

    describe('Edge Cases and Type Flexibility', () => {
        it('should support multiple push and pop operations', () => {
            const stack = new Stack<number>();

            stack.push(1);
            stack.push(2);
            expect(stack.pop()).toBe(2);
            stack.push(3);
            expect(stack.size()).toBe(2);
        });

        it('should work with complex objects', () => {
            interface TestObject {
                id: number;
                name: string;
            }

            const stack = new Stack<TestObject>();
            const obj1 = { id: 1, name: 'first' };
            const obj2 = { id: 2, name: 'second' };

            stack.push(obj1);
            stack.push(obj2);

            expect(stack.readTop()).toEqual(obj2);
            expect(stack.size()).toBe(2);
        });
    });

    describe('Interaction with isExist Validation', () => {
        it.skip('should only push non-null/undefined items when using popTo', () => {
            // const stack = new Stack<number | null | undefined>([1, null, 2, undefined, 3]);
            // const target: number[] = [];
            //
            // const originalIsExist = isExist;
            // (global as any).isExist = (item: any) => item !== null && item !== undefined;
            //
            // try {
            //   stack.popAllTo(target);
            //
            //   expect(target).toEqual([3, 2, 1]);
            //   expect(stack.size()).toBe(0);
            // } finally {
            //   (global as any).isExist = originalIsExist;
            // }
        });
    });
});
