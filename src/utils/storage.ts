import {
  User,
  Project,
  ChatMessage,
  ChatChannel,
  VaultItem,
  ContactSubmission,
  OwnerProfile,
  SiteAnnouncement,
  MemberNote,
} from '../types.ts';
import { hashPin } from './vaultEncryption.ts';

// Initial Owner Profile for Mr. Tyler Ndu
export const INITIAL_OWNER_PROFILE: OwnerProfile = {
  name: 'Mr. Tyler Ndu',
  title: 'Founder, Software Architect & Game Designer',
  email: 'tylerndu72@gmail.com',
  location: 'Global / Remote Operations',
  customDomain: 'nduzaveltech.com',
  bio: 'Tyler Ndu is the creator and sovereign owner of NDÛZAVÉL. A multi-disciplinary software engineer, artificial intelligence architect, and game developer focused on next-generation decentralized ecosystems, intelligent autonomous agents, and immersive real-time gaming engines.',
  vision: 'To build high-performance, aesthetically uncompromising technology platforms that empower independent creators, developers, and gamers with sovereign computing, private digital vaults, and world-class AI tooling.',
  photoUrl: '/src/assets/images/hero_tyler_ndu_1793347989778.jpg',
  skills: [
    { name: 'AI Systems & Neural Agents', level: 96, category: 'AI & Systems' },
    { name: 'Full-Stack React & Node Architecture', level: 98, category: 'App Engineering' },
    { name: 'Real-Time Game Engines & WebGL', level: 92, category: 'Game Development' },
    { name: 'Cloud Infrastructure & Microservices', level: 94, category: 'Cloud Architecture' },
    { name: 'Cybersecurity & Sovereign Data Vaults', level: 95, category: 'Cloud Architecture' },
    { name: 'Interactive UI/UX & Shader Craft', level: 93, category: 'App Engineering' },
  ],
  achievements: [
    {
      year: '2026',
      title: 'NDÛZAVÉL Ecosystem Launch',
      description: 'Unified ecosystem integrating Apps, AI Studio, WebGL Gaming, and Private Vault in one architecture.',
      impact: '100% self-hosted capability, complete owner governance, zero vendor lock-in.',
    },
    {
      year: '2025',
      title: 'Neural Core v4 Distributed Engine',
      description: 'Designed an ultra-low latency inference gateway for real-time prompt generation and context chaining.',
      impact: 'Sub-40ms agent response times across multi-region deployment.',
    },
    {
      year: '2024',
      title: 'HexaRun Cyber Engine Prototype',
      description: 'Engineered a 60fps lightweight canvas vector runner with zero external graphics engine overhead.',
      impact: 'Playable across all mobile and desktop browsers with 120Hz refresh support.',
    },
    {
      year: '2023',
      title: 'Decentralized Vault Specification',
      description: 'Pioneered browser-side encrypted storage architecture for confidential IP and project blue-prints.',
      impact: 'Zero plaintext transmission to cloud databases.',
    },
  ],
  socialLinks: [
    { platform: 'Email', url: 'mailto:tylerndu72@gmail.com' },
    { platform: 'GitHub', url: 'https://github.com' },
    { platform: 'X / Twitter', url: 'https://x.com' },
    { platform: 'LinkedIn', url: 'https://linkedin.com' },
  ],
};

