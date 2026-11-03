/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Briefcase, MessageSquare, Copy, Check, ChevronDown, ChevronUp, UserCheck, Star } from 'lucide-react';

export const Phase11InterviewCareer: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const resumeBullets = [
    'Architected an isolated enterprise virtual lab featuring a dual-homed pfSense 2.7.2 firewall, multi-subnet VLAN segmentation (LAN 192.168.10.0/24 vs. DMZ 192.168.20.0/24), and stateful ingress/egress filtering.',
    'Deployed Wazuh 4.9 SIEM and centralized telemetry pipelines across Ubuntu Server 22.04 and Windows Server 2022 endpoints via TLS-encrypted agent daemons and syslog forwarders.',
    'Engineered advanced Windows endpoint visibility by authoring custom Sysmon v15 modular profiles, capturing Process Creation (Event 1), Network Connections (Event 3), and DNS queries (Event 22).',
    'Conducted safe adversary emulations mapped to MITRE ATT&CK (T1046, T1110, T1071.004, T1021) using Kali Linux, Nmap, and Hydra to validate SIEM detection thresholds and active-response blacklisting.',
    'Developed a Python 3 automation utility to ingest SIEM alerts.json, parse authentication anomaly frequencies, and generate structured JSON/CSV incident triage digests for SOC Tier 1 escalations.'
  ];

  const faqs = [
    {
      q: 'Why did you choose pfSense and how did you configure network segmentation?',
      a: 'I chose pfSense CE because it provides an industry-standard FreeBSD packet filter with stateful inspection and multi-interface routing. I configured 3 separate virtual adapters: WAN (NAT uplink), LAN (192.168.10.0/24) for internal corporate systems, and DMZ (192.168.20.0/24) for public services. I enforced an explicit zero-trust firewall rule strictly dropping any DMZ-to-LAN initiation, preventing lateral movement if the perimeter web server is compromised.'
    },
    {
      q: 'How does Wazuh correlate security events and what is an active response?',
      a: 'Wazuh uses pre-decoders and regex decoders to extract fields from logs, then tests them against an XML rule hierarchy. Each rule has a severity level (0-15) and frequency threshold. For example, in my SSH brute force simulation, Rule 5710 detects a single failure, but Rule 5712 triggers at Level 10 if 6 failures occur from the same source IP within 120 seconds. Wazuh Active Response then executes an automated shell command on the host (like iptables drop) to quarantine the attacker.'
    },
    {
      q: 'Why is Sysmon necessary on Windows if Windows Event Viewer already logs events?',
      a: 'Standard Windows Security logs (like Event ID 4624/4625) only log that an authentication succeeded or failed; they do not reveal the parent process tree, full command-line arguments, process GUIDs, or loaded DLLs. Sysmon provides kernel-level telemetry. With Event ID 1 (Process Create) and Event ID 3 (Network Connection), I can trace exactly which executable opened an SMB port or spawned cmd.exe.'
    },
    {
      q: 'How would you differentiate a true positive port scan from routine network traffic?',
      a: 'A true positive port scan produces a rapid burst of TCP SYN packets across multiple sequential or high-value destination ports (e.g., 22, 80, 443, 3389) from a single source IP, receiving either RST or no ACK, with no corresponding application-layer payload. In contrast, normal traffic connects to specific destination ports, completes the 3-way handshake, and exchanges TLS or HTTP application data.'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>Phase 11: Career Development, ATS Resume & Technical Interview Masterclass</span>
        </div>
        <h2 className="text-xl font-bold text-white">Interview Readiness & ATS Resume Asset Kit</h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          High-impact resume bullet points, professional LinkedIn project summary, 2-minute elevator pitch, 
          and senior-level answers for SOC Analyst & Network Security Engineer job interviews.
        </p>
      </div>

      {/* ATS Resume Bullets Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-cyan-400" />
            ATS-Optimized Resume Bullet Points (Copy Directly)
          </h3>
          <button
            onClick={() => copyText(resumeBullets.map(b => `• ${b}`).join('\n'), 'bullets')}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copiedId === 'bullets' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedId === 'bullets' ? 'Copied' : 'Copy All Bullets'}</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {resumeBullets.map((bullet, idx) => (
            <div key={idx} className="p-3 bg-slate-950/80 rounded-lg border border-slate-800 flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 shrink-0" />
              <p className="text-xs text-slate-300 leading-relaxed">{bullet}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 2-Minute Elevator Pitch & 5-Minute Technical Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-400" />
              2-Minute Elevator Pitch (How to Explain to a Recruiter)
            </h3>
            <button
              onClick={() =>
                copyText(
                  `"I built a production-grade enterprise network security lab simulating a corporate infrastructure. I configured a pfSense firewall with three distinct network segments: WAN, a trusted corporate LAN, and an isolated DMZ. Inside the LAN, I deployed a centralized Wazuh SIEM server, along with monitored Ubuntu and Windows endpoints. I instrumented Windows with Microsoft Sysmon for deep process and network telemetry. Then, using Kali Linux, I safely emulated six attack techniques mapped to MITRE ATT&CK—such as SSH brute force, SMB password spray, and unauthorized DMZ lateral pivoting. I verified that our firewall policies and Wazuh correlation rules successfully detected and contained every incident, and wrote a Python automation script to parse logs and generate triage reports."`,
                  'pitch'
                )
              }
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedId === 'pitch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'pitch' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800 italic">
            "I built a production-grade enterprise network security lab simulating a corporate infrastructure. 
            I configured a pfSense firewall with three distinct network segments: WAN, a trusted corporate LAN, 
            and an isolated DMZ. Inside the LAN, I deployed a centralized Wazuh SIEM server, along with monitored 
            Ubuntu and Windows endpoints. I instrumented Windows with Microsoft Sysmon for deep process and network 
            telemetry. Then, using Kali Linux, I safely emulated six attack techniques mapped to MITRE ATT&CK—such 
            as SSH brute force, SMB password spray, and unauthorized DMZ lateral pivoting. I verified that our 
            firewall policies and Wazuh correlation rules successfully detected and contained every incident, 
            and wrote a Python automation script to parse logs and generate triage reports."
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-cyan-400" />
              LinkedIn Project Summary (Featured Section)
            </h3>
            <button
              onClick={() =>
                copyText(
                  `🚀 Excited to share my latest cybersecurity engineering project: "Enterprise Network Lab with SIEM-Based Security Monitoring"\n\nIn this project, I engineered a realistic simulated enterprise environment:\n🔹 Perimeter Security: Deployed pfSense 2.7.2 CE with 3 virtual NICs, configuring stateful routing, Unbound DNS, and strict DMZ-to-LAN isolation policies.\n🔹 Centralized SIEM: Installed Wazuh 4.9 Manager & Indexer, ingesting syslogs and endpoint telemetry over encrypted TLS channels.\n🔹 Endpoint Telemetry: Configured Microsoft Sysinternals Sysmon v15 + SwiftOnSecurity rules on Windows Server 2022 to log Event IDs 1, 3, and 22.\n🔹 Adversary Emulation: Safely executed 6 attack simulations mapped to MITRE ATT&CK (Nmap SYN scan, SSH brute force, SMB password spray, C2 DNS queries, and lateral pivot attempts).\n🔹 SOC Automation: Authored Python scripts to parse alerts.json, extract threat frequencies, and export incident digests.\n\nCheck out the full repository and architecture documentation on GitHub!`,
                  'linkedin'
                )
              }
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              {copiedId === 'linkedin' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedId === 'linkedin' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-4 rounded-lg border border-slate-800">
            <strong>Key Highlights to Feature:</strong><br />
            • Multi-segment routing & zero-trust firewalling<br />
            • Wazuh SIEM rule engineering & MITRE ATT&CK mapping<br />
            • Sysmon process creation & network socket auditing<br />
            • Python log parsing & automated triage
          </p>
        </div>
      </div>

      {/* Technical Interview Q&A Accordion */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          Technical Interview Questions & Senior Engineer Model Answers
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-lg border border-slate-800">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left text-xs font-bold text-white hover:text-cyan-400 transition-colors"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {openFaq === idx && (
                <p className="mt-3 text-xs text-slate-300 leading-relaxed pt-3 border-t border-slate-800/80">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
