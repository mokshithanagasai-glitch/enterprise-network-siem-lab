/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Shield, Play, CheckCircle2, XCircle, ArrowRight, Lock, Filter } from 'lucide-react';

interface FirewallRule {
  id: string;
  zone: 'WAN' | 'LAN' | 'DMZ';
  action: 'Pass' | 'Block' | 'Reject';
  protocol: 'TCP' | 'UDP' | 'TCP/UDP' | 'ICMP' | 'Any';
  source: string;
  port: string;
  destination: string;
  destPort: string;
  description: string;
  stateful: boolean;
}

export const Phase3FirewallView: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<'LAN' | 'DMZ' | 'WAN'>('LAN');
  const [simTest, setSimTest] = useState<{
    src: string;
    dst: string;
    port: number;
    proto: string;
    result?: 'ALLOWED' | 'BLOCKED';
    ruleMatched?: string;
  } | null>(null);

  const rules: FirewallRule[] = [
    // LAN Rules
    {
      id: 'rule-lan-01',
      zone: 'LAN',
      action: 'Pass',
      protocol: 'TCP',
      source: 'LAN Net',
      port: '*',
      destination: '192.168.10.1',
      destPort: '443, 80',
      description: 'Anti-Lockout Rule: Guaranteed access to pfSense WebGUI from internal LAN.',
      stateful: true
    },
    {
      id: 'rule-lan-02',
      zone: 'LAN',
      action: 'Pass',
      protocol: 'UDP',
      source: 'LAN Net',
      port: '*',
      destination: '192.168.10.1',
      destPort: '53',
      description: 'DNS Lookup: Permits internal workstations to query pfSense Unbound DNS.',
      stateful: true
    },
    {
      id: 'rule-lan-03',
      zone: 'LAN',
      action: 'Pass',
      protocol: 'TCP',
      source: 'LAN Net',
      port: '*',
      destination: 'WAN Net / Any',
      destPort: '80, 443',
      description: 'Egress Internet Access: Allows HTTP/HTTPS for updates and browsing with NAT.',
      stateful: true
    },
    {
      id: 'rule-lan-04',
      zone: 'LAN',
      action: 'Block',
      protocol: 'Any',
      source: 'LAN Net',
      port: '*',
      destination: 'Any',
      destPort: '*',
      description: 'Default Deny Egress: Blocks unauthorized high-port egress beacons.',
      stateful: false
    },
    // DMZ Rules
    {
      id: 'rule-dmz-01',
      zone: 'DMZ',
      action: 'Block',
      protocol: 'Any',
      source: 'DMZ Net',
      port: '*',
      destination: '192.168.10.0/24 (LAN Net)',
      destPort: '*',
      description: 'CRITICAL ISOLATION: Explicitly blocks DMZ hosts from reaching trusted LAN.',
      stateful: false
    },
    {
      id: 'rule-dmz-02',
      zone: 'DMZ',
      action: 'Pass',
      protocol: 'UDP',
      source: 'DMZ Net',
      port: '*',
      destination: '192.168.20.1',
      destPort: '53',
      description: 'Permit DNS query to pfSense DMZ gateway.',
      stateful: true
    },
    {
      id: 'rule-dmz-03',
      zone: 'DMZ',
      action: 'Pass',
      protocol: 'TCP',
      source: 'DMZ Net',
      port: '*',
      destination: 'Any',
      destPort: '80, 443',
      description: 'Permit web server package repository downloads (apt-get update).',
      stateful: true
    },
    // WAN Rules
    {
      id: 'rule-wan-01',
      zone: 'WAN',
      action: 'Block',
      protocol: 'Any',
      source: 'Reserved / Bogon / Private',
      port: '*',
      destination: 'WAN Net',
      destPort: '*',
      description: 'Block Private Networks (RFC 1918) & Bogon networks arriving on WAN.',
      stateful: false
    },
    {
      id: 'rule-wan-02',
      zone: 'WAN',
      action: 'Block',
      protocol: 'Any',
      source: 'Any',
      port: '*',
      destination: 'Any',
      destPort: '*',
      description: 'Default Inbound Deny: Drops all unsolicited external traffic.',
      stateful: false
    }
  ];

  const filteredRules = rules.filter(r => r.zone === selectedZone);

  const runFirewallSimulation = (src: string, dst: string, port: number, proto: string) => {
    // DMZ to LAN is always blocked
    if (src.startsWith('192.168.20.') && dst.startsWith('192.168.10.')) {
      setSimTest({
        src,
        dst,
        port,
        proto,
        result: 'BLOCKED',
        ruleMatched: 'Rule #DMZ-01: Explicit Block DMZ -> LAN Net'
      });
      return;
    }

    // WAN to LAN is blocked
    if (src.startsWith('192.168.1.') && dst.startsWith('192.168.10.')) {
      setSimTest({
        src,
        dst,
        port,
        proto,
        result: 'BLOCKED',
        ruleMatched: 'Rule #WAN-02: Default Inbound Deny'
      });
      return;
    }

    // LAN to WAN HTTP/HTTPS
    if (src.startsWith('192.168.10.') && (port === 80 || port === 443 || port === 53)) {
      setSimTest({
        src,
        dst,
        port,
        proto,
        result: 'ALLOWED',
        ruleMatched: 'Rule #LAN-03: Pass LAN to WAN (HTTP/HTTPS)'
      });
      return;
    }

    // Default block
    setSimTest({
      src,
      dst,
      port,
      proto,
      result: 'BLOCKED',
      ruleMatched: 'Default Implicit Drop'
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>Phase 3: Network Configuration & Packet Filtering</span>
        </div>
        <h2 className="text-xl font-bold text-white">pfSense Firewall Rule Hierarchy & Zone Policies</h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Firewall rules are evaluated top-down; the first rule that matches a packet takes precedence. 
          Stateful tracking ensures return traffic is automatically permitted.
        </p>

        {/* Zone Selector Tabs */}
        <div className="mt-6 flex items-center gap-2 border-b border-slate-800 pb-2">
          {(['LAN', 'DMZ', 'WAN'] as const).map(zone => (
            <button
              key={zone}
              onClick={() => setSelectedZone(zone)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedZone === zone
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {zone} Interface Rules ({rules.filter(r => r.zone === zone).length})
            </button>
          ))}
        </div>
      </div>

      {/* Rules Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Filter className="w-4 h-4 text-cyan-400" />
          Active Rules for {selectedZone} Interface
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/60">
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Protocol</th>
                <th className="py-2.5 px-3">Source</th>
                <th className="py-2.5 px-3">Port</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Dest Port</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Description & Security Intent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRules.map(rule => (
                <tr key={rule.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        rule.action === 'Pass'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      }`}
                    >
                      {rule.action.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-200">{rule.protocol}</td>
                  <td className="py-3 px-3 text-cyan-300">{rule.source}</td>
                  <td className="py-3 px-3 text-slate-400">{rule.port}</td>
                  <td className="py-3 px-3 text-cyan-300">{rule.destination}</td>
                  <td className="py-3 px-3 text-amber-300">{rule.destPort}</td>
                  <td className="py-3 px-3 font-sans text-slate-400">
                    {rule.stateful ? 'Stateful' : 'Stateless'}
                  </td>
                  <td className="py-3 px-3 font-sans text-slate-300">{rule.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Packet Filter Testing Sandbox */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Play className="w-4 h-4 text-emerald-400" />
          Interactive Packet Filter Verification Sandbox
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Click any test scenario to simulate how the pfSense kernel packet filter evaluates the packet.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => runFirewallSimulation('192.168.10.20', '1.1.1.1', 443, 'TCP')}
            className="p-3 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-lg text-left transition-colors"
          >
            <div className="text-xs font-bold text-white">LAN → External HTTPS</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">192.168.10.20:51240 → 1.1.1.1:443</div>
            <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Expected: PASS</span>
          </button>

          <button
            onClick={() => runFirewallSimulation('192.168.20.10', '192.168.10.10', 1514, 'TCP')}
            className="p-3 bg-slate-950 border border-slate-800 hover:border-rose-500/50 rounded-lg text-left transition-colors"
          >
            <div className="text-xs font-bold text-white">DMZ → LAN Wazuh Pivot</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">192.168.20.10 → 192.168.10.10:1514</div>
            <span className="text-[10px] text-rose-400 font-semibold block mt-1">Expected: BLOCK</span>
          </button>

          <button
            onClick={() => runFirewallSimulation('192.168.1.50', '192.168.10.20', 22, 'TCP')}
            className="p-3 bg-slate-950 border border-slate-800 hover:border-rose-500/50 rounded-lg text-left transition-colors"
          >
            <div className="text-xs font-bold text-white">Kali Inbound SSH on WAN</div>
            <div className="text-[11px] font-mono text-slate-400 mt-1">192.168.1.50 → 192.168.10.20:22</div>
            <span className="text-[10px] text-rose-400 font-semibold block mt-1">Expected: BLOCK</span>
          </button>
        </div>

        {simTest && (
          <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-start gap-3">
            {simTest.result === 'ALLOWED' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="text-xs space-y-1">
              <div className="font-bold text-white flex items-center gap-2">
                <span>Simulation Result:</span>
                <span
                  className={simTest.result === 'ALLOWED' ? 'text-emerald-400' : 'text-rose-400 font-bold'}
                >
                  {simTest.result}
                </span>
              </div>
              <p className="text-slate-300">
                Rule Evaluation: <strong className="text-cyan-400 font-mono">{simTest.ruleMatched}</strong>
              </p>
              <p className="text-[11px] font-mono text-slate-400">
                Packet: {simTest.proto} {simTest.src} → {simTest.dst}:{simTest.port}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
