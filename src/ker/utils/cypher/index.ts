const CryptoJS = require('crypto-js');

/**
 * Encrypt a string using the provided key.
 * @param {string} s - The string to encrypt.
 * @param {string} key - The encryption key.
 * @returns {string} - The encrypted string.
 */
export function encrypt(s: string, key: string) {
  const cipherText = CryptoJS.AES.encrypt(s, key); // Corregir setInterval por s
  return cipherText.toString();
}

/**
 * Decrypt an encrypted string using the provided key.
 * @param {string} s - The encrypted string to decrypt.
 * @param {string} key - The decryption key.
 * @returns {string} - The decrypted original string.
 */
export function decrypt(s: string, key: string) {
  const bytes = CryptoJS.AES.decrypt(s, key);
  const originalText = bytes.toString(CryptoJS.enc.Utf8);
  return originalText;
}