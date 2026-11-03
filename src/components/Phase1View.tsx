/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Cpu, HardDrive, Download, ExternalLink, ShieldCheck, Network, Layers, AlertTriangle, Check, Copy } from 'lucide-react';
import { VIRTUAL_MACHINES, SUBNETS, VirtualMachine } from '../data/labData';
import { TopologyDiagram } from './TopologyDiagram';

interface Phase1ViewProps {
  hostRamTier: '8GB' | '16GB' | '32GB';
  setHostRamTier: (tier: '8GB' | '16GB' | '32GB') => void;
}

export const Phase1View: React.FC<Phase1ViewProps> = ({ hostRamTier, setHostRamTier }) => {
  const [selectedVm, setSelectedVm] = useState<VirtualMachine>(VIRTUAL_MACHINES[0]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // RAM allocation calculation based on Host RAM tier
  const getVmRam = (vm: VirtualMachine) => {
    if (hostRamTier === '8GB') return vm.hardware.minRam;
    if (hostRamTier === '16GB') return vm.hardware.recRam;
    return vm.hardware.highRam;
  };

  const totalAllocatedRamMb = VIRTUAL_MACHINES.reduce((acc, vm) => acc + getVmRam(vm), 0);
  const totalHostRamMb = hostRamTier === '8GB' ? 8192 : hostRamTier === '16GB' ? 16384 : 32768;
  const hostReservedRamMb = totalHostRamMb - totalAllocatedRamMb;

  return (
    <div className="space-y-8">
      {/* Hero / Executive Overview */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/40 border border-slate-800 rounded-2xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
            <span>Phase 1 Requirements & Architecture Blueprint</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Enterprise Network Lab with SIEM-Based Security Monitoring
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed">
            A production-style cybersecurity proving ground simulating a mid-sized enterprise environment. 
            Features multi-interface perimeter firewalling (pfSense), strict network segmentation (LAN vs. DMZ), 
            centralized SIEM telemetry collection (Wazuh), kernel-level Windows event auditing (Sysmon), 
            and MITRE ATT&CK security detection validation.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <div>
              <span className="text-slate-200 font-semibold">Architecture Model:</span> Dual-Interface Perimeter + Isolated DMZ + Trust LAN
            </div>
            <div>
              <span className="text-slate-200 font-semibold">SIEM Standard:</span> Wazuh 4.9 (Elastic/OpenSearch backend)
            </div>
            <div>
              <span className="text-slate-200 font-semibold">Cost:</span> $0.00 (100% Free Open-Source & Official Evaluation ISOs)
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Topology Diagram */}
      <section className="space-y-4">
        <TopologyDiagram onSelectVm={setSelectedVm} selectedVmId={selectedVm.id} />

        {/* Selected Node Inspector Drawer */}
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 font-mono text-xs font-bold border border-cyan-500/30">
                ACTIVE NODE
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>{selectedVm.name}</span>
                  <span className="text-xs font-mono text-cyan-400 font-normal">({selectedVm.hostname})</span>
                </h4>
                <p className="text-xs text-slate-400">{selectedVm.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Assigned IP:</span>
              <span className="text-white font-bold px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                {selectedVm.ip}
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">Network Interfaces</span>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                {selectedVm.adapters.map(a => (
                  <div key={a.slot} className="truncate">
                    Slot {a.slot}: <strong className="text-cyan-400">{a.type}</strong> ({a.networkName || 'NAT'})
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">Active Sizing Budget</span>
              <div className="space-y-1 font-mono text-[11px] text-slate-300">
                <div>RAM: <strong className="text-cyan-400">{(getVmRam(selectedVm) / 1024).toFixed(1)} GB</strong> ({getVmRam(selectedVm)} MB)</div>
                <div>vCPU: <strong className="text-slate-200">{selectedVm.hardware.vCpu} Cores</strong></div>
                <div>Storage: <strong className="text-slate-200">{selectedVm.hardware.diskGb} GB</strong></div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-400 block mb-1 font-semibold uppercase text-[10px]">Core Services & Daemons</span>
              <div className="flex flex-wrap gap-1 mt-1 font-mono text-[10px]">
                {selectedVm.services.map((srv, i) => (
                  <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                    {srv}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Host Hardware Budget & RAM Calculator */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              Hardware Sizing & Virtualization Budget Calculator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Select your physical host machine RAM to generate recommended per-VM allocations so your host OS never freezes.
            </p>
          </div>

          {/* Tier Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 self-start sm:self-auto">
            {(['8GB', '16GB', '32GB'] as const).map(tier => (
              <button
                key={tier}
                onClick={() => setHostRamTier(tier)}
                className={`px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                  hostRamTier === tier
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tier} Host
              </button>
            ))}
          </div>
        </div>

        {/* Resource Allocation Bars */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/80 rounded-lg border border-slate-800">
            <span className="text-xs text-slate-400">Total Host RAM</span>
            <div className="mt-1 text-2xl font-bold font-mono text-white tabular-nums">
              {(totalHostRamMb / 1024).toFixed(0)} GB
            </div>
            <span className="text-[11px] text-slate-400">Physical machine total memory</span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-lg border border-cyan-900/40">
            <span className="text-xs text-cyan-300">VM Allocation Total</span>
            <div className="mt-1 text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {(totalAllocatedRamMb / 1024).toFixed(1)} GB
            </div>
            <span className="text-[11px] text-slate-400">Sum of all running lab VMs</span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-lg border border-emerald-900/40">
            <span className="text-xs text-emerald-300">Host OS Reserved Headroom</span>
            <div className="mt-1 text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {(hostReservedRamMb / 1024).toFixed(1)} GB
            </div>
            <span className="text-[11px] text-slate-400">Guarantees host Windows/Linux/macOS responsiveness</span>
          </div>
        </div>

        {/* Per-VM Allocation Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/60">
                <th className="py-2.5 px-3">Virtual Machine</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3 text-right">vCPU</th>
                <th className="py-2.5 px-3 text-right">Assigned RAM</th>
                <th className="py-2.5 px-3 text-right">Disk Space</th>
                <th className="py-2.5 px-3">Virtual Network Adapter</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {VIRTUAL_MACHINES.map(vm => (
                <tr key={vm.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-3 font-sans font-bold text-white flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400" />
                    {vm.name}
                  </td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">{vm.role.split(',')[0]}</td>
                  <td className="py-2.5 px-3 text-right text-slate-300">{vm.hardware.vCpu} Cores</td>
                  <td className="py-2.5 px-3 text-right font-bold text-cyan-400">
                    {(getVmRam(vm) / 1024).toFixed(1)} GB ({getVmRam(vm)} MB)
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-400">{vm.hardware.diskGb} GB</td>
                  <td className="py-2.5 px-3 font-sans text-slate-300">
                    {vm.adapters.map(a => `${a.type} (${a.networkName || 'NAT'})`).join(' + ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {hostRamTier === '8GB' && (
          <div className="mt-4 p-3 bg-amber-950/30 border border-amber-800/50 rounded-lg flex items-start gap-2.5 text-xs text-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold text-amber-300">8GB Low-Spec Optimization Strategy:</strong>{' '}
              Do not run all 6 VMs simultaneously. Start pfSense + Wazuh + Ubuntu first. Only boot Kali Linux when actively executing attack simulations, or power down Windows when testing Linux endpoints!
            </div>
          </div>
        )}
      </section>

      {/* Subnet & IP Addressing Table */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="pb-4 border-b border-slate-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-emerald-400" />
            IP Addressing & Subnet Architecture Matrix
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Segmented addressing plan preventing broadcast spillover and enforcing zero-trust firewall controls.
          </p>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/60">
                <th className="py-2.5 px-3">Segment Name</th>
                <th className="py-2.5 px-3">Subnet (CIDR)</th>
                <th className="py-2.5 px-3">Gateway (pfSense)</th>
                <th className="py-2.5 px-3">DHCP Pool</th>
                <th className="py-2.5 px-3">DNS Resolver</th>
                <th className="py-2.5 px-3">Security Policy & Inter-VLAN Rules</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {SUBNETS.map(sub => (
                <tr key={sub.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-bold text-white">{sub.name}</td>
                  <td className="py-3 px-3 font-mono text-cyan-300">{sub.cidr}</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">{sub.gateway}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{sub.dhcpRange || 'Disabled (Static)'}</td>
                  <td className="py-3 px-3 font-mono text-slate-300">{sub.dnsServer}</td>
                  <td className="py-3 px-3 text-slate-300 leading-snug">{sub.securityPolicy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Network Concepts Deep-Dive */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            Fundamental Network Segmentation Concepts
          </h4>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div>
              <strong className="text-white block font-semibold mb-0.5">LAN (Local Area Network - Corporate Core):</strong>
              Trusted internal network segment containing core business servers, endpoints, domain controllers, and SIEM managers. 
              Protected from the outside world. Never directly exposed to the Internet.
            </div>
            <div>
              <strong className="text-white block font-semibold mb-0.5">DMZ (Demilitarized Zone):</strong>
              Perimeter subnet that sits between untrusted external networks (WAN) and the trusted internal LAN. 
              Holds public-facing servers (HTTP, DNS, Mail). If a DMZ host is compromised, firewall rules strictly block it from pivoting into the LAN.
            </div>
            <div>
              <strong className="text-white block font-semibold mb-0.5">WAN (Wide Area Network):</strong>
              Untrusted external network, usually the public Internet. In this lab, it is simulated by the VirtualBox NAT or host bridge adapter.
            </div>
            <div>
              <strong className="text-white block font-semibold mb-0.5">Stateful Packet Inspection (SPI):</strong>
              Unlike simple packet filters that inspect headers in isolation, pfSense tracks active TCP 3-way handshakes and connection states. 
              Outbound LAN requests automatically permit the returning reply packets without opening permanent inbound ports!
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <h4 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Sequential Implementation Order (Roadmap)
          </h4>

          <div className="space-y-2.5 text-xs text-slate-300">
            {[
              { step: '01', title: 'Virtualization & Switch Fabric', desc: 'Install VirtualBox/VMware, create internal network switches (intnet-lan, intnet-dmz).' },
              { step: '02', title: 'pfSense Perimeter Firewall', desc: 'Install pfSense with 3 NICs. Assign WAN (DHCP), LAN (192.168.10.1), DMZ (192.168.20.1).' },
              { step: '03', title: 'Ubuntu Server & Web Setup', desc: 'Deploy Ubuntu Server on LAN (192.168.10.20) and DMZ Web (192.168.20.10). Verify gateway ping.' },
              { step: '04', title: 'Wazuh SIEM Manager Deployment', desc: 'Install Wazuh All-in-One server (192.168.10.10). Access web dashboard on HTTPS.' },
              { step: '05', title: 'Windows Endpoint & Sysmon Audit', desc: 'Install Windows VM (192.168.10.30), install Sysmon with SwiftOnSecurity config, enroll Wazuh Agent.' },
              { step: '06', title: 'Controlled Attack Simulations', desc: 'Boot Kali Linux. Execute port scans, SSH brute force, SMB invalid logins, and verify alerts in Wazuh.' }
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3 p-2 rounded bg-slate-950/60 border border-slate-800">
                <span className="font-mono text-cyan-400 font-bold text-xs">{item.step}</span>
                <div>
                  <strong className="text-white font-semibold">{item.title}:</strong>{' '}
                  <span className="text-slate-400">{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Official Free Download Matrix */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-5 h-5 text-cyan-400" />
              Verified Official Download Links Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Direct official sources for all ISOs, virtual appliances, and telemetry agents. No pirated or untrusted sources.
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {VIRTUAL_MACHINES.flatMap(vm => vm.downloads.map(d => ({ ...d, vmName: vm.name }))).map((dl, idx) => (
            <div key={idx} className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-bold text-white">{dl.title}</span>
                  <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/40">
                    {dl.license}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Component for: {dl.vmName}</p>
                <div className="mt-2 text-[11px] font-mono text-slate-300 break-all bg-slate-900 p-2 rounded border border-slate-800/60">
                  {dl.url}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-end gap-2">
                <button
                  onClick={() => copyToClipboard(dl.url, `dl-${idx}`)}
                  className="px-3 py-1.5 rounded text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  {copiedLink === `dl-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLink === `dl-${idx}` ? 'Copied' : 'Copy URL'}</span>
                </button>
                <a
                  href={dl.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-slate-950 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
