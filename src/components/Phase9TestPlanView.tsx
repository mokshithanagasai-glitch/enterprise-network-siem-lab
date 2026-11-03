/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck, Terminal, AlertCircle } from 'lucide-react';
import { TEST_CASES, TestCase } from '../data/labData';

export const Phase9TestPlanView: React.FC = () => {
  const [testCases, setTestCases] = useState<TestCase[]>(TEST_CASES);

  const toggleStatus = (id: string) => {
    setTestCases(prev =>
      prev.map(tc => {
        if (tc.id === id) {
          const nextStatus = tc.status === 'Passed' ? 'Failed' : tc.status === 'Failed' ? 'Pending' : 'Passed';
          return { ...tc, status: nextStatus };
        }
        return tc;
      })
    );
  };

  const passedCount = testCases.filter(t => t.status === 'Passed').length;

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400 uppercase tracking-wider mb-1">
              <span>Phase 9: Testing, Quality Assurance & Evidence Validation</span>
            </div>
            <h2 className="text-xl font-bold text-white">Verification Test Matrix & Pass/Fail Criteria</h2>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">Execution Score:</span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
              {passedCount} / {testCases.length} Tests Verified
            </span>
          </div>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
          Industry standard rule: <em>Do not claim a detection works until verified with observable evidence.</em> 
          Each test specifies the objective, verification command, expected outcome, and logged result.
        </p>
      </div>

      {/* Test Matrix Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/60 font-mono">
                <th className="py-2.5 px-3">Test ID</th>
                <th className="py-2.5 px-3">Phase & Objective</th>
                <th className="py-2.5 px-3">Verification Command</th>
                <th className="py-2.5 px-3">Expected Result</th>
                <th className="py-2.5 px-3">Actual Result (Verified)</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {testCases.map(tc => (
                <tr key={tc.id} className="hover:bg-slate-800/30">
                  <td className="py-3 px-3 font-bold text-cyan-400">{tc.id}</td>
                  <td className="py-3 px-3 font-sans">
                    <span className="text-[10px] text-slate-400 block">{tc.phase}</span>
                    <span className="text-white font-medium">{tc.objective}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-mono text-[11px] max-w-xs break-all">
                    {tc.verificationCommand}
                  </td>
                  <td className="py-3 px-3 text-slate-300 font-sans text-xs max-w-xs leading-snug">
                    {tc.expectedResult}
                  </td>
                  <td className="py-3 px-3 text-emerald-300 font-sans text-xs max-w-xs leading-snug">
                    {tc.actualResult}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => toggleStatus(tc.id)}
                      className={`px-2.5 py-1 rounded text-[11px] font-bold font-sans transition-colors ${
                        tc.status === 'Passed'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : tc.status === 'Failed'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {tc.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
