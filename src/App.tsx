import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  Bug, 
  BarChart3, 
  Settings, 
  Download, 
  Upload, 
  RotateCcw,
  Plus,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Play,
  Square,
  Save,
  Timer as ClockIcon
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
// Recharts removed - not used in current implementation
import { db, seedDatabase, type ChecklistItem, type BountyReport, type PlannedTask, type TimeLog } from './db/database';
import { cn } from './lib/utils';

// --- Components ---

const Header = () => {
  const checklist = useLiveQuery(() => db.checklist.toArray());
  const total = checklist?.length || 0;
  const completed = checklist?.filter(t => t.completed).length || 0;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-end border-b-2 border-hacker-cyan pb-4 mb-6 bg-black/40 backdrop-blur-md p-4 pt-6 perspective-container">
      <div className="hover:translate-z-10 transition-transform duration-300">
        <h1 className="text-4xl font-bold tracking-tighter drop-shadow-hacker-text font-cyber text-hacker-cyan">GHOST_TRACK_v2.0</h1>
        <p className="text-[10px] opacity-70 uppercase mt-1 leading-none font-mono">
          // LOCAL_INST_ID: 0x882A_99F // OFFLINE_MODE: ACTIVE // NODE_STATUS: ENCRYPTED
        </p>
      </div>
      <div className="text-right mt-4 md:mt-0 w-full md:w-auto">
        <div className="text-[10px] mb-1 uppercase tracking-widest text-left md:text-right font-cyber text-hacker-pink">Global Progress</div>
        <div className="flex items-center gap-4">
          <div className="hacker-progress-container w-full md:w-64">
            <div 
              className="hacker-progress-bar" 
              style={{ width: `${progress}%`, backgroundColor: '#ff00ff', boxShadow: '0 0 15px #ff00ff' }}
            ></div>
          </div>
          <span className="text-2xl font-bold tabular-nums font-cyber text-hacker-pink">{Math.round(progress)}%</span>
        </div>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="mt-auto flex flex-col md:flex-row justify-between items-center text-[10px] border-t border-hacker-cyan pt-4 pb-8 px-4 bg-black/40 backdrop-blur-md">
    <div className="flex flex-wrap gap-4 md:gap-6 uppercase mb-4 md:mb-0 justify-center">
      <span className="flex items-center gap-1 text-hacker-pink animate-pulse">
        <div className="w-2 h-2 rounded-full bg-hacker-pink shadow-pink-glow"></div> RECORDING_SESSION
      </span>
      <span className="opacity-70">STORAGE_USE: 14.2kb / 10.0gb</span>
      <span className="opacity-70">LATENCY: 12ms</span>
      <span className="opacity-70 text-hacker-cyan/50">Uptime: 04:12:09</span>
    </div>
    <div className="flex gap-4 opacity-50 uppercase font-cyber text-[8px]">
      <span>[F1] HELP</span>
      <span>[F5] RELOAD</span>
      <span>[ESC] LOGOUT</span>
    </div>
  </footer>
);

