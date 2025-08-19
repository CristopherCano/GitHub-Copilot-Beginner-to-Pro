import { test, expect } from '@playwright/test';

// filepath: src/js/main.test.js
// Unit tests for usernameRegex validation


// The regex from main.js
const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

test.describe('usernameRegex validation', () => {
    test('valid username: meets all requirements', () => {
        expect(usernameRegex.test('Password1!')).toBe(true);
        expect(usernameRegex.test('A1@bcdefg')).toBe(true);
        expect(usernameRegex.test('Zz9$zzzz')).toBe(true);
    });

    test('invalid: less than 8 characters', () => {
        expect(usernameRegex.test('A1@bcde')).toBe(false);
        expect(usernameRegex.test('A1@bcd')).toBe(false);
    });

    test('invalid: missing uppercase letter', () => {
        expect(usernameRegex.test('password1!')).toBe(false);
        expect(usernameRegex.test('abcde1@f')).toBe(false);
    });
    
    test('invalid: missing number', () => {
        expect(usernameRegex.test('Password!')).toBe(false);
        expect(usernameRegex.test('Abcdefg@')).toBe(false);
    });

    test('invalid: missing special character', () => {
        expect(usernameRegex.test('Password1')).toBe(false);
        expect(usernameRegex.test('A1bcdefg')).toBe(false);
    });

    test('invalid: contains invalid characters', () => {
        expect(usernameRegex.test('Password1! ')).toBe(false); // space
        expect(usernameRegex.test('Password1!#')).toBe(false); // # not in allowed set
    });

    // Using getByRole('textbox', { name: 'Enter your username' }) test the username input field
    test('username input field validation', async ({ page }) => {
        await page.goto('http://127.0.0.1:5500/src/index.html'); // Adjust URL as needed
        const usernameInput = page.getByRole('textbox', { name: 'Enter your username' });

        await usernameInput.fill('ValidUser1@');
        await expect(usernameInput).toHaveValue('ValidUser1@');

        await usernameInput.fill('invaliduser');
        await expect(usernameInput).toHaveValue('invaliduser');
        await expect.poll(async () => await usernameInput.getAttribute('aria-invalid')).toBe('true');

        await usernameInput.fill('A1@bcde');
        await expect(usernameInput).toHaveValue('A1@bcde');
        await expect.poll(async () => await usernameInput.getAttribute('aria-invalid')).toBe('true');
    });

    // Additional tests for edge cases
    test('edge case: exactly 8 characters', () => {
        expect(usernameRegex.test('A1@bcdef')).toBe(true);
        expect(usernameRegex.test('Z9$zzzzz')).toBe(true);
    });

    test('edge case: special character at start', () => {
        expect(usernameRegex.test('@A1bcdef')).toBe(false);
        expect(usernameRegex.test('$Z9zzzzz')).toBe(false);
    });

    test('edge case: special character at end', () => {
        expect(usernameRegex.test('A1bcdef@')).toBe(true);
        expect(usernameRegex.test('Z9zzzzz$')).toBe(true);
    });

    test('edge case: mixed case letters', () => {
        expect(usernameRegex.test('a1@Bcdef')).toBe(false);
        expect(usernameRegex.test('A1@bCdeF')).toBe(true);
    });
});