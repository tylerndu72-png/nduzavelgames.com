import React from 'react';
import { Bell, Check, X, Sparkles, MessageSquare, Shield } from 'lucide-react';
import { SiteAnnouncement } from '../types.ts';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  announcements: SiteAnnouncement[];
  onNavigate: (view: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  announcements,
  onNavigate,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Notification Center"
      className="fixed inset-0 z-50 flex items-start justify-end p-4 pt-20 bg-black/60 backdrop-blur-xs"
    >
      <div className="relative w-full max-w-sm bg-[#0E131F] border border-amber-500/20 rounded-2xl shadow-2xl p-4 text-slate-200 animate-in slide-in-from-right-4 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white font-heading">Notifications</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close notification center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-2 space-y-3 max-h-[70vh] overflow-y-auto">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              onClick={() => {
                onNavigate('home');
                onClose();
              }}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono mb-1">
                <span>{ann.category}</span>
                <span className="text-slate-400">{ann.date}</span>
              </div>
              <h4 className="text-xs font-semibold text-white mb-1 hover:text-amber-300">
                {ann.title}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                {ann.summary}
              </p>
            </div>
          ))}

          <div
            onClick={() => {
              onNavigate('community');
              onClose();
            }}
            className="p-3 rounded-xl bg-sky-950/20 border border-sky-500/20 hover:border-sky-500/40 cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-2 text-xs font-medium text-sky-300 mb-1">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Active Community Discussions</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Members are currently discussing AI agent orchestration and game engine physics in #general-tech.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
