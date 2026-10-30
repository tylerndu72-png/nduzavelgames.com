import React, { useState, useRef, useEffect } from 'react';
import { Project, ProjectCategory } from '../types.ts';
import {
  Sparkles,
  Gamepad2,
  Code2,
  BookOpen,
  Send,
  Play,
  RotateCcw,
  Sliders,
  ChevronRight,
  ExternalLink,
  Zap,
  Shield,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface StudioViewProps {
  projects: Project[];
  onOpenContact: () => void;
}

export const StudioView: React.FC<StudioViewProps> = ({ projects, onOpenContact }) => {
  const [activeTab, setActiveTab] = useState<'all' | ProjectCategory | 'tutorials'>('all');
  const [selectedTool, setSelectedTool] = useState<'neural-ai' | 'hexarun-game' | 'tutorials'>('neural-ai');

  // Neural Assistant Playground State
  const [neuralPersona, setNeuralPersona] = useState<'architect' | 'gaming' | 'quant'>('architect');
  const [temperature, setTemperature] = useState(0.7);
  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiResponses, setAiResponses] = useState<
    { role: 'user' | 'assistant'; text: string; latency?: string }[]
  >([
    {
      role: 'assistant',
      text: 'Greetings. I am the Ndûzavél Neural Inference Assistant, trained on Tyler Ndu\'s engineering specifications. Ask me to architect a system, generate WebGL game logic, or analyze performance bottlenecks.',
      latency: '24ms',
    },
  ]);

  // HexaRun Game State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [gameScore, setGameScore] = useState(0);
  const [gameHighScore, setGameHighScore] = useState(() => {
    return parseInt(localStorage.getItem('nduzavel_hexarun_highscore') || '420');
  });

  // Game internal refs for 60fps loop
  const gameRef = useRef({
    playerX: 200,
    playerWidth: 32,
    playerHeight: 20,
    speed: 4,
    score: 0,
    obstacles: [] as { x: number; y: number; width: number; height: number; passed: boolean }[],
    dataCores: [] as { x: number; y: number; size: number; collected: boolean }[],
    keys: { left: false, right: false },
    animationId: 0,
    lastSpawn: 0,
  });

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim() || isGenerating) return;

    const userText = promptInput.trim();
    setPromptInput('');
    setAiResponses((prev) => [...prev, { role: 'user', text: userText }]);
    setIsGenerating(true);

    setTimeout(() => {
      let responseText = '';
      if (neuralPersona === 'architect') {
        responseText = `[Ndûzavél Architecture Synthesis]:
For "${userText}", Mr. Tyler Ndu recommends a decoupled sovereign micro-layer:
1. State Orchestrator: Local client cache with BroadcastChannel multi-tab sync.
2. Edge Gateway: Cloudflare / Vercel Edge with zero server cold-start.
3. Vault Cryptography: Salted XOR dynamic hashing with client-side zero-knowledge isolation.
4. Estimated Throughput: >12,000 req/sec at zero cloud infrastructure cost.`;
      } else if (neuralPersona === 'gaming') {
        responseText = `[HexaRun Cyber Lore & Vector Scripting]:
Analyzing entity parameters for "${userText}":
- Collision Mesh: Axis-Aligned Bounding Box (AABB) with spatial partitioning.
- Neon Shader Matrix: Electric Cyan (#38BDF8) + Radiant Amber (#F59E0B) rim glow.
- Particle Physics: 60fps Euler integration without external engine overhead.`;
      } else {
        responseText = `[Algorithmic Optimizer]:
Benchmark results for query: "${userText}":
- Memory Footprint: Reduced by 42.8% via typed Uint8Array buffers.
- Execution Latency: 1.42ms average.
- Invariant Status: All cryptographic constraints validated.`;
      }

      setAiResponses((prev) => [
        ...prev,
        { role: 'assistant', text: responseText, latency: `${Math.floor(18 + Math.random() * 25)}ms` },
      ]);
      setIsGenerating(false);
    }, 700);
  };

  // Sound Synth Helper
  const playBeep = (freq: number, type: OscillatorType = 'sine', duration: number = 0.1) => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext muted/unsupported
    }
  };

  // Game Engine Loop
  const startGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    gameRef.current = {
      playerX: canvas.width / 2 - 16,
      playerWidth: 32,
      playerHeight: 20,
      speed: 4,
      score: 0,
      obstacles: [],
      dataCores: [],
      keys: { left: false, right: false },
      animationId: 0,
      lastSpawn: Date.now(),
    };

    setGameState('playing');
    setGameScore(0);
    playBeep(440, 'triangle', 0.15);

    const updateLoop = () => {
      const g = gameRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Clear & Draw Cyber Grid Background
      ctx.fillStyle = '#06080E';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid perspective lines
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Input update
      if (g.keys.left && g.playerX > 10) g.playerX -= 6;
      if (g.keys.right && g.playerX < canvas.width - g.playerWidth - 10) g.playerX += 6;

      // Spawning obstacles & data cores
      const now = Date.now();
      if (now - g.lastSpawn > Math.max(700, 1400 - g.score * 12)) {
        g.lastSpawn = now;
        const obsWidth = 40 + Math.random() * 60;
        const obsX = Math.random() * (canvas.width - obsWidth - 20) + 10;
        g.obstacles.push({
          x: obsX,
          y: -30,
          width: obsWidth,
          height: 18,
          passed: false,
        });

        // Chance to spawn gold core
        if (Math.random() > 0.4) {
          g.dataCores.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: -50,
            size: 8,
            collected: false,
          });
        }
      }

      // Move & Draw Obstacles
      for (let i = g.obstacles.length - 1; i >= 0; i--) {
        const obs = g.obstacles[i];
        obs.y += g.speed;

        // Draw obstacle with electric blue & danger orange
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.strokeStyle = '#FCA5A5';
        ctx.strokeRect(obs.x, obs.y, obs.width, obs.height);

        // Check collision with player
        const playerY = canvas.height - 40;
        if (
          g.playerX < obs.x + obs.width &&
          g.playerX + g.playerWidth > obs.x &&
          playerY < obs.y + obs.height &&
          playerY + g.playerHeight > obs.y
        ) {
          // Game Over!
          playBeep(160, 'sawtooth', 0.4);
          setGameState('gameover');
          if (g.score > gameHighScore) {
            setGameHighScore(g.score);
            localStorage.setItem('nduzavel_hexarun_highscore', g.score.toString());
          }
          return;
        }

        // Score update on pass
        if (obs.y > canvas.height && !obs.passed) {
          obs.passed = true;
          g.score += 10;
          setGameScore(g.score);
          if (g.score % 50 === 0) g.speed += 0.5;
        }

        // Cleanup
        if (obs.y > canvas.height + 40) {
          g.obstacles.splice(i, 1);
        }
      }

      // Move & Draw Data Cores
      for (let i = g.dataCores.length - 1; i >= 0; i--) {
        const core = g.dataCores[i];
        core.y += g.speed * 1.1;

        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.arc(core.x, core.y, core.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FDE68A';
        ctx.stroke();

        // Check collection
        const playerY = canvas.height - 40;
        const dist = Math.hypot(core.x - (g.playerX + g.playerWidth / 2), core.y - (playerY + g.playerHeight / 2));
        if (dist < 22 && !core.collected) {
          core.collected = true;
          g.score += 25;
          setGameScore(g.score);
          playBeep(880, 'sine', 0.1);
          g.dataCores.splice(i, 1);
          continue;
        }

        if (core.y > canvas.height + 20) {
          g.dataCores.splice(i, 1);
        }
      }

      // Draw Player Cyber Ship
      const playerY = canvas.height - 40;
      ctx.fillStyle = '#38BDF8';
      ctx.beginPath();
      ctx.moveTo(g.playerX + g.playerWidth / 2, playerY);
      ctx.lineTo(g.playerX + g.playerWidth, playerY + g.playerHeight);
      ctx.lineTo(g.playerX, playerY + g.playerHeight);
      ctx.closePath();
      ctx.fill();

      // Ship thruster glow
      ctx.fillStyle = '#F59E0B';
      ctx.beginPath();
      ctx.moveTo(g.playerX + g.playerWidth / 2 - 4, playerY + g.playerHeight);
      ctx.lineTo(g.playerX + g.playerWidth / 2 + 4, playerY + g.playerHeight);
      ctx.lineTo(g.playerX + g.playerWidth / 2, playerY + g.playerHeight + 8);
      ctx.closePath();
      ctx.fill();

      g.animationId = requestAnimationFrame(updateLoop);
    };

    g.animationId = requestAnimationFrame(updateLoop);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a') gameRef.current.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd') gameRef.current.keys.right = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a') gameRef.current.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd') gameRef.current.keys.right = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(gameRef.current.animationId);
    };
  }, [gameState]);

  // Filtered projects
  const filteredProjects =
    activeTab === 'all'
      ? projects
      : activeTab === 'tutorials'
      ? []
      : projects.filter((p) => p.category === activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16 pb-24">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
            <span>NDÛZAVÉL Engineering Suite</span>
            <span aria-hidden="true">·</span>
            <span>Created by Tyler Ndu</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white tracking-tight">
            AI & Development Studio
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Explore live neural intelligence tools, test WebGL 60FPS game engines, browse modular applications, and review architectural documentation.
          </p>
        </div>

        {/* Studio View Selector */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            onClick={() => setSelectedTool('neural-ai')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              selectedTool === 'neural-ai'
                ? 'bg-amber-400 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Neural AI Assistant</span>
          </button>

          <button
            onClick={() => setSelectedTool('hexarun-game')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              selectedTool === 'hexarun-game'
                ? 'bg-sky-400 text-black shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>HexaRun Game</span>
          </button>

          <button
            onClick={() => setSelectedTool('tutorials')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              selectedTool === 'tutorials'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Tutorials</span>
          </button>
        </div>
      </div>

      {/* 1. INTERACTIVE LIVE DEMO CONTAINER */}
      <section className="rounded-3xl bg-[#0B0F17] border border-amber-500/20 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {selectedTool === 'neural-ai' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ndûzavél Neural Core v4 Simulator</span>
                </div>
                <h2 className="text-xl font-bold font-heading text-white">Interactive Prompt & Agent Studio</h2>
              </div>

              {/* Persona Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400 font-mono">Agent Persona:</span>
                <select
                  value={neuralPersona}
                  onChange={(e) => setNeuralPersona(e.target.value as 'architect' | 'gaming' | 'quant')}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-300 font-mono focus:border-amber-400"
                >
                  <option value="architect">Code Architect & Systems</option>
                  <option value="gaming">Game Narrative & Shader Logic</option>
                  <option value="quant">Algorithmic Optimizer</option>
                </select>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="h-64 sm:h-80 overflow-y-auto space-y-4 p-4 rounded-2xl bg-[#07090E] border border-slate-800/80">
              {aiResponses.map((res, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${res.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-xl p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      res.role === 'user'
                        ? 'bg-amber-500/20 border border-amber-500/40 text-amber-100 rounded-br-xs'
                        : 'bg-[#111624] border border-slate-800 text-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap font-sans">{res.text}</p>
                    {res.latency && (
                      <p className="text-[10px] text-amber-400/80 font-mono mt-1 text-right">
                        Latency: {res.latency}
                      </p>
                    )}
                  </div>
                </div>
              ))}
              {isGenerating && (
                <div className="flex items-center gap-2 text-xs text-amber-400 font-mono animate-pulse">
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Generating intelligent neural synthesis...</span>
                </div>
              )}
            </div>

            {/* Prompt Input Form */}
            <form onSubmit={handlePromptSubmit} className="flex gap-2">
              <input
                type="text"
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                placeholder="Ask Neural Core: 'How do I optimize WebGL draw calls?' or 'Outline autonomous agent flow'..."
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                disabled={isGenerating || !promptInput.trim()}
                className="px-5 py-2.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Send</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {selectedTool === 'hexarun-game' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-sky-400">
                  <Gamepad2 className="w-3.5 h-3.5" />
                  <span>HexaRun: Cyber Vector (Interactive Mini-Game)</span>
                </div>
                <h2 className="text-xl font-bold font-heading text-white">Playable WebGL Canvas Engine</h2>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400">Score: </span>
                  <span className="text-amber-400 font-bold text-sm tabular-nums">{gameScore}</span>
                </div>
                <div>
                  <span className="text-slate-400">High Score: </span>
                  <span className="text-sky-400 font-bold text-sm tabular-nums">{gameHighScore}</span>
                </div>
              </div>
            </div>

            {/* Game Canvas Container */}
            <div className="relative flex flex-col items-center">
              <div className="relative rounded-2xl overflow-hidden border-2 border-sky-500/30 bg-[#06080E] shadow-2xl">
                <canvas
                  ref={canvasRef}
                  width={420}
                  height={320}
                  className="max-w-full h-auto block"
                />

                {/* Game Overlay */}
                {gameState === 'idle' && (
                  <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-4">
                    <h3 className="text-2xl font-bold font-heading text-white">HEXARUN CYBER VECTOR</h3>
                    <p className="text-xs text-slate-300 max-w-xs">
                      Steer your cyber vector ship. Dodge red data walls and collect glowing amber cores!
                    </p>
                    <button
                      onClick={startGame}
                      className="px-6 py-2.5 text-sm font-bold text-black bg-sky-400 hover:bg-sky-300 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                    >
                      <Play className="w-4 h-4" />
                      <span>Start Game (A/D or Touch)</span>
                    </button>
                  </div>
                )}

                {gameState === 'gameover' && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center space-y-3">
                    <h3 className="text-2xl font-bold font-heading text-rose-400">SYSTEM BREACH: GAME OVER</h3>
                    <p className="text-sm font-mono text-white">
                      Final Score: <span className="text-amber-400 font-bold">{gameScore}</span>
                    </p>
                    <button
                      onClick={startGame}
                      className="px-6 py-2.5 text-xs font-semibold text-black bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Play Again</span>
                    </button>
                  </div>
                )}
              </div>

              {/* On-screen touch buttons for mobile Android players */}
              <div className="flex items-center justify-center gap-4 mt-4 w-full max-w-sm">
                <button
                  onMouseDown={() => (gameRef.current.keys.left = true)}
                  onMouseUp={() => (gameRef.current.keys.left = false)}
                  onTouchStart={() => (gameRef.current.keys.left = true)}
                  onTouchEnd={() => (gameRef.current.keys.left = false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 active:bg-sky-500/30 text-white font-bold rounded-xl border border-slate-700 text-sm select-none"
                >
                  ◀ STEER LEFT
                </button>
                <button
                  onMouseDown={() => (gameRef.current.keys.right = true)}
                  onMouseUp={() => (gameRef.current.keys.right = false)}
                  onTouchStart={() => (gameRef.current.keys.right = true)}
                  onTouchEnd={() => (gameRef.current.keys.right = false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 active:bg-sky-500/30 text-white font-bold rounded-xl border border-slate-700 text-sm select-none"
                >
                  STEER RIGHT ▶
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedTool === 'tutorials' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Knowledge Base & Tutorials</span>
              </div>
              <h2 className="text-xl font-bold font-heading text-white">
                Engineering Blueprints by Tyler Ndu
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-amber-400">Tutorial 01 · Hosting</span>
                <h4 className="text-base font-bold text-white">Zero-Cost Cloud Deployment</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  How to deploy NDÛZAVÉL to Vercel, Netlify, or Firebase on the 100% free tier with custom domain DNS mapping.
                </p>
                <div className="pt-2 text-xs text-sky-400 font-medium">Read Full Guide →</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-sky-400">Tutorial 02 · Cryptography</span>
                <h4 className="text-base font-bold text-white">Browser Vault Encryption</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Implementing master PIN validation and salted XOR ciphering to guarantee user data never leaks to servers.
                </p>
                <div className="pt-2 text-xs text-sky-400 font-medium">Read Full Guide →</div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <span className="text-xs font-mono text-emerald-400">Tutorial 03 · Gaming</span>
                <h4 className="text-base font-bold text-white">60FPS Canvas Physics</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Eliminating garbage collection pauses in mobile HTML5 canvas engines using object pools and requestAnimationFrame.
                </p>
                <div className="pt-2 text-xs text-sky-400 font-medium">Read Full Guide →</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 2. PROJECT CATALOG & FILTERS */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-1">
              <span>Full Portfolio Catalog</span>
            </div>
            <h2 className="text-2xl font-bold font-heading text-white">Explore All Innovations</h2>
          </div>

          {/* Interactive Filter Tabs (Zero-pill button style) */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
            {(['all', 'Apps', 'AI Tools', 'Gaming', 'Websites'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === cat
                    ? 'bg-amber-400 text-black font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'All Projects' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div
              key={p.id}
              className="group rounded-2xl bg-[#0D121D] border border-slate-800 hover:border-amber-500/40 transition-all flex flex-col justify-between overflow-hidden"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                <img
                  src={p.coverImage}
                  alt={p.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D121D] via-transparent to-transparent opacity-80" />
              </div>

              <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  {/* Clean unboxed metadata with dot separators */}
                  <div className="flex items-center gap-2 text-xs text-amber-400 font-mono">
                    <span>{p.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">{p.status}</span>
                    {p.metrics?.rating && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="text-amber-300 font-semibold">{p.metrics.rating}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-lg font-bold font-heading text-white group-hover:text-amber-300 transition-colors">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {p.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-mono text-[11px]">
                    {p.tags.slice(0, 2).join(' · ')}
                  </span>
                  <button
                    onClick={() => {
                      if (p.category === 'AI Tools') setSelectedTool('neural-ai');
                      else if (p.category === 'Gaming') setSelectedTool('hexarun-game');
                      window.scrollTo({ top: 300, behavior: 'smooth' });
                    }}
                    className="text-amber-400 font-medium hover:text-amber-300 flex items-center gap-1"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
