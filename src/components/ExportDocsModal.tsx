/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Download, FileText, Code, Shield, Check, Copy, ExternalLink, CheckCircle2 } from 'lucide-react';
import { SUBNETS, VIRTUAL_MACHINES, SECURITY_SCENARIOS, TEST_CASES, PYTHON_LOG_PARSER_SCRIPT } from '../data/labData';

interface ExportDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToPhase: (phaseNum: number) => void;
}

export const ExportDocsModal: React.FC<ExportDocsModalProps> = ({ isOpen, onClose, onNavigateToPhase }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [copiedSuccess, setCopiedSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const triggerDownload = (filename: string, content: string, mimeType = 'text/markdown') => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(filename);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const copyContent = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSuccess(id);
    setTimeout(() => setCopiedSuccess(null), 2000);
  };

  const readmeContent = `# Enterprise Network Lab with SIEM-Based Security Monitoring

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
${SUBNETS.map(s => `| ${s.name} | ${s.cidr} | ${s.gateway} | ${s.purpose} |`).join('\n')}

## 🛡️ Tested MITRE ATT&CK Detections
${SECURITY_SCENARIOS.map((s, idx) => `${idx + 1}. **${s.mitreId} (${s.title}):** ${s.concept} Wazuh Rule ${s.wazuhRuleId} (Level ${s.severityScore}).`).join('\n')}

## ⚡ Automation
Includes \`scripts/parse_siem_alerts.py\` to parse Wazuh \`alerts.json\` telemetry, isolate repeated authentication failures, and generate JSON/CSV threat summaries.
`;

  const fullLabManual = `# COMPLETE ENTERPRISE NETWORK LAB & SIEM MONITORING MANUAL

## PHASE 1: REQUIREMENTS & ARCHITECTURE
${readmeContent}

## PHASE 2: ENVIRONMENT SETUP
- Hypervisor: VirtualBox 7.x / VMware Workstation
- Virtual Switches:
  * intnet-lan (192.168.10.0/24)
  * intnet-dmz (192.168.20.0/24)
- pfSense Interfaces:
  * em0: WAN (NAT)
  * em1: LAN (192.168.10.1/24)
  * em2: DMZ (192.168.20.1/24)

## PHASE 3: FIREWALL RULES
- Rule 1 (DMZ): Block DMZ Net to LAN Net (192.168.10.0/24)
- Rule 2 (LAN): Allow LAN Net to pfSense Port 443/80 (Anti-lockout)
- Rule 3 (LAN): Allow LAN Net to WAN HTTP/HTTPS (Port 80, 443)
- Rule 4 (WAN): Default Inbound Deny (Block RFC1918 + Bogons)

## PHASE 4: SIEM & SYSMON INSTALLATION
- Wazuh Manager: \`curl -sO https://packages.wazuh.com/4.9/wazuh-install.sh && sudo bash ./wazuh-install.sh -a\`
- Linux Agent: Enrolled pointing to 192.168.10.10:1514
- Windows Sysmon: Installed with SwiftOnSecurity modular XML rules

## PHASE 5: SECURITY DETECTION SIMULATIONS
${SECURITY_SCENARIOS.map(s => `### ${s.title} (${s.mitreId})
- Command: \`${s.kaliCommand}\`
- Log: ${s.rawLogSample}
- Wazuh Rule: ${s.wazuhRuleId} (Level ${s.severityScore})
- Remediation: ${s.remediationSteps.join('; ')}
`).join('\n')}

## PHASE 8: PYTHON AUTOMATION SCRIPT
\`\`\`python
${PYTHON_LOG_PARSER_SCRIPT}
\`\`\`

## PHASE 9: TEST VERIFICATION MATRIX
| Test ID | Objective | Command | Status |
|---|---|---|---|
${TEST_CASES.map(tc => `| ${tc.id} | ${tc.objective} | \`${tc.verificationCommand}\` | ${tc.status} |`).join('\n')}
`;

  const testPlanMarkdown = `# TEST VERIFICATION MATRIX
| Test ID | Phase & Objective | Verification Command | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
${TEST_CASES.map(t => `| ${t.id} | ${t.objective} | \`${t.verificationCommand}\` | ${t.expectedResult} | ${t.actualResult} | ${t.status} |`).join('\n')}
`;

  const incidentReportMarkdown = `# SECURITY INCIDENT REPORT: INC-2026-001
**Title:** High-Volume SSH Brute Force against srv-app01  
**Severity:** HIGH (Score 8/10)  
**Target Asset:** 192.168.10.20 (srv-app01)  
**Attacking Entity:** 192.168.1.50 (Kali Linux via WAN)  
**Resolution Status:** Contained & Mitigated  