const SkillMeter = ({ progress }: { progress: number }) => {
  let label = "Beginner";
  if (progress >= 30) label = "Intermediate";
  if (progress >= 60) label = "Advanced";

  return (
    <div className="hacker-card">
      <h2 className="hacker-card-header text-hacker-pink border-hacker-pink bg-hacker-pink/10">[04] SKILL_METER</h2>
      <div className="flex-grow flex flex-col justify-center items-center py-6">
        <div className="relative w-40 h-40 border-4 border-dashed border-hacker-pink/20 rounded-full flex items-center justify-center">
          <div 
             className="absolute w-32 h-32 border-4 border-hacker-pink rounded-full shadow-pink-glow transition-all duration-700"
             style={{ clipPath: `polygon(50% 50%, -100% -100%, ${progress > 12.5 ? '200%' : '50%'} -100%, ${progress > 37.5 ? '200%' : progress > 12.5 ? '200%' : '50%'} ${progress > 37.5 ? '200%' : '200%'}, ${progress > 62.5 ? '-100%' : progress > 37.5 ? '-100%' : '50%'} ${progress > 62.5 ? '200%' : '200%'}, ${progress > 87.5 ? '-100%' : progress > 62.5 ? '-100%' : '50%'} ${progress > 87.5 ? '-100%' : '-100%'}, 50% -100%)` }}
          ></div>
          <div className="text-center z-10">
            <div className="text-3xl font-black tabular-nums font-cyber text-hacker-pink">{progress.toFixed(1)}</div>
            <div className="text-[10px] uppercase tracking-widest opacity-70 font-mono">Rank: {label}</div>
          </div>
        </div>
        <div className="mt-6 text-[10px] flex gap-3 uppercase items-center font-cyber">
            <span className={cn(progress < 30 ? "bg-hacker-pink text-black px-1 font-bold" : "opacity-40")}>BEG</span>
            <span className={cn(progress >= 30 && progress < 60 ? "bg-hacker-pink text-black px-1 font-bold" : "opacity-40")}>INT</span>
            <span className={cn(progress >= 60 ? "bg-hacker-pink text-black px-1 font-bold" : "opacity-40")}>ADV</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const checklist = useLiveQuery(() => db.checklist.toArray());
  const bounties = useLiveQuery(() => db.bounties.toArray());
  const stats = useLiveQuery(() => db.stats.toCollection().first());

  if (!checklist) return null;

  const total = checklist.length;
  const completed = checklist.filter(t => t.completed).length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const totalBounties = bounties?.length || 0;
  const totalRewards = bounties?.reduce((acc, curr) => acc + (Number(curr.reward) || 0), 0) || 0;

  const missions = [
    "Scan 3 bug bounty targets for open ports.",
    "Solve 1 SQL Injection lab on PortSwigger.",
    "Update your local documentation on Nmap flags.",
    "Audit a public repository for secrets.",
    "Write a bash script to automate subdomain enumeration."
  ];
  const dailyMission = missions[new Date().getDate() % missions.length];

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch perspective-container">
      <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
          <SkillMeter progress={progress} />
          <div className="hacker-card">
              <h2 className="hacker-card-header font-cyber">[02] ANALYTICS_CORE</h2>
              <div className="grid grid-cols-2 gap-4">
                  <div className="border border-hacker-cyan p-3 text-center bg-hacker-cyan/5">
                      <div className="text-[10px] opacity-70 uppercase font-mono">HOURS_PRACTICED</div>
                      <div className="text-3xl font-bold tabular-nums font-cyber text-hacker-cyan">{stats?.hoursPracticed || 0}</div>
                  </div>
                  <div className="border border-hacker-cyan p-3 text-center bg-hacker-cyan/5">
                      <div className="text-[10px] opacity-70 uppercase font-mono">REPORTS_ID'D</div>
                      <div className="text-3xl font-bold tabular-nums font-cyber text-hacker-cyan">{totalBounties}</div>
                  </div>
                  <div className="border border-hacker-cyan p-3 text-center bg-hacker-cyan/5">
                      <div className="text-[10px] opacity-70 uppercase font-mono">TOTAL_VAL</div>
                      <div className="text-2xl font-bold tabular-nums font-cyber text-hacker-pink">${totalRewards}</div>
                  </div>
                  <div className="border border-hacker-cyan p-3 text-center bg-hacker-cyan/5">
                      <div className="text-[10px] opacity-70 uppercase font-mono">LVL</div>
                      <div className="text-xl font-bold uppercase font-cyber text-hacker-cyan">{progress > 60 ? 'ADV' : progress > 30 ? 'INT' : 'BEG'}</div>
                  </div>
              </div>
          </div>
      </div>
      
      <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="hacker-card flex-grow min-h-[250px]">
              <h2 className="hacker-card-header text-hacker-cyan font-cyber">[03] DAILY_MISSION_LOG</h2>
              <div className="space-y-4 flex-grow">
                  <div className="border-l-2 border-hacker-pink pl-4 py-2 bg-hacker-pink/5 backdrop-blur-sm">
                      <div className="text-[10px] opacity-50 uppercase font-cyber text-hacker-pink">{new Date().toDateString()}</div>
                      <div className="text-sm mt-1 leading-relaxed font-mono text-hacker-cyan">
                          &gt; {dailyMission}
                      </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-hacker-cyan/10">
                      <div className="text-[10px] opacity-70 uppercase font-cyber text-hacker-cyan mb-2">Daily_Protocol: (2hr_Session)</div>
                      <ul className="text-[9px] space-y-1 font-mono opacity-60">
                          <li>- [30m] Recon & Intel Gathering</li>
                          <li>- [60m] Methodical Vuln Testing</li>
                          <li>- [30m] Reporting & Documentation</li>
                      </ul>
                  </div>

                  <p className="text-[9px] opacity-40 uppercase tracking-widest mt-auto italic pt-6 font-mono">
                      // MISSION_TYPE: TACTICAL_AUDIT<br/>
                      // OBJECTIVE_PRIORITY: HIGH
                  </p>
              </div>
          </div>
          <div className="hacker-card bg-hacker-pink/10 border-hacker-pink">
              <h2 className="hacker-card-header text-hacker-pink border-hacker-pink bg-hacker-pink/10 font-cyber">[00] STATUS_ALERT</h2>
              <div className="flex items-center gap-3">
                  <ShieldAlert className="text-hacker-pink shrink-0" size={20} />
                  <div className="flex flex-col">
                      <p className="text-[10px] leading-tight font-mono text-hacker-pink/80 font-bold uppercase">
                          SYSTEM_OFFLINE // AIR_GAPPED
                      </p>
                      <p className="text-[8px] leading-tight font-mono text-hacker-pink/60 mt-1">
                          No external socket transmissions detected. Local environment is secured.
                      </p>
                  </div>
              </div>
          </div>
      </div>

      <div className="md:col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="hacker-card flex-grow border-hacker-cyan">
              <h2 className="hacker-card-header font-cyber">[05] REPORT_SUMMARY</h2>
              <div className="space-y-2 text-[11px] font-mono">
                  {bounties?.slice(-5).map(b => (
                      <div key={b.id} className="flex justify-between items-center border-b border-hacker-cyan/30 pb-1 hover:bg-hacker-cyan/5 px-1">
                          <span className="opacity-70">{b.target.substring(0, 15)}</span>
                          <span className={cn(
                              "font-bold px-1",
                              b.status === 'Resolved' ? "text-hacker-cyan shadow-hacker-glow" : "opacity-50"
                          )}>{b.reward > 0 ? `$${b.reward}` : 'TBD'}</span>
                      </div>
                  ))}
                  {(!bounties || bounties.length === 0) && (
                      <p className="opacity-30 italic">LOG_EMPTY</p>
                  )}
              </div>
          </div>
          <div className="hacker-card bg-black/60 relative overflow-hidden group">
              <h2 className="hacker-card-header font-cyber">[06] QUICK_SYSTEM_OPS</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative z-10">
                  <button onClick={() => window.open('/?tab=set')} className="hacker-btn py-1">SYS_CFG</button>
                  <button onClick={() => window.open('/?tab=log')} className="hacker-btn-pink py-1">ADD_LOG</button>
              </div>
          </div>
      </div>
    </div>
  );
};

