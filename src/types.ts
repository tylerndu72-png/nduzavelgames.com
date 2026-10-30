export type UserRole = 'owner' | 'moderator' | 'member' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title?: string;
  bio?: string;
  verified: boolean;
  joinedAt: string;
}

export type ProjectCategory = 'Apps' | 'AI Tools' | 'Gaming' | 'Websites';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  description: string;
  longDescription: string;
  coverImage: string;
  tags: string[];
  status: 'Live' | 'Beta' | 'Concept';
  demoUrl?: string;
  githubUrl?: string;
  metrics?: {
    users?: string;
    rating?: string;
    performance?: string;
  };
  featured: boolean;
  date: string;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  senderAvatar: string;
  content: string;
  timestamp: string;
  reactions: Record<string, string[]>; // emoji -> array of userIds
  isPinned?: boolean;
  replyToId?: string;
}

export interface ChatChannel {
  id: string;
  name: string;
  description: string;
  iconName: string;
  isPrivate?: boolean;
}

export type VaultCategory =
  | 'Project Ideas'
  | 'API Credentials'
  | 'Financial & Legal'
  | 'Architecture'
  | 'Personal Notes';

export interface VaultItem {
  id: string;
  title: string;
  category: VaultCategory;
  content: string;
  secretValue?: string;
  tags: string[];
  updatedAt: string;
  accessLevel: 'owner_only' | 'confidential';
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  category: 'Collaboration' | 'Project Inquiry' | 'Game Development' | 'Consulting' | 'General';
  message: string;
  timestamp: string;
  status: 'unread' | 'read' | 'replied';
}

export interface SkillItem {
  name: string;
  level: number;
  category: 'AI & Systems' | 'App Engineering' | 'Game Development' | 'Cloud Architecture';
}

export interface AchievementItem {
  year: string;
  title: string;
  description: string;
  impact: string;
}

export interface OwnerProfile {
  name: string;
  title: string;
  email: string;
  location: string;
  customDomain?: string;
  bio: string;
  vision: string;
  photoUrl: string;
  skills: SkillItem[];
  achievements: AchievementItem[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
}

export interface SiteAnnouncement {
  id: string;
  title: string;
  summary: string;
  date: string;
  category: string;
  readTime: string;
}

export interface MemberNote {
  id: string;
  userId: string;
  title: string;
  content: string;
  updatedAt: string;
}
