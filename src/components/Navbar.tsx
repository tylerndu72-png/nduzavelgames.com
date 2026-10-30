import React, { useState } from 'react';
import { User } from '../types.ts';
import {
  Search,
  Shield,
  User as UserIcon,
  Crown,
  Menu,
  X,
  Bell,
  LogOut,
  FolderLock,
  Code2,
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
  onLogout: () => void;
  unreadCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onOpenSearch,
  onOpenNotifications,
  onLogout,
  unreadCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About Tyler Ndu' },
    { id: 'studio', label: 'AI & Studio' },
    { id: 'community', label: 'Community' },
    { id: 'vault', label: 'Digital Vault' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#07090E]/90 backdrop-blur-md border-b border-amber-500/15 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand Wordmark (Single text element in display face) */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 text-left group focus:outline-none"
            aria-label="NDÛZAVÉL Home"
          >
            <span className="text-xl md:text-2xl font-extrabold tracking-tight font-heading text-white whitespace-nowrap shrink-0 group-hover:opacity-90 transition-opacity">
              <span className="text-amber-400">NDÛ</span>
              <span className="text-sky-400">ZAVÉL</span>
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-widest text-slate-400 uppercase pt-0.5">
              Apps · AI · Gaming
            </span>
          </button>

          {/* Zone 2: Navigation Links (Clean single-line text links with subtle hover) */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`whitespace-nowrap shrink-0 py-1 transition-colors relative hover:text-white ${
                    isActive ? 'text-amber-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 to-sky-400 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Action & Utilities */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick search button */}
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors focus:outline-none focus:ring-1 focus:ring-amber-400"
              aria-label="Search site"
              title="Global Search (Ctrl+K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Notifications */}
            <button
              onClick={onOpenNotifications}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors relative focus:outline-none focus:ring-1 focus:ring-amber-400"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#07090E]" />
              )}
            </button>

            {/* User Account / Owner Action */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all focus:outline-none ${
                    currentUser.role === 'owner'
                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                      : 'border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20'
                  }`}
                  aria-expanded={userDropdownOpen}
                >
                  {currentUser.role === 'owner' ? (
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                  )}
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="text-[10px] uppercase tracking-wider font-mono opacity-80">
                    {currentUser.role === 'owner' ? 'Owner' : 'Member'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-xl bg-[#0F1420] border border-slate-800 shadow-2xl py-2 z-50 divide-y divide-slate-800/70"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 text-xs">
                      <p className="font-semibold text-white">{currentUser.name}</p>
                      <p className="text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'owner' ? (
                        <>
                          <button
                            onClick={() => {
                              onNavigate('owner-dashboard');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-amber-300 hover:bg-amber-500/10 text-left"
                          >
                            <Crown className="w-3.5 h-3.5 text-amber-400" />
                            Owner Dashboard
                          </button>
                          <button
                            onClick={() => {
                              onNavigate('vault');
                              setUserDropdownOpen(false);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 text-left"
                          >
                            <FolderLock className="w-3.5 h-3.5 text-amber-400" />
                            Private Digital Vault
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            onNavigate('member-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 text-xs text-sky-300 hover:bg-sky-500/10 text-left"
                        >
                          <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                          Member Dashboard
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onNavigate('studio');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-200 hover:bg-slate-800 text-left"
                      >
                        <Code2 className="w-3.5 h-3.5 text-sky-400" />
                        AI & Dev Studio
                      </button>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-400 hover:bg-rose-500/10 text-left"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-lg shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Member Access</span>
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B0F18] border-b border-slate-800 px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === link.id
                    ? 'bg-amber-500/10 text-amber-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            {currentUser && currentUser.role === 'owner' && (
              <button
                onClick={() => handleNavClick('owner-dashboard')}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-amber-300 bg-amber-500/15 flex items-center gap-2 mt-2"
              >
                <Crown className="w-4 h-4 text-amber-400" />
                Owner Dashboard
              </button>
            )}

            {currentUser && currentUser.role !== 'owner' && (
              <button
                onClick={() => handleNavClick('member-dashboard')}
                className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-sky-300 bg-sky-500/15 flex items-center gap-2 mt-2"
              >
                <UserIcon className="w-4 h-4 text-sky-400" />
                Member Dashboard
              </button>
            )}

            {!currentUser && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuth();
                }}
                className="w-full mt-3 py-2.5 text-center text-xs font-semibold text-black bg-amber-400 rounded-lg"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
