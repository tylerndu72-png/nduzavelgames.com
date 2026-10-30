/**
 * Pure cryptographic and utility helper functions for NDÛZAVÉL Private Digital Vault.
 * Provides client-side secret obfuscation, PIN hashing verification, and text utilities.
 */

/**
 * Simple deterministic hash for PIN validation (owner security barrier).
 */
export function hashPin(pin: string, salt: string = 'NDUZAVEL_VAULT_2026'): string {
  let hash = 0;
  const combined = `${salt}:${pin.trim()}`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * Verify whether an entered PIN matches the stored hash.
 */
export function verifyPin(enteredPin: string, expectedHash: string): boolean {
  if (!enteredPin || !expectedHash) return false;
  return hashPin(enteredPin) === expectedHash;
}

/**
 * Reversible XOR obfuscation with dynamic key derivation based on PIN.
 * Allows owner to encrypt/decrypt private digital vault secrets locally.
 */
export function obfuscateSecret(plainText: string, pin: string): string {
  if (!plainText) return '';
  const key = `${pin}_NDUZAVEL_SECURE_TOKEN`;
  let result = '';
  for (let i = 0; i < plainText.length; i++) {
    const charCode = plainText.charCodeAt(i);
    const keyChar = key.charCodeAt(i % key.length);
    const encrypted = charCode ^ keyChar;
    result += encrypted.toString(16).padStart(2, '0');
  }
  return result;
}

/**
 * Decrypts a previously obfuscated hex payload using the PIN.
 */
export function deobfuscateSecret(hexCipher: string, pin: string): string {
  if (!hexCipher || hexCipher.length % 2 !== 0) return '';
  const key = `${pin}_NDUZAVEL_SECURE_TOKEN`;
  let result = '';
  let keyIndex = 0;
  for (let i = 0; i < hexCipher.length; i += 2) {
    const hex = hexCipher.substring(i, i + 2);
    const charCode = parseInt(hex, 16);
    const keyChar = key.charCodeAt(keyIndex % key.length);
    result += String.fromCharCode(charCode ^ keyChar);
    keyIndex++;
  }
  return result;
}

/**
 * Mask sensitive values (e.g., API keys, passwords) showing only first and last 4 characters.
 */
export function maskSecret(secret: string): string {
  if (!secret) return '';
  if (secret.length <= 8) return '••••••••';
  const start = secret.slice(0, 4);
  const end = secret.slice(-4);
  return `${start}••••••••${end}`;
}

/**
 * Formats character byte size into readable KB / bytes.
 */
export function formatVaultPayloadSize(content: string): string {
  const bytes = new TextEncoder().encode(content).length;
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
