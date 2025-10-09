import { describe, expect, it } from 'vitest';
import { filterWhitespaces } from './validation';

describe('strings utils', () => {
    describe('filterWhitespaces', () => {
        it('removes all whitespaces from a string', () => {
            const input = '  hello world  ';
            const expected = 'helloworld';
            expect(filterWhitespaces(input)).toBe(expected);
        });

        it('removes all types of whitespaces', () => {
            const input = 'hello\t\n\r world';
            const expected = 'helloworld';
            expect(filterWhitespaces(input)).toBe(expected);
        });

        it('returns empty string when input contains only whitespaces', () => {
            const input = ' \t\n\r ';
            const expected = '';
            expect(filterWhitespaces(input)).toBe(expected);
        });

        it('returns the same string when there are no whitespaces', () => {
            const input = 'hello';
            expect(filterWhitespaces(input)).toBe(input);
        });

        it('handles empty string', () => {
            expect(filterWhitespaces('')).toBe('');
        });
    });
});
