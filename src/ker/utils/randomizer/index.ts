/**
 * Randomizer
 * -------------------------
 * This class provides utility functions to generate random strings and UUIDs (Universally Unique Identifiers).
 * The class offers two static methods: 'RandomString' and 'UUIDGenerator'.
 */

// modules
import { v4 as uuidv4 } from 'uuid';

export class Randomizer {
    /**
     * RandomString
     * -------------------------
     * Generates a random string of the specified length using the characters based on the selected mode.
     *
     * @param length The length of the random string to generate.
     * @param mode Optional. The mode that defines the set of characters to use for generating the random string.
     * Possible modes: 'mixed' (default), 'nums', 'caps', 'lows', 'syms', 'lets', 'capsNums', and 'lowsNums'.
     * If mode is not provided or an invalid mode is passed, 'mixed' mode is used by default.
     * @returns The generated random string.
     */
    public static RandomString(length: number,
        mode: string[]=['caps','nums','lows']) {
        let chars = {
            caps: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            lows: 'abcdefghijklmnopqrstuvwxyz',
            nums: '0123456789',
            syms: '!@#$%&*=?_/'
        }

        let characters = ''
        if (mode.includes('caps')) {
            characters += chars.caps
        }

        if (mode.includes('lows')) {
            characters += chars.lows
        }

        if (mode.includes('nums')) {
            characters += chars.nums
        }

        if (mode.includes('syms')) {
            characters += chars.syms
        }
        var result = '';

        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }

    /**
     * UUIDGenerator
     * -------------------------
     * Generates a Universally Unique Identifier (UUID) using the 'uuid' library (version 4).
     * The generated UUID follows the format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
     * where x is a hexadecimal digit (0-9, a-f) and y is either 8, 9, A, or B.
     *
     * @returns The generated UUID as a string.
     */
    public static UUIDGenerator(): string {
        return uuidv4()
    }

}