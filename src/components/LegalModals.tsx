import React from 'react';
import { X, Shield, Lock, FileText } from 'lucide-react';

interface LegalModalProps {
  type: 'privacy' | 'terms' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-2xl bg-[#0D121D] border border-amber-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-300 max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              {type === 'privacy' ? <Shield className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold font-heading text-white">
                {type === 'privacy' ? 'NDÛZAVÉL Privacy Policy' : 'NDÛZAVÉL Terms of Service'}
              </h3>
              <p className="text-xs text-slate-400">Owner & Governance: Mr. Tyler Ndu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto py-6 space-y-4 text-xs leading-relaxed text-slate-300 pr-2">
          {type === 'privacy' ? (
            <>
              <p className="text-sm font-semibold text-white">1. Data Sovereignty & Zero-Telemetry Commitment</p>
              <p>
                NDÛZAVÉL, established and operated by Mr. Tyler Ndu, is architected from the ground up on the principle of sovereign data ownership. We do not sell, license, or monetize your personal information to third-party ad networks or data brokers.
              </p>

              <p className="text-sm font-semibold text-white">2. Private Digital Vault Security</p>
              <p>
                The Private Digital Vault stores high-security credentials, project notes, and proprietary blue-prints with client-side obfuscation. Secrets stored inside the vault require the Owner's master PIN for decryption and are never transmitted in plaintext across third-party networks.
              </p>

              <p className="text-sm font-semibold text-white">3. User Accounts & Communications</p>
              <p>
                Member account credentials, community messages, and direct messages are processed exclusively for ecosystem interaction, community moderation, and security integrity. You may export or delete your personal account data at any time through your Member Dashboard.
              </p>

              <p className="text-sm font-semibold text-white">4. Direct Contact Inquiries</p>
              <p>
                Direct inquiries sent to <code className="text-amber-300">tylerndu72@gmail.com</code> via the website contact form are encrypted in transit and routed directly into Mr. Tyler Ndu's executive inbox.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold text-white">1. Platform Ownership & Intellectual Property</p>
              <p>
                All proprietary applications, artificial intelligence algorithms, Neural Core frameworks, HexaRun game mechanics, and graphical assets on NDÛZAVÉL are the exclusive intellectual property of Mr. Tyler Ndu.
              </p>

              <p className="text-sm font-semibold text-white">2. Community Standards & Acceptable Use</p>
              <p>
                Community chat channels (#general-tech, #gaming-zone, #ai-lab) are designated for professional engineering discussions, game development, and collaborative feedback. Hate speech, abusive behavior, spamming, and distribution of malicious code are strictly prohibited and will result in immediate suspension by moderators.
              </p>

              <p className="text-sm font-semibold text-white">3. Software & Interactive Tool Demos</p>
              <p>
                The interactive simulators, code playgrounds, and game previews are provided for demonstration, testing, and developer evaluation. Production licensing inquiries should be directed to Mr. Tyler Ndu at <code className="text-amber-300">tylerndu72@gmail.com</code>.
              </p>

              <p className="text-sm font-semibold text-white">4. Sovereign Hosting & Expandability</p>
              <p>
                This platform is architected to be 100% self-contained and expandable with zero vendor lock-in. Full JSON backups can be exported and imported at will by the owner.
              </p>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
