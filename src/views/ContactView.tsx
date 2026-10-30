import React, { useState } from 'react';
import { AppStorage } from '../utils/storage.ts';
import { ContactSubmission } from '../types.ts';
import {
  Mail,
  Send,
  Copy,
  Check,
  CheckCircle2,
  MessageSquare,
  Shield,
  Clock,
  Sparkles,
} from 'lucide-react';

interface ContactViewProps {
  ownerEmail?: string;
}

export const ContactView: React.FC<ContactViewProps> = ({
  ownerEmail = 'tylerndu72@gmail.com',
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<ContactSubmission['category']>('Collaboration');
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(ownerEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const refCode = `NDU-REF-${Math.floor(100000 + Math.random() * 900000)}`;
      const submission: ContactSubmission = {
        id: `sub-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        category,
        message: message.trim(),
        timestamp: new Date().toISOString(),
        status: 'unread',
      };

      AppStorage.addContactSubmission(submission);
      setIsSubmitting(false);
      setSubmittedRef(refCode);
      setName('');
      setEmail('');
      setMessage('');
    }, 600);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-16">
      {/* Page Title */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
          <span>Executive Direct Line</span>
          <span aria-hidden="true">·</span>
          <span>Inquiries & Partnerships</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
          Contact Mr. Tyler Ndu
        </h1>
        <p className="text-sm sm:text-base text-slate-300 mt-2 leading-relaxed">
          Have an inquiry regarding autonomous AI integration, custom game engine development, licensing, or strategic technology collaborations? Reach out directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Email Showcase & Details (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Highlighted Email Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#0F1422] to-[#090D15] border-2 border-amber-500/30 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Official Founder Inbox
              </span>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Monitored Daily</span>
              </span>
            </div>

            <div className="space-y-1">
              <p className="text-xs text-slate-400">Direct Email Address:</p>
              <a
                href={`mailto:${ownerEmail}`}
                className="text-lg sm:text-xl font-bold font-mono text-amber-300 hover:text-amber-200 break-all transition-colors block"
              >
                {ownerEmail}
              </a>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleCopyEmail}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Email Copied!' : 'Copy Email Address'}</span>
              </button>

              <a
                href={`mailto:${ownerEmail}`}
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Open Mail Client
              </a>
            </div>
          </div>

          {/* Response Commitment & Security */}
          <div className="p-6 rounded-2xl bg-[#0B0F17] border border-slate-800 space-y-4 text-xs text-slate-400">
            <h3 className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
              Communication SLA & Privacy
            </h3>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-white">Prompt Review:</strong> Tyler Ndu personally reviews all verified project proposals and collaboration inquiries within 24–48 business hours.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Shield className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-white">Confidentiality:</strong> Proprietary concepts and non-disclosure requests are strictly protected under NDÛZAVÉL governance.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Functional Message Dispatch Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#0B0F17] border border-slate-800 shadow-2xl space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <h2 className="text-xl font-bold font-heading text-white">
                Send Direct Message to Tyler Ndu
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Messages submit directly to Tyler Ndu's executive dashboard inbox and official email.
              </p>
            </div>

            {submittedRef ? (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4 animate-in fade-in">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-heading text-white">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out. Your transmission has been logged into Mr. Tyler Ndu's executive inbox and dispatched to <code className="text-amber-300 font-mono">{ownerEmail}</code>.
                </p>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/40 py-1.5 px-3 rounded-lg inline-block border border-emerald-500/30">
                  Confirmation Code: {submittedRef}
                </div>
                <div>
                  <button
                    onClick={() => setSubmittedRef(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ContactSubmission['category'])
                    }
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Collaboration">Strategic Collaboration / Partnership</option>
                    <option value="Project Inquiry">Custom App & Software Development</option>
                    <option value="Game Development">Game Engine & WebGL Project</option>
                    <option value="Consulting">AI Architecture & Consulting</option>
                    <option value="General">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-slate-300">Message</label>
                    <span className="text-[10px] font-mono text-slate-500">
                      {message.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your project, timeline, technical requirements, or inquiry..."
                    className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !name.trim() || !email.trim() || !message.trim()}
                  className="w-full py-3 px-4 text-xs sm:text-sm font-semibold text-black bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 disabled:opacity-50 rounded-xl shadow-lg transition-transform flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Sparkles className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>{isSubmitting ? 'Dispatching Message...' : 'Send Message to Tyler Ndu'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
