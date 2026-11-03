/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Network,
  Server,
  Terminal,
  Activity,
  FileCheck,
  Code,
  CheckCircle2,
  GitBranch,
  Award,
  ChevronRight,
  HardDrive
} from 'lucide-react';
import { Phase1View } from './components/Phase1View';
import { Phase2EnvironmentView } from './components/Phase2EnvironmentView';
import { Phase3FirewallView } from './components/Phase3FirewallView';
import { Phase4WazuhView } from './components/Phase4WazuhView';
import { Phase5DetectionView } from './components/Phase5DetectionView';
import { Phase6SocDashboardView } from './components/Phase6SocDashboardView';
import { Phase7IncidentResponseView } from './components/Phase7IncidentResponseView';
import { Phase8AutomationView } from './components/Phase8AutomationView';
import { Phase9TestPlanView } from './components/Phase9TestPlanView';
import { Phase10GithubDocsView } from './components/Phase10GithubDocsView';
import { Phase11InterviewCareer } from './components/Phase11InterviewCareer';
import { ExportDocsModal } from './components/ExportDocsModal';

export default function App() {
  const [activePhase, setActivePhase] = useState<number>(1);
  const [hostRamTier, setHostRamTier] = useState<'8GB' | '16GB' | '32GB'>('16GB');
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  const navigationPhases = [
    { num: 1, label: 'Phase 1: Architecture & HW', icon: Layers },
    { num: 2, label: 'Phase 2: VirtualBox & Adapters', icon: Server },
    { num: 3, label: 'Phase 3: pfSense Firewall Rules', icon: Network },
    { num: 4, label: 'Phase 4: Wazuh SIEM & Sysmon', icon: Shield },
    { num: 5, label: 'Phase 5: Attack Simulations', icon: Terminal },
    { num: 6, label: 'Phase 6: Live SOC Dashboard', icon: Activity },
    { num: 7, label: 'Phase 7: Incident Response', icon: FileCheck },
    { num: 8, label: 'Phase 8: Python Automation', icon: Code },
    { num: 9, label: 'Phase 9: Test Verification', icon: CheckCircle2 },
    { num: 10, label: 'Phase 10: GitHub Repo & Docs', icon: GitBranch },
    { num: 11, label: 'Phase 11: ATS Resume & Interview', icon: Award }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Bar Contract (Zone 1: Wordmark, Zone 2: Concise Nav, Zone 3: Primary Action) */}
      <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-base font-extrabold tracking-tight text-white block leading-none">
              Enterprise SOC Lab
            </span>
            <span className="text-[10px] font-mono text-cyan-400 leading-none">
              SIEM & Perimeter Defense Workbench
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-Line) */}
        <nav className="hidden lg:flex items-center gap-4 text-xs font-semibold text-slate-400">
          <button
            onClick={() => setActivePhase(1)}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activePhase === 1 ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Architecture
          </button>
          <button
            onClick={() => setActivePhase(3)}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activePhase === 3 ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Firewall Rules
          </button>
          <button
            onClick={() => setActivePhase(4)}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activePhase === 4 ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Wazuh SIEM
          </button>
          <button
            onClick={() => setActivePhase(5)}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activePhase === 5 ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Detections
          </button>
          <button
            onClick={() => setActivePhase(6)}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activePhase === 6 ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            SOC Console
          </button>
          <button
            onClick={() => setActivePhase(8)}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activePhase === 8 ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Automation
          </button>
          <button
            onClick={() => setActivePhase(11)}
            className={`transition-colors whitespace-nowrap shrink-0 ${
              activePhase === 11 ? 'text-cyan-400 font-bold' : 'hover:text-white'
            }`}
          >
            Resume & Q&A
          </button>
        </nav>

        {/* Zone 3: Primary Action (Host RAM Tier quick switcher) */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
            <HardDrive className="w-3.5 h-3.5 text-cyan-400 ml-1" />
            <span className="text-slate-400 text-[11px]">Host RAM:</span>
            {(['8GB', '16GB', '32GB'] as const).map(tier => (
              <button
                key={tier}
                onClick={() => setHostRamTier(tier)}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-colors ${
                  hostRamTier === tier
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold transition-all shadow-sm whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <span>Export Docs</span>
          </button>
        </div>
      </header>

      {/* Main App Layout: Sidebar + Main Content Viewport */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Phase Navigator Sidebar (3 cols) */}
        <aside className="lg:col-span-3 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-3 px-1 flex items-center justify-between">
              <span>Project Phases (1 - 11)</span>
              <span className="text-cyan-400 font-mono">P0{activePhase} Active</span>
            </div>

            <div className="space-y-1">
              {navigationPhases.map(p => {
                const IconComponent = p.icon;
                const isActive = activePhase === p.num;
                return (
                  <button
                    key={p.num}
                    onClick={() => setActivePhase(p.num)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                      isActive
                        ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 font-bold'
                        : 'text-slate-300 hover:bg-slate-800/60 hover:text-white border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <IconComponent
                        className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`}
                      />
                      <span className="truncate">{p.label}</span>
                    </div>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Mentor Info Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Cybersecurity Mentor Status
            </span>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Ready for Phase 1 review. Confirm your host specs (CPU cores, RAM, OS, VirtualBox or VMware) to begin installation steps.
            </p>
          </div>
        </aside>

        {/* Dynamic Phase Content Viewport (9 cols) */}
        <main className="lg:col-span-9 space-y-8">
          {activePhase === 1 && <Phase1View hostRamTier={hostRamTier} setHostRamTier={setHostRamTier} />}
          {activePhase === 2 && <Phase2EnvironmentView />}
          {activePhase === 3 && <Phase3FirewallView />}
          {activePhase === 4 && <Phase4WazuhView />}
          {activePhase === 5 && <Phase5DetectionView />}
          {activePhase === 6 && <Phase6SocDashboardView />}
          {activePhase === 7 && <Phase7IncidentResponseView />}
          {activePhase === 8 && <Phase8AutomationView />}
          {activePhase === 9 && <Phase9TestPlanView />}
          {activePhase === 10 && <Phase10GithubDocsView />}
          {activePhase === 11 && <Phase11InterviewCareer />}

          {/* Sequential Phase Stepper & Navigation Buttons */}
          <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            {activePhase > 1 ? (
              <button
                onClick={() => {
                  setActivePhase(prev => Math.max(1, prev - 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>← Previous: {navigationPhases[activePhase - 2]?.label.split(':')[1]}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="text-xs font-mono text-slate-500">
              Phase {activePhase} of 11
            </div>

            {activePhase < 11 ? (
              <button
                onClick={() => {
                  setActivePhase(prev => Math.min(11, prev + 1));
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Next: {navigationPhases[activePhase]?.label.split(':')[1]} →</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setActivePhase(1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Return to Phase 1 Architecture ↺</span>
              </button>
            )}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500 font-mono">
        Enterprise Network Security Lab & SIEM Monitoring Project · Built for Defensive Cyber Operations & SOC Engineering
      </footer>

      {/* Export Documentation & Lab Package Modal */}
      <ExportDocsModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        onNavigateToPhase={(num) => setActivePhase(num)}
      />
    </div>
  );
}
