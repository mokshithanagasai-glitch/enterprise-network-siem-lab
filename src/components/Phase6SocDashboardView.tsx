/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AlertCircle, ShieldAlert, Activity, Search, Filter, Terminal, Clock, CheckCircle } from 'lucide-react';
import { SECURITY_SCENARIOS } from '../data/labData';

export const Phase6SocDashboardView: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedAlertIndex, setSelectedAlertIndex] = useState<number | null>(null);

  // Synthesize alerts from scenarios
  const alertRecords = [
    {
      id: 'ALT-10492',
      time: '09:49:55',
      agent: 'srv-app01',
      ruleId: 92410,
      level: 9,
      severity: 'High',
      desc: 'Suspicious outbound high-port egress connection from internal asset',
      srcIp: '192.168.10.20',
      dstIp: '198.51.100.4',
      dstPort: '8080',
      mitre: 'T1041 (Exfiltration)',
      action: 'Alert'
    },
    {
      id: 'ALT-10488',
      time: '09:45:18',
      agent: 'pfsense-firewall',
      ruleId: 87702,
      level: 12,
      severity: 'Critical',
      desc: 'CRITICAL: Unauthorized DMZ to Internal LAN Lateral Pivot Blocked by Firewall',
      srcIp: '192.168.20.10',
      dstIp: '192.168.10.10',
      dstPort: '1514',
      mitre: 'T1021 (Lateral Movement)',
      action: 'Blocked'
    },
    {
      id: 'ALT-10480',
      time: '09:42:01',
      agent: 'win-client01',
      ruleId: 92305,
      level: 8,
      severity: 'High',
      desc: 'Sysmon: Suspicious DNS Query to potential C2 / Exfiltration Domain',
      srcIp: '192.168.10.30',
      dstIp: '192.168.10.1',
      dstPort: '53',
      mitre: 'T1071.004 (C2)',
      action: 'Alert'
    },
    {
      id: 'ALT-10474',
      time: '09:38:10',
      agent: 'win-client01',
      ruleId: 60122,
      level: 9,
      severity: 'High',
      desc: 'Multiple Windows logon failures (Event ID 4625) from same source IP',
      srcIp: '192.168.1.50',
      dstIp: '192.168.10.30',
      dstPort: '445',
      mitre: 'T1110 (Brute Force)',
      action: 'Alert'
    },
    {
      id: 'ALT-10469',
      time: '09:34:25',
      agent: 'srv-app01',
      ruleId: 5712,
      level: 10,
      severity: 'High',
      desc: 'sshd: Multiple failed SSH authentication attempts (Brute-Force suspected)',
      srcIp: '192.168.1.50',
      dstIp: '192.168.10.20',
      dstPort: '22',
      mitre: 'T1110.001 (Brute Force)',
      action: 'Active-Response Drop'
    },
    {
      id: 'ALT-10461',
      time: '09:30:15',
      agent: 'pfsense-firewall',
      ruleId: 87701,
      level: 6,
      severity: 'Medium',
      desc: 'pfSense: Inbound port scan connection blocked',
      srcIp: '192.168.1.50',
      dstIp: '192.168.10.20',
      dstPort: '3389',
      mitre: 'T1046 (Discovery)',
      action: 'Blocked'
    }
  ];

  const filteredAlerts = alertRecords.filter(a => {
    const matchesSev = filterSeverity === 'All' || a.severity === filterSeverity;
    const matchesSearch =
      searchQuery === '' ||
      a.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.srcIp.includes(searchQuery) ||
      a.dstIp.includes(searchQuery) ||
      a.agent.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Dashboard Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <span>Phase 6: SOC Live Telemetry & Incident Monitoring</span>
            </div>
            <h2 className="text-xl font-bold text-white">Central Security Operations Center (SOC) Console</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry Window: Last 1 Hour</span>
            <span className="text-emerald-400 font-bold ml-2">● SIEM Pipeline Healthy</span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-3.5 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400 block">Total Alerts</span>
            <div className="mt-1 text-2xl font-bold font-mono text-white tabular-nums">142</div>
            <span className="text-[11px] text-slate-400">Past 24 hours</span>
          </div>
          <div className="p-3.5 bg-slate-950/80 rounded-lg border border-red-900/40">
            <span className="text-xs text-red-400 block font-semibold">Critical (Lvl 12+)</span>
            <div className="mt-1 text-2xl font-bold font-mono text-red-400 tabular-nums">1</div>
            <span className="text-[11px] text-slate-400">DMZ Lateral Pivot</span>
          </div>
          <div className="p-3.5 bg-slate-950/80 rounded-lg border border-rose-900/40">
            <span className="text-xs text-rose-300 block font-semibold">High (Lvl 8-11)</span>
            <div className="mt-1 text-2xl font-bold font-mono text-rose-400 tabular-nums">4</div>
            <span className="text-[11px] text-slate-400">Brute Force & DNS C2</span>
          </div>
          <div className="p-3.5 bg-slate-950/80 rounded-lg border border-amber-900/40">
            <span className="text-xs text-amber-300 block font-semibold">Medium (Lvl 4-7)</span>
            <div className="mt-1 text-2xl font-bold font-mono text-amber-400 tabular-nums">18</div>
            <span className="text-[11px] text-slate-400">Port Scans Blocked</span>
          </div>
          <div className="p-3.5 bg-slate-950/80 rounded-lg border border-emerald-900/40">
            <span className="text-xs text-emerald-300 block font-semibold">Low (Lvl 1-3)</span>
            <div className="mt-1 text-2xl font-bold font-mono text-emerald-400 tabular-nums">119</div>
            <span className="text-[11px] text-slate-400">Nominal Logons & Syn</span>
          </div>
        </div>
      </div>

      {/* MITRE ATT&CK & Top Talkers Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Attacker & Target Entities */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-cyan-400" />
            Top Suspicious Source Entities & Victims
          </h3>

          <div className="space-y-2 text-xs font-mono">
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-rose-400 font-bold block">192.168.1.50 (Kali Linux)</span>
                <span className="text-[10px] text-slate-400 font-sans">SSH Brute Force + SMB Spray + Recon</span>
              </div>
              <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-rose-950 border border-rose-800">
                24 Events
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-amber-400 font-bold block">192.168.20.10 (DMZ Web Server)</span>
                <span className="text-[10px] text-slate-400 font-sans">Unauthorized Port 1514 Pivot to LAN</span>
              </div>
              <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-amber-950 border border-amber-800">
                1 Event
              </span>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-cyan-400 font-bold block">192.168.10.20 (srv-app01)</span>
                <span className="text-[10px] text-slate-400 font-sans">Target of SSH dictionary attack</span>
              </div>
              <span className="text-xs font-bold text-slate-300">Target</span>
            </div>

            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 flex justify-between items-center">
              <div>
                <span className="text-blue-400 font-bold block">192.168.10.30 (win-client01)</span>
                <span className="text-[10px] text-slate-400 font-sans">Target of Event 4625 SMB Spray</span>
              </div>
              <span className="text-xs font-bold text-slate-300">Target</span>
            </div>
          </div>
        </div>

        {/* MITRE ATT&CK Matrix Breakdown */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            MITRE ATT&CK Matrix Tactic Coverage
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-sans">Discovery</span>
              <div className="text-sm font-bold text-white mt-1">T1046</div>
              <span className="text-[11px] text-cyan-400">Port Recon</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-sans">Credential Access</span>
              <div className="text-sm font-bold text-white mt-1">T1110</div>
              <span className="text-[11px] text-rose-400">Password Spray</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-sans">Lateral Move</span>
              <div className="text-sm font-bold text-white mt-1">T1021</div>
              <span className="text-[11px] text-red-400">DMZ Pivot</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-sans">Command & Control</span>
              <div className="text-sm font-bold text-white mt-1">T1071.004</div>
              <span className="text-[11px] text-amber-400">DNS Beacon</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80 text-xs text-slate-400">
            <strong>Detection Coverage Ratio:</strong> 6 of 6 planned threat vectors mapped to Wazuh decoders and Sysmon telemetry drivers with zero false positive drops.
          </div>
        </div>
      </div>

      {/* Live Searchable Alert Stream Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              Live Ingested Security Alert Log Stream
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-time feed indexed by Wazuh Manager and filtered by custom rules.
            </p>
          </div>

          {/* Search & Severity Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Filter IP or alert..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              {(['All', 'Critical', 'High', 'Medium'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(sev)}
                  className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                    filterSeverity === sev ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {sev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Alert Table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/60 font-mono">
                <th className="py-2.5 px-3">Time</th>
                <th className="py-2.5 px-3">Level</th>
                <th className="py-2.5 px-3">Agent</th>
                <th className="py-2.5 px-3">Source IP</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Rule Description</th>
                <th className="py-2.5 px-3">MITRE ID</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredAlerts.map((a, idx) => (
                <tr
                  key={a.id}
                  onClick={() => setSelectedAlertIndex(selectedAlertIndex === idx ? null : idx)}
                  className={`cursor-pointer transition-colors ${
                    selectedAlertIndex === idx ? 'bg-slate-800/80' : 'hover:bg-slate-800/30'
                  }`}
                >
                  <td className="py-3 px-3 text-slate-300">{a.time}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        a.severity === 'Critical'
                          ? 'bg-red-500/20 text-red-400'
                          : a.severity === 'High'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      Lvl {a.level}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-cyan-400 font-bold">{a.agent}</td>
                  <td className="py-3 px-3 text-rose-400">{a.srcIp}</td>
                  <td className="py-3 px-3 text-slate-300">{a.dstIp}:{a.dstPort}</td>
                  <td className="py-3 px-3 font-sans text-slate-200 font-medium">{a.desc}</td>
                  <td className="py-3 px-3 text-cyan-300">{a.mitre}</td>
                  <td className="py-3 px-3 text-right">
                    <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {a.action}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Alert Details Drawer */}
        {selectedAlertIndex !== null && filteredAlerts[selectedAlertIndex] && (
          <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-cyan-500/40 animate-in fade-in space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
                  {filteredAlerts[selectedAlertIndex].id}
                </span>
                <span className="text-xs font-bold text-white">
                  {filteredAlerts[selectedAlertIndex].desc}
                </span>
              </div>
              <button
                onClick={() => setSelectedAlertIndex(null)}
                className="text-xs text-slate-400 hover:text-white self-end sm:self-auto"
              >
                Close Inspector
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs font-mono">
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Source IP:</span>
                <span className="text-rose-400 font-bold">{filteredAlerts[selectedAlertIndex].srcIp}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Destination:</span>
                <span className="text-slate-200">{filteredAlerts[selectedAlertIndex].dstIp}:{filteredAlerts[selectedAlertIndex].dstPort}</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Rule ID & Level:</span>
                <span className="text-cyan-400 font-bold">Rule {filteredAlerts[selectedAlertIndex].ruleId} (Lvl {filteredAlerts[selectedAlertIndex].level})</span>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800">
                <span className="text-slate-400 block text-[10px]">MITRE Tactic:</span>
                <span className="text-emerald-400">{filteredAlerts[selectedAlertIndex].mitre}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Wazuh Indexed Raw Alert Document (JSON):
              </span>
              <pre className="p-3 bg-slate-900 rounded border border-slate-800 font-mono text-[11px] text-cyan-300 overflow-x-auto">
{JSON.stringify({
  timestamp: `2026-11-03T${filteredAlerts[selectedAlertIndex].time}.000Z`,
  rule: {
    id: String(filteredAlerts[selectedAlertIndex].ruleId),
    level: filteredAlerts[selectedAlertIndex].level,
    description: filteredAlerts[selectedAlertIndex].desc,
    mitre: { id: [filteredAlerts[selectedAlertIndex].mitre.split(' ')[0]] }
  },
  agent: {
    id: "001",
    name: filteredAlerts[selectedAlertIndex].agent
  },
  data: {
    srcip: filteredAlerts[selectedAlertIndex].srcIp,
    dstip: filteredAlerts[selectedAlertIndex].dstIp,
    dstport: filteredAlerts[selectedAlertIndex].dstPort,
    action: filteredAlerts[selectedAlertIndex].action
  }
}, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
