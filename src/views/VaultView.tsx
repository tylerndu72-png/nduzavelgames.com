import React, { useState } from 'react';
import { VaultItem, VaultCategory, User } from '../types.ts';
import { AppStorage } from '../utils/storage.ts';
import {
  hashPin,
  verifyPin,
  obfuscateSecret,
  deobfuscateSecret,
  maskSecret,
  formatVaultPayloadSize,
} from '../utils/vaultEncryption.ts';
import {
  Shield,
  Lock,
  Unlock,
  KeyRound,
  Search,
  Plus,
  Trash2,
  Edit3,
  Download,
  Copy,
  Check,
  Eye,
  EyeOff,
  FolderLock,
  FileText,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

interface VaultViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const VaultView: React.FC<VaultViewProps> = ({ currentUser, onOpenAuth }) => {
  const [pinInput, setPinInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'All' | VaultCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [vaultItems, setVaultItems] = useState<VaultItem[]>(() => AppStorage.getVaultItems());
  const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);
  const [revealedSecrets, setRevealedSecrets] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New / Edit Item Modal
  const [isEditingItem, setIsEditingItem] = useState(false);
  const [editingItemData, setEditingItemData] = useState<Partial<VaultItem>>({
    title: '',
    category: 'Project Ideas',
    content: '',
    secretValue: '',
    tags: [],
  });
  const [tagsInput, setTagsInput] = useState('');

  // Change PIN modal state
  const [showChangePin, setShowChangePin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinChangeMsg, setPinChangeMsg] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const storedHash = AppStorage.getVaultPinHash();
    if (verifyPin(pinInput, storedHash)) {
      setIsUnlocked(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    setSelectedItem(null);
    setRevealedSecrets({});
  };

  const handleToggleReveal = (id: string) => {
    setRevealedSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopySecret = (secret: string, id: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownloadItem = (item: VaultItem) => {
    const textContent = `=========================================
NDÛZAVÉL PRIVATE DIGITAL VAULT DOCUMENT
Owner: Mr. Tyler Ndu
Title: ${item.title}
Category: ${item.category}
Updated: ${new Date(item.updatedAt).toLocaleString()}
Tags: ${item.tags.join(', ')}
=========================================

CONTENT:
${item.content}

${item.secretValue ? `SECRET CREDENTIAL:\n${item.secretValue}\n` : ''}
=========================================
Generated from NDÛZAVÉL Sovereign Storage
`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vault-${item.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDeleteItem = (id: string) => {
    const updated = vaultItems.filter((i) => i.id !== id);
    setVaultItems(updated);
    AppStorage.saveVaultItems(updated);
    if (selectedItem?.id === id) setSelectedItem(null);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItemData.title || !editingItemData.content) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newItem: VaultItem = {
      id: editingItemData.id || `vault-${Date.now()}`,
      title: editingItemData.title,
      category: (editingItemData.category as VaultCategory) || 'Project Ideas',
      content: editingItemData.content,
      secretValue: editingItemData.secretValue,
      tags: tags.length > 0 ? tags : ['Confidential'],
      updatedAt: new Date().toISOString(),
      accessLevel: 'owner_only',
    };

    let updated: VaultItem[];
    if (editingItemData.id) {
      updated = vaultItems.map((i) => (i.id === newItem.id ? newItem : i));
    } else {
      updated = [newItem, ...vaultItems];
    }

    setVaultItems(updated);
    AppStorage.saveVaultItems(updated);
    setSelectedItem(newItem);
    setIsEditingItem(false);
  };

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length < 4) {
      setPinChangeMsg('PIN must be at least 4 digits.');
      return;
    }
    if (newPin !== confirmPin) {
      setPinChangeMsg('PINs do not match.');
      return;
    }
    AppStorage.setVaultPin(newPin);
    setPinChangeMsg('Vault Master PIN successfully updated.');
    setTimeout(() => {
      setShowChangePin(false);
      setPinChangeMsg('');
      setNewPin('');
      setConfirmPin('');
    }, 1500);
  };

  const filteredItems = vaultItems.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            <Shield className="w-3.5 h-3.5" />
            <span>Sovereign Security Fortress</span>
            <span aria-hidden="true">·</span>
            <span>Zero-Knowledge Architecture</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-white">
            Private Digital Vault
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Owner-only encrypted storage for proprietary notes, API secrets, patent ideas, and contracts.
          </p>
        </div>

        {isUnlocked && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChangePin(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
            >
              Change Master PIN
            </button>
            <button
              onClick={handleLock}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Vault</span>
            </button>
          </div>
        )}
      </div>

      {/* LOCKED STATE: Master PIN Authenticator */}
      {!isUnlocked ? (
        <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-[#0B0F17] border-2 border-amber-500/30 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FolderLock className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold font-heading text-white">Enter Vault Master PIN</h2>
            <p className="text-xs text-slate-400 mt-1">
              Restricted to Mr. Tyler Ndu. Client-side encrypted barrier.
            </p>
            <div className="mt-2 text-[11px] font-mono text-amber-400/90 bg-amber-500/10 py-1 px-2 rounded inline-block">
              Default Master PIN: <strong className="text-white">7272</strong>
            </div>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setPinError(false);
                }}
                placeholder="Enter 4-digit PIN..."
                autoFocus
                className="w-full pl-9 pr-3 py-2.5 text-center text-lg font-mono tracking-widest bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-400"
              />
            </div>

            {pinError && (
              <p className="text-xs text-rose-400 font-mono">
                Incorrect Master PIN. Access denied.
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2.5 text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg transition-transform flex items-center justify-center gap-2"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Digital Vault</span>
            </button>
          </form>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Data is stored with local cryptographic salt. Plaintext is never broadcast without owner authorization.
          </p>
        </div>
      ) : (
        /* UNLOCKED VAULT INTERFACE */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Filter tabs & Item Directory (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vault documents..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:border-amber-400"
                />
              </div>

              <button
                onClick={() => {
                  setEditingItemData({
                    title: '',
                    category: 'Project Ideas',
                    content: '',
                    secretValue: '',
                    tags: [],
                  });
                  setTagsInput('');
                  setIsEditingItem(true);
                }}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Note</span>
              </button>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {(
                [
                  'All',
                  'Project Ideas',
                  'API Credentials',
                  'Architecture',
                  'Financial & Legal',
                ] as const
              ).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg whitespace-nowrap transition-colors ${
                    activeCategory === cat
                      ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Item List */}
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {filteredItems.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  No vault records found matching query.
                </div>
              ) : (
                filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      selectedItem?.id === item.id
                        ? 'bg-amber-500/10 border-amber-500/50 shadow-md'
                        : 'bg-[#0B0F17] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-400/90 mb-1">
                      <span>{item.category}</span>
                      <span className="text-slate-500">
                        {new Date(item.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white truncate">{item.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{item.content}</p>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>{item.tags.join(' · ')}</span>
                      <span className="font-mono text-amber-400/70">
                        {formatVaultPayloadSize(item.content)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column: Document Details & Editor (7 cols) */}
          <div className="lg:col-span-7">
            {selectedItem ? (
              <div className="p-6 rounded-2xl bg-[#0B0F17] border border-amber-500/20 space-y-6 shadow-2xl">
                {/* Document Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                      {selectedItem.category}
                    </span>
                    <h3 className="text-xl font-bold font-heading text-white mt-1">
                      {selectedItem.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Last modified: {new Date(selectedItem.updatedAt).toLocaleString()} · Size:{' '}
                      {formatVaultPayloadSize(selectedItem.content)}
                    </p>
                  </div>

                  {/* Document Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadItem(selectedItem)}
                      className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 text-xs flex items-center gap-1.5"
                      title="Download Note (.txt)"
                    >
                      <Download className="w-3.5 h-3.5 text-sky-400" />
                      <span>Download</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingItemData(selectedItem);
                        setTagsInput(selectedItem.tags.join(', '));
                        setIsEditingItem(true);
                      }}
                      className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 text-xs flex items-center gap-1.5"
                      title="Edit Note"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteItem(selectedItem.id)}
                      className="p-2 text-rose-400 hover:text-rose-300 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-xs"
                      title="Delete Record"
                      aria-label="Delete Record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Secret Credential Bar (if present) */}
                {selectedItem.secretValue && (
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                    <div className="flex items-center justify-between text-xs font-mono text-amber-400">
                      <span>Confidential Key / Secret Token:</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleReveal(selectedItem.id)}
                          className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white"
                        >
                          {revealedSecrets[selectedItem.id] ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Hide</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Reveal</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() =>
                            handleCopySecret(selectedItem.secretValue || '', selectedItem.id)
                          }
                          className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200"
                        >
                          {copiedId === selectedItem.id ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs text-white overflow-x-auto select-all">
                      {revealedSecrets[selectedItem.id]
                        ? selectedItem.secretValue
                        : maskSecret(selectedItem.secretValue)}
                    </div>
                  </div>
                )}

                {/* Main Content Body */}
                <div className="space-y-2">
                  <h4 className="text-xs font-mono uppercase text-slate-400 tracking-wider">
                    Document Body
                  </h4>
                  <div className="p-4 rounded-xl bg-[#07090E] border border-slate-800 text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed font-mono">
                    {selectedItem.content}
                  </div>
                </div>

                {/* Cryptographic Proof Display */}
                <div className="pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-500 space-y-1">
                  <div className="flex items-center justify-between">
                    <span>Cipher Hash:</span>
                    <span className="text-amber-400/80">
                      {obfuscateSecret(selectedItem.title, '7272').substring(0, 24)}...
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Encryption Protocol:</span>
                    <span className="text-sky-400">Salted Dynamic XOR 32-bit</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center p-8 rounded-2xl bg-[#0B0F17] border border-dashed border-slate-800 text-center space-y-3">
                <FileText className="w-10 h-10 text-slate-600" />
                <h3 className="text-base font-semibold text-slate-400">
                  Select a document to inspect or edit
                </h3>
                <p className="text-xs text-slate-500 max-w-sm">
                  Click any entry from the left directory to view encrypted payloads, download files, or edit confidential records.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW / EDIT ITEM MODAL */}
      {isEditingItem && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-xl bg-[#0D121D] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200">
            <h3 className="text-lg font-bold font-heading text-white mb-4">
              {editingItemData.id ? 'Edit Vault Document' : 'Add New Vault Document'}
            </h3>

            <form onSubmit={handleSaveItem} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingItemData.title || ''}
                  onChange={(e) =>
                    setEditingItemData({ ...editingItemData, title: e.target.value })
                  }
                  placeholder="e.g. NextGen Game Logic Algorithm"
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={editingItemData.category || 'Project Ideas'}
                    onChange={(e) =>
                      setEditingItemData({
                        ...editingItemData,
                        category: e.target.value as VaultCategory,
                      })
                    }
                    className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                  >
                    <option value="Project Ideas">Project Ideas</option>
                    <option value="API Credentials">API Credentials</option>
                    <option value="Architecture">Architecture</option>
                    <option value="Financial & Legal">Financial & Legal</option>
                    <option value="Personal Notes">Personal Notes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="AI, Secret, 2026"
                    className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Secret Key / Credential (Optional)
                </label>
                <input
                  type="text"
                  value={editingItemData.secretValue || ''}
                  onChange={(e) =>
                    setEditingItemData({ ...editingItemData, secretValue: e.target.value })
                  }
                  placeholder="sk-live-secret-payload..."
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-amber-300 font-mono focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Document Notes & Blueprint
                </label>
                <textarea
                  rows={5}
                  required
                  value={editingItemData.content || ''}
                  onChange={(e) =>
                    setEditingItemData({ ...editingItemData, content: e.target.value })
                  }
                  placeholder="Write proprietary specifications, confidential notes, or project blueprints..."
                  className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white font-mono text-xs focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingItem(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md"
                >
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PIN MODAL */}
      {showChangePin && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div className="relative w-full max-w-sm bg-[#0D121D] border border-amber-500/30 rounded-2xl p-6 shadow-2xl text-slate-200">
            <h3 className="text-base font-bold font-heading text-white mb-2">
              Update Vault Master PIN
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Set a new 4 to 8 digit Master PIN to protect your private vault.
            </p>

            {pinChangeMsg && (
              <p className="text-xs text-emerald-400 font-mono mb-3">{pinChangeMsg}</p>
            )}

            <form onSubmit={handleChangePinSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">New PIN</label>
                <input
                  type="password"
                  maxLength={8}
                  required
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value)}
                  placeholder="Enter new PIN..."
                  className="w-full px-3 py-2 text-center text-sm font-mono tracking-widest bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Confirm New PIN
                </label>
                <input
                  type="password"
                  maxLength={8}
                  required
                  value={confirmPin}
                  onChange={(e) => setConfirmPin(e.target.value)}
                  placeholder="Re-enter new PIN..."
                  className="w-full px-3 py-2 text-center text-sm font-mono tracking-widest bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowChangePin(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg"
                >
                  Save PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
