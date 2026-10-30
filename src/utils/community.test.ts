import test from 'node:test';
import assert from 'node:assert/strict';
import { canModerate, canAccessVault, toggleReaction } from './community.ts';

test('canModerate permits owner and moderator only', () => {
  assert.equal(canModerate('owner'), true);
  assert.equal(canModerate('moderator'), true);
  assert.equal(canModerate('member'), false);
  assert.equal(canModerate('guest'), false);
});

test('canAccessVault permits owner only', () => {
  assert.equal(canAccessVault('owner'), true);
  assert.equal(canAccessVault('moderator'), false);
  assert.equal(canAccessVault('member'), false);
});

test('toggleReaction toggles user emoji reaction correctly', () => {
  const initial = {};
  const step1 = toggleReaction(initial, '🔥', 'user-123');
  assert.deepEqual(step1['🔥'], ['user-123']);

  const step2 = toggleReaction(step1, '🔥', 'user-456');
  assert.deepEqual(step2['🔥'], ['user-123', 'user-456']);

  const step3 = toggleReaction(step2, '🔥', 'user-123');
  assert.deepEqual(step3['🔥'], ['user-456']);

  const step4 = toggleReaction(step3, '🔥', 'user-456');
  assert.equal(step4['🔥'], undefined);
});