// Initial Seed Projects
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-neural-core',
    title: 'Ndûzavél Neural Core AI',
    category: 'AI Tools',
    description: 'Autonomous multi-modal reasoning and agent framework tailored for code generation, system architecture, and creative scripting.',
    longDescription: 'Ndûzavél Neural Core is an intelligent inference layer created by Tyler Ndu. It features dynamic token throttling, context window persistence, and specialized agent personas for software engineering, game lore design, and algorithmic trading.',
    coverImage: '/src/assets/images/showcase_ai_neural_1793347990677.jpg',
    tags: ['Artificial Intelligence', 'TypeScript', 'Neural Agents', 'LLM Gateway'],
    status: 'Live',
    demoUrl: '#studio-assistant',
    githubUrl: 'https://github.com/tylerndu/neural-core',
    metrics: {
      users: '4.8k Active',
      rating: '4.95 / 5',
      performance: '32ms Latency',
    },
    featured: true,
    date: '2026-03-12',
  },
  {
    id: 'proj-hexarun-game',
    title: 'HexaRun: Cyber Vector',
    category: 'Gaming',
    description: 'High-octane cyberpunk vector runner with dynamic particle physics, audio-reactive tracks, and responsive touch controls.',
    longDescription: 'Engineered for instant load and fluid 60fps performance on both Android phones and high-refresh desktop monitors. Built with a custom procedural collision engine and sound synthesis.',
    coverImage: '/src/assets/images/showcase_game_cyber_1793347992829.jpg',
    tags: ['HTML5 Canvas', 'Game Dev', 'Cyberpunk', 'Procedural'],
    status: 'Live',
    demoUrl: '#game-runner',
    githubUrl: 'https://github.com/tylerndu/hexarun-cyber',
    metrics: {
      users: '18.2k Plays',
      rating: '4.9 / 5',
      performance: '60 FPS Smooth',
    },
    featured: true,
    date: '2026-02-28',
  },
  {
    id: 'proj-nexus-suite',
    title: 'Nexus Enterprise Mobile & Web Hub',
    category: 'Apps',
    description: 'Cross-platform suite offering real-time asset telemetry, secure wallet management, and modular micro-frontend dashboards.',
    longDescription: 'A production-grade multi-platform application supporting offline caching, encrypted biometrics, real-time WebSocket state synchronization, and reactive UI.',
    coverImage: '/src/assets/images/showcase_apps_mobile_1793347991945.jpg',
    tags: ['React Native', 'TypeScript', 'Tailwind CSS', 'PWA'],
    status: 'Live',
    demoUrl: '#studio',
    githubUrl: 'https://github.com/tylerndu/nexus-hub',
    metrics: {
      users: '9.4k Installs',
      rating: '4.88 / 5',
      performance: '99.98% Uptime',
    },
    featured: true,
    date: '2026-01-15',
  },
  {
    id: 'proj-vault-sovereign',
    title: 'Aegis Private Digital Vault',
    category: 'Apps',
    description: 'Encrypted personal data fortress with zero-knowledge master PIN validation and offline document synchronization.',
    longDescription: 'Created to ensure absolute data sovereignty. Protects research ideas, software licenses, confidential patents, and API tokens with local obfuscation and offline exports.',
    coverImage: '/src/assets/images/hero_tyler_ndu_1793347989778.jpg',
    tags: ['Security', 'Zero-Knowledge', 'Data Sovereignty', 'Cryptography'],
    status: 'Live',
    demoUrl: '#vault',
    githubUrl: 'https://github.com/tylerndu/aegis-vault',
    metrics: {
      users: 'Owner Exclusive',
      rating: '5.0 / 5',
      performance: 'Instant Local Load',
    },
    featured: true,
    date: '2026-03-01',
  },
  {
    id: 'proj-dev-platform',
    title: 'Ndûzavél Studio Cloud Portal',
    category: 'Websites',
    description: 'Next-generation web portal featuring live code sandbox, API inspector, and tutorial documentation repository.',
    longDescription: 'A modern developer experience portal engineered with edge rendering, instantaneous search, and integrated community discussion channels.',
    coverImage: '/src/assets/images/showcase_ai_neural_1793347990677.jpg',
    tags: ['NextGen Web', 'Developer Tools', 'Edge API', 'Tailwind'],
    status: 'Beta',
    demoUrl: '#studio',
    githubUrl: 'https://github.com/tylerndu/nduzavel-portal',
    metrics: {
      users: '1.2k Devs',
      rating: '4.9 / 5',
      performance: 'Edge Cached',
    },
    featured: false,
    date: '2026-03-20',
  },
];

// Initial Default Channels
export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'general-tech',
    name: 'general-tech',
    description: 'Main discussion on software engineering, AI breakthroughs & tech innovation',
    iconName: 'Terminal',
  },
  {
    id: 'gaming-zone',
    name: 'gaming-zone',
    description: 'Game design, HexaRun high scores, indie mechanics & graphics engines',
    iconName: 'Gamepad2',
  },
  {
    id: 'ai-lab',
    name: 'ai-lab',
    description: 'Neural agent architectures, prompt engineering & machine learning workflows',
    iconName: 'Cpu',
  },
  {
    id: 'project-feedback',
    name: 'project-feedback',
    description: 'Member suggestions, feature requests, and early beta testing feedback',
    iconName: 'MessageSquareShare',
  },
];

