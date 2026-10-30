import React, { useState } from 'react';
import { OwnerProfile, SkillItem, AchievementItem } from '../types.ts';
import {
  Mail,
  Award,
  Terminal,
  Cpu,
  Gamepad2,
  Layers,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

interface AboutViewProps {
  owner: OwnerProfile;
  isOwner: boolean;
  onSaveProfile: (profile: OwnerProfile) => void;
  onOpenContact: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  owner,
  isOwner,
  onSaveProfile,
  onOpenContact,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<OwnerProfile>(owner);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit Handlers
  const handleSkillChange = (idx: number, field: keyof SkillItem, val: string | number) => {
    const updated = [...formData.skills];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData({ ...formData, skills: updated });
  };

  const handleAddSkill = () => {
    setFormData({
      ...formData,
      skills: [
        ...formData.skills,
        { name: 'New Competency', level: 90, category: 'App Engineering' },
      ],
    });
  };

  const handleRemoveSkill = (idx: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== idx),
    });
  };

  const handleAchievementChange = (
    idx: number,
    field: keyof AchievementItem,
    val: string
  ) => {
    const updated = [...formData.achievements];
    updated[idx] = { ...updated[idx], [field]: val };
    setFormData({ ...formData, achievements: updated });
  };

  const handleAddAchievement = () => {
    setFormData({
      ...formData,
      achievements: [
        {
          year: new Date().getFullYear().toString(),
          title: 'New Milestone',
          description: 'Key breakthrough or architectural accomplishment',
          impact: 'Measurable metric or community outcome',
        },
        ...formData.achievements,
      ],
    });
  };

  const handleRemoveAchievement = (idx: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== idx),
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-24">
      {/* Top Banner with Edit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            <span>Founder & Architect</span>
            <span aria-hidden="true">·</span>
            <span>Executive Biography</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            About Mr. Tyler Ndu
          </h1>
        </div>

        {/* Quick Edit Trigger for Owner or Testing */}
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>Biography updated</span>
            </span>
          )}
          <button
            onClick={() => {
              setFormData(owner);
              setIsEditing(!isEditing);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
              isEditing
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
            }`}
          >
            {isEditing ? <X className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
            <span>{isEditing ? 'Cancel Editing' : 'Edit Profile & Skills'}</span>
          </button>
        </div>
      </div>

      {/* EDIT MODAL / INLINE EDITOR */}
      {isEditing && (
        <form
          onSubmit={handleFormSubmit}
          className="p-6 sm:p-8 rounded-2xl bg-[#0F1420] border-2 border-amber-500/40 shadow-2xl space-y-6 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="text-lg font-bold font-heading text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-amber-400" />
              <span>Owner Content Management: Edit Mr. Tyler Ndu's Biography</span>
            </h3>
            <span className="text-xs text-amber-400 font-mono">No Code Required</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Executive Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Direct Contact Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Photo Image URL or Path</label>
              <input
                type="text"
                value={formData.photoUrl}
                onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400 font-mono text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Biography</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Vision Statement</label>
            <textarea
              rows={3}
              value={formData.vision}
              onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-amber-400"
              required
            />
          </div>

          {/* Edit Skills */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Skills & Competencies</h4>
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-500/10 rounded border border-amber-500/30 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Skill</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleSkillChange(idx, 'name', e.target.value)}
                    placeholder="Skill name"
                    className="flex-1 px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white"
                  />
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={skill.level}
                    onChange={(e) => handleSkillChange(idx, 'level', parseInt(e.target.value) || 50)}
                    className="w-20 px-2 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-400"
                    aria-label={`Remove skill ${skill.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Edit Achievements */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-white">Verified Career Achievements</h4>
              <button
                type="button"
                onClick={handleAddAchievement}
                className="px-2.5 py-1 text-xs font-medium text-amber-300 bg-amber-500/10 rounded border border-amber-500/30 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Achievement</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.achievements.map((ach, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={ach.year}
                      onChange={(e) => handleAchievementChange(idx, 'year', e.target.value)}
                      placeholder="Year"
                      className="w-24 px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-amber-400 font-mono"
                    />
                    <input
                      type="text"
                      value={ach.title}
                      onChange={(e) => handleAchievementChange(idx, 'title', e.target.value)}
                      placeholder="Achievement Title"
                      className="flex-1 px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-white font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveAchievement(idx)}
                      className="p-1 text-slate-400 hover:text-rose-400"
                      aria-label="Remove achievement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={ach.description}
                    onChange={(e) => handleAchievementChange(idx, 'description', e.target.value)}
                    placeholder="Description"
                    className="w-full px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-slate-300"
                  />
                  <input
                    type="text"
                    value={ach.impact}
                    onChange={(e) => handleAchievementChange(idx, 'impact', e.target.value)}
                    placeholder="Impact or measurable outcome"
                    className="w-full px-2 py-1 text-xs bg-slate-800 border border-slate-700 rounded text-emerald-400 font-mono text-[11px]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 shadow-md"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Publish Changes</span>
            </button>
          </div>
        </form>
      )}

      {/* Main Biography Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Portrait & Quick Credentials */}
        <div className="lg:col-span-5 space-y-6">
          <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/30 bg-[#0E131F] shadow-2xl">
            <img
              src={owner.photoUrl || '/src/assets/images/hero_tyler_ndu_1793347989778.jpg'}
              alt={owner.name}
              referrerPolicy="no-referrer"
              className="w-full aspect-[4/5] object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-black/60 backdrop-blur-md border border-amber-500/30">
              <p className="text-xs font-mono text-amber-400">Official Founder Identity</p>
              <h2 className="text-xl font-bold font-heading text-white">{owner.name}</h2>
              <p className="text-xs text-slate-300">{owner.title}</p>
            </div>
          </div>

          {/* Contact & Social Card */}
          <div className="p-6 rounded-2xl bg-[#0D121D] border border-slate-800 space-y-4">
            <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
              Direct Contact & Channels
            </h3>
            <div className="space-y-2 text-xs">
              <a
                href={`mailto:${owner.email}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400 hover:text-amber-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-amber-400" />
                  <span className="font-mono">{owner.email}</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>

              <button
                onClick={onOpenContact}
                className="w-full py-2.5 px-3 rounded-lg text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 transition-colors text-center"
              >
                Open Direct Message Form
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Narrative, Vision & Interactive Skill Matrix */}
        <div className="lg:col-span-7 space-y-10">
          {/* Executive Biography */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <span>Biography & Background</span>
            </div>
            <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
              {owner.bio}
            </p>
          </div>

          {/* Founder Vision */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-[#0E131F] to-sky-500/10 border border-amber-500/20 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <span>The NDÛZAVÉL Vision</span>
            </div>
            <blockquote className="text-sm sm:text-base text-slate-200 italic leading-relaxed">
              "{owner.vision}"
            </blockquote>
            <p className="text-xs text-amber-400 font-semibold text-right">— Mr. Tyler Ndu</p>
          </div>

          {/* Interactive Skill Matrix */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
                <Cpu className="w-4 h-4" />
                <span>Technical Mastery & Proficiency</span>
              </div>
            </div>

            <div className="space-y-3">
              {owner.skills.map((skill, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-white">{skill.name}</span>
                    <span className="font-mono text-amber-400 tabular-nums">{skill.level}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-sky-400 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Achievements & Milestones */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400">
              <Award className="w-4 h-4" />
              <span>Verified Career Achievements</span>
            </div>

            <div className="space-y-4">
              {owner.achievements.map((ach, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#0D121D] border border-slate-800 hover:border-amber-500/30 transition-colors space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <h3 className="font-bold text-white text-sm">{ach.title}</h3>
                    <span className="font-mono text-amber-400 text-xs">{ach.year}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{ach.description}</p>
                  <p className="text-[11px] font-mono text-emerald-400 pt-1 flex items-center gap-1">
                    <span>Impact:</span>
                    <span>{ach.impact}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
