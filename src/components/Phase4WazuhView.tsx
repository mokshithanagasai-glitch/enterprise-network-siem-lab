/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Server, Terminal, Copy, Check, Shield, FileCode, CheckCircle2 } from 'lucide-react';

export const Phase4WazuhView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>Phase 4: Centralized SIEM Installation & Endpoint Telemetry</span>
        </div>
        <h2 className="text-xl font-bold text-white">Wazuh SIEM Server & Sysmon Telemetry Pipeline</h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Centralizes authentication logs, kernel events, and firewall packet telemetry. 
          Deploys the Wazuh Indexer, Server, and Dashboard alongside the Microsoft Sysinternals Sysmon driver.
        </p>
      </div>

      {/* Wazuh All-in-One Deployment */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            1. Wazuh Manager 4.9 Installation (Ubuntu Server 192.168.10.10)
          </h3>
          <span className="text-xs font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
            Automated Assistant
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Execute the official unattended Wazuh installation script on the dedicated SIEM machine:
        </p>

        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 relative">
          <button
            onClick={() => copyCode('curl -sO https://packages.wazuh.com/4.9/wazuh-install.sh && sudo bash ./wazuh-install.sh -a', 'wazuh-inst')}
            className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            {copiedId === 'wazuh-inst' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId === 'wazuh-inst' ? 'Copied' : 'Copy'}</span>
          </button>
          <div className="text-slate-400"># Run on Ubuntu 22.04 LTS (192.168.10.10)</div>
          <div className="text-cyan-400 mt-1">
            curl -sO https://packages.wazuh.com/4.9/wazuh-install.sh && sudo bash ./wazuh-install.sh -a
          </div>
        </div>

        <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-lg text-xs space-y-1">
          <span className="text-slate-400 font-semibold">Post-Install Verification:</span>
          <p className="text-slate-300 font-mono">
            Dashboard URL: <strong className="text-cyan-400">https://192.168.10.10</strong> | Admin credentials saved in <code className="text-emerald-400">wazuh-passwords.txt</code>
          </p>
        </div>
      </div>

      {/* Linux Agent Enrollment */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-5 h-5 text-emerald-400" />
          2. Linux Endpoint Agent Enrollment (srv-app01 192.168.10.20)
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Run these commands on the Ubuntu Enterprise server to install the lightweight C daemon and register with the Wazuh Manager:
        </p>

        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 relative">
          <button
            onClick={() => copyCode(
`wget -qO - https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo gpg --dearmor -o /usr/share/keyrings/wazuh.gpg
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | sudo tee -a /etc/apt/sources.list.d/wazuh.list
sudo apt-get update && sudo WAZUH_MANAGER='192.168.10.10' WAZUH_AGENT_NAME='srv-app01' apt-get install wazuh-agent
sudo systemctl daemon-reload && sudo systemctl enable --now wazuh-agent`,
              'linux-agent'
            )}
            className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            {copiedId === 'linux-agent' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId === 'linux-agent' ? 'Copied' : 'Copy'}</span>
          </button>
          <pre className="text-cyan-400 leading-relaxed whitespace-pre-wrap">
{`# 1. Register Wazuh repository & import signing key
wget -qO - https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo gpg --dearmor -o /usr/share/keyrings/wazuh.gpg
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | sudo tee -a /etc/apt/sources.list.d/wazuh.list

# 2. Install Wazuh agent pointing to manager 192.168.10.10
sudo apt-get update && sudo WAZUH_MANAGER='192.168.10.10' WAZUH_AGENT_NAME='srv-app01' apt-get install wazuh-agent

# 3. Start and enable service on boot
sudo systemctl daemon-reload && sudo systemctl enable --now wazuh-agent`}
          </pre>
        </div>
      </div>

      {/* Windows Sysmon & Agent Installation */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          3. Windows Endpoint & Sysmon Telemetry (win-client01 192.168.10.30)
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          Open an Administrative PowerShell window on the Windows VM to install Sysmon with SwiftOnSecurity modular rules, then install the Wazuh agent MSI:
        </p>

        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-200 relative">
          <button
            onClick={() => copyCode(
`# 1. Download and install Sysmon with SwiftOnSecurity configuration
Invoke-WebRequest -Uri "https://live.sysinternals.com/Sysmon64.exe" -OutFile "$env:TEMP\\Sysmon64.exe"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/SwiftOnSecurity/sysmon-config/master/sysmonconfig-export.xml" -OutFile "$env:TEMP\\sysmonconfig.xml"
& "$env:TEMP\\Sysmon64.exe" -accepteula -i "$env:TEMP\\sysmonconfig.xml"

# 2. Download and install Wazuh Agent MSI
Invoke-WebRequest -Uri "https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.0-1.msi" -OutFile "$env:TEMP\\wazuh-agent.msi"
msiexec.exe /i "$env:TEMP\\wazuh-agent.msi" /q WAZUH_MANAGER="192.168.10.10" WAZUH_REGISTRATION_SERVER="192.168.10.10" WAZUH_AGENT_NAME="win-client01"
NET START WazuhSvc`,
              'win-agent'
            )}
            className="absolute top-3 right-3 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            {copiedId === 'win-agent' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId === 'win-agent' ? 'Copied' : 'Copy'}</span>
          </button>
          <pre className="text-cyan-400 leading-relaxed whitespace-pre-wrap">
{`# 1. Download and install Sysmon with SwiftOnSecurity configuration
Invoke-WebRequest -Uri "https://live.sysinternals.com/Sysmon64.exe" -OutFile "$env:TEMP\\Sysmon64.exe"
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/SwiftOnSecurity/sysmon-config/master/sysmonconfig-export.xml" -OutFile "$env:TEMP\\sysmonconfig.xml"
& "$env:TEMP\\Sysmon64.exe" -accepteula -i "$env:TEMP\\sysmonconfig.xml"

# 2. Download and silently install Wazuh Agent MSI pointing to 192.168.10.10
Invoke-WebRequest -Uri "https://packages.wazuh.com/4.x/windows/wazuh-agent-4.9.0-1.msi" -OutFile "$env:TEMP\\wazuh-agent.msi"
msiexec.exe /i "$env:TEMP\\wazuh-agent.msi" /q WAZUH_MANAGER="192.168.10.10" WAZUH_AGENT_NAME="win-client01"
NET START WazuhSvc`}
          </pre>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="font-bold text-white block">Event ID 1: Process Creation</span>
            <span className="text-slate-400 mt-1 block">Monitors command-line arguments, parent-child processes, SHA256 hashes.</span>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="font-bold text-white block">Event ID 3: Network Connect</span>
            <span className="text-slate-400 mt-1 block">Logs destination IP and port for every outbound TCP/UDP socket opened by software.</span>
          </div>
          <div className="p-3 bg-slate-950 rounded border border-slate-800">
            <span className="font-bold text-white block">Event ID 22: DNS Query</span>
            <span className="text-slate-400 mt-1 block">Captures domain query names to detect C2 domain beacons & DGA malware.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