// Initial Chat Messages
export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'general-tech',
    senderId: 'user-tyler-ndu',
    senderName: 'Tyler Ndu',
    senderRole: 'owner',
    senderAvatar: '/src/assets/images/hero_tyler_ndu_1793347989778.jpg',
    content: 'Welcome to the official NDÛZAVÉL Community platform! Feel free to explore our apps, play our game demos in the Studio, and connect with other creators.',
    timestamp: '2026-03-30T09:00:00Z',
    reactions: { '🔥': ['user-1', 'user-2'], '🚀': ['user-3'] },
    isPinned: true,
  },
  {
    id: 'msg-2',
    channelId: 'general-tech',
    senderId: 'user-marcus',
    senderName: 'Marcus Vance',
    senderRole: 'member',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus',
    content: 'Mr. Tyler, the new HexaRun game engine runs buttery smooth on my phone! Loving the electric blue aesthetic.',
    timestamp: '2026-03-30T09:15:00Z',
    reactions: { '👍': ['user-tyler-ndu'] },
  },
  {
    id: 'msg-3',
    channelId: 'ai-lab',
    senderId: 'user-elena',
    senderName: 'Dr. Elena Rostova',
    senderRole: 'member',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Elena',
    content: 'Testing the Neural Core assistant. The response latency is remarkable—really impressed by the decoupled inference architecture.',
    timestamp: '2026-03-30T10:02:00Z',
    reactions: { '💡': ['user-tyler-ndu', 'user-marcus'] },
  },
];

// Initial Private Digital Vault Items
export const INITIAL_VAULT_ITEMS: VaultItem[] = [
  {
    id: 'vault-1',
    title: 'Autonomous Game Agent Patent Draft',
    category: 'Project Ideas',
    content: 'System and algorithmic method for real-time procedural enemy behavior adaptation in WebGL games using local quantised neural weights. Focus on reducing cloud inference cost to $0 per active player session.',
    secretValue: 'CONFIDENTIAL-PATENT-REF-NDU-2026-091A',
    tags: ['Patent', 'Game AI', 'Procedural'],
    updatedAt: '2026-03-25T14:30:00Z',
    accessLevel: 'owner_only',
  },
  {
    id: 'vault-2',
    title: 'Cloudflare & Vercel Production Deploy Tokens',
    category: 'API Credentials',
    content: 'Master edge deployment environment tokens and encrypted SSL certificate authority secrets for NDÛZAVÉL domains.',
    secretValue: 'cf_edge_live_99f81a7b9c2014d5e8921a884c01',
    tags: ['Infrastructure', 'Production', 'Edge'],
    updatedAt: '2026-03-20T11:15:00Z',
    accessLevel: 'owner_only',
  },
  {
    id: 'vault-3',
    title: 'Ndûzavél Sovereign Cloud Architecture Plan',
    category: 'Architecture',
    content: '1. Edge worker routing for zero-cold-start\n2. Client-side encrypted vault with master PIN\n3. Peer-to-peer WebRTC fallback for community messaging\n4. Zero external runtime dependencies for maximum resilience.',
    tags: ['Architecture', 'Blueprint', 'Zero-Trust'],
    updatedAt: '2026-03-18T16:45:00Z',
    accessLevel: 'owner_only',
  },
  {
    id: 'vault-4',
    title: 'Enterprise Licensing & Royalty Contract Notes',
    category: 'Financial & Legal',
    content: 'Commercial licensing terms for Neural Core engine embeds in corporate customer stacks. Standard revenue share at 15% net with 12-month lock-in and SLA guarantee.',
    secretValue: 'CONTRACT_REF_ENTERPRISE_2026_NDU',
    tags: ['Legal', 'Enterprise', 'Royalties'],
    updatedAt: '2026-03-10T08:20:00Z',
    accessLevel: 'owner_only',
  },
];

// Initial Site Announcements
export const INITIAL_ANNOUNCEMENTS: SiteAnnouncement[] = [
  {
    id: 'ann-1',
    title: 'NDÛZAVÉL Platform 2026 Release Live',
    summary: 'Introducing the unified technology home for Mr. Tyler Ndu: featuring the AI Studio, HexaRun WebGL game, Private Digital Vault, and real-time community channels.',
    date: 'March 2026',
    category: 'Ecosystem',
    readTime: '3 min read',
  },
  {
    id: 'ann-2',
    title: 'Neural Core v4 Developer Preview Available',
    summary: 'Our proprietary interactive neural assistant is now playable directly in the browser with custom agent prompt engineering presets.',
    date: 'March 2026',
    category: 'AI Research',
    readTime: '4 min read',
  },
  {
    id: 'ann-3',
    title: 'Zero-Knowledge Sovereign Vault Architecture',
    summary: 'A deep-dive into how our Private Digital Vault safeguards confidential notes and developer secrets locally with master PIN verification.',
    date: 'February 2026',
    category: 'Cybersecurity',
    readTime: '5 min read',
  },
];

