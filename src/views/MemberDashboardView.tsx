import React, { useState } from 'react';
import { User, Project, MemberNote } from '../types.ts';
import { AppStorage } from '../utils/storage.ts';
import {
  User as UserIcon,
  Bookmark,
  FileText,
  Shield,
  MessageSquare,
  Plus,
  Trash2,
  Edit3,
  ExternalLink,
  Check,
  Save,
} from 'lucide-react';

interface MemberDashboardViewProps {
  currentUser: User;
  projects: Project[];
  onNavigate: (view: string) => void;
  onUpdateUser: (user: User) => void;
}

export const MemberDashboardView: React.FC<MemberDashboardViewProps> = ({
  currentUser,
  projects,
  onNavigate,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'saved' | 'notes'>('saved');

  // Saved Projects
  const [savedIds, setSavedIds] = useState<string[]>(() => AppStorage.getSavedProjectIds());
  const savedProjects = projects.filter((p) => savedIds.includes(p.id));

  // Member Personal Notes
  const [notes, setNotes] = useState<MemberNote[]>(() =>
    AppStorage.getMemberNotes(currentUser.id)
  );
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');
  const [isAddingNote, setIsAddingNote] = useState(false);

  // Profile Edit
  const [nameInput, setNameInput] = useState(currentUser.name);
  const [titleInput, setTitleInput] = useState(currentUser.title || '');
  const [bioInput, setBioInput] = useState(currentUser.bio || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleToggleSave = (projectId: string) => {
    const updated = AppStorage.toggleSavedProject(projectId);
    setSavedIds(updated);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteTitle.trim() || !newNoteContent.trim()) return;

    const newNote: MemberNote = {
      id: `note-${Date.now()}`,
      userId: currentUser.id,
      title: newNoteTitle.trim(),
      content: newNoteContent.trim(),
      updatedAt: new Date().toISOString(),
    };

    AppStorage.saveMemberNote(newNote);
    setNotes([newNote, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setIsAddingNote(false);
  };

  const handleDeleteNote = (noteId: string) => {
    AppStorage.deleteMemberNote(noteId);
    setNotes(notes.filter((n) => n.id !== noteId));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: User = {
      ...currentUser,
      name: nameInput.trim(),
      title: titleInput.trim(),
      bio: bioInput.trim(),
    };
    onUpdateUser(updated);
    AppStorage.setCurrentUser(updated);
    const allUsers = AppStorage.getUsers().map((u) => (u.id === updated.id ? updated : u));
    AppStorage.saveUsers(allUsers);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* Member Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-sky-500/40 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
              <span>Verified Ecosystem Member</span>
              <span aria-hidden="true">·</span>
              <span>Joined {new Date(currentUser.joinedAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
              {currentUser.name}
            </h1>
            <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('community')}
          className="px-4 py-2 text-xs font-semibold rounded-xl bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 border border-sky-500/40 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Go to Community Chat</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('saved')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'saved'
              ? 'bg-sky-400 text-black font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Projects ({savedProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'notes'
              ? 'bg-sky-400 text-black font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Personal Scratchpad ({notes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-sky-400 text-black font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Profile & Account</span>
        </button>
      </div>

      {/* 1. SAVED PROJECTS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heading text-white">Bookmarked Innovations</h2>
            <button
              onClick={() => onNavigate('studio')}
              className="text-xs text-sky-400 hover:underline"
            >
              Browse more tools in Studio →
            </button>
          </div>

          {savedProjects.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs rounded-2xl bg-[#0B0F17] border border-slate-800">
              You haven't bookmarked any projects yet. Browse the Studio to save your favorites!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProjects.map((p) => (
                <div
                  key={p.id}
                  className="rounded-2xl bg-[#0B0F17] border border-slate-800 overflow-hidden flex flex-col justify-between"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden bg-slate-900">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs font-mono text-sky-400 mb-1">
                        <span>{p.category}</span>
                        <span className="text-slate-400">{p.status}</span>
                      </div>
                      <h4 className="text-base font-bold text-white">{p.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{p.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                      <button
                        onClick={() => handleToggleSave(p.id)}
                        className="text-xs text-rose-400 hover:underline"
                      >
                        Remove Bookmark
                      </button>

                      <button
                        onClick={() => onNavigate('studio')}
                        className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      >
                        <span>Launch Demo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. PERSONAL SCRATCHPAD */}
      {activeTab === 'notes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">Personal Scratchpad</h2>
              <p className="text-xs text-slate-400">
                Write and store personal notes, ideas, and code snippets locally.
              </p>
            </div>

            <button
              onClick={() => setIsAddingNote(!isAddingNote)}
              className="px-4 py-2 text-xs font-semibold text-black bg-sky-400 hover:bg-sky-300 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{isAddingNote ? 'Close Form' : 'New Note'}</span>
            </button>
          </div>

          {isAddingNote && (
            <form
              onSubmit={handleCreateNote}
              className="p-5 rounded-2xl bg-slate-900 border border-sky-500/30 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Note Title</label>
                <input
                  type="text"
                  required
                  value={newNoteTitle}
                  onChange={(e) => setNewNoteTitle(e.target.value)}
                  placeholder="e.g. Ideas for Tyler Ndu's next game..."
                  className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Content</label>
                <textarea
                  rows={4}
                  required
                  value={newNoteContent}
                  onChange={(e) => setNewNoteContent(e.target.value)}
                  placeholder="Write your note..."
                  className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white focus:border-sky-400"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNote(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-black bg-sky-400 hover:bg-sky-300 rounded-lg"
                >
                  Save Note
                </button>
              </div>
            </form>
          )}

          {notes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs rounded-2xl bg-[#0B0F17] border border-slate-800">
              No personal notes yet. Click "New Note" to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="p-4 rounded-xl bg-[#0B0F17] border border-slate-800 space-y-2 relative group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-white">{note.title}</h4>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
                    {note.content}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono pt-1">
                    Updated: {new Date(note.updatedAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. PROFILE & ACCOUNT */}
      {activeTab === 'profile' && (
        <form
          onSubmit={handleSaveProfile}
          className="p-6 sm:p-8 rounded-3xl bg-[#0B0F17] border border-slate-800 space-y-6"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-lg font-bold font-heading text-white">Account Details</h2>
              <p className="text-xs text-slate-400">Update your public display identity in the community.</p>
            </div>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-4 h-4" />
                <span>Profile updated!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Display Name</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Professional Title</label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder="e.g. Indie Game Developer"
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Short Bio</label>
            <textarea
              rows={3}
              value={bioInput}
              onChange={(e) => setBioInput(e.target.value)}
              placeholder="Tell other NDÛZAVÉL members about what you build..."
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-sky-400"
            />
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-black bg-sky-400 hover:bg-sky-300 rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
