// modules
import bcrypt from 'bcryptjs';

/**
 * Hash a value with the specified number of hash rounds.
 * @param {number} hashRounds - The number of hash rounds.
 * @param {string} val - The value to hash.
 * @returns {Promise<string>} - A promise that resolves to the hashed value.
 */
export const hashVal = async (hashRounds: number, val: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
        bcrypt.genSalt(hashRounds, (err, salt) => {
            if (err) {
                reject(err);
            } else {
                bcrypt.hash(val, salt, (err, hash) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(hash);
                    }
                });
            }
        });
    });
};

/**
 * Compare a hashed value with a value to check if they match.
 * @param {string} hash - The hashed value to compare.
 * @param {string} compareVal - The value to compare.
 * @returns {Promise<boolean>} - A promise that resolves to `true` if the values match, otherwise `false`.
 */
export const compareHash = async (hash: string, compareVal: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        bcrypt.compare(compareVal, hash, (err, match) => {
            if (err) {
                reject(err);
            } else {
                resolve(match);
            }
        });
    });
};