// Initial Seed Users
export const INITIAL_USERS: User[] = [
  {
    id: 'user-tyler-ndu',
    name: 'Mr. Tyler Ndu',
    email: 'tylerndu72@gmail.com',
    role: 'owner',
    avatar: '/src/assets/images/hero_tyler_ndu_1793347989778.jpg',
    title: 'Founder & Software Architect',
    bio: 'Platform Owner, Architect, and Lead Engineer at NDÛZAVÉL.',
    verified: true,
    joinedAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    email: 'marcus.v@techinnovate.io',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Marcus',
    title: 'Game Developer & Modeler',
    bio: 'Cyberpunk indie developer building futuristic WebGL environments.',
    verified: true,
    joinedAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'user-elena',
    name: 'Dr. Elena Rostova',
    email: 'elena.rostova@neuralnet.org',
    role: 'moderator',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Elena',
    title: 'AI Researcher & Data Scientist',
    bio: 'Exploring transformer efficiency and small language model quantization.',
    verified: true,
    joinedAt: '2026-02-14T15:30:00Z',
  },
];

// Storage keys
const STORAGE_KEYS = {
  OWNER_PROFILE: 'nduzavel_owner_profile_v1',
  PROJECTS: 'nduzavel_projects_v1',
  VAULT_ITEMS: 'nduzavel_vault_items_v1',
  VAULT_PIN_HASH: 'nduzavel_vault_pin_hash_v1',
  CHAT_MESSAGES: 'nduzavel_chat_messages_v1',
  CONTACT_SUBMISSIONS: 'nduzavel_contact_submissions_v1',
  ANNOUNCEMENTS: 'nduzavel_announcements_v1',
  USERS: 'nduzavel_users_v1',
  CURRENT_USER: 'nduzavel_current_user_v1',
  SAVED_PROJECT_IDS: 'nduzavel_saved_projects_v1',
  MEMBER_NOTES: 'nduzavel_member_notes_v1',
};

// Storage helper class
export class AppStorage {
  private static broadcastChannel: BroadcastChannel | null = null;

