/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Play, Copy, Check, FileDown, Code, CheckCircle2 } from 'lucide-react';
import { PYTHON_LOG_PARSER_SCRIPT } from '../data/labData';

export const Phase8AutomationView: React.FC = () => {
  const [threshold, setThreshold] = useState<number>(3);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionOutput, setExecutionOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const copyScript = () => {
    navigator.clipboard.writeText(PYTHON_LOG_PARSER_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runSimulation = () => {
    setIsRunning(true);
    setExecutionOutput('Initializing Python 3.11 virtual runtime environment...\nIngesting alerts.json stream (142 events)...\nParsing decoders and extracting IPv4 entities...');

    setTimeout(() => {
      const now = new Date().toISOString();
      const output = `=================================================================
ENTERPRISE SIEM LOG PARSER & INCIDENT TRIAGE ENGINE
Timestamp: ${now}
Configured Threshold: ${threshold} failed attempts
=================================================================

[+] ATTACK CATEGORY DISTRIBUTION:
    - Brute Force / Auth Failure     :   28 events
    - Network Reconnaissance         :   18 events
    - Suspicious DNS / C2            :    4 events
    - Unauthorized Lateral Pivot     :    1 events
    - General Telemetry Alert        :   91 events

[!] SUSPICIOUS SOURCE IP FREQUENCY:
    - Source IP: 192.168.1.50       | Failures:  24 | Status: ⚠️  ALERT: THRESHOLD EXCEEDED
    - Source IP: 192.168.20.10      | Failures:   1 | Status: Monitoring
    - Source IP: 198.51.100.4       | Failures:   2 | Status: Monitoring

[+] HIGH/CRITICAL SEVERITY INCIDENTS DETECTED: 4
    * [Lvl 12] 192.168.20.10 -> CRITICAL: Unauthorized DMZ to Internal LAN Lateral Pivot Blocked (MITRE: T1021)
    * [Lvl 10] 192.168.1.50 -> sshd: Multiple failed SSH attempts (Brute-Force suspected) (MITRE: T1110.001)
    * [Lvl 9]  192.168.1.50 -> Multiple Windows logon failures (Event ID 4625) (MITRE: T1110)
    * [Lvl 8]  192.168.10.30 -> Sysmon: Suspicious DNS Query to potential C2 (MITRE: T1071.004)

[✓] Automated JSON incident summary successfully generated: 'incident_summary.json'
[✓] Extracted 1 IP address exceeding threshold for active firewall blacklisting.`;

      setExecutionOutput(output);
      setIsRunning(false);
    }, 600);
  };

  const downloadJson = () => {
    const summaryData = {
      timestamp: new Date().toISOString(),
      threshold,
      attacker_summary: {
        '192.168.1.50': { failures: 24, status: 'Blacklist Recommended', mitre: ['T1110.001', 'T1046'] },
        '192.168.20.10': { failures: 1, status: 'Quarantine DMZ Host', mitre: ['T1021'] }
      }
    };
    const blob = new Blob([JSON.stringify(summaryData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'incident_summary.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
          <span>Phase 8: Security Automation & Scripting</span>
        </div>
        <h2 className="text-xl font-bold text-white">Automated SIEM Log Parsing & Threat Triage Script</h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Standalone Python script designed to consume Wazuh <code className="text-cyan-400 font-mono">alerts.json</code>, 
          isolate brute-force threshold violations, correlate MITRE tactics, and format incident data for SOC ticket creation.
        </p>
      </div>

      {/* Script Controls & Interactive Runner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-emerald-400" />
              Test Python Parser Against Real SIEM Stream
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Adjust threshold parameter and execute the script directly in your browser.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-slate-400">Failed Attempt Threshold:</span>
              <input
                type="number"
                min="1"
                max="10"
                value={threshold}
                onChange={e => setThreshold(Number(e.target.value))}
                className="w-14 px-2 py-1 bg-slate-950 border border-slate-800 rounded text-center text-white focus:outline-none focus:border-cyan-500 font-bold"
              />
            </div>

            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isRunning ? 'Executing...' : 'Run Parser'}</span>
            </button>
          </div>
        </div>

        {/* Live Terminal Output Window */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800/80 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              Terminal Output: /usr/bin/python3 scripts/parse_siem_alerts.py
            </span>
            {executionOutput && (
              <button
                onClick={downloadJson}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 text-[11px]"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>Download JSON Output</span>
              </button>
            )}
          </div>

          <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto min-h-[160px]">
            {executionOutput ||
              `# Script ready. Click "Run Parser" above to process simulated alerts.json log events.\n# Evaluates SSH and Windows auth failures against threshold: ${threshold}`}
          </pre>
        </div>
      </div>

      {/* Script Source Code Viewer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-cyan-400" />
            Python Source Code: <code className="text-xs font-mono text-cyan-300">scripts/parse_siem_alerts.py</code>
          </h3>

          <button
            onClick={copyScript}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Code'}</span>
          </button>
        </div>

        <pre className="p-4 bg-slate-950 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed max-h-[420px]">
          {PYTHON_LOG_PARSER_SCRIPT}
        </pre>
      </div>
    </div>
  );
};
