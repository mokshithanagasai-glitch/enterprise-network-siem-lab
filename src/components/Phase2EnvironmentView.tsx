/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Settings, CheckCircle2, ChevronRight, Copy, Check, Info } from 'lucide-react';

export const Phase2EnvironmentView: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const steps = [
    {
      num: 1,
      title: 'VirtualBox / VMware Host Preparation',
      summary: 'Configuring hypervisor global settings and creating isolated Virtual Switch fabrics.'
    },
    {
      num: 2,
      title: 'pfSense Virtual Machine Creation',
      summary: 'Provisioning the firewall with 3 network adapters (NAT, intnet-lan, intnet-dmz).'
    },
    {
      num: 3,
      title: 'Initial Console Wizard & Interface Assignment',
      summary: 'Assigning em0 (WAN), em1 (LAN), and em2 (DMZ) via the FreeBSD console.'
    },
    {
      num: 4,
      title: 'LAN & DMZ IP Configuration',
      summary: 'Setting 192.168.10.1/24 on LAN and enabling DHCP pool (192.168.10.100 - 199).'
    },
    {
      num: 5,
      title: 'Accessing pfSense WebGUI',
      summary: 'Connecting from an internal VM or host browser to finalize the setup wizard.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>Phase 2: Environment Setup & Hypervisor Configuration</span>
        </div>
        <h2 className="text-xl font-bold text-white">Virtual Machine Provisioning & Virtual Switch Topology</h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Step-by-step instructions for creating isolated internal virtual networks, mapping network interface cards (NICs), 
          and initializing the pfSense firewall from scratch.
        </p>

        {/* Step Navigation */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-2">
          {steps.map(s => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`p-3 rounded-lg text-left transition-all border ${
                activeStep === s.num
                  ? 'bg-cyan-950/60 border-cyan-500 text-white'
                  : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <div className="text-[10px] font-mono text-cyan-400 font-bold">STEP 0{s.num}</div>
              <div className="text-xs font-semibold truncate mt-0.5">{s.title.split(' ')[0]} {s.title.split(' ')[1]}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Step Detail Content */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
        {activeStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              Step 1: Hypervisor Virtual Network Fabric Setup
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              VirtualBox uses <strong className="text-white">Internal Networks</strong> to act as software-defined virtual Ethernet switches. 
              Virtual machines attached to the same internal network name can communicate directly, but are completely isolated from your host computer and the physical home router.
            </p>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">Virtual Switch Names to Create:</h4>
              <ul className="text-xs text-slate-300 space-y-2 font-mono">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-400 font-bold">• intnet-lan</span>
                  <span className="text-slate-400 font-sans">- Trusted corporate LAN segment (192.168.10.0/24)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-amber-400 font-bold">• intnet-dmz</span>
                  <span className="text-slate-400 font-sans">- Demilitarized public perimeter (192.168.20.0/24)</span>
                </li>
              </ul>
            </div>

            <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-lg text-xs text-blue-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>
                <strong>Tip for VMware Workstation users:</strong> Use <strong>VMnet2</strong> (Host-only, DHCP disabled) for LAN and <strong>VMnet3</strong> for DMZ.
              </span>
            </div>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-cyan-400" />
              Step 2: Provisioning pfSense VM Hardware & Adapters
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              In VirtualBox, click <strong className="text-white">New</strong> to create the pfSense virtual machine with the following settings:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 block mb-1">Operating System Type:</span>
                <span className="text-white font-bold">BSD / FreeBSD (64-bit)</span>
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400 block mb-1">Memory & CPU:</span>
                <span className="text-white font-bold">1536 MB RAM | 1 vCPU</span>
              </div>
            </div>

            <div className="mt-4 p-4 bg-slate-950 rounded-lg border border-slate-800">
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2">Network Adapter Configuration (Critical):</h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="font-mono text-cyan-400">Adapter 1 (WAN / em0):</span>
                  <span className="text-slate-300 font-mono">Attached to: NAT (Provides Internet access)</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="font-mono text-emerald-400">Adapter 2 (LAN / em1):</span>
                  <span className="text-slate-300 font-mono">Attached to: Internal Network -&gt; "intnet-lan"</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
                  <span className="font-mono text-amber-400">Adapter 3 (DMZ / em2):</span>
                  <span className="text-slate-300 font-mono">Attached to: Internal Network -&gt; "intnet-dmz"</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              Step 3: Initial pfSense Console Interface Assignment
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Boot the pfSense VM from the ISO. Once the FreeBSD installer finishes, the terminal presents the interface assignment dialog:
            </p>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 space-y-2">
              <div className="text-cyan-400">Should VLANs be set up now [y|n]? <strong className="text-white">n</strong></div>
              <div className="text-slate-400">Enter the WAN interface name or 'a' for auto-detection: <strong className="text-white">em0</strong></div>
              <div className="text-slate-400">Enter the LAN interface name or 'a' for auto-detection: <strong className="text-white">em1</strong></div>
              <div className="text-slate-400">Enter the Optional 1 (OPT1 / DMZ) interface name: <strong className="text-white">em2</strong></div>
              <div className="text-emerald-400">Do you want to proceed [y|n]? <strong className="text-white">y</strong></div>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Terminal className="w-5 h-5 text-emerald-400" />
              Step 4: Setting LAN & DMZ Static Gateway IP & DHCP
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              From the pfSense console menu, enter option <strong className="text-white">2) Set interface(s) IP address</strong>:
            </p>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
              <div>Enter the number of the interface you wish to configure: <strong className="text-cyan-400">2</strong> (LAN)</div>
              <div>Configure IPv4 address LAN interface via DHCP? (y/n): <strong className="text-white">n</strong></div>
              <div>Enter the new LAN IPv4 address: <strong className="text-emerald-400">192.168.10.1</strong></div>
              <div>Enter the new LAN IPv4 subnet bit count (1 to 31): <strong className="text-emerald-400">24</strong></div>
              <div>For a WAN, enter the new LAN IPv4 upstream gateway address: <strong className="text-slate-500">[Press Enter for none]</strong></div>
              <div>Do you want to enable the DHCP server on LAN? (y/n): <strong className="text-white">y</strong></div>
              <div>Enter the start address of the IPv4 client address range: <strong className="text-cyan-400">192.168.10.100</strong></div>
              <div>Enter the end address of the IPv4 client address range: <strong className="text-cyan-400">192.168.10.199</strong></div>
              <div>Do you want to revert to HTTP as the webConfigurator protocol? (y/n): <strong className="text-white">n</strong></div>
            </div>
          </div>
        )}

        {activeStep === 5 && (
          <div className="space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Step 5: Logging into the pfSense WebGUI
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              From your Ubuntu Server or Windows VM attached to <strong className="text-white font-mono">intnet-lan</strong>, 
              open a web browser and navigate to the LAN gateway:
            </p>

            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">WebConfigurator URL:</span>
                <span className="text-sm font-mono font-bold text-cyan-400">https://192.168.10.1</span>
              </div>
              <div className="text-right text-xs font-mono">
                <span className="text-slate-400 block">Default Credentials:</span>
                <span className="text-slate-200">Username: <strong className="text-white">admin</strong> | Password: <strong className="text-white">pfsense</strong></span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
