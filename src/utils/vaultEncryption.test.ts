import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hashPin,
  verifyPin,
  obfuscateSecret,
  deobfuscateSecret,
  maskSecret,
  formatVaultPayloadSize,
} from './vaultEncryption.ts';

test('hashPin returns consistent deterministic hash', () => {
  const hash1 = hashPin('7272');
  const hash2 = hashPin('7272');
  assert.equal(hash1, hash2);
  assert.notEqual(hashPin('7272'), hashPin('0000'));
});

test('verifyPin checks valid and invalid PINs accurately', () => {
  const validHash = hashPin('1234');
  assert.equal(verifyPin('1234', validHash), true);
  assert.equal(verifyPin('4321', validHash), false);
  assert.equal(verifyPin('', validHash), false);
});

test('obfuscateSecret and deobfuscateSecret round-trips correctly', () => {
  const secret = 'sk-nduzavel-production-master-secret-key-9988';
  const pin = '7272';
  const cipher = obfuscateSecret(secret, pin);
  assert.notEqual(cipher, secret);
  const decrypted = deobfuscateSecret(cipher, pin);
  assert.equal(decrypted, secret);
});

test('deobfuscateSecret fails with incorrect PIN', () => {
  const secret = 'TylerNduSecretNotes2026';
  const pin = '7272';
  const cipher = obfuscateSecret(secret, pin);
  const wrongDecrypted = deobfuscateSecret(cipher, '9999');
  assert.notEqual(wrongDecrypted, secret);
});

test('maskSecret preserves boundaries while hiding payload', () => {
  const apiKey = 'sk-live-1234567890abcdef';
  const masked = maskSecret(apiKey);
  assert.equal(masked.startsWith('sk-l'), true);
  assert.equal(masked.endsWith('cdef'), true);
  assert.equal(masked.includes('••••••••'), true);
});

test('formatVaultPayloadSize formats byte outputs correctly', () => {
  assert.equal(formatVaultPayloadSize('hello'), '5 B');
  const largeText = 'a'.repeat(2048);
  assert.equal(formatVaultPayloadSize(largeText), '2.0 KB');
});
