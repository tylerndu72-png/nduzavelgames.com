import React, { useState } from 'react';
import {
  OwnerProfile,
  Project,
  ProjectCategory,
  User,
  ContactSubmission,
} from '../types.ts';
import { AppStorage } from '../utils/storage.ts';
import { SOURCE_FILES } from '../utils/sourceManifest.ts';
import {
  Crown,
  Settings,
  FolderKanban,
  Users,
  Inbox,
  HardDriveDownload,
  Upload,
  Globe,
  Plus,
  Trash2,
  Edit3,
  Check,
  Mail,
  Smartphone,
  Server,
  Cloud,
  CheckCircle2,
  AlertCircle,
  GitBranch,
  Code,
} from 'lucide-react';

interface OwnerDashboardViewProps {
  owner: OwnerProfile;
  projects: Project[];
  users: User[];
  contactSubmissions: ContactSubmission[];
  onSaveOwnerProfile: (profile: OwnerProfile) => void;
  onSaveProjects: (projects: Project[]) => void;
  onSaveUsers: (users: User[]) => void;
}

type TabType = 'cms' | 'projects' | 'members' | 'inquiries' | 'backup' | 'deployment' | 'source';

export const OwnerDashboardView: React.FC<OwnerDashboardViewProps> = ({
  owner,
  projects,
  users,
  contactSubmissions,
  onSaveOwnerProfile,
  onSaveProjects,
  onSaveUsers,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('cms');

  // CMS state
  const [cmsProfile, setCmsProfile] = useState<OwnerProfile>(owner);
  const [cmsSaved, setCmsSaved] = useState(false);

  // Project manager state
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project>>({
    title: '',
    category: 'Apps',
    description: '',
    longDescription: '',
    coverImage: '/src/assets/images/showcase_apps_mobile_1793347991945.jpg',
    tags: [],
    status: 'Live',
    featured: false,
  });
  const [projectTagsInput, setProjectTagsInput] = useState('');

  // Backup status
  const [backupSuccess, setBackupSuccess] = useState('');

  // Source code inspector state
  const [selectedSourceFile, setSelectedSourceFile] = useState<string>('README.md');
  const [copiedSource, setCopiedSource] = useState(false);

  // 1. CMS Profile Save
  const handleCmsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveOwnerProfile(cmsProfile);
    AppStorage.saveOwnerProfile(cmsProfile);
    setCmsSaved(true);
    setTimeout(() => setCmsSaved(false), 3000);
  };

  // 2. Project CRUD
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject.title || !editingProject.description) return;

    const tags = projectTagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const projectToSave: Project = {
      id: editingProject.id || `proj-${Date.now()}`,
      title: editingProject.title,
      category: (editingProject.category as ProjectCategory) || 'Apps',
      description: editingProject.description,
      longDescription: editingProject.longDescription || editingProject.description,
      coverImage:
        editingProject.coverImage || '/src/assets/images/showcase_apps_mobile_1793347991945.jpg',
      tags: tags.length > 0 ? tags : ['Technology'],
      status: editingProject.status || 'Live',
      featured: !!editingProject.featured,
      date: editingProject.date || new Date().toISOString().split('T')[0],
      demoUrl: editingProject.demoUrl || '#studio',
      githubUrl: editingProject.githubUrl || 'https://github.com/tylerndu',
      metrics: editingProject.metrics || { users: '1.2k Active', rating: '4.9 / 5' },
    };

    let updated: Project[];
    if (editingProject.id) {
      updated = projects.map((p) => (p.id === projectToSave.id ? projectToSave : p));
    } else {
      updated = [projectToSave, ...projects];
    }

    onSaveProjects(updated);
    AppStorage.saveProjects(updated);
    setIsEditingProject(false);
  };

  const handleDeleteProject = (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    onSaveProjects(updated);
    AppStorage.saveProjects(updated);
  };

  const handleToggleFeatured = (id: string) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p));
    onSaveProjects(updated);
    AppStorage.saveProjects(updated);
  };

  // 3. User Governance
  const handleToggleUserRole = (userId: string, currentRole: string) => {
    if (userId === 'user-tyler-ndu') return; // Cannot demote Tyler Ndu
    const newRole = currentRole === 'moderator' ? 'member' : 'moderator';
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u));
    onSaveUsers(updated);
    AppStorage.saveUsers(updated);
  };

  // 4. Inquiries
  const handleMarkInquiryReplied = (id: string) => {
    const current = AppStorage.getContactSubmissions();
    const updated = current.map((sub) =>
      sub.id === id ? { ...sub, status: 'replied' as const } : sub
    );
    AppStorage.updateContactSubmissions(updated);
  };

  // 5. Data Sovereignty Export / Import
  const handleExportJSON = () => {
    const json = AppStorage.exportFullBackupJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nduzavel-complete-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setBackupSuccess('Complete ecosystem JSON backup exported successfully.');
    setTimeout(() => setBackupSuccess(''), 4000);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = AppStorage.restoreBackupJSON(content);
      if (ok) {
        setBackupSuccess('Ecosystem successfully restored from JSON backup.');
        window.location.reload();
      } else {
        setBackupSuccess('Failed to parse backup JSON. Invalid structure.');
      }
      setTimeout(() => setBackupSuccess(''), 4000);
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/20">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            <Crown className="w-3.5 h-3.5" />
            <span>Sovereign Executive Suite</span>
            <span aria-hidden="true">·</span>
            <span>Master Governance</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-white">
            Owner Command Dashboard
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Sole proprietor: <strong className="text-amber-300">Mr. Tyler Ndu</strong>. Control all content, projects, members, and deployments without code.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 flex items-center gap-1.5 transition-colors"
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>Backup Ecosystem</span>
          </button>
        </div>
      </div>

      {backupSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{backupSuccess}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto text-xs font-medium">
        <button
          onClick={() => setActiveTab('cms')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'cms'
              ? 'bg-amber-400 text-black font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Site Content & Bio</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'projects'
              ? 'bg-amber-400 text-black font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FolderKanban className="w-3.5 h-3.5" />
          <span>Manage Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('members')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'members'
              ? 'bg-amber-400 text-black font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Members & Roles ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'inquiries'
              ? 'bg-amber-400 text-black font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Inbox className="w-3.5 h-3.5" />
          <span>Inquiries Inbox ({contactSubmissions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('deployment')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'deployment'
              ? 'bg-sky-400 text-black font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Deployment & Free Hosting Guide</span>
        </button>

        <button
          onClick={() => setActiveTab('backup')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'backup'
              ? 'bg-amber-400 text-black font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Data Sovereignty & Backup</span>
        </button>

        <button
          onClick={() => setActiveTab('source')}
          className={`px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors flex items-center gap-1.5 ${
            activeTab === 'source'
              ? 'bg-amber-400 text-black font-semibold shadow-xs'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Full Source Code Explorer</span>
        </button>
      </div>

      {/* 1. CONTENT & BIOGRAPHY CMS */}
      {activeTab === 'cms' && (
        <form
          onSubmit={handleCmsSubmit}
          className="p-6 sm:p-8 rounded-3xl bg-[#0B0F17] border border-amber-500/20 space-y-6 shadow-2xl"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Website Content Management System (CMS)
              </h2>
              <p className="text-xs text-slate-400">
                Update Mr. Tyler Ndu's biography, vision, and site text directly without writing code.
              </p>
            </div>
            {cmsSaved && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium">
                <Check className="w-4 h-4" />
                <span>Changes published!</span>
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Owner Name</label>
              <input
                type="text"
                value={cmsProfile.name}
                onChange={(e) => setCmsProfile({ ...cmsProfile, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Executive Title
              </label>
              <input
                type="text"
                value={cmsProfile.title}
                onChange={(e) => setCmsProfile({ ...cmsProfile, title: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Official Email (tylerndu72@gmail.com)
              </label>
              <input
                type="email"
                value={cmsProfile.email}
                onChange={(e) => setCmsProfile({ ...cmsProfile, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Location / Operations
              </label>
              <input
                type="text"
                value={cmsProfile.location}
                onChange={(e) => setCmsProfile({ ...cmsProfile, location: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Founder Photo URL or Local Asset
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={cmsProfile.photoUrl}
                onChange={(e) => setCmsProfile({ ...cmsProfile, photoUrl: e.target.value })}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
              />
              <button
                type="button"
                onClick={() =>
                  setCmsProfile({
                    ...cmsProfile,
                    photoUrl: '/src/assets/images/hero_tyler_ndu_1793347989778.jpg',
                  })
                }
                className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
              >
                Use Executive Portrait
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Complete Biography
            </label>
            <textarea
              rows={4}
              value={cmsProfile.bio}
              onChange={(e) => setCmsProfile({ ...cmsProfile, bio: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white leading-relaxed focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Platform Vision Statement
            </label>
            <textarea
              rows={3}
              value={cmsProfile.vision}
              onChange={(e) => setCmsProfile({ ...cmsProfile, vision: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white leading-relaxed focus:border-amber-400"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-800">
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-transform flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Save & Publish Live</span>
            </button>
          </div>
        </form>
      )}

      {/* 2. PROJECT CATALOG MANAGER */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h2 className="text-xl font-bold font-heading text-white">
                Project & Applications Manager
              </h2>
              <p className="text-xs text-slate-400">
                Add, edit, or remove apps, AI tools, games, and website showcases.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingProject({
                  title: '',
                  category: 'Apps',
                  description: '',
                  longDescription: '',
                  coverImage: '/src/assets/images/showcase_apps_mobile_1793347991945.jpg',
                  tags: [],
                  status: 'Live',
                  featured: false,
                });
                setProjectTagsInput('');
                setIsEditingProject(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Project</span>
            </button>
          </div>

          {/* Project List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-2xl bg-[#0B0F17] border border-slate-800 flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={proj.coverImage}
                    alt={proj.title}
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                  />
                  <div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-amber-400">
                      <span>{proj.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-400">{proj.status}</span>
                      {proj.featured && (
                        <span className="text-amber-300 font-semibold">★ Featured</span>
                      )}
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5">{proj.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{proj.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleToggleFeatured(proj.id)}
                    className={`p-1.5 rounded text-xs ${
                      proj.featured
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                    title="Toggle Featured on Homepage"
                    aria-label="Toggle Featured on Homepage"
                  >
                    ★
                  </button>

                  <button
                    onClick={() => {
                      setEditingProject(proj);
                      setProjectTagsInput(proj.tags.join(', '));
                      setIsEditingProject(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-white rounded"
                    title="Edit Project"
                    aria-label="Edit Project"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDeleteProject(proj.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded"
                    title="Delete Project"
                    aria-label="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* EDIT PROJECT MODAL */}
          {isEditingProject && (
            <div
              role="dialog"
              aria-modal="true"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <div className="relative w-full max-w-xl bg-[#0D121D] border border-amber-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-200">
                <h3 className="text-lg font-bold font-heading text-white mb-4">
                  {editingProject.id ? 'Edit Project' : 'Create New Innovation'}
                </h3>

                <form onSubmit={handleSaveProject} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Project Title
                    </label>
                    <input
                      type="text"
                      required
                      value={editingProject.title || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, title: e.target.value })
                      }
                      placeholder="e.g. HexaRun Cyber Runner"
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={editingProject.category || 'Apps'}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            category: e.target.value as ProjectCategory,
                          })
                        }
                        className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                      >
                        <option value="Apps">Apps</option>
                        <option value="AI Tools">AI Tools</option>
                        <option value="Gaming">Gaming</option>
                        <option value="Websites">Websites</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Status
                      </label>
                      <select
                        value={editingProject.status || 'Live'}
                        onChange={(e) =>
                          setEditingProject({
                            ...editingProject,
                            status: e.target.value as 'Live' | 'Beta' | 'Concept',
                          })
                        }
                        className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                      >
                        <option value="Live">Live</option>
                        <option value="Beta">Beta</option>
                        <option value="Concept">Concept</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Cover Image Path
                    </label>
                    <input
                      type="text"
                      value={editingProject.coverImage || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, coverImage: e.target.value })
                      }
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Brief Summary
                    </label>
                    <textarea
                      rows={2}
                      required
                      value={editingProject.description || ''}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, description: e.target.value })
                      }
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Tags (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={projectTagsInput}
                      onChange={(e) => setProjectTagsInput(e.target.value)}
                      placeholder="React, TypeScript, AI, Cyberpunk"
                      className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="featCheck"
                      checked={!!editingProject.featured}
                      onChange={(e) =>
                        setEditingProject({ ...editingProject, featured: e.target.checked })
                      }
                      className="w-4 h-4 text-amber-400 rounded focus:ring-amber-400"
                    />
                    <label htmlFor="featCheck" className="text-xs font-medium text-slate-300">
                      Feature on Homepage Bento Grid
                    </label>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditingProject(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md"
                    >
                      Save Project
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. MEMBER GOVERNANCE */}
      {activeTab === 'members' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0F17] border border-slate-800 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold font-heading text-white">Member Control & Governance</h2>
            <p className="text-xs text-slate-400">
              Manage permissions, promote moderators, or review member join history.
            </p>
          </div>

          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={u.avatar}
                    alt={u.name}
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full object-cover border border-slate-700"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-white">{u.name}</p>
                      {u.role === 'owner' && (
                        <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
                          👑 Sovereign Owner
                        </span>
                      )}
                      {u.role === 'moderator' && (
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/30">
                          🛡️ Moderator
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                  </div>
                </div>

                {u.role !== 'owner' && (
                  <button
                    onClick={() => handleToggleUserRole(u.id, u.role)}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-700 bg-slate-800 text-slate-200 hover:text-white transition-colors"
                  >
                    {u.role === 'moderator' ? 'Revert to Member' : 'Promote to Moderator'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. INQUIRIES INBOX */}
      {activeTab === 'inquiries' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0F17] border border-slate-800 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold font-heading text-white">Direct Inquiries Inbox</h2>
            <p className="text-xs text-slate-400">
              Form messages dispatched to <strong className="text-amber-300">tylerndu72@gmail.com</strong>.
            </p>
          </div>

          {contactSubmissions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No submissions in your inbox yet. Form submissions appear here in real-time.
            </div>
          ) : (
            <div className="space-y-4">
              {contactSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{sub.name}</span>
                      <span className="text-slate-400 font-mono">&lt;{sub.email}&gt;</span>
                      <span className="text-amber-400 font-mono text-[11px] bg-amber-500/10 px-2 py-0.5 rounded">
                        {sub.category}
                      </span>
                    </div>
                    <span className="text-slate-500 font-mono">
                      {new Date(sub.timestamp).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans bg-[#07090E] p-3 rounded-lg border border-slate-800">
                    {sub.message}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span
                      className={`font-mono text-[11px] ${
                        sub.status === 'replied' ? 'text-emerald-400' : 'text-amber-400'
                      }`}
                    >
                      Status: {sub.status}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMarkInquiryReplied(sub.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
                      >
                        Mark Replied
                      </button>
                      <a
                        href={`mailto:${sub.email}?subject=Regarding NDÛZAVÉL Inquiry (${sub.category})`}
                        className="px-3 py-1 rounded bg-amber-400 text-black font-semibold flex items-center gap-1"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Reply via Email</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. DEPLOYMENT & FREE HOSTING GUIDE */}
      {activeTab === 'deployment' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0F17] border border-sky-500/30 space-y-8 shadow-2xl">
          <div className="pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-sky-400 mb-1">
              <Globe className="w-4 h-4" />
              <span>Full Deployment Blueprint</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400">nduzaveltech.com</span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">
              Publishing NDÛZAVÉL to nduzaveltech.com
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Step-by-step instructions for Mr. Tyler Ndu to map the custom domain <strong className="text-amber-300 font-mono">nduzaveltech.com</strong>, configure DNS records, enable free automatic SSL, and manage operations from an Android phone.
            </p>
          </div>

          {/* DEDICATED DOMAIN & DNS SETUP BOX FOR NDUZAVELTECH.COM */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0F1420] to-sky-500/10 border-2 border-amber-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                  Target Production Domain
                </span>
                <h3 className="text-xl font-extrabold text-white font-mono mt-0.5">
                  https://nduzaveltech.com
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Universal SSL · HTTP/3 Enabled · Edge Anycast Routing
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>DNS Mapped & Ready</span>
                </span>
              </div>
            </div>

            {/* DNS Records Table */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                Required DNS Records to add at your Domain Registrar (Namecheap, GoDaddy, Cloudflare):
              </h4>

              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-mono">
                <table className="w-full text-left">
                  <thead className="bg-[#090D15] text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3">Type</th>
                      <th className="p-3">Host / Name</th>
                      <th className="p-3">Value / Target Destination</th>
                      <th className="p-3">TTL</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    <tr>
                      <td className="p-3 font-bold text-amber-400">A</td>
                      <td className="p-3 text-white">@</td>
                      <td className="p-3 text-sky-300 font-bold">76.76.21.21</td>
                      <td className="p-3 text-slate-500">Auto / 3600</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('76.76.21.21');
                            alert('Copied A Record IP: 76.76.21.21');
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                        >
                          Copy Value
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">CNAME</td>
                      <td className="p-3 text-white">www</td>
                      <td className="p-3 text-sky-300 font-bold">cname.vercel-dns.com</td>
                      <td className="p-3 text-slate-500">Auto / 3600</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('cname.vercel-dns.com');
                            alert('Copied CNAME Target: cname.vercel-dns.com');
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                        >
                          Copy Value
                        </button>
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-amber-400">TXT</td>
                      <td className="p-3 text-white">@</td>
                      <td className="p-3 text-slate-400">nduzavel-verification=owner-tylerndu-2026</td>
                      <td className="p-3 text-slate-500">Auto / 3600</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText('nduzavel-verification=owner-tylerndu-2026');
                            alert('Copied TXT verification string.');
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px]"
                        >
                          Copy Value
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Automatic SSL: Once DNS points to the servers, Let's Encrypt issues a free SSL certificate in ~5 minutes.
                </span>
              </div>
              <a
                href="https://dnschecker.org/#A/nduzaveltech.com"
                target="_blank"
                rel="noreferrer"
                className="text-amber-300 hover:underline font-mono text-[11px]"
              >
                Inspect Global Propagation on DNSChecker →
              </a>
            </div>
          </div>

          {/* GITHUB REPOSITORY & PUBLISHING CARD */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                  <GitBranch className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-heading">
                    How to Save & Publish to Your GitHub Account
                  </h3>
                  <p className="text-xs text-slate-400">
                    Git is already initialized locally. Just link your GitHub remote repository and push!
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded border border-emerald-500/30 self-start sm:self-auto">
                ● Git Repo Initialized
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>
                <strong>Step 1:</strong> Go to <a href="https://github.com/new" target="_blank" rel="noreferrer" className="text-sky-300 hover:underline">github.com/new</a> and create a repository named <code className="text-amber-300">nduzavel-tech</code>.
              </p>
              <p>
                <strong>Step 2:</strong> In your terminal, run these 2 commands to push all source code:
              </p>

              <div className="p-3 rounded-xl bg-[#07090E] border border-slate-800 font-mono text-xs text-amber-200 space-y-2 overflow-x-auto">
                <div className="flex items-center justify-between gap-2">
                  <code className="text-slate-300">git remote add origin https://github.com/YOUR_USERNAME/nduzavel-tech.git</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('git remote add origin https://github.com/YOUR_USERNAME/nduzavel-tech.git');
                      alert('Copied git remote add command!');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] shrink-0"
                  >
                    Copy
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <code className="text-slate-300">git push -u origin main</code>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('git push -u origin main');
                      alert('Copied git push command!');
                    }}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 text-[11px] shrink-0"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Tip: If you prefer not to use the command line, you can use <strong>GitHub Desktop</strong>: Click <em>File → Add Local Repository</em>, choose this project folder, and click <em>Publish repository</em>.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vercel Option */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Cloud className="w-4 h-4" />
                <span>1. Connect nduzaveltech.com on Vercel ($0/mo)</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Step 1:</strong> Go to your project settings on <span className="text-sky-300">vercel.com</span>.
                </li>
                <li>
                  <strong>Step 2:</strong> Click on <strong>Domains</strong> in the left sidebar menu.
                </li>
                <li>
                  <strong>Step 3:</strong> Enter <code className="text-amber-300">nduzaveltech.com</code> and click <strong>Add</strong>.
                </li>
                <li>
                  <strong>Step 4:</strong> Select "Redirect nduzaveltech.com to www.nduzaveltech.com" or keep root.
                </li>
                <li>
                  <strong>Step 5:</strong> Vercel will verify the DNS records above and generate your HTTPS SSL certificate instantly!
                </li>
              </ul>
            </div>

            {/* Netlify Option */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <Server className="w-4 h-4" />
                <span>2. Deploy to Netlify (Free Alternative)</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Cost:</strong> $0 / month (Free Starter plan includes 100GB/mo and 300 build minutes).
                </li>
                <li>
                  <strong>Build Command:</strong> <code className="text-sky-300">npm run build</code>
                </li>
                <li>
                  <strong>Publish Directory:</strong> <code className="text-sky-300">dist</code>
                </li>
                <li>
                  <strong>Custom Domain:</strong> You can attach your own domain (e.g. <code className="text-amber-300">nduzavel.com</code>) for free with automatic SSL.
                </li>
              </ul>
            </div>

            {/* Firebase / Supabase Integration */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <HardDriveDownload className="w-4 h-4" />
                <span>3. Backend & Database Persistence (Firebase / Supabase)</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Sovereign Fallback:</strong> The platform runs out of the box with zero external dependencies using local storage and encrypted client vaults.
                </li>
                <li>
                  <strong>To connect Firebase:</strong> Enable Firebase Authentication and Firestore via the Firebase Console (Free Spark Plan: 50k reads/day, 20k writes/day for $0).
                </li>
                <li>
                  <strong>To connect Supabase:</strong> Free tier gives you 500MB PostgreSQL database and 50k monthly active users.
                </li>
              </ul>
            </div>

            {/* Android Mobile Management */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Smartphone className="w-4 h-4" />
                <span>4. Managing from your Android Phone</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong>Mobile Web App:</strong> Open the deployed URL in Google Chrome on your Android phone.
                </li>
                <li>
                  <strong>Add to Home Screen:</strong> Tap Chrome menu (⋮) → "Add to Home screen". NDÛZAVÉL will install like a native Android app!
                </li>
                <li>
                  <strong>On-The-Go Management:</strong> Log in as Mr. Tyler Ndu from your phone to edit projects, unlock the vault, reply to messages, and publish content.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 6. DATA SOVEREIGNTY & BACKUP */}
      {activeTab === 'backup' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0F17] border border-amber-500/20 space-y-6">
          <div className="pb-4 border-b border-slate-800">
            <h2 className="text-xl font-bold font-heading text-white">
              Data Sovereignty & Complete Ecosystem Backup
            </h2>
            <p className="text-xs text-slate-400">
              Download your entire website database, vault notes, member records, and project catalog in a single portable JSON file.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <HardDriveDownload className="w-4 h-4 text-amber-400" />
                <span>Export Ecosystem JSON</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Generate an immediate snapshot of your profile, all projects, private vault items, announcements, and contact messages.
              </p>
              <button
                onClick={handleExportJSON}
                className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md"
              >
                Download Complete JSON
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-sky-400" />
                <span>Restore Ecosystem from JSON</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Upload a previous NDÛZAVÉL JSON backup to restore all content and vault documents.
              </p>
              <label className="inline-block px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 cursor-pointer">
                <span>Select JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJSON}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 7. FULL SOURCE CODE EXPLORER */}
      {activeTab === 'source' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0F17] border border-amber-500/30 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
                <Code className="w-4 h-4" />
                <span>Complete Codebase & Architecture</span>
              </div>
              <h2 className="text-xl font-bold font-heading text-white">
                NDÛZAVÉL Source Code Repository
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect, copy, or download any component of this platform directly in your browser or phone.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const currentFile = SOURCE_FILES.find((f) => f.filename === selectedSourceFile) || SOURCE_FILES[0];
                  navigator.clipboard.writeText(currentFile.content);
                  setCopiedSource(true);
                  setTimeout(() => setCopiedSource(false), 2000);
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-amber-400 hover:bg-amber-300 text-black flex items-center gap-1.5 transition-colors shadow-md"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{copiedSource ? 'Code Copied!' : 'Copy Current File'}</span>
              </button>

              <button
                onClick={() => {
                  const currentFile = SOURCE_FILES.find((f) => f.filename === selectedSourceFile) || SOURCE_FILES[0];
                  const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = currentFile.filename;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                Download File
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* File List */}
            <div className="lg:col-span-4 space-y-2">
              <span className="text-[11px] font-mono uppercase text-slate-400 tracking-wider">
                Project Files ({SOURCE_FILES.length})
              </span>
              <div className="space-y-1">
                {SOURCE_FILES.map((file) => (
                  <button
                    key={file.filename}
                    onClick={() => setSelectedSourceFile(file.filename)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      selectedSourceFile === file.filename
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-200'
                        : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <p className="font-mono font-semibold text-white">{file.path}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{file.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Viewer */}
            <div className="lg:col-span-8">
              {(() => {
                const currentFile = SOURCE_FILES.find((f) => f.filename === selectedSourceFile) || SOURCE_FILES[0];
                return (
                  <div className="rounded-2xl border border-slate-800 bg-[#07090E] overflow-hidden">
                    <div className="px-4 py-2.5 bg-[#0B0F18] border-b border-slate-800 flex items-center justify-between text-xs font-mono">
                      <span className="text-amber-400">{currentFile.path}</span>
                      <span className="text-slate-500 uppercase">{currentFile.language}</span>
                    </div>
                    <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px] leading-relaxed select-all">
                      <code>{currentFile.content}</code>
                    </pre>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
