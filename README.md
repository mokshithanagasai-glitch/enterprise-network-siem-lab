live link: https://enterprise-network-lab-with-siem-monitoring-347970729497.asia-south1.run.app
# Enterprise Network Lab with SIEM-Based Security Monitoring

![Cybersecurity Lab](https://img.shields.io/badge/Security-Enterprise%20SOC%20Lab-blue.svg)
![SIEM](https://img.shields.io/badge/SIEM-Wazuh%204.9-00A4E4.svg)
![Firewall](https://img.shields.io/badge/Firewall-pfSense%202.7.2%20CE-black.svg)
![Telemetry](https://img.shields.io/badge/Telemetry-Sysmon%20v15-0078D4.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A production-style cybersecurity homelab demonstrating enterprise network segmentation, stateful firewalling, multi-platform centralized log collection, and SOC threat detection engineering.

---

## 🏛️ Network Architecture & Topology

```
                        +---------------------------------------------+
                        |        PHYSICAL HOST / INTERNET (WAN)       |
                        |      VirtualBox NAT / Bridged Uplink        |
                        +---------------------------------------------+
                                              |
                                              | (WAN Interface: em0 / DHCP)
                                              v
                              +-------------------------------+
                              |    pfSense 2.7.2 CE Firewall   |
                              |   Default Deny Inbound on WAN |
                              |   Stateful Inspection Engine   |
                              +---------------+---------------+
                                              |
                 +----------------------------+----------------------------+
                 | (em2 / 192.168.20.1)                                    | (em1 / 192.168.10.1)
                 | Virtual Switch: "intnet-dmz"                            | Virtual Switch: "intnet-lan"
                 v                                                         v
   +-----------------------------+                           +-----------------------------+
   |   DMZ SEGMENT (192.168.20.0/24) |                       |   LAN SEGMENT (192.168.10.0/24) |
   +-----------------------------+                           +-----------------------------+
   |                             |                           |                             |
   |  [DMZ Web Server]           |                           |  [Wazuh SIEM Manager]       |
   |  IP: 192.168.20.10          |                           |  IP: 192.168.10.10          |
   |  FQDN: dmz-web.enterprise.lab |                         |  FQDN: wazuh.enterprise.lab |
   |  Policy: BLOCKED from LAN   |                           |  Ports: 1514, 1515, 443     |
   +-----------------------------+                           +-----------------------------+
                 |                                                         |
                 X (Firewall Rule #1 explicitly DROPS                      |-- [Ubuntu Enterprise Server]
                    any traffic from DMZ to LAN)                           |   IP: 192.168.10.20
                                                                           |   FQDN: srv-app01.enterprise.lab
                                                                           |   Telemetry: Wazuh Agent
                                                                           |
                                                                           +-- [Windows Client / Server]
                                                                               IP: 192.168.10.30
                                                                               FQDN: win-client01.corp.enterprise.lab
                                                                               Telemetry: Sysmon + Wazuh Agent

   +-----------------------------+
   | ATTACKER / TEST STAGING VM  |
   | Kali Linux 2024 (192.168.1.50)
   | FQDN: kali.enterprise.lab   |
   +-----------------------------+
```

---

## 🌐 IP Addressing & Subnet Scheme

| Subnet Name | Network CIDR | Gateway (pfSense) | DHCP Range | DNS Server | Security Policy |
|---|---|---|---|---|---|
| **WAN (External)** | `192.168.1.0/24` | VirtualBox NAT | Hypervisor DHCP | `1.1.1.1, 8.8.8.8` | Default Inbound Deny; Outbound NAT Overload (PAT) |
| **LAN (Corporate)** | `192.168.10.0/24` | `192.168.10.1` (`em1`) | `192.168.10.100` - `.199` | `192.168.10.1` (Unbound) | Egress allowed for HTTP/HTTPS/DNS. Inbound blocked from DMZ & WAN. |
| **DMZ (Perimeter)** | `192.168.20.0/24` | `192.168.20.1` (`em2`) | `192.168.20.50` - `.99` | `192.168.20.1` (Unbound) | **Strict Isolation:** Explicitly denied from initiating connections to `192.168.10.0/24`. |

---

## 🏷️ Domain Naming Conventions

- **Primary Lab Domain:** `enterprise.lab` (RFC 6761 reserved `.lab` to prevent public DNS leakage)
- **Active Directory Forest:** `corp.enterprise.local`
- **Host FQDNs:**
  - pfSense WebGUI: `pfsense.enterprise.lab` (`192.168.10.1`)
  - Wazuh SIEM Manager: `wazuh.enterprise.lab` (`192.168.10.10`)
  - Ubuntu Application Server: `srv-app01.enterprise.lab` (`192.168.10.20`)
  - Windows Enterprise Endpoint: `win-client01.corp.enterprise.lab` (`192.168.10.30`)
  - DMZ Web Server: `dmz-web.enterprise.lab` (`192.168.20.10`)
  - Kali Attacker VM: `kali.enterprise.lab` (`192.168.1.50`)

---

## 💻 Virtual Machine Sizing & Allocation Matrix

| VM | OS | Assigned IP | vCPU | 16 GB Host RAM | 8 GB Host RAM | Network Adapters |
|---|---|---|---|---|---|---|
| **pfSense Firewall** | FreeBSD 14 / pfSense 2.7.2 CE | `192.168.10.1` / `20.1` | 1 | 1.5 GB | 1.0 GB | NAT (`em0`), `intnet-lan` (`em1`), `intnet-dmz` (`em2`) |
| **Wazuh SIEM Manager** | Ubuntu 22.04 LTS | `192.168.10.10` | 2 | 4.0 GB | 3.0 GB | Internal (`intnet-lan`) |
| **Ubuntu Server** | Ubuntu Server 22.04 LTS | `192.168.10.20` | 1 | 1.5 GB | 1.0 GB | Internal (`intnet-lan`) |
| **Windows Endpoint** | Windows Server 2022 Eval | `192.168.10.30` | 2 | 3.0 GB | 2.0 GB | Internal (`intnet-lan`) |
| **DMZ Web Server** | Ubuntu 22.04 / Alpine | `192.168.20.10` | 1 | 1.0 GB | 0.5 GB | Internal (`intnet-dmz`) |
| **Kali Linux** | Kali Linux 2024.x | `192.168.1.50` | 2 | 2.0 GB | 1.5 GB | NAT / NAT Network |
| **Host Headroom** | Windows / Linux / macOS | - | - | **3.0 GB free** | **~0 GB** *(Staggered boot)* | - |

---

## 🛡️ Tested MITRE ATT&CK Security Detections

| Simulation ID | Attack Scenario | MITRE ID | Target | Telemetry Source | Wazuh Rule ID | Action Taken |
|---|---|---|---|---|---|---|
| **SIM-01** | TCP SYN Port Reconnaissance | `T1046` | `192.168.10.20` | pfSense `filterlog` | Rule `87701` (Level 6) | Blocked by default deny rule on WAN |
| **SIM-02** | SSH Password Spray / Brute Force | `T1110.001` | `192.168.10.20:22` | `/var/log/auth.log` | Rule `5712` (Level 10) | Active Response automated IP blacklisting |
| **SIM-03** | Windows Failed SMB Authentication | `T1110` | `192.168.10.30:445` | Security Event `4625` | Rule `60122` (Level 9) | Account lockout alert & source IP correlation |
| **SIM-04** | Suspicious DNS C2 Beacon | `T1071.004` | `192.168.10.1:53` | Sysmon Event `22` | Rule `92305` (Level 8) | Domain sinkholing & host isolation |
| **SIM-05** | Unauthorized DMZ-to-LAN Pivot | `T1021` | `192.168.10.10:1514` | pfSense `em2` drop | Rule `87702` (Level 12) | **CRITICAL:** Inter-VLAN firewall drop at perimeter |
| **SIM-06** | Outbound High-Port Egress Beacon | `T1041` | `198.51.100.4:8080` | Sysmon Event `3` | Rule `92410` (Level 9) | Egress rule drop & offending PID killed |

---

## ⚙️ Security Automation & Log Triage Script

The repository includes `scripts/parse_siem_alerts.py`, a Python 3 automated triage engine that:
1. Consumes Wazuh `alerts.json` event streams.
2. Identifies source IPs exceeding configured authentication failure thresholds.
3. Groups anomalies by MITRE ATT&CK tactic category.
4. Generates an exportable JSON/CSV incident digest for SOC Tier 1 ticket escalation.

### Quick Run:
```bash
python3 scripts/parse_siem_alerts.py --input /var/ossec/logs/alerts/alerts.json --threshold 5
```

---

## 📋 Installation Order Roadmap

1. **Phase 1: Hypervisor & Virtual Switching:** Create `intnet-lan` and `intnet-dmz` virtual networks.
2. **Phase 2: pfSense Gateway:** Deploy firewall VM with 3 NICs, configure WAN (NAT), LAN (`192.168.10.1`), and DMZ (`192.168.20.1`).
3. **Phase 3: Network Hardening:** Establish top-down firewall rules enforcing zero-trust isolation from DMZ to LAN.
4. **Phase 4: SIEM Deployment:** Install Wazuh All-in-One on `192.168.10.10`, enroll Linux and Windows agents, and configure Sysmon v15.
5. **Phase 5: Adversary Emulation:** Boot Kali Linux on WAN and execute controlled attack commands.
6. **Phase 6: Incident Verification:** Validate that alerts trigger in Wazuh Indexer and verify against the test plan.

---

## 🧪 Verification & Test Results

| Test ID | Procedure | Verification Command | Status |
|---|---|---|---|
| **TC-NET-01** | LAN to Internet egress test | `ping -c 4 1.1.1.1` | **PASSED** (0% loss) |
| **TC-NET-02** | DMZ to LAN lateral pivot block | `nc -zv -w 3 192.168.10.20 22` | **PASSED** (Connection timed out / filtered) |
| **TC-SIEM-01** | Wazuh agent enrollment check | `/var/ossec/bin/agent_control -l` | **PASSED** (Active status on all agents) |
| **TC-SEC-01** | SSH brute force alert detection | `grep "5712" /var/ossec/logs/alerts/alerts.json` | **PASSED** (Level 10 alert generated) |
| **TC-SEC-02** | Windows Event 4625 ingestion | `Get-WinEvent -FilterHashtable @{Id=4625}` | **PASSED** (Ingested & alerted under Rule 60122) |
| **TC-AUTO-01**| Python log parser execution | `python3 scripts/parse_siem_alerts.py` | **PASSED** (JSON summary exported) |

---

## 💼 ATS-Friendly Resume Bullets

- **Architected** an isolated enterprise virtual lab featuring a dual-homed pfSense 2.7.2 firewall, multi-subnet VLAN segmentation (LAN `192.168.10.0/24` vs. DMZ `192.168.20.0/24`), and stateful ingress/egress filtering.
- **Deployed** Wazuh 4.9 SIEM and centralized telemetry pipelines across Ubuntu Server 22.04 and Windows Server 2022 endpoints via TLS-encrypted agent daemons and syslog forwarders.
- **Engineered** advanced Windows endpoint visibility by authoring custom Sysmon v15 modular profiles, capturing Process Creation (Event 1), Network Connections (Event 3), and DNS queries (Event 22).
- **Conducted** safe adversary emulations mapped to MITRE ATT&CK (T1046, T1110, T1071.004, T1021) using Kali Linux, Nmap, and Hydra to validate SIEM detection thresholds and active-response blacklisting.
- **Developed** a Python 3 automation utility to ingest SIEM alerts.json, parse authentication anomaly frequencies, and generate structured JSON/CSV incident triage digests for SOC Tier 1 escalations.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
