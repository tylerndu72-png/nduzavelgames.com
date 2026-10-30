import React from 'react';
import { Project, SiteAnnouncement, OwnerProfile } from '../types.ts';
import {
  ArrowRight,
  Sparkles,
  Gamepad2,
  Layers,
  Shield,
  Zap,
  Terminal,
  Cpu,
  Mail,
  ChevronRight,
} from 'lucide-react';

interface HomeViewProps {
  owner: OwnerProfile;
  projects: Project[];
  announcements: SiteAnnouncement[];
  onNavigate: (view: string) => void;
  onOpenContact: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  owner,
  projects,
  announcements,
  onNavigate,
  onOpenContact,
}) => {
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 3);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. Split-Screen Hero Section (Frontend-Design §2.B & §4) */}
      <section className="relative pt-8 sm:pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Typographic Hierarchy */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>The Sovereign Tech Platform · Founded by Mr. Tyler Ndu</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-white tracking-tight leading-[1.08] text-balance">
                Architecting the Future of{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-sky-400 bg-clip-text text-transparent">
                  Apps, AI & Gaming.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Welcome to <strong className="text-white font-semibold">NDÛZAVÉL</strong>. An independent technology ecosystem uniting autonomous artificial intelligence agents, high-octane real-time WebGL games, cross-platform mobile apps, and zero-knowledge digital vaults under sovereign owner control.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('studio')}
                  className="px-6 py-3.5 text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Explore AI & Studio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => onNavigate('about')}
                  className="px-6 py-3.5 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/40 rounded-xl transition-all flex items-center gap-2"
                >
                  <span>Meet Tyler Ndu</span>
                </button>
              </div>

              {/* Direct email line */}
              <div className="pt-2 flex items-center gap-3 text-xs text-slate-400">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>Official Direct Line:</span>
                <a
                  href="mailto:tylerndu72@gmail.com"
                  className="text-amber-300 hover:underline font-mono"
                >
                  tylerndu72@gmail.com
                </a>
              </div>
            </div>

            {/* Right Column: Large Founder Visual Frame */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-[#0E131F] shadow-2xl group">
                <div className="aspect-[4/5] sm:aspect-square lg:aspect-[4/5] w-full overflow-hidden">
                  <img
                    src={owner.photoUrl || '/src/assets/images/hero_tyler_ndu_1793347989778.jpg'}
                    alt="Mr. Tyler Ndu, Founder of NDÛZAVÉL"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-700"
                  />
                  {/* Subtle lighting overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-transparent opacity-80" />
                </div>

                {/* Founder Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                    <span>Founder & Lead Architect</span>
                    <span aria-hidden="true">·</span>
                    <span>NDÛZAVÉL</span>
                  </div>
                  <h3 className="text-xl font-bold font-heading text-white">{owner.name}</h3>
                  <p className="text-xs text-slate-300 line-clamp-2">{owner.title}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width KPI strip below the split (§2.B) */}
          <div className="mt-16 pt-8 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight tabular-nums">
                12<span className="text-amber-400">+</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Proprietary Innovations</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight tabular-nums">
                60<span className="text-sky-400">FPS</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Real-Time Canvas Gaming</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight tabular-nums">
                100<span className="text-amber-400">%</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Sovereign Owner Control</p>
            </div>
            <div className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white tracking-tight tabular-nums">
                Zero<span className="text-emerald-400">Key</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Encrypted Vault Privacy</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Bento Grid of Featured Works & Applications */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
              <span>Selected Works</span>
              <span aria-hidden="true">·</span>
              <span>Proprietary Releases</span>
            </div>
            <h2 className="text-3xl font-bold font-heading text-white tracking-tight">
              Featured Apps, AI Systems & Gaming
            </h2>
          </div>
          <button
            onClick={() => onNavigate('studio')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors group"
          >
            <span>Explore All in Studio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Dynamic Bento Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProjects.map((project, idx) => (
            <div
              key={project.id}
              onClick={() => onNavigate('studio')}
              className={`group cursor-pointer rounded-2xl bg-[#0D121D] border border-slate-800 hover:border-amber-500/40 transition-all duration-300 overflow-hidden flex flex-col justify-between ${
                idx === 0 ? 'md:col-span-2' : 'md:col-span-1'
              }`}
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={project.coverImage}
                  alt={project.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D121D] via-transparent to-transparent opacity-90" />
              </div>

              <div className="p-6 space-y-3">
                {/* Zero-Pill Unboxed Metadata (Frontend Design §1.A) */}
                <div className="flex items-center gap-2 text-xs text-amber-400/90 font-mono">
                  <span>{project.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-400">{project.status}</span>
                  {project.metrics?.performance && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="text-sky-400">{project.metrics.performance}</span>
                    </>
                  )}
                </div>

                <h3 className="text-xl font-bold font-heading text-white group-hover:text-amber-300 transition-colors">
                  {project.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                <div className="pt-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-400">
                    {project.tags.slice(0, 3).join(' · ')}
                  </div>
                  <span className="text-amber-400 font-medium group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Launch</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Core Ecosystem Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-[#0F1422] to-[#090D15] border border-amber-500/20 shadow-2xl space-y-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
              <span>Platform Capabilities</span>
              <span aria-hidden="true">·</span>
              <span>Engineered by Tyler Ndu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
              An End-to-End Technology Stack Built for Sovereignty
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-white">Autonomous AI & Inference</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                High-performance neural agent architectures, context orchestrators, and prompt test studios designed for developer efficiency and sub-second reasoning.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-white">Real-Time Gaming & Vector Engines</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Hardware-accelerated HTML5 canvas runners and WebGL mini-games crafted with custom physics pipelines that execute smoothly on mobile and desktop without installs.
              </p>
            </div>

            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold font-heading text-white">Private Digital Vault</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                A personal digital fortress protecting proprietary algorithms, financial documents, API credentials, and patent drafts with master PIN lock and zero-knowledge storage.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Latest Announcements & Tech Dispatches */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
              <span>Dispatches & Updates</span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">Latest Releases & Notes</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className="p-6 rounded-2xl bg-[#0B0F17] border border-slate-800/80 hover:border-amber-500/30 transition-all space-y-3"
            >
              {/* Zero-Pill Unboxed Metadata */}
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                <span className="text-amber-400">{ann.category}</span>
                <span aria-hidden="true">·</span>
                <span>{ann.date}</span>
                <span aria-hidden="true">·</span>
                <span>{ann.readTime}</span>
              </div>
              <h3 className="text-base font-semibold text-white">{ann.title}</h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{ann.summary}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Founder Call to Action */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#0E131F] to-sky-500/10 border border-amber-500/30 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            Ready to Collaborate or Build with Tyler Ndu?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
            Whether you are looking to integrate autonomous AI workflows, collaborate on futuristic game development, or license our sovereign app platforms, let's connect.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={onOpenContact}
              className="px-6 py-3 text-sm font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors shadow-lg shadow-amber-500/10"
            >
              Send Direct Message
            </button>
            <a
              href="mailto:tylerndu72@gmail.com"
              className="px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-700 hover:border-amber-400 rounded-xl transition-colors"
            >
              Email tylerndu72@gmail.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
