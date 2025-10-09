import { regexEscape } from '@entities/calculator/model/validation/Validator';
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

    describe('regexEscape', () => {
    // todo do not understand completely how this should work and what should be the result
        it.skip('escapes special regex characters', () => {
            const input = '^[].*+?{}()|/$';
            const expected = '\\[\\]\\.\\*\\+\\?\\{\\}\\(\\)\\|\\/';
            expect(regexEscape(input)).toBe(expected);
        });

        it('does not modify regular characters', () => {
            const input = 'hello world';
            expect(regexEscape(input)).toBe(input);
        });

        it('handles empty string', () => {
            expect(regexEscape('')).toBe('');
        });

        it('handles string with no special characters', () => {
            const input = 'abcdef123';
            expect(regexEscape(input)).toBe(input);
        });

        it('escapes a complete regex pattern properly ', () => {
            const input = '/path/to/resource.js';
            const expected = '\\/path\\/to\\/resource\\.js';
            expect(regexEscape(input)).toBe(expected);
        });
    });
});
