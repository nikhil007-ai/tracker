import Dexie, { type Table } from 'dexie';

export interface ChecklistItem {
  id?: number;
  phase: string;
  task: string;
  completed: boolean;
}

export interface BountyReport {
  id?: number;
  date: string;
  platform: string;
  target: string;
  vulnerability: string;
  severity: 'P1' | 'P2' | 'P3' | 'P4' | 'P5';
  status: 'Pending' | 'Triaged' | 'Resolved' | 'Duplicate' | 'Informative' | 'N/A';
  reward: number;
}

export interface PlannedTask {
  id?: number;
  date: string; // ISO String
  task: string;
  completed: boolean;
}

export interface AppStats {
  id?: number;
  hoursPracticed: number;
  bugsFound: number;
}

export interface TimeLog {
  id?: number;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
}

export class GhostTrackDB extends Dexie {
  checklist!: Table<ChecklistItem>;
  bounties!: Table<BountyReport>;
  planner!: Table<PlannedTask>;
  stats!: Table<AppStats>;
  timeLogs!: Table<TimeLog>;

  constructor() {
    super('GhostTrackDB');
    this.version(2).stores({
      checklist: '++id, phase, completed',
      bounties: '++id, date, platform, status',
      planner: '++id, date, completed',
      stats: '++id',
      timeLogs: '++id, date'
    });
  }
}

export const db = new GhostTrackDB();

// Initial checklist data
export const INITIAL_CHECKLIST: Omit<ChecklistItem, 'id'>[] = [
  // Phase 1: Core Fundamentals (Months 0-3)
  { phase: '01: Core Fundamentals', task: 'Networking (TCP/UDP, DNS, HTTP/S, Routing)', completed: false },
  { phase: '01: Core Fundamentals', task: 'Linux (File systems, Permissions, CLI)', completed: false },
  { phase: '01: Core Fundamentals', task: 'Web Basics (Requests, Responses, Cookies, HTML)', completed: false },
  
  // Phase 2: Scripting and Tools (Months 3-6)
  { phase: '02: Scripting & Tools', task: 'Python (Automation & Exploits)', completed: false },
  { phase: '02: Scripting & Tools', task: 'Bash/JS for payloads', completed: false },
  { phase: '02: Scripting & Tools', task: 'Master Tools: Nmap, Burp Suite, ffuf', completed: false },
  
  // Phase 3: Security Concepts
  { phase: '03: Security Concepts', task: 'Threat Modeling & Secure Coding', completed: false },
  { phase: '03: Security Concepts', task: 'Understand Vulnerability Impact', completed: false },
  
  // Phase 4: Web App Hacking (Months 4-9)
  { phase: '04: Web App Hacking', task: 'OWASP Top 10 (SQLi, XSS, CSRF)', completed: false },
  { phase: '04: Web App Hacking', task: 'Broken Access Control & Auth flaws', completed: false },
  { phase: '04: Web App Hacking', task: 'File Upload & Logic flaws', completed: false },

  // Phase 5: Practice (Ongoing)
  { phase: '05: Practical Practice', task: 'PortSwigger Academy Labs', completed: false },
  { phase: '05: Practical Practice', task: 'TryHackMe & HTB Modules', completed: false },
  { phase: '05: Practical Practice', task: 'Build Home Lab Environment', completed: false },

  // Phase 6: Bug Bounty Basics (Months 6-12)
  { phase: '06: Bug Bounty Ops', task: 'Set up H1/Bugcrowd/Intigriti', completed: false },
  { phase: '06: Bug Bounty Ops', task: 'Learn VDP Workflow & Reporting', completed: false },
  { phase: '06: Bug Bounty Ops', task: 'Recon Pipeline Implementation', completed: false },

  // Phase 7: Specialization (Months 10-18)
  { phase: '07: Specialization', task: 'Advanced Certifications (OSCP/PNPT)', completed: false },
  { phase: '07: Specialization', task: 'Deep Dive: Mobile/API/Cloud Hacking', completed: false },
];

export async function seedDatabase() {
  const count = await db.checklist.count();
  if (count === 0) {
    await db.checklist.bulkAdd(INITIAL_CHECKLIST);
    await db.stats.add({ hoursPracticed: 0, bugsFound: 0 });
  } else {
    // Check for duplicates and fix if found
    const all = await db.checklist.toArray();
    const uniqueTasks = new Set();
    const duplicatesFound = all.some(item => {
      const key = `${item.phase}-${item.task}`;
      if (uniqueTasks.has(key)) return true;
      uniqueTasks.add(key);
      return false;
    });

    if (duplicatesFound) {
      await db.checklist.clear();
      await db.checklist.bulkAdd(INITIAL_CHECKLIST);
    }
  }
}