---
### 1. Incident Timeline
- **09:34:10 UTC:** First failed SSH attempt logged for user ubuntu from 192.168.1.50.
- **09:34:25 UTC:** Wazuh Rule 5712 triggers after 8 consecutive failed attempts in 15 seconds.
- **09:34:26 UTC:** Active Response script invokes iptables drop on target host for 600s.
- **09:36:00 UTC:** SOC Analyst confirms no successful login occurred in /var/log/auth.log.
- **09:40:00 UTC:** Firewall drop alias permanently updated; SSH password auth disabled.

---
### 2. Root Cause Analysis (RCA)
SSH service listening with password authentication enabled on default port 22.

---
### 3. Immediate Containment Actions Taken
Automated Wazuh active-response firewall drop + pfSense WAN rule drop.

---
### 4. Long-Term Remediation & Hardening
Disabled PasswordAuthentication in sshd_config. Enforced Ed25519 public keys only.
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export Documentation & Lab Package</h3>
              <p className="text-xs text-slate-400">Download production-ready Markdown, Python scripts, and test reports.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Download Items */}
        <div className="p-6 overflow-y-auto space-y-4">
          {downloadSuccess && (
            <div className="p-3 bg-emerald-950/50 border border-emerald-800 rounded-lg text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                Successfully downloaded <strong>{downloadSuccess}</strong> to your computer!
              </span>
            </div>
          )}

          {/* Master All-in-One Download Banner */}
          <div className="p-4 bg-gradient-to-r from-cyan-950/60 via-slate-900 to-slate-900 border border-cyan-500/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Recommended</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">Complete Master Manual</span>
              </div>
              <h4 className="text-sm font-bold text-white mt-1">Full 11-Phase Lab Manual (All-In-One .md)</h4>
              <p className="text-xs text-slate-400 mt-0.5">Includes architecture, IP matrix, firewall rules, detections, and test plan.</p>
            </div>
            <button
              onClick={() => triggerDownload('ENTERPRISE_SIEM_LAB_MANUAL.md', fullLabManual)}
              className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md shrink-0"
            >
              <Download className="w-4 h-4" />
              <span>Download Master Manual</span>
            </button>
          </div>

          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider pt-2">
            Individual Project Artifacts:
          </div>

          {/* Individual Artifact Cards */}
          <div className="space-y-3">
            {/* README.md */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white">README.md (GitHub Showcase)</h5>
                  <p className="text-[11px] text-slate-400">ATS-optimized markdown formatted for your GitHub repository.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyContent(readmeContent, 'copy-readme')}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedSuccess === 'copy-readme' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess === 'copy-readme' ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => triggerDownload('README.md', readmeContent)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Python Automation Script */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Code className="w-4 h-4 text-cyan-400 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white">parse_siem_alerts.py (Phase 8 Automation)</h5>
                  <p className="text-[11px] text-slate-400">Standalone Python script to parse alerts.json and isolate brute-force IPs.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyContent(PYTHON_LOG_PARSER_SCRIPT, 'copy-py')}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedSuccess === 'copy-py' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess === 'copy-py' ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => triggerDownload('parse_siem_alerts.py', PYTHON_LOG_PARSER_SCRIPT, 'text/x-python')}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Test Plan Matrix */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white">test_plan_matrix.md (Phase 9 QA Matrix)</h5>
                  <p className="text-[11px] text-slate-400">6 verified test cases with commands, expected results, and actual outputs.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyContent(testPlanMarkdown, 'copy-tp')}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedSuccess === 'copy-tp' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess === 'copy-tp' ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => triggerDownload('test_plan_matrix.md', testPlanMarkdown)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>

            {/* Incident Report */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                <div>
                  <h5 className="text-xs font-bold text-white">incident_report_INC-2026-001.md (Phase 7)</h5>
                  <p className="text-[11px] text-slate-400">Sample NIST 6-stage SOC incident report for SSH brute force.</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyContent(incidentReportMarkdown, 'copy-ir')}
                  className="px-2.5 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 transition-colors"
                >
                  {copiedSuccess === 'copy-ir' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSuccess === 'copy-ir' ? 'Copied' : 'Copy'}</span>
                </button>
                <button
                  onClick={() => triggerDownload('incident_report_INC-2026-001.md', incidentReportMarkdown)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onClose();
              onNavigateToPhase(10);
            }}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
          >
            <span>View GitHub Folder Structure & README in Phase 10</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
