import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatChannel, User } from '../types.ts';
import { AppStorage, INITIAL_CHANNELS } from '../utils/storage.ts';
import { canModerate, toggleReaction } from '../utils/community.ts';
import {
  Send,
  Pin,
  Trash2,
  Crown,
  Shield,
  User as UserIcon,
  Smile,
  Hash,
  Users,
  MessageSquare,
  Lock,
} from 'lucide-react';

interface CommunityViewProps {
  currentUser: User | null;
  onOpenAuth: () => void;
}

const EMOJI_LIST = ['🔥', '👍', '🚀', '💡', '❤️'];

export const CommunityView: React.FC<CommunityViewProps> = ({ currentUser, onOpenAuth }) => {
  const [channels] = useState<ChatChannel[]>(INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string>('general-tech');
  const [isDirectMessage, setIsDirectMessage] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => AppStorage.getChatMessages());
  const [inputText, setInputText] = useState('');
  const [activeEmojiPicker, setActiveEmojiPicker] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const users = AppStorage.getUsers();
  const activeChannel = channels.find((c) => c.id === activeChannelId);

  // Sync messages in real-time across tabs
  useEffect(() => {
    AppStorage.initBroadcast((event) => {
      if (event.data?.type === 'CHAT_UPDATED') {
        setMessages(AppStorage.getChatMessages());
      }
    });
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeChannelId, isDirectMessage]);

  const channelMessages = messages.filter((m) => {
    if (isDirectMessage) {
      return m.channelId === `dm-${currentUser?.id || 'guest'}`;
    }
    return m.channelId === activeChannelId;
  });

  const pinnedMessages = channelMessages.filter((m) => m.isPinned);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      channelId: isDirectMessage ? `dm-${currentUser.id}` : activeChannelId,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentUser.role,
      senderAvatar: currentUser.avatar,
      content: inputText.trim(),
      timestamp: new Date().toISOString(),
      reactions: {},
    };

    const updated = [...messages, newMessage];
    setMessages(updated);
    AppStorage.saveChatMessages(updated);
    setInputText('');

    // If sending a direct message to Tyler Ndu, simulate a thoughtful founder reply after a brief moment
    if (isDirectMessage && currentUser.role !== 'owner') {
      setTimeout(() => {
        const reply: ChatMessage = {
          id: `msg-${Date.now() + 1}`,
          channelId: `dm-${currentUser.id}`,
          senderId: 'user-tyler-ndu',
          senderName: 'Tyler Ndu',
          senderRole: 'owner',
          senderAvatar: '/src/assets/images/hero_tyler_ndu_1793347989778.jpg',
          content: `Thank you for reaching out directly, ${currentUser.name}. I have received your dispatch. Feel free to also send formal project proposals via tylerndu72@gmail.com!`,
          timestamp: new Date().toISOString(),
          reactions: { '👍': [currentUser.id] },
        };
        const next = [...AppStorage.getChatMessages(), reply];
        setMessages(next);
        AppStorage.saveChatMessages(next);
      }, 1200);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    const updated = messages.map((m) => {
      if (m.id === messageId) {
        return {
          ...m,
          reactions: toggleReaction(m.reactions || {}, emoji, currentUser.id),
        };
      }
      return m;
    });

    setMessages(updated);
    AppStorage.saveChatMessages(updated);
    setActiveEmojiPicker(null);
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!currentUser || !canModerate(currentUser.role)) return;
    const updated = messages.filter((m) => m.id !== messageId);
    setMessages(updated);
    AppStorage.saveChatMessages(updated);
  };

  const handleTogglePin = (messageId: string) => {
    if (!currentUser || !canModerate(currentUser.role)) return;
    const updated = messages.map((m) => {
      if (m.id === messageId) {
        return { ...m, isPinned: !m.isPinned };
      }
      return m;
    });
    setMessages(updated);
    AppStorage.saveChatMessages(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            <span>Community Nexus</span>
            <span aria-hidden="true">·</span>
            <span>Real-Time Broadcast</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
            Community Chat & Private Messaging
          </h1>
        </div>

        {!currentUser && (
          <button
            onClick={onOpenAuth}
            className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md"
          >
            Sign In to Join Conversation
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px] rounded-3xl bg-[#090D15] border border-amber-500/20 overflow-hidden shadow-2xl">
        {/* Left Sidebar: Channels & Direct Messages (3 cols) */}
        <div className="lg:col-span-3 bg-[#0B0F18] border-r border-slate-800 flex flex-col justify-between">
          <div className="p-4 space-y-6 overflow-y-auto">
            {/* Channels Header */}
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Public Channels
              </span>
              <div className="space-y-1">
                {channels.map((chan) => (
                  <button
                    key={chan.id}
                    onClick={() => {
                      setActiveChannelId(chan.id);
                      setIsDirectMessage(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                      !isDirectMessage && activeChannelId === chan.id
                        ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <Hash className="w-4 h-4 text-amber-400 shrink-0" />
                    <span className="truncate">{chan.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Message with Owner Section */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Direct Inquiries
              </span>
              <button
                onClick={() => {
                  if (!currentUser) {
                    onOpenAuth();
                    return;
                  }
                  setIsDirectMessage(true);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors ${
                  isDirectMessage
                    ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="relative">
                  <Crown className="w-4 h-4 text-amber-400 shrink-0" />
                </div>
                <div className="truncate">
                  <p className="truncate font-semibold">Tyler Ndu (Founder)</p>
                  <p className="text-[10px] text-slate-400">Direct Private Line</p>
                </div>
              </button>
            </div>

            {/* Active Members Mini List */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <div className="flex items-center justify-between text-[11px] font-mono uppercase text-slate-400">
                <span>Active Members</span>
                <span className="text-emerald-400">● Live</span>
              </div>
              <div className="space-y-1.5">
                {users.slice(0, 4).map((u) => (
                  <div key={u.id} className="flex items-center gap-2 text-xs text-slate-300 px-2 py-1">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="truncate text-[11px]">{u.name}</span>
                    {u.role === 'owner' && <Crown className="w-3 h-3 text-amber-400 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Current User Footnote */}
          {currentUser && (
            <div className="p-3 border-t border-slate-800 bg-[#07090E] flex items-center gap-2">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                referrerPolicy="no-referrer"
                className="w-7 h-7 rounded-full object-cover border border-amber-500/40"
              />
              <div className="text-xs truncate">
                <p className="font-semibold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-slate-400 font-mono capitalize">{currentUser.role}</p>
              </div>
            </div>
          )}
        </div>

        {/* Center: Active Chat Stream (9 cols) */}
        <div className="lg:col-span-9 flex flex-col justify-between bg-[#07090E] h-full">
          {/* Channel Header */}
          <div className="px-6 py-4 border-b border-slate-800 bg-[#0B0F17] flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isDirectMessage ? (
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                  <Lock className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Hash className="w-4 h-4" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-white font-heading">
                  {isDirectMessage ? 'Direct Message with Mr. Tyler Ndu' : `#${activeChannel?.name}`}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {isDirectMessage
                    ? 'Confidential 1-on-1 messaging channel directly with the platform founder'
                    : activeChannel?.description}
                </p>
              </div>
            </div>

            <div className="text-xs font-mono text-slate-400">
              <span className="text-emerald-400">Real-time Sync</span>
            </div>
          </div>

          {/* Pinned Messages Banner */}
          {pinnedMessages.length > 0 && !isDirectMessage && (
            <div className="px-6 py-2 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-xs text-amber-200">
              <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-semibold">Pinned:</span>
              <span className="truncate">{pinnedMessages[0].content}</span>
            </div>
          )}

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {channelMessages.length === 0 ? (
              <div className="text-center py-12 text-slate-500 text-xs">
                No messages in this channel yet. Be the first to start the discussion!
              </div>
            ) : (
              channelMessages.map((msg) => {
                const isAuthor = currentUser?.id === msg.senderId;
                const canMod = currentUser && canModerate(currentUser.role);

                return (
                  <div
                    key={msg.id}
                    className="group relative flex items-start gap-3 hover:bg-slate-900/40 p-2.5 rounded-xl transition-colors"
                  >
                    <img
                      src={msg.senderAvatar}
                      alt={msg.senderName}
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5"
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{msg.senderName}</span>
                        {msg.senderRole === 'owner' && (
                          <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/30 flex items-center gap-1">
                            <Crown className="w-2.5 h-2.5" />
                            <span>Owner</span>
                          </span>
                        )}
                        {msg.senderRole === 'moderator' && (
                          <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded border border-sky-500/30">
                            Mod
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(msg.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                        {msg.isPinned && (
                          <Pin className="w-3 h-3 text-amber-400 fill-amber-400" />
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                        {msg.content}
                      </p>

                      {/* Reactions bar */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {Object.entries(msg.reactions || {}).map(([emoji, userIds]) => (
                          <button
                            key={emoji}
                            onClick={() => handleReaction(msg.id, emoji)}
                            className={`px-2 py-0.5 rounded-full text-xs font-mono flex items-center gap-1 border transition-colors ${
                              currentUser && userIds.includes(currentUser.id)
                                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>{emoji}</span>
                            <span className="text-[10px]">{userIds.length}</span>
                          </button>
                        ))}

                        {/* Add reaction button */}
                        <div className="relative">
                          <button
                            onClick={() =>
                              setActiveEmojiPicker(
                                activeEmojiPicker === msg.id ? null : msg.id
                              )
                            }
                            className="p-1 text-slate-500 hover:text-amber-400 rounded transition-colors"
                            aria-label="Add reaction"
                          >
                            <Smile className="w-3.5 h-3.5" />
                          </button>

                          {activeEmojiPicker === msg.id && (
                            <div className="absolute left-0 bottom-full mb-1 p-1 bg-[#131A29] border border-slate-700 rounded-lg flex items-center gap-1 z-20 shadow-xl">
                              {EMOJI_LIST.map((emoji) => (
                                <button
                                  key={emoji}
                                  onClick={() => handleReaction(msg.id, emoji)}
                                  className="p-1 hover:scale-125 transition-transform text-sm"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Moderation Actions (Owner / Mod) */}
                    {canMod && (
                      <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
                        <button
                          onClick={() => handleTogglePin(msg.id)}
                          className="p-1 text-slate-400 hover:text-amber-400 rounded"
                          title="Pin Message"
                          aria-label="Pin Message"
                        >
                          <Pin className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 rounded"
                          title="Delete Message"
                          aria-label="Delete Message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box Form */}
          <div className="p-4 border-t border-slate-800 bg-[#0B0F17]">
            {currentUser ? (
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    isDirectMessage
                      ? 'Type confidential direct message to Tyler Ndu...'
                      : `Message #${activeChannel?.name || 'chat'}...`
                  }
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="px-5 py-2.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <span>Send</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            ) : (
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-3">
                <span>Join our tech community to chat and send private messages.</span>
                <button
                  onClick={onOpenAuth}
                  className="text-amber-400 font-semibold hover:underline"
                >
                  Sign In / Register →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