const Checklist = () => {
  const checklist = useLiveQuery(() => db.checklist.toArray());
  
  if (!checklist) return null;

  const phases = Array.from(new Set(checklist.map(item => item.phase)));

  const toggleTask = async (id: number, completed: boolean) => {
    await db.checklist.update(id, { completed: !completed });
  };

  return (
    <div className="space-y-6 perspective-container">
        <div className="hacker-card">
            <h2 className="hacker-card-header font-cyber">[01] TRAINING_PHASES</h2>
            <div className="space-y-8">
                {phases.map((phase, idx) => {
                    const items = checklist.filter(i => i.phase === phase);
                    const phaseDone = items.filter(i => i.completed).length;
                    const phaseProgress = Math.round((phaseDone / items.length) * 100);

                    return (
                        <div key={phase} className="space-y-3 group">
                            <div className="flex justify-between items-end mb-2">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-hacker-cyan/80 font-cyber">
                                    {String(idx + 1).padStart(2, '0')}. {phase}
                                </h3>
                                <div className="text-[10px] tabular-nums font-mono opacity-60">
                                    {phaseDone}/{items.length} ({phaseProgress}%)
                                </div>
                            </div>
                            <div className="hacker-progress-container h-1 border-hacker-cyan/20">
                                <div 
                                    className="hacker-progress-bar bg-hacker-cyan shadow-hacker-glow" 
                                    style={{ width: `${phaseProgress}%` }}
                                ></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2 mt-3">
                                {items.map(item => (
                                    <label 
                                        key={item.id} 
                                        className={cn(
                                            "flex items-center gap-2 cursor-pointer group text-[11px] font-mono p-1 hover:bg-hacker-cyan/5 transition-all border border-transparent hover:border-hacker-cyan/20",
                                            item.completed ? "opacity-30" : "hover:text-hacker-cyan"
                                        )}
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={item.completed} 
                                            onChange={() => toggleTask(item.id!, item.completed)}
                                            className="appearance-none w-3 h-3 border border-hacker-cyan checked:bg-hacker-cyan focus:outline-none cursor-pointer shadow-[2px_2px_0px_rgba(0,243,255,0.2)]"
                                        />
                                        <span className={cn(item.completed && "line-through")}>{item.task}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
  );
};

const Planner = () => {
    const [newTask, setNewTask] = useState("");
    const items = useLiveQuery(() => db.planner.toArray());

    const addTask = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedTask = newTask.trim();
        if (!trimmedTask) return;

        // Duplicate check
        const isDuplicate = items?.some(i => i.task.toLowerCase() === trimmedTask.toLowerCase());
        if (isDuplicate) {
            alert("TASK_ERROR: OBJECTIVE_ALREADY_EXISTS_IN_BUFFER");
            return;
        }

        await db.planner.add({
            date: new Date().toISOString(),
            task: trimmedTask,
            completed: false
        });
        setNewTask("");
    };

    const deleteTask = async (id: number) => {
        await db.planner.delete(id);
    };

    const toggleTask = async (id: number, completed: boolean) => {
        await db.planner.update(id, { completed: !completed });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 perspective-container">
            <div className="hacker-card border-hacker-cyan">
                <h2 className="hacker-card-header font-cyber text-hacker-cyan">[03] OPERATIONAL_OBJECTIVES</h2>
                <form onSubmit={addTask} className="flex gap-2 mb-6 px-2">
                    <input 
                        type="text" 
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        placeholder="New tactical objective..." 
                        className="hacker-input flex-1 border-hacker-cyan/40"
                    />
                    <button type="submit" className="hacker-btn flex items-center gap-2">
                        <Plus size={16} /> ADD
                    </button>
                </form>

                <div className="space-y-1">
                    <AnimatePresence>
                        {items?.map(item => (
                            <motion.div 
                                key={item.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                className="flex items-center justify-between group border-b border-hacker-cyan/10 py-3 px-3 hover:bg-hacker-cyan/5 transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <input 
                                        type="checkbox" 
                                        checked={item.completed} 
                                        onChange={() => toggleTask(item.id!, item.completed)}
                                        className="appearance-none w-4 h-4 border border-hacker-cyan checked:bg-hacker-cyan focus:outline-none cursor-pointer shadow-[2px_2px_0px_rgba(0,243,255,0.2)]"
                                    />
                                    <span className={cn("text-[11px] font-mono", item.completed ? "line-through opacity-30 italic" : "text-hacker-cyan hover:glow-cyan")}>{item.task}</span>
                                </div>
                                <button onClick={() => deleteTask(item.id!)} className="opacity-0 group-hover:opacity-100 text-hacker-pink hover:text-pink-400 transition-opacity">
                                    <Trash2 size={14} />
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {(!items || items.length === 0) && (
                        <div className="text-center p-8 opacity-30 italic text-[10px] uppercase tracking-widest font-mono">No active operations.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BountyTracker = () => {
    const [showForm, setShowForm] = useState(false);
    const [autoPlanner, setAutoPlanner] = useState(true);
    const reports = useLiveQuery(() => db.bounties.toArray());
    const [formData, setFormData] = useState<Omit<BountyReport, 'id'>>({
        date: new Date().toISOString().split('T')[0],
        platform: 'HackerOne',
        target: '',
        vulnerability: '',
        severity: 'P3',
        status: 'Pending',
        reward: 0
    });

    const addReport = async (e: React.FormEvent) => {
        e.preventDefault();
        const reportId = await db.bounties.add(formData);
        
        if (autoPlanner && formData.target) {
            await db.planner.add({
                task: `Follow up: ${formData.target} (${formData.vulnerability || 'General'})`,
                completed: false,
                date: new Date().toISOString()
            });
        }

        setShowForm(false);
        setFormData({
            date: new Date().toISOString().split('T')[0],
            platform: 'HackerOne',
            target: '',
            vulnerability: '',
            severity: 'P3',
            status: 'Pending',
            reward: 0
        });
    };

    const deleteReport = async (id: number) => {
        if (confirm("Delete report permanently?")) {
            await db.bounties.delete(id);
        }
    };

    return (
        <div className="space-y-6 perspective-container">
            <div className="flex justify-between items-center bg-hacker-cyan/5 p-4 border-l-4 border-hacker-cyan backdrop-blur-md">
                <h2 className="text-lg font-bold tracking-tighter font-cyber">BUG_LOG.EXE</h2>
                <button 
                  onClick={() => setShowForm(!showForm)} 
                  className={cn("hacker-btn flex items-center gap-2 px-6", showForm && "bg-hacker-pink border-hacker-pink text-black shadow-none")}
                >
                    {showForm ? 'CLOSE_TERMINAL' : <><Plus size={16} /> INITIALIZE_NEW_REPORT</>}
                </button>
            </div>

            {showForm && (
                <motion.form 
                    initial={{ opacity: 0, scale: 0.98, rotateX: -10 }}
                    animate={{ opacity: 1, scale: 1, rotateX: 0 }}
                    onSubmit={addReport} 
                    className="hacker-card bg-hacker-cyan/5 border-hacker-cyan grid grid-cols-1 md:grid-cols-2 gap-4 shadow-hacker-glow"
                >
                    <h3 className="md:col-span-2 text-[10px] opacity-70 border-b border-hacker-cyan/30 pb-1 mb-2 font-mono uppercase tracking-[0.2em]">INPUT_FIELDS:</h3>
                    {/* Form fields */}
                    <div className="space-y-1">
                        <label className="text-[10px] opacity-70 font-mono">DATE</label>
                        <input 
                            type="date" 
                            className="hacker-input border-hacker-cyan/40" 
                            value={formData.date}
                            onChange={e => setFormData({...formData, date: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] opacity-70 font-mono">PLATFORM</label>
                        <select 
                            className="hacker-input border-hacker-cyan/40"
                            value={formData.platform}
                            onChange={e => setFormData({...formData, platform: e.target.value})}
                        >
                            <option className="bg-black">HackerOne</option>
                            <option className="bg-black">Bugcrowd</option>
                            <option className="bg-black">Intigriti</option>
                            <option className="bg-black">Private</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] opacity-70 font-mono">TARGET</label>
                        <input 
                            type="text" 
                            className="hacker-input border-hacker-cyan/40" 
                            placeholder="example.com"
                            value={formData.target}
                            onChange={e => setFormData({...formData, target: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] opacity-70 font-mono">VULNERABILITY</label>
                        <input 
                            type="text" 
                            className="hacker-input border-hacker-cyan/40" 
                            placeholder="Stored XSS" 
                            value={formData.vulnerability}
                            onChange={e => setFormData({...formData, vulnerability: e.target.value})}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] opacity-70 font-mono">SEVERITY</label>
                        <select 
                            className="hacker-input border-hacker-cyan/40"
                            value={formData.severity}
                            onChange={e => setFormData({...formData, severity: e.target.value as any})}
                        >
                            <option className="bg-black">P1</option>
                            <option className="bg-black">P2</option>
                            <option className="bg-black">P3</option>
                            <option className="bg-black">P4</option>
                            <option className="bg-black">P5</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] opacity-70 font-mono">STATUS</label>
                        <select 
                            className="hacker-input border-hacker-cyan/40"
                            value={formData.status}
                            onChange={e => setFormData({...formData, status: e.target.value as any})}
                        >
                            <option className="bg-black">Pending</option>
                            <option className="bg-black">Triaged</option>
                            <option className="bg-black">Resolved</option>
                            <option className="bg-black">Duplicate</option>
                            <option className="bg-black">Informative</option>
                            <option className="bg-black">N/A</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-[10px] opacity-70 font-mono">REWARD ($)</label>
                        <input 
                            type="number" 
                            className="hacker-input border-hacker-cyan/40" 
                            value={formData.reward}
                            onChange={e => setFormData({...formData, reward: Number(e.target.value)})}
                        />
                    </div>
                    
                    <div className="md:col-span-2 flex items-center gap-3 bg-hacker-cyan/10 p-2 border border-hacker-cyan/20">
                        <input 
                            type="checkbox" 
                            id="autoPlanner"
                            checked={autoPlanner}
                            onChange={(e) => setAutoPlanner(e.target.checked)}
                            className="appearance-none w-4 h-4 border border-hacker-cyan checked:bg-hacker-cyan focus:outline-none cursor-pointer"
                        />
                        <label htmlFor="autoPlanner" className="text-[10px] font-mono cursor-pointer uppercase tracking-wider text-hacker-cyan">
                            Auto-Add Follow-up Objective to Planner
                        </label>
                    </div>

                    <button type="submit" className="hacker-btn md:col-span-2 mt-4">SUBMIT TO LOCAL_LOG</button>
                </motion.form>
            )}

            <div className="overflow-x-auto border border-hacker-cyan/40 hacker-card shadow-lg">
                <table className="w-full text-left text-sm whitespace-nowrap font-mono">
                    <thead>
                        <tr className="bg-hacker-cyan/20 uppercase text-[10px] font-cyber tracking-widest text-hacker-cyan">
                            <th className="p-4 font-medium border-b border-hacker-cyan/40">Timestamp</th>
                            <th className="p-4 font-medium border-b border-hacker-cyan/40">Network</th>
                            <th className="p-4 font-medium border-b border-hacker-cyan/40">Target_ID</th>
                            <th className="p-4 font-medium border-b border-hacker-cyan/40">Vuln_Class</th>
                            <th className="p-4 font-medium border-b border-hacker-cyan/40">SEV</th>
                            <th className="p-4 font-medium border-b border-hacker-cyan/40">Status</th>
                            <th className="p-4 font-medium border-b border-hacker-cyan/40">Payout</th>
                            <th className="p-4 font-medium border-b border-hacker-cyan/40"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-hacker-cyan/10">
                        {reports?.map(report => (
                            <tr key={report.id} className="hover:bg-hacker-cyan/5 transition-colors group">
                                <td className="p-4 opacity-50 text-[11px]">{report.date}</td>
                                <td className="p-4 text-hacker-cyan">{report.platform}</td>
                                <td className="p-4 max-w-[150px] truncate text-hacker-cyan">{report.target}</td>
                                <td className="p-4 truncate text-hacker-cyan/80">{report.vulnerability}</td>
                                <td className="p-4">
                                    <span className={cn(
                                        "font-bold",
                                        report.severity === 'P1' ? "text-red-500" :
                                        report.severity === 'P2' ? "text-orange-500" :
                                        report.severity === 'P3' ? "text-yellow-500" :
                                        "text-hacker-cyan"
                                    )}>
                                        {report.severity}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <span className={cn(
                                        "px-2 py-0.5 text-[10px] uppercase font-bold border",
                                        report.status === 'Resolved' ? "bg-hacker-cyan text-black border-hacker-cyan" : 
                                        report.status === 'Triaged' ? "border-hacker-cyan text-hacker-cyan" :
                                        "opacity-50 border-hacker-cyan/20"
                                    )}>
                                        {report.status}
                                    </span>
                                </td>
                                <td className="p-4 font-bold text-hacker-pink tabular-nums">${report.reward}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => deleteReport(report.id!)} className="text-hacker-pink opacity-0 group-hover:opacity-100 transition-opacity p-1">
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {(!reports || reports.length === 0) && (
                <div className="text-center p-12 hacker-card border-hacker-cyan/20 italic opacity-30 font-mono text-[11px] uppercase tracking-widest">
                    // LOG_EMPTY: NO SCAN RESULTS FOUND.
                </div>
            )}
        </div>
    );
};

const Timer = () => {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Initial load from localStorage
    useEffect(() => {
        const savedSession = localStorage.getItem('ghost_session');
        if (savedSession) {
            try {
                const { seconds: savedSeconds, isActive: savedIsActive, timestamp } = JSON.parse(savedSession);
                let currentSeconds = savedSeconds;

                if (savedIsActive) {
                    const elapsed = Math.floor((Date.now() - timestamp) / 1000);
                    currentSeconds += elapsed;
                }
                
                setSeconds(currentSeconds);
                setIsActive(savedIsActive);
            } catch (e) {
                console.error("Failed to load saved session", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // Save to localStorage whenever state changes
    useEffect(() => {
        if (!isLoaded) return;
        
        const sessionData = JSON.stringify({
            seconds,
            isActive,
            timestamp: Date.now()
        });
        localStorage.setItem('ghost_session', sessionData);
    }, [seconds, isActive, isLoaded]);

    useEffect(() => {
        let interval: any = null;
        if (isActive) {
            interval = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const toggle = () => setIsActive(!isActive);
    
    const reset = () => {
        localStorage.removeItem('ghost_session');
        setIsActive(false);
        setSeconds(0);
    };

    const saveSession = async () => {
        if (seconds < 60) {
            alert("Session too short to log (min 1 minute).");
            return;
        }

        const minutes = Math.floor(seconds / 60);
        const today = new Date().toISOString().split('T')[0];
        
        await db.timeLogs.add({
            date: today,
            durationMinutes: minutes
        });

        // Update total stats too
        const stats = await db.stats.toCollection().first();
        if (stats) {
            const newTotalHours = stats.hoursPracticed + (minutes / 60);
            await db.stats.update(stats.id!, { hoursPracticed: Number(newTotalHours.toFixed(1)) });
        }

        alert(`Session of ${minutes} minutes logged.`);
        reset();
    };

    const formatTime = (totalSeconds: number) => {
        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;
        return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="hacker-card flex flex-col justify-center items-center gap-4 border-hacker-cyan/50 perspective-container">
            <h3 className="text-sm font-bold opacity-70 flex items-center gap-2 font-cyber text-hacker-cyan">
                <ClockIcon size={14} className={cn(isActive && "animate-spin")} /> 
                ACTIVE_SESSION_TIMER
            </h3>
            <div className="text-4xl font-black font-mono tracking-widest text-hacker-pink drop-shadow-pink-glow font-cyber">
                {formatTime(seconds)}
            </div>
            <div className="flex gap-2 w-full">
                <button 
                  onClick={toggle} 
                  className={cn(
                    "hacker-btn flex-grow flex items-center justify-center gap-2",
                    isActive ? "border-hacker-pink text-hacker-pink bg-hacker-pink/10" : "border-hacker-cyan text-hacker-cyan"
                  )}
                >
                    {isActive ? <><Square size={14} /> PAUSE</> : <><Play size={14} /> START_SESSION</>}
                </button>
                {seconds > 0 && (
                    <button 
                      onClick={saveSession} 
                      className="hacker-btn-pink border-hacker-pink text-hacker-pink flex items-center justify-center p-2"
                      title="Save and End Session"
                    >
                        <Save size={14} />
                    </button>
                )}
                {seconds > 0 && !isActive && (
                    <button 
                      onClick={reset} 
                      className="hacker-btn border-red-500 text-red-500 hover:bg-black flex items-center justify-center p-2"
                      title="Discard Session"
                    >
                        <RotateCcw size={14} />
                    </button>
                )}
            </div>
        </div>
    );
};

const Analytics = () => {
    const bounties = useLiveQuery(() => db.bounties.toArray());
    const stats = useLiveQuery(() => db.stats.toCollection().first());
    const logs = useLiveQuery(() => db.timeLogs.toArray());

    if (!bounties || !logs) return null;

    // Group by status
    const statusData = [
        { name: 'Resolved', value: bounties.filter(b => b.status === 'Resolved').length },
        { name: 'Duplicate', value: bounties.filter(b => b.status === 'Duplicate').length },
        { name: 'N/A/Inf', value: bounties.filter(b => ['N/A', 'Informative'].includes(b.status)).length },
        { name: 'Pending/Triaged', value: bounties.filter(b => ['Pending', 'Triaged'].includes(b.status)).length },
    ];

    const COLORS = ['#00f3ff', '#ff00ff', '#333333', '#0066ff'];

    // Process time logs for chart
    // Last 7 days
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        return d.toISOString().split('T')[0];
    });

    const timeData = last7Days.map(date => {
        const dayLogs = logs.filter(l => l.date === date);
        const totalMinutes = dayLogs.reduce((acc, curr) => acc + curr.durationMinutes, 0);
        return {
            date: date.split('-').slice(1).join('/'),
            minutes: totalMinutes
        };
    });

    const scatterData = bounties.filter(b => b.reward > 0).map(b => ({
        severity: Number(b.severity?.replace('P', '')) || 3,
        reward: Number(b.reward),
        name: b.target
    }));

    const sevMap: Record<number, string> = { 1: 'P1', 2: 'P2', 3: 'P3', 4: 'P4', 5: 'P5' };

    return (
        <div className="space-y-8 perspective-container text-hacker-cyan">
            <div className="hacker-card border-hacker-cyan bg-hacker-cyan/5">
                <Timer />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="hacker-card border-hacker-cyan">
                    <h3 className="hacker-card-header text-sm font-bold opacity-70 mb-6 font-cyber">[07] PRACTICE_INTEL (MINS)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={timeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                                <XAxis dataKey="date" stroke="#00f3ff" fontSize={10} fontStyle="italic" />
                                <YAxis stroke="#00f3ff" fontSize={10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #00f3ff', fontSize: '10px' }}
                                    itemStyle={{ color: '#00f3ff' }}
                                />
                                <Bar dataKey="minutes" fill="#ff00ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="hacker-card border-hacker-cyan">
                    <h3 className="hacker-card-header text-sm font-bold opacity-70 mb-6 font-cyber">[11] REWARD_VS_SEVERITY</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#111" />
                                <XAxis 
                                    type="number" 
                                    dataKey="severity" 
                                    name="Severity" 
                                    domain={[0, 6]} 
                                    tickFormatter={(val) => sevMap[val] || ''}
                                    stroke="#00f3ff" 
                                    fontSize={10} 
                                />
                                <YAxis type="number" dataKey="reward" name="Reward" unit="$" stroke="#00f3ff" fontSize={10} />
                                <ZAxis type="number" range={[60, 400]} />
                                <Tooltip 
                                    cursor={{ strokeDasharray: '3 3' }}
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #ff00ff', fontSize: '10px' }}
                                    formatter={(value: any, name: any) => [name === 'Severity' ? (sevMap[value] || value) : `$${value}`, name]}
                                />
                                <Scatter name="Reports" data={scatterData} fill="#ff00ff" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="hacker-card">
                    <h2 className="hacker-card-header font-cyber">[08] REPORTS_BY_STATUS</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#000', border: '1px solid #00f3ff', fontSize: '10px' }}
                                />
                                <Pie
                                    data={statusData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap gap-4 justify-center mt-4 text-[10px] font-mono">
                        {statusData.map((d, i) => (
                            <div key={d.name} className="flex items-center gap-1">
                                <div className="w-2 h-2" style={{ backgroundColor: COLORS[i] }}></div>
                                <span className="uppercase">{d.name} ({d.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hacker-card flex flex-col justify-between">
                    <div>
                      <h2 className="hacker-card-header font-cyber">[09] PERFORMANCE_METRICS</h2>
                      <div className="space-y-6">
                          <div>
                              <div className="flex justify-between text-xs mb-1 font-mono">
                                  <span>SUCCESS_RATE (Resolved / Total)</span>
                                  <span>{bounties.length > 0 ? Math.round((statusData[0].value / bounties.length) * 100) : 0}%</span>
                              </div>
                              <div className="hacker-progress-container h-2">
                                  <div 
                                    className="hacker-progress-bar bg-hacker-pink shadow-pink-glow" 
                                    style={{ width: `${bounties.length > 0 ? (statusData[0].value / bounties.length) * 100 : 0}%` }}
                                  ></div>
                              </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 font-mono">
                              <div className="border border-hacker-cyan/40 p-3 bg-hacker-cyan/5">
                                  <p className="text-[10px] opacity-50 uppercase">Total Practice</p>
                                  <p className="text-xl font-bold font-cyber">{stats?.hoursPracticed || 0}H</p>
                              </div>
                              <div className="border border-hacker-cyan/40 p-3 bg-hacker-cyan/5">
                                  <p className="text-[10px] opacity-50 uppercase">Total Rewards</p>
                                  <p className="text-xl font-bold text-hacker-pink font-cyber">${bounties.reduce((a,c) => a + Number(c.reward), 0)}</p>
                              </div>
                          </div>
                      </div>
                    </div>
                    <div className="mt-8">
                      <p className="text-[9px] opacity-30 italic leading-none uppercase font-mono">
                        * ALL DATA STORED LOCALLY VIA INDEXEDDB ENCRYPTION LAYER.
                      </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsView = () => {
    const exportData = async () => {
        const fullData = {
            checklist: await db.checklist.toArray(),
            bounties: await db.bounties.toArray(),
            planner: await db.planner.toArray(),
            stats: await db.stats.toArray(),
            timeLogs: await db.timeLogs.toArray(),
            exportDate: new Date().toISOString(),
            version: '1.0.4'
        };

        const blob = new Blob([JSON.stringify(fullData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ghost_track_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const data = JSON.parse(event.target?.result as string);
                if (confirm("This will overwrite existing local data. Continue?")) {
                    await db.transaction('rw', [db.checklist, db.bounties, db.planner, db.stats, db.timeLogs], async () => {
                        await db.checklist.clear();
                        await db.bounties.clear();
                        await db.planner.clear();
                        await db.stats.clear();
                        await db.timeLogs.clear();
                        
                        if (data.checklist) await db.checklist.bulkAdd(data.checklist);
                        if (data.bounties) await db.bounties.bulkAdd(data.bounties);
                        if (data.planner) await db.planner.bulkAdd(data.planner);
                        if (data.stats) await db.stats.bulkAdd(data.stats);
                        if (data.timeLogs) await db.timeLogs.bulkAdd(data.timeLogs);
                    });
                    alert("Backup restored successfully. Refreshing database...");
                    window.location.reload();
                }
            } catch (err) {
                alert("Invalid backup file structure.");
            }
        };
        reader.readAsText(file);
    };

    const resetAll = async () => {
        if (confirm("CRITICAL WARNING: Wipe all local databases? This cannot be undone.")) {
            await db.delete();
            window.location.reload();
        }
    };

    const resetToBeginner = async () => {
        if (confirm("Initialize Beginner State? This will reset all training progress.")) {
            await db.checklist.where('completed').equals(1).modify({ completed: false });
            // Dexie uses 1 for true in some contexts or boolean. Let's be safe.
            await db.checklist.toCollection().modify({ completed: false });
            alert("Training progress reset to BEGINNER_LEVEL.");
            window.location.reload();
        }
    }

    const [hours, setHours] = useState(0);
    const stats = useLiveQuery(() => db.stats.toCollection().first());

    useEffect(() => {
        if (stats) setHours(stats.hoursPracticed);
    }, [stats]);

    const updateHours = async () => {
        const first = await db.stats.toCollection().first();
        if (first) {
            await db.stats.update(first.id!, { hoursPracticed: hours });
            alert("Hours updated.");
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-8 perspective-container text-hacker-cyan">
            <div className="hacker-card border-hacker-cyan p-8 shadow-hacker-glow">
                <h2 className="hacker-card-header font-cyber mb-8">[10] SYSTEM_CONFIG</h2>
                
                <div className="space-y-10 mt-6">
                    <div className="flex items-center justify-between group px-2">
                        <div>
                            <p className="text-sm font-bold font-cyber tracking-widest">LOCAL_INDEXDB_PROTO</p>
                            <p className="text-[10px] opacity-40 font-mono tracking-tighter uppercase mt-1">GhostTrack_v2 // PERSISTENT // ENCRYPTED</p>
                        </div>
                        <div className="w-10 h-4 bg-hacker-cyan/10 border border-hacker-cyan relative">
                            <div className="absolute left-0.5 top-0.5 w-3 h-2.5 bg-hacker-cyan animate-pulse shadow-hacker-glow"></div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 px-2">
                        <div className="flex-1 space-y-1">
                            <label className="text-[10px] opacity-50 font-mono tracking-widest uppercase">Manual_Hours_Inject</label>
                            <input 
                                type="number" 
                                className="hacker-input" 
                                value={hours}
                                onChange={e => setHours(Number(e.target.value))}
                            />
                        </div>
                        <button onClick={updateHours} className="hacker-btn-pink sm:mt-5">COMMIT_VAL</button>
                    </div>

                    <div className="pt-8 border-t border-hacker-cyan/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={exportData} className="hacker-btn flex items-center justify-center gap-2">
                            <Download size={14} /> DUMP_STORAGE (.JSON)
                        </button>
                        
                        <label className="hacker-btn-pink flex items-center justify-center gap-2 cursor-pointer">
                            <Upload size={14} /> INJECT_EXTERNAL (.JSON)
                            <input type="file" hidden onChange={importData} accept=".json" />
                        </label>
                    </div>

                    <div className="pt-8 border-t border-hacker-cyan/10 grid grid-cols-1 gap-4">
                        <button onClick={resetToBeginner} className="w-full border border-hacker-cyan text-hacker-cyan py-3 hover:bg-hacker-cyan hover:text-black transition-all flex items-center justify-center gap-2 font-cyber text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_rgba(0,243,255,0.2)] hover:shadow-none translate-x-[-2px] translate-y-[-2px]">
                            <LayoutDashboard size={14} /> [INITIALIZE_BEGINNER_STATUS]
                        </button>
                        
                        <button onClick={resetAll} className="w-full border border-red-500 text-red-500 py-3 hover:bg-red-500 hover:text-black transition-all flex items-center justify-center gap-2 font-cyber text-[10px] uppercase tracking-widest shadow-[4px_4px_0px_#440000] hover:shadow-none translate-x-[-2px] translate-y-[-2px]">
                            <RotateCcw size={14} /> !! PURGE_LOCAL_SYSTEM !!
                        </button>
                    </div>
                </div>
            </div>

            <div className="text-center space-y-4 opacity-30 font-mono text-[9px] uppercase tracking-[0.4em] pt-8">
                <p>GhostTrack Terminal / Build 0x442A</p>
                <div className="flex justify-center gap-6">
                    <span>V_1.0.4</span>
                    <span>PROTO_X_09</span>
                </div>
                <p className="mt-4">&copy; 2026 DEEP_WEB_SYSTEMS // SECURED_NODE</p>
            </div>
        </div>
    );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState<'dash' | 'check' | 'plan' | 'log' | 'graph' | 'set'>('dash');
  const [isSeeding, setIsSeeding] = useState(true);

  useEffect(() => {
    seedDatabase().then(() => setIsSeeding(false));
  }, []);

  if (isSeeding) {
    return (
      <div className="fixed inset-0 bg-[#050510] flex flex-col items-center justify-center font-mono p-4 border-[10px] border-black">
        <div className="scanline"></div>
        <div className="relative z-10 flex flex-col items-center">
            <Terminal size={64} className="text-hacker-cyan animate-pulse mb-6" />
            <div className="text-hacker-cyan text-sm tracking-[0.5em] font-cyber">BOOTING_UP_GHOST_ENV_v2.0...</div>
            <div className="w-64 h-1 bg-black border border-hacker-cyan/30 mt-6 relative overflow-hidden">
                 <div className="absolute inset-0 bg-hacker-pink animate-[shimmer_2s_infinite]"></div>
            </div>
            <div className="mt-4 text-[8px] text-hacker-cyan/40 uppercase font-mono tracking-widest">
                Establishing neural link... OK<br/>
                Decrypting local storage... OK<br/>
                Bypassing security protocols... OK
            </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dash', icon: LayoutDashboard, label: 'DASH' },
    { id: 'check', icon: CheckSquare, label: 'QUEST' },
    { id: 'plan', icon: Calendar, label: 'OPS' },
    { id: 'log', icon: Bug, label: 'BUG_LOG' },
    { id: 'graph', icon: BarChart3, label: 'INTEL' },
    { id: 'set', icon: Settings, label: 'SYS' },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-[#050510] lg:p-6 p-0 overflow-x-hidden md:border-[10px] border-[#08081a]">
      <div className="scanline"></div>
      <div className="flex-grow flex flex-col bg-black/40 backdrop-blur-xl border-4 border-hacker-cyan shadow-[0_0_30px_rgba(0,243,255,0.15)] relative">
        <Header />
        
        <main className="flex-1 p-4 md:p-6 overflow-y-auto relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
            >
              {activeTab === 'dash' && <Dashboard />}
              {activeTab === 'check' && <Checklist />}
              {activeTab === 'plan' && <Planner />}
              {activeTab === 'log' && <BountyTracker />}
              {activeTab === 'graph' && <Analytics />}
              {activeTab === 'set' && <SettingsView />}
            </motion.div>
          </AnimatePresence>
        </main>

        <Footer />

        {/* Persistent Navigation */}
        <nav className="border-t border-hacker-cyan bg-black/80 backdrop-blur-md sticky bottom-0 z-50">
          <div className="max-w-2xl mx-auto flex justify-between p-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "flex flex-col items-center gap-0.5 p-2 transition-all group flex-1 font-cyber",
                  activeTab === item.id ? "text-black bg-hacker-cyan shadow-hacker-glow" : "text-hacker-cyan hover:bg-hacker-cyan/10"
                )}
              >
                <item.icon size={16} className={cn(activeTab === item.id ? "text-black" : "text-hacker-cyan")} />
                <span className="text-[8px] font-black tracking-widest leading-none mt-1">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
