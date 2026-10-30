import React from 'react';
import { Mail, Shield, Terminal, ArrowUp } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#05070A] border-t border-slate-800/80 pt-16 pb-24 lg:pb-16 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand & Ownership Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight font-heading text-white">
                <span className="text-amber-400">NDÛ</span>
                <span className="text-sky-400">ZAVÉL</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Apps · AI & Gaming
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md text-sm">
              The sovereign digital headquarters and innovation lab created and owned by{' '}
              <strong className="text-amber-300 font-medium">Mr. Tyler Ndu</strong>. Empowering independent software engineering, autonomous neural agents, immersive WebGL gaming, and zero-knowledge digital vaults.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-slate-300">
              <a
                href="mailto:tylerndu72@gmail.com"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>tylerndu72@gmail.com</span>
              </a>
              <span className="text-slate-600">·</span>
              <span className="text-amber-400/90 font-mono text-xs">nduzaveltech.com</span>
              <span className="text-slate-600">·</span>
              <span className="text-slate-400">Mobile & Web Sovereign Platform</span>
            </div>
          </div>

          {/* Quick Ecosystem Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Ecosystem
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('studio')}
                  className="hover:text-amber-300 transition-colors"
                >
                  AI & Development Studio
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('studio')}
                  className="hover:text-amber-300 transition-colors"
                >
                  HexaRun Cyber Game
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('community')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Real-time Community Chat
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('vault')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Private Digital Vault
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-amber-300 transition-colors"
                >
                  About Tyler Ndu
                </button>
              </li>
            </ul>
          </div>

          {/* Governance & Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Security & Legal
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-amber-300 transition-colors">
                  Privacy Policy & Data Rights
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-amber-300 transition-colors">
                  Terms of Service & Licensing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-amber-300 transition-colors"
                >
                  Contact Mr. Tyler Ndu
                </button>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-emerald-400/90">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Sovereign Storage Architecture</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <span>© {new Date().getFullYear()} NDÛZAVÉL. Owned and operated by Mr. Tyler Ndu.</span>
            <span aria-hidden="true">·</span>
            <span>All rights reserved.</span>
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-900"
            aria-label="Scroll to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
