/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GitBranch, FolderTree, Copy, Check, FileDown, Terminal, BookOpen, CheckSquare, Download } from 'lucide-react';

export const Phase10GithubDocsView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const projectTree = `enterprise-network-siem-lab/
├── README.md
├── docs/
│   ├── network-architecture.png
│   ├── ip-addressing-matrix.md
│   ├── pfsense-firewall-rules.md
│   ├── wazuh-siem-setup-guide.md
│   ├── detection-engineering-rules.md
│   ├── sysmon-configuration.xml
│   └── incident-report-sample.md
├── configs/
│   ├── pfsense/
│   │   └── config.xml
│   ├── wazuh/
│   │   ├── ossec.conf
│   │   └── local_rules.xml
│   └── sysmon/
│       └── sysmonconfig-export.xml
├── scripts/
│   ├── parse_siem_alerts.py
│   ├── generate_security_report.py
│   └── simulate_lab_attacks.sh
├── screenshots/
│   ├── 01_virtualbox_network_adapters.png
│   ├── 02_pfsense_dashboard_interfaces.png
│   ├── 03_pfsense_firewall_rules.png
│   ├── 04_wazuh_agent_list.png
│   ├── 05_nmap_recon_alert.png
│   ├── 06_ssh_brute_force_alert.png
│   ├── 07_windows_4625_alert.png
│   ├── 08_dmz_lateral_pivot_blocked.png
│   └── 09_python_automation_output.png
└── tests/
    └── test_plan_matrix.md`;

  const readmeMarkdown = `# Enterprise Network Lab with SIEM-Based Security Monitoring

A production-style cybersecurity homelab demonstrating enterprise network segmentation, stateful firewalling, centralized log aggregation, and SOC threat detection.

## 🏛️ Architecture Overview
- **Perimeter Firewall:** pfSense 2.7.2 CE (Dual internal segments + NAT WAN)
- **Central SIEM:** Wazuh 4.9 Manager, Indexer & Dashboard
- **Monitored Endpoints:** Ubuntu 22.04 LTS & Windows Server 2022
- **Deep Endpoint Telemetry:** Microsoft Sysmon v15 + SwiftOnSecurity configuration
- **Attacker VM:** Kali Linux 2024 (Reconnaissance, Brute-Force, C2 simulation)

## 🌐 Network Addressing Scheme
| Subnet | CIDR | Gateway | Purpose |
|---|---|---|---|
| WAN | 192.168.1.0/24 | VirtualBox NAT | External Uplink & Testing |
| LAN | 192.168.10.0/24 | 192.168.10.1 | Trusted Corporate Assets (Wazuh, Ubuntu, Windows) |
| DMZ | 192.168.20.0/24 | 192.168.20.1 | Semi-trusted Public Web Services |

## 🛡️ Tested MITRE ATT&CK Detections
1. **T1046 (Network Service Discovery):** Nmap TCP SYN scan blocked & logged by pfSense filterlog (Rule 87701).
2. **T1110.001 (SSH Password Spray):** Hydra dictionary attack detected by Wazuh Rule 5712 (Level 10) + Active Response IP drop.
3. **T1110 (Brute Force):** Windows Security Event ID 4625 logon failure spike detected by Wazuh Rule 60122.
4. **T1071.004 (DNS C2 Beacon):** High-entropy domain lookup captured via Sysmon Event 22.
5. **T1021 (Lateral Movement):** Unauthorized DMZ-to-LAN pivot blocked by pfSense firewall policy (Rule 87702).

## ⚡ Automation
Includes \`scripts/parse_siem_alerts.py\` to parse Wazuh \`alerts.json\` telemetry, isolate repeated authentication failures, and generate JSON/CSV threat summaries.
`;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>Phase 10: GitHub Repository & Professional Documentation</span>
        </div>
        <h2 className="text-xl font-bold text-white">Repository Blueprint & Showcase README</h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Ready-to-publish project directory layout, complete portfolio README.md, and essential screenshot checklist for your GitHub profile.
        </p>
      </div>

      {/* Official Repository & Domain Name Naming Hub */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          Recommended Repository & Domain Naming Scheme
        </h3>
        <p className="text-xs text-slate-400">
          Curated industry-standard naming conventions for your GitHub repository and internal/external lab domains.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* GitHub Repo Names */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block text-cyan-400">
              GitHub Repository Names:
            </span>
            <div className="space-y-2">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    enterprise-network-siem-lab
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">Primary Recommended (Clean, SEO & ATS optimized)</span>
                </div>
                <button
                  onClick={() => copyToClipboard('enterprise-network-siem-lab', 'repo1')}
                  className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white"
                >
                  {copiedSection === 'repo1' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    enterprise-soc-siem-monitoring
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">Alternative: Emphasizes SOC Operations</span>
                </div>
                <button
                  onClick={() => copyToClipboard('enterprise-soc-siem-monitoring', 'repo2')}
                  className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white"
                >
                  {copiedSection === 'repo2' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    pfsense-wazuh-cyber-lab
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">Alternative: Tech Stack focused</span>
                </div>
                <button
                  onClick={() => copyToClipboard('pfsense-wazuh-cyber-lab', 'repo3')}
                  className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white"
                >
                  {copiedSection === 'repo3' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>

          {/* Lab Domain Names */}
          <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider block text-cyan-400">
              Lab DNS & Active Directory Domains:
            </span>
            <div className="space-y-2">
              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    enterprise.lab
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">Primary Internal Zone (RFC 6761 reserved .lab)</span>
                </div>
                <button
                  onClick={() => copyToClipboard('enterprise.lab', 'dom1')}
                  className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white"
                >
                  {copiedSection === 'dom1' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    corp.enterprise.local
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">Active Directory / Windows Forest Root</span>
                </div>
                <button
                  onClick={() => copyToClipboard('corp.enterprise.local', 'dom2')}
                  className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white"
                >
                  {copiedSection === 'dom2' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-2.5 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono font-bold text-white block">
                    secops-lab.internal
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">SIEM & SOC Management Zone</span>
                </div>
                <button
                  onClick={() => copyToClipboard('secops-lab.internal', 'dom3')}
                  className="px-2 py-1 rounded bg-slate-800 text-[11px] text-slate-300 hover:text-white"
                >
                  {copiedSection === 'dom3' ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FQDN Host Records Table */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-slate-300 block mb-2">
            Host FQDN (Fully Qualified Domain Name) Mapping:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">pfSense Firewall:</span>
              <span className="text-cyan-400">pfsense.enterprise.lab</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Wazuh SIEM Manager:</span>
              <span className="text-cyan-400">wazuh.enterprise.lab</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Ubuntu App Server:</span>
              <span className="text-cyan-400">srv-app01.enterprise.lab</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Windows Client:</span>
              <span className="text-cyan-400">win-client01.enterprise.lab</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">DMZ Web Server:</span>
              <span className="text-amber-400">dmz-web.enterprise.lab</span>
            </div>
            <div className="p-2 bg-slate-950 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Kali Attacker:</span>
              <span className="text-rose-400">kali.enterprise.lab</span>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Structure & Git Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Folder Tree */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-cyan-400" />
              Standard Project Folder Structure
            </h3>
            <button
              onClick={() => copyToClipboard(projectTree, 'tree')}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedSection === 'tree' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'tree' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed max-h-[320px]">
            {projectTree}
          </pre>
        </div>

        {/* Git Upload Terminal Instructions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-emerald-400" />
              Git Commands to Publish to GitHub
            </h3>
            <button
              onClick={() =>
                copyToClipboard(
`git init
git add .
git commit -m "Initial commit: Enterprise Network Lab with SIEM Monitoring"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/enterprise-network-siem-lab.git
git push -u origin main`,
                  'git-cmd'
                )
              }
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedSection === 'git-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'git-cmd' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-cyan-400 space-y-2">
            <div># 1. Initialize local repository</div>
            <div className="text-white">git init</div>
            <div className="text-white">git add .</div>
            <div className="text-white">git commit -m "feat: complete enterprise network lab with Wazuh SIEM & Sysmon"</div>
            <div className="mt-2 text-slate-400"># 2. Link your GitHub repository</div>
            <div className="text-white">git branch -M main</div>
            <div className="text-white">git remote add origin https://github.com/YOUR_USERNAME/enterprise-network-siem-lab.git</div>
            <div className="text-white">git push -u origin main</div>
          </div>

          {/* Screenshot Checklist */}
          <div className="mt-4 p-3.5 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              Mandatory Proof Screenshots Checklist:
            </span>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>✓ pfSense Dashboard showing 3 active interfaces (WAN, LAN, DMZ)</li>
              <li>✓ Wazuh Dashboard showing both Linux and Windows agents "Active"</li>
              <li>✓ Windows Event Viewer showing Sysmon Event ID 1 & 3 records</li>
              <li>✓ Wazuh Security Events panel showing SSH brute-force Level 10 alert</li>
              <li>✓ pfSense system log showing DMZ-to-LAN block event</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Complete README.md Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Complete Showcase README.md Template
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => copyToClipboard(readmeMarkdown, 'readme')}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedSection === 'readme' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'readme' ? 'Copied' : 'Copy README.md'}</span>
            </button>
            <button
              onClick={() => downloadFile('README.md', readmeMarkdown)}
              className="px-3 py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download README.md</span>
            </button>
          </div>
        </div>

        <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-[380px]">
          {readmeMarkdown}
        </pre>
      </div>
    </div>
  );
};
