import React from 'react';
import { Home, Compass, MessageSquare, Shield, Crown, User as UserIcon } from 'lucide-react';
import { User } from '../types.ts';

interface MobileNavProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
}) => {
  const isOwner = currentUser?.role === 'owner';

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0B0F17]/95 backdrop-blur-lg border-t border-slate-800/80 px-2 py-1 max-h-[14vh]"
    >
      <div className="flex items-center justify-around h-14 max-w-md mx-auto">
        <button
          onClick={() => onNavigate('home')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-colors ${
            currentView === 'home' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Home</span>
        </button>

        <button
          onClick={() => onNavigate('studio')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-colors ${
            currentView === 'studio' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="AI Studio & Games"
        >
          <Compass className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Studio</span>
        </button>

        <button
          onClick={() => onNavigate('community')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-colors ${
            currentView === 'community' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Community Chat"
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Chat</span>
        </button>

        <button
          onClick={() => onNavigate('vault')}
          className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-colors ${
            currentView === 'vault' ? 'text-amber-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
          }`}
          aria-label="Digital Vault"
        >
          <Shield className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] tracking-tight">Vault</span>
        </button>

        {isOwner ? (
          <button
            onClick={() => onNavigate('owner-dashboard')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-colors ${
              currentView === 'owner-dashboard' ? 'text-amber-400 font-semibold' : 'text-amber-300/80 hover:text-amber-200'
            }`}
            aria-label="Owner Control Room"
          >
            <Crown className="w-5 h-5 mb-0.5 text-amber-400" />
            <span className="text-[10px] tracking-tight">Owner</span>
          </button>
        ) : currentUser ? (
          <button
            onClick={() => onNavigate('member-dashboard')}
            className={`flex flex-col items-center justify-center min-w-[50px] min-h-[44px] transition-colors ${
              currentView === 'member-dashboard' ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
            }`}
            aria-label="Member Hub"
          >
            <UserIcon className="w-5 h-5 mb-0.5 text-sky-400" />
            <span className="text-[10px] tracking-tight">Hub</span>
          </button>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center min-w-[50px] min-h-[44px] text-amber-400 hover:text-amber-300"
            aria-label="Sign In"
          >
            <UserIcon className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Sign In</span>
          </button>
        )}
      </div>
    </nav>
  );
};
