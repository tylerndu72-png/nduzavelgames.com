import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, Sparkles, Gamepad2, Shield, Folder } from 'lucide-react';
import { Project, VaultItem } from '../types.ts';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  vaultItems: VaultItem[];
  isOwner: boolean;
  onNavigate: (view: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  projects,
  vaultItems,
  isOwner,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Toggle or open handled in parent
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredProjects = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  );

  const filteredVault = isOwner
    ? vaultItems.filter(
        (v) =>
          v.title.toLowerCase().includes(query.toLowerCase()) ||
          v.category.toLowerCase().includes(query.toLowerCase()) ||
          v.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Global Search"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl bg-[#0D121D] border border-amber-500/20 rounded-2xl shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800">
          <Search className="w-5 h-5 text-amber-400 mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search apps, AI tools, games, tutorials, vault..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-white mr-2"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 text-xs font-mono text-slate-400 hover:text-white rounded bg-slate-800"
            aria-label="Close search"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {/* Projects & Apps Section */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
              <span>Applications & Tools ({filteredProjects.length})</span>
            </div>
            {filteredProjects.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">No matching projects found.</p>
            ) : (
              <div className="space-y-1.5">
                {filteredProjects.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onNavigate('studio');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-amber-500/10 text-amber-400 group-hover:bg-amber-500/20">
                        {p.category === 'Gaming' ? (
                          <Gamepad2 className="w-4 h-4" />
                        ) : p.category === 'AI Tools' ? (
                          <Sparkles className="w-4 h-4" />
                        ) : (
                          <Folder className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-amber-300">
                          {p.title}
                        </p>
                        <p className="text-xs text-slate-400 truncate max-w-md">{p.description}</p>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 group-hover:text-amber-400 flex items-center gap-1">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sovereign Vault Section (Owner Only) */}
          {isOwner && (
            <div>
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Private Digital Vault Items ({filteredVault.length})</span>
                </span>
                <span className="text-[10px] text-amber-500/80">Owner Access</span>
              </div>
              {filteredVault.length === 0 ? (
                <p className="text-xs text-slate-500 py-2">No matching vault entries.</p>
              ) : (
                <div className="space-y-1.5">
                  {filteredVault.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate('vault');
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20 hover:bg-amber-900/30 text-left transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded bg-amber-500/20 text-amber-400">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-amber-200 group-hover:text-amber-100">
                            {item.title}
                          </p>
                          <p className="text-xs text-amber-400/70 truncate max-w-md">
                            {item.category} · {item.tags.join(', ')}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-amber-400 flex items-center gap-1">
                        <span>Open Vault</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#090D15] border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Navigate with arrow keys or click</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
