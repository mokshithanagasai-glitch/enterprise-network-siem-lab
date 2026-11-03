/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Server, Monitor, Terminal, Globe, Lock, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { VIRTUAL_MACHINES, SUBNETS, VirtualMachine } from '../data/labData';

interface TopologyDiagramProps {
  onSelectVm?: (vm: VirtualMachine) => void;
  selectedVmId?: string;
}

export const TopologyDiagram: React.FC<TopologyDiagramProps> = ({ onSelectVm, selectedVmId }) => {
  const [activeFlow, setActiveFlow] = useState<'none' | 'lan_egress' | 'siem_telemetry' | 'kali_recon' | 'dmz_pivot'>('none');
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const pfsense = VIRTUAL_MACHINES.find(v => v.id === 'pfsense')!;
  const wazuh = VIRTUAL_MACHINES.find(v => v.id === 'wazuh')!;
  const ubuntu = VIRTUAL_MACHINES.find(v => v.id === 'ubuntu_srv')!;
  const windows = VIRTUAL_MACHINES.find(v => v.id === 'windows_ep')!;
  const dmzWeb = VIRTUAL_MACHINES.find(v => v.id === 'dmz_web')!;
  const kali = VIRTUAL_MACHINES.find(v => v.id === 'kali')!;

  const handleVmClick = (vm: VirtualMachine) => {
    if (onSelectVm) onSelectVm(vm);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Topology Toolbar */}
      <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Interactive Architecture</div>
          <h3 className="text-base font-bold text-white">Enterprise Network Segmentation & Traffic Routing</h3>
        </div>

        {/* Traffic Flow Trace Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <span className="px-2 text-slate-400 font-medium hidden sm:inline">Trace Flow:</span>
          <button
            onClick={() => setActiveFlow(activeFlow === 'lan_egress' ? 'none' : 'lan_egress')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeFlow === 'lan_egress'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            LAN → Internet (Allowed)
          </button>
          <button
            onClick={() => setActiveFlow(activeFlow === 'siem_telemetry' ? 'none' : 'siem_telemetry')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeFlow === 'siem_telemetry'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Endpoint → Wazuh (Port 1514)
          </button>
          <button
            onClick={() => setActiveFlow(activeFlow === 'kali_recon' ? 'none' : 'kali_recon')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeFlow === 'kali_recon'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Kali → LAN Scan (Blocked)
          </button>
          <button
            onClick={() => setActiveFlow(activeFlow === 'dmz_pivot' ? 'none' : 'dmz_pivot')}
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              activeFlow === 'dmz_pivot'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            DMZ → LAN Pivot (Blocked)
          </button>
        </div>
      </div>

      {/* SVG Canvas & Node Layout */}
      <div className="p-6 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* External / WAN Zone (Left) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
                <Globe className="w-3.5 h-3.5 text-blue-400" />
                <span>WAN / INTERNET SIMULATION</span>
              </div>
              <p className="text-xs text-slate-400">VirtualBox NAT / Bridged Uplink</p>
            </div>

            {/* Kali Linux Node */}
            <div
              onClick={() => handleVmClick(kali)}
              onMouseEnter={() => setHoveredNode(kali.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedVmId === kali.id
                  ? 'border-rose-500 bg-rose-950/30 ring-1 ring-rose-500'
                  : 'border-rose-900/40 bg-slate-950 hover:border-rose-700/60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-500/10 rounded-lg text-rose-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Kali Linux</h4>
                    <span className="text-xs font-mono text-rose-400">192.168.1.50</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-rose-300/80 bg-rose-950/50 px-2 py-0.5 rounded border border-rose-800/40">
                  ATTACKER / TEST
                </span>
              </div>
              <p className="mt-2.5 text-xs text-slate-400 leading-relaxed">
                Nmap, Hydra, Scapy attack generation platform.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>RAM: 2 GB</span>
                <span>NIC: NAT (em0)</span>
              </div>
            </div>

            {/* Active Flow Explanation Card */}
            {activeFlow !== 'none' && (
              <div className="p-3.5 bg-slate-950/90 border border-cyan-500/30 rounded-lg text-xs leading-relaxed animate-in fade-in">
                <div className="font-semibold text-cyan-300 mb-1 flex items-center gap-1.5">
                  {activeFlow.includes('Blocked') || activeFlow === 'kali_recon' || activeFlow === 'dmz_pivot' ? (
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  Packet Inspection Result
                </div>
                {activeFlow === 'lan_egress' && (
                  <p className="text-slate-300">
                    <strong className="text-white">LAN (192.168.10.20) → pfSense (em1) → NAT WAN (em0) → 1.1.1.1:</strong> Outbound connection matched state table, permitted with PAT source translation.
                  </p>
                )}
                {activeFlow === 'siem_telemetry' && (
                  <p className="text-slate-300">
                    <strong className="text-white">Windows/Ubuntu Agent → Wazuh Manager (192.168.10.10:1514):</strong> Direct intra-LAN encrypted TCP channel. High-speed encrypted agent telemetry.
                  </p>
                )}
                {activeFlow === 'kali_recon' && (
                  <p className="text-slate-300">
                    <strong className="text-white">Kali (192.168.1.50) → pfSense WAN:</strong> Blocked by Default Inbound Deny rule. Packet dropped, recorded in pfSense filterlog for SIEM ingestion.
                  </p>
                )}
                {activeFlow === 'dmz_pivot' && (
                  <p className="text-slate-300">
                    <strong className="text-white">DMZ (192.168.20.10) → LAN (192.168.10.10):</strong> Blocked! Firewall Rule #3 denies DMZ to LAN. Prevents compromised web server from pivoting!
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Central Firewall / Router (Middle) */}
          <div className="lg:col-span-3 flex flex-col justify-center gap-4">
            <div
              onClick={() => handleVmClick(pfsense)}
              onMouseEnter={() => setHoveredNode(pfsense.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                selectedVmId === pfsense.id
                  ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400'
                  : 'border-cyan-800/40 bg-slate-950 hover:border-cyan-600/60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 bg-cyan-500/10 rounded-lg text-cyan-400">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-white">pfSense 2.7.2 CE</h4>
                    <span className="text-xs text-cyan-400 font-mono">Core Gateway & Firewall</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mt-4 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">WAN (em0):</span>
                  <span className="text-slate-200">DHCP (VirtualBox NAT)</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-emerald-400">LAN Gateway (em1):</span>
                  <span className="text-white font-semibold">192.168.10.1/24</span>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-slate-800 flex justify-between items-center">
                  <span className="text-amber-400">DMZ Gateway (em2):</span>
                  <span className="text-white font-semibold">192.168.20.1/24</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Stateful Packet Filter</span>
                <span className="text-cyan-400 font-mono">RAM: 1.5 GB</span>
              </div>
            </div>

            {/* DMZ Segment Card */}
            <div className="p-3.5 bg-slate-950/80 border border-amber-900/40 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                  <Lock className="w-3.5 h-3.5" />
                  <span>DMZ PERIMETER (192.168.20.0/24)</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">intnet-dmz</span>
              </div>

              <div
                onClick={() => handleVmClick(dmzWeb)}
                onMouseEnter={() => setHoveredNode(dmzWeb.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`p-3 rounded-lg border cursor-pointer transition-all ${
                  selectedVmId === dmzWeb.id
                    ? 'border-amber-400 bg-amber-950/30'
                    : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">DMZ Web Server</span>
                  <span className="text-xs font-mono text-amber-300">192.168.20.10</span>
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Exposed Nginx/Apache. Strict isolate from LAN.</p>
              </div>
            </div>
          </div>

          {/* Internal Corporate LAN (Right, 6 cols) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="p-3 bg-slate-950/60 border border-emerald-900/40 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                <span>SECURE INTERNAL LAN (192.168.10.0/24)</span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">VirtualBox intnet-lan</span>
            </div>

            {/* Wazuh SIEM Manager */}
            <div
              onClick={() => handleVmClick(wazuh)}
              onMouseEnter={() => setHoveredNode(wazuh.id)}
              onMouseLeave={() => setHoveredNode(null)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedVmId === wazuh.id
                  ? 'border-cyan-400 bg-cyan-950/30 ring-1 ring-cyan-400'
                  : 'border-cyan-900/40 bg-slate-950 hover:border-cyan-700/60'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                    <Server className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">Wazuh SIEM Manager & Indexer</h4>
                    <span className="text-xs font-mono text-cyan-400">192.168.10.10</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                  CENTRAL SIEM
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Aggregates syslog from pfSense, security events from Linux and Windows, runs MITRE ATT&CK correlation rules, and hosts the SOC web console.
              </p>
              <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Listening: Ports 1514 (Agent), 1515 (Auth), 443 (Dashboard)</span>
                <span className="text-cyan-300">RAM: 4–6 GB</span>
              </div>
            </div>

            {/* Monitored Endpoints Grid (Ubuntu Server + Windows) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Ubuntu Server Node */}
              <div
                onClick={() => handleVmClick(ubuntu)}
                onMouseEnter={() => setHoveredNode(ubuntu.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedVmId === ubuntu.id
                    ? 'border-emerald-400 bg-emerald-950/30 ring-1 ring-emerald-400'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Ubuntu Enterprise</span>
                  </div>
                  <span className="text-xs font-mono text-emerald-400">.10.20</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  OpenSSH server, Wazuh Agent daemon, Auditd logging.
                </p>
                <div className="pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>RAM: 1.5 GB</span>
                  <span className="text-emerald-400">Agent Active</span>
                </div>
              </div>

              {/* Windows Client / Server Node */}
              <div
                onClick={() => handleVmClick(windows)}
                onMouseEnter={() => setHoveredNode(windows.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  selectedVmId === windows.id
                    ? 'border-blue-400 bg-blue-950/30 ring-1 ring-blue-400'
                    : 'border-slate-800 bg-slate-950 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">Windows Server/Client</span>
                  </div>
                  <span className="text-xs font-mono text-blue-400">.10.30</span>
                </div>
                <p className="text-[11px] text-slate-400 mb-2">
                  Sysmon v15 + SwiftOnSecurity config, Event 4625 auditing.
                </p>
                <div className="pt-2 border-t border-slate-800/60 text-[10px] font-mono text-slate-400 flex justify-between">
                  <span>RAM: 3 GB</span>
                  <span className="text-blue-400">Sysmon Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