  static initBroadcast(onMessage: (event: MessageEvent) => void) {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      if (!this.broadcastChannel) {
        this.broadcastChannel = new BroadcastChannel('nduzavel_sync_channel');
      }
      this.broadcastChannel.onmessage = onMessage;
    }
  }

  static broadcast(type: string, payload?: unknown) {
    try {
      if (this.broadcastChannel) {
        this.broadcastChannel.postMessage({ type, payload, timestamp: Date.now() });
      }
    } catch {
      // Ignore broadcast channel errors in restricted environments
    }
  }

  static getOwnerProfile(): OwnerProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OWNER_PROFILE);
      return data ? JSON.parse(data) : INITIAL_OWNER_PROFILE;
    } catch {
      return INITIAL_OWNER_PROFILE;
    }
  }

  static saveOwnerProfile(profile: OwnerProfile) {
    localStorage.setItem(STORAGE_KEYS.OWNER_PROFILE, JSON.stringify(profile));
    this.broadcast('OWNER_PROFILE_UPDATED', profile);
  }

  static getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      return data ? JSON.parse(data) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  }

  static saveProjects(projects: Project[]) {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
    this.broadcast('PROJECTS_UPDATED', projects);
  }

  static getVaultItems(): VaultItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VAULT_ITEMS);
      return data ? JSON.parse(data) : INITIAL_VAULT_ITEMS;
    } catch {
      return INITIAL_VAULT_ITEMS;
    }
  }

  static saveVaultItems(items: VaultItem[]) {
    localStorage.setItem(STORAGE_KEYS.VAULT_ITEMS, JSON.stringify(items));
    this.broadcast('VAULT_UPDATED', items);
  }

  static getVaultPinHash(): string {
    try {
      const hash = localStorage.getItem(STORAGE_KEYS.VAULT_PIN_HASH);
      // Default master PIN is '7272' (matching Tyler Ndu's email prefix 72)
      return hash || hashPin('7272');
    } catch {
      return hashPin('7272');
    }
  }

  static setVaultPin(pin: string) {
    const hash = hashPin(pin);
    localStorage.setItem(STORAGE_KEYS.VAULT_PIN_HASH, hash);
  }

  static getChatMessages(): ChatMessage[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      return data ? JSON.parse(data) : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  }

  static saveChatMessages(messages: ChatMessage[]) {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(messages));
    this.broadcast('CHAT_UPDATED', messages);
  }

  static getContactSubmissions(): ContactSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONTACT_SUBMISSIONS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static addContactSubmission(submission: ContactSubmission) {
    const current = this.getContactSubmissions();
    const updated = [submission, ...current];
    localStorage.setItem(STORAGE_KEYS.CONTACT_SUBMISSIONS, JSON.stringify(updated));
    this.broadcast('CONTACT_SUBMITTED', submission);
    return updated;
  }

  static updateContactSubmissions(submissions: ContactSubmission[]) {
    localStorage.setItem(STORAGE_KEYS.CONTACT_SUBMISSIONS, JSON.stringify(submissions));
    this.broadcast('CONTACT_UPDATED', submissions);
  }

  static getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      return data ? JSON.parse(data) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  }

  static saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    this.broadcast('USERS_UPDATED', users);
  }

  static getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  static setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
    this.broadcast('AUTH_CHANGED', user);
  }

  static getSavedProjectIds(): string[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_PROJECT_IDS);
      return data ? JSON.parse(data) : ['proj-neural-core', 'proj-hexarun-game'];
    } catch {
      return [];
    }
  }

  static toggleSavedProject(projectId: string): string[] {
    const saved = this.getSavedProjectIds();
    const exists = saved.includes(projectId);
    const updated = exists ? saved.filter((id) => id !== projectId) : [...saved, projectId];
    localStorage.setItem(STORAGE_KEYS.SAVED_PROJECT_IDS, JSON.stringify(updated));
    return updated;
  }

  static getMemberNotes(userId: string): MemberNote[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBER_NOTES);
      const all: MemberNote[] = data ? JSON.parse(data) : [];
      return all.filter((n) => n.userId === userId);
    } catch {
      return [];
    }
  }

  static saveMemberNote(note: MemberNote) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBER_NOTES);
      const all: MemberNote[] = data ? JSON.parse(data) : [];
      const index = all.findIndex((n) => n.id === note.id);
      if (index >= 0) {
        all[index] = note;
      } else {
        all.unshift(note);
      }
      localStorage.setItem(STORAGE_KEYS.MEMBER_NOTES, JSON.stringify(all));
    } catch {
      // Ignore
    }
  }

  static deleteMemberNote(noteId: string) {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MEMBER_NOTES);
      const all: MemberNote[] = data ? JSON.parse(data) : [];
      const updated = all.filter((n) => n.id !== noteId);
      localStorage.setItem(STORAGE_KEYS.MEMBER_NOTES, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }

  // Full Sovereign Data Export (JSON Backup for Tyler Ndu)
  static exportFullBackupJSON(): string {
    const backup = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      ownerProfile: this.getOwnerProfile(),
      projects: this.getProjects(),
      vaultItems: this.getVaultItems(),
      chatMessages: this.getChatMessages(),
      contactSubmissions: this.getContactSubmissions(),
      users: this.getUsers(),
    };
    return JSON.stringify(backup, null, 2);
  }

  // Full Sovereign Data Restore
  static restoreBackupJSON(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.ownerProfile) this.saveOwnerProfile(parsed.ownerProfile);
      if (parsed.projects) this.saveProjects(parsed.projects);
      if (parsed.vaultItems) this.saveVaultItems(parsed.vaultItems);
      if (parsed.chatMessages) this.saveChatMessages(parsed.chatMessages);
      if (parsed.users) this.saveUsers(parsed.users);
      if (parsed.contactSubmissions) this.updateContactSubmissions(parsed.contactSubmissions);
      return true;
    } catch {
      return false;
    }
  }

  // Reset to Factory Default
  static resetToDefaults() {
    localStorage.removeItem(STORAGE_KEYS.OWNER_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PROJECTS);
    localStorage.removeItem(STORAGE_KEYS.VAULT_ITEMS);
    localStorage.removeItem(STORAGE_KEYS.VAULT_PIN_HASH);
    localStorage.removeItem(STORAGE_KEYS.CHAT_MESSAGES);
    localStorage.removeItem(STORAGE_KEYS.CONTACT_SUBMISSIONS);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    this.broadcast('FACTORY_RESET');
  }
}
