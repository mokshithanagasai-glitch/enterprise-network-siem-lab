/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, ShieldAlert, Copy, Check, FileText, ChevronRight, AlertOctagon, ArrowUpRight } from 'lucide-react';
import { SECURITY_SCENARIOS, SecurityScenario } from '../data/labData';

export const Phase5DetectionView: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<SecurityScenario>(SECURITY_SCENARIOS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
          <span>Phase 5: Controlled Attack Emulation & SIEM Detection Engineering</span>
        </div>
        <h2 className="text-xl font-bold text-white">Controlled Lab Attack Scenarios & Wazuh Alert Correlation</h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Six industry-standard adversary simulations mapped to MITRE ATT&CK techniques. 
          Executed strictly inside our isolated virtual laboratory to trigger, log, and alert via Wazuh SIEM.
        </p>

        {/* Scenario Selector Chips */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SECURITY_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc)}
              className={`p-3 rounded-lg text-left transition-all border ${
                selectedScenario.id === sc.id
                  ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500 text-white'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-mono text-cyan-400 font-bold">SIM 0{idx + 1} · {sc.mitreId}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    sc.severity === 'Critical'
                      ? 'bg-red-500/20 text-red-400'
                      : sc.severity === 'High'
                      ? 'bg-rose-500/20 text-rose-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {sc.severity} (Lvl {sc.severityScore})
                </span>
              </div>
              <div className="text-xs font-bold truncate text-white">{sc.title}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Scenario Detailed Workbench */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {/* Scenario Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
              <span>Category: {selectedScenario.category}</span>
              <span>·</span>
              <span className="text-cyan-400">MITRE ATT&CK: {selectedScenario.mitreId} ({selectedScenario.mitreTactic})</span>
            </div>
            <h3 className="text-lg font-bold text-white">{selectedScenario.title}</h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Target Host:</span>
            <span className="text-xs font-mono font-bold text-white bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              {selectedScenario.target}
            </span>
          </div>
        </div>

        {/* Attack Concept & Safe Reproduction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider block">Attack Concept</span>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedScenario.concept}</p>
          </div>
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Lab Pre-Requisites</span>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedScenario.prerequisites}</p>
          </div>
        </div>

        {/* Command to Execute in Kali Linux */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-rose-400" />
              Kali Linux Execution Command (Safe Lab Emulation)
            </span>
            <button
              onClick={() => copyCode(selectedScenario.kaliCommand, 'cmd')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copiedId === 'cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'cmd' ? 'Copied' : 'Copy Command'}</span>
            </button>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-rose-400">
            {selectedScenario.kaliCommand}
          </div>

          {/* Line by Line Flag Explanation */}
          <div className="p-3.5 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Flag & Argument Explanation:</span>
            <div className="space-y-1">
              {selectedScenario.commandBreakdown.map((item, i) => (
                <div key={i} className="text-xs flex items-start gap-2">
                  <span className="font-mono text-cyan-400 shrink-0 font-semibold">{item.flag}:</span>
                  <span className="text-slate-300">{item.explanation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Raw Log & Wazuh Detection Rule */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-amber-400" />
              Generated Raw Log ({selectedScenario.expectedLogSource})
            </span>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-amber-300/90 break-all leading-relaxed overflow-x-auto">
              {selectedScenario.rawLogSample}
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              Wazuh Custom Detection Rule (Rule ID {selectedScenario.wazuhRuleId})
            </span>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
              {selectedScenario.wazuhRuleXml}
            </div>
          </div>
        </div>

        {/* Resulting Wazuh Alert JSON */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <AlertOctagon className="w-4 h-4 text-emerald-400" />
            Wazuh Alert Document (Stored in /var/ossec/logs/alerts/alerts.json & OpenSearch)
          </span>
          <pre className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-emerald-300 overflow-x-auto">
            {JSON.stringify(selectedScenario.wazuhAlertJson, null, 2)}
          </pre>
        </div>

        {/* SOC Analyst Response Recommendations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">Immediate Containment Steps:</span>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              {selectedScenario.containmentSteps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>

          <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-lg space-y-1.5">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">Permanent Remediation Steps:</span>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
              {selectedScenario.remediationSteps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
