export interface SourceFileItem {
  filename: string;
  path: string;
  description: string;
  language: string;
  content: string;
}

export const SOURCE_FILES: SourceFileItem[] = [
  {
    filename: 'README.md',
    path: '/README.md',
    description: 'Master documentation, setup instructions, and GitHub publishing guide',
    language: 'markdown',
    content: `# NDÛZAVÉL — Apps, AI & Gaming
Owned by Mr. Tyler Ndu | https://nduzaveltech.com | tylerndu72@gmail.com

How to publish to GitHub:
1. git remote add origin https://github.com/YOUR_USERNAME/nduzavel-tech.git
2. git push -u origin main

How to deploy to Vercel/Netlify for free:
1. Import repository on vercel.com
2. Under Settings -> Domains, add nduzaveltech.com
3. Configure DNS records:
   - Type A: @ -> 76.76.21.21
   - Type CNAME: www -> cname.vercel-dns.com
   - Type TXT: @ -> nduzavel-verification=owner-tylerndu-2026`,
  },
  {
    filename: 'types.ts',
    path: '/src/types.ts',
    description: 'TypeScript domain interfaces for Users, Projects, Chat, and Private Vault',
    language: 'typescript',
    content: `export type UserRole = 'owner' | 'moderator' | 'member' | 'guest';

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
  metrics?: { users?: string; rating?: string; performance?: string };
  featured: boolean;
  date: string;
}

export interface VaultItem {
  id: string;
  title: string;
  category: 'Project Ideas' | 'API Credentials' | 'Financial & Legal' | 'Architecture' | 'Personal Notes';
  content: string;
  secretValue?: string;
  tags: string[];
  updatedAt: string;
  accessLevel: 'owner_only' | 'confidential';
}`,
  },
  {
    filename: 'vaultEncryption.ts',
    path: '/src/utils/vaultEncryption.ts',
    description: 'Cryptographic utilities for master PIN validation and salted dynamic XOR obfuscation',
    language: 'typescript',
    content: `export function hashPin(pin: string, salt: string = 'NDUZAVEL_VAULT_2026'): string {
  let hash = 0;
  const combined = \`\${salt}:\${pin.trim()}\`;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16).padStart(8, '0');
}

export function verifyPin(enteredPin: string, expectedHash: string): boolean {
  if (!enteredPin || !expectedHash) return false;
  return hashPin(enteredPin) === expectedHash;
}

export function obfuscateSecret(plainText: string, pin: string): string {
  if (!plainText) return '';
  const key = \`\${pin}_NDUZAVEL_SECURE_TOKEN\`;
  let result = '';
  for (let i = 0; i < plainText.length; i++) {
    result += (plainText.charCodeAt(i) ^ key.charCodeAt(i % key.length)).toString(16).padStart(2, '0');
  }
  return result;
}

export function deobfuscateSecret(hexCipher: string, pin: string): string {
  if (!hexCipher || hexCipher.length % 2 !== 0) return '';
  const key = \`\${pin}_NDUZAVEL_SECURE_TOKEN\`;
  let result = '';
  let keyIndex = 0;
  for (let i = 0; i < hexCipher.length; i += 2) {
    const charCode = parseInt(hexCipher.substring(i, i + 2), 16);
    result += String.fromCharCode(charCode ^ key.charCodeAt(keyIndex % key.length));
    keyIndex++;
  }
  return result;
}`,
  },
  {
    filename: 'storage.ts',
    path: '/src/utils/storage.ts',
    description: 'Local persistence, BroadcastChannel real-time sync, and sovereign JSON backup/restore',
    language: 'typescript',
    content: `// LocalStorage and BroadcastChannel orchestrator
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
    } catch {}
  }

  // Full Sovereign Data Export (JSON Backup for Tyler Ndu)
  static exportFullBackupJSON(): string {
    return JSON.stringify({
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      ownerProfile: this.getOwnerProfile(),
      projects: this.getProjects(),
      vaultItems: this.getVaultItems(),
      chatMessages: this.getChatMessages(),
      contactSubmissions: this.getContactSubmissions(),
      users: this.getUsers(),
    }, null, 2);
  }
}`,
  },
  {
    filename: 'package.json',
    path: '/package.json',
    description: 'Application dependencies, npm build scripts, and engine specifications',
    language: 'json',
    content: `{
  "name": "nduzavel-tech",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "tsc",
    "test": "tsx --test src/utils/*.test.ts"
  },
  "dependencies": {
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24"
  }
}`,
  },
];
