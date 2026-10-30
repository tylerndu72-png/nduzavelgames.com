import { UserRole } from '../types.ts';

// Pure logic for community moderation and permissions
export function canModerate(role: UserRole): boolean {
  return role === 'owner' || role === 'moderator';
}

export function canAccessVault(role: UserRole): boolean {
  return role === 'owner';
}

export function toggleReaction(
  reactions: Record<string, string[]>,
  emoji: string,
  userId: string
): Record<string, string[]> {
  const currentList = reactions[emoji] || [];
  const hasReacted = currentList.includes(userId);
  const updatedList = hasReacted
    ? currentList.filter((id) => id !== userId)
    : [...currentList, userId];

  const next = { ...reactions };
  if (updatedList.length === 0) {
    delete next[emoji];
  } else {
    next[emoji] = updatedList;
  }
  return next;
}
