"use client";

import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Bell,
  Boxes,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Clock3,
  Copy,
  Database,
  Download,
  ExternalLink,
  FileText,
  Fingerprint,
  Globe2,
  KeyRound,
  LayoutDashboard,
  Link2,
  Menu,
  Network,
  Radar,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Portal } from "@ark-ui/react/portal";
import { Tooltip } from "@ark-ui/react/tooltip";
import { AreaChart } from "../components/charts/area-chart";
import { Area } from "../components/charts/area";
import { BarChart } from "../components/charts/bar-chart";
import { Bar } from "../components/charts/bar";
import { HeatmapChart } from "../components/charts/heatmap/heatmap-chart";
import { LineChart } from "../components/charts/line-chart";
import { Line } from "../components/charts/line";
import { RingChart } from "../components/charts/ring-chart";
import { Ring } from "../components/charts/ring";
import { RingCenter } from "../components/charts/ring-center";

type Page = "overview" | "actors" | "actor" | "graph" | "infrastructure" | "activity" | "scans" | "reports";
type Drawer = { title: string; eyebrow: string; body: React.ReactNode } | null;

const navItems: { id: Page; label: string; icon: typeof Activity }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "actors", label: "Actor intelligence", icon: Fingerprint },
  { id: "graph", label: "Graph explorer", icon: Network },
  { id: "infrastructure", label: "Infrastructure", icon: Globe2 },
  { id: "activity", label: "Activity", icon: Activity },
  { id: "scans", label: "Scan runs", icon: Radar },
  { id: "reports", label: "Reports", icon: FileText },
];

const actors = [
  { handle: "nightmarket", aliases: "nm_vendor · nocturne", category: "Stolen data", markets: 3, identifiers: 12, confidence: "High", lastSeen: "14 Sep 2026", status: "Review" },
  { handle: "sablefox", aliases: "fox_13 · sable", category: "Access broker", markets: 2, identifiers: 8, confidence: "Medium", lastSeen: "12 Sep 2026", status: "Open" },
  { handle: "ravenpost", aliases: "rp_vendor", category: "Hacking service", markets: 4, identifiers: 16, confidence: "High", lastSeen: "09 Sep 2026", status: "Confirmed" },
  { handle: "greyharbor", aliases: "gh_data · northbay", category: "Personal data", markets: 2, identifiers: 6, confidence: "Needs review", lastSeen: "06 Sep 2026", status: "Open" },
  { handle: "quietsignal", aliases: "q-signal", category: "Financial fraud", markets: 1, identifiers: 5, confidence: "Low", lastSeen: "02 Sep 2026", status: "Open" },
];

const activity = [
  { title: "Possible handle migration", detail: "sablefox matched with a dormant persona on Market North", time: "11 min ago", kind: "link" },
  { title: "Infrastructure match found", detail: "Shared favicon hash between onion-7f3a and 185.22.91.40", time: "38 min ago", kind: "infra" },
  { title: "PGP fingerprint reused", detail: "nightmarket key seen in a new vendor profile", time: "1 hr ago", kind: "key" },
  { title: "Scan run completed", detail: "Forum archive collected 184 records and 9 identifiers", time: "2 hr ago", kind: "scan" },
];

const lineData = [
  { date: "01 Sep", findings: 8 }, { date: "03 Sep", findings: 13 }, { date: "05 Sep", findings: 11 }, { date: "07 Sep", findings: 18 }, { date: "09 Sep", findings: 16 }, { date: "11 Sep", findings: 24 }, { date: "13 Sep", findings: 29 },
];
const barData = [
  { source: "Forums", records: 184 }, { source: "Archives", records: 128 }, { source: "Markets", records: 97 }, { source: "Clearnet", records: 62 },
];
const ringData = [
  { label: "Stolen data", value: 38, maxValue: 100, color: "#f26a4b" },
  { label: "Access broker", value: 26, maxValue: 100, color: "#1e1e1e" },
  { label: "Hacking service", value: 18, maxValue: 100, color: "#5e5a52" },
];
const heatmapData = Array.from({ length: 8 }, (_, week) => ({
  bin: week,
  bins: Array.from({ length: 7 }, (_, day) => ({ count: (week * 7 + day * 3) % 10, bin: day, date: new Date(2026, 8, week * 7 + day + 1) })),
}));

function Badge({ value }: { value: string }) {
  const className = value.toLowerCase().includes("high") || value.toLowerCase().includes("healthy") || value === "Confirmed" ? "badge-high" : value.toLowerCase().includes("low") || value === "Failed" ? "badge-low" : value.toLowerCase().includes("running") ? "badge-running" : "badge-review";
  return <Tooltip.Root openDelay={250}><Tooltip.Trigger asChild><span className={`badge ${className}`}><span className="signal-dot" />{value}</span></Tooltip.Trigger><Portal><Tooltip.Positioner><Tooltip.Content className="ark-tooltip">Analytical confidence, not proof of identity.</Tooltip.Content></Tooltip.Positioner></Portal></Tooltip.Root>;
}

function ChartShell({ children }: { children: React.ReactNode }) { return <div className="chart-wrap">{children}</div>; }

function StatCard({ label, value, foot, warn, icon: Icon }: { label: string; value: string; foot: string; warn?: boolean; icon: typeof Activity }) {
  return <div className="card stat-card"><div className="stat-top"><span>{label}</span><Icon size={15} /></div><div className="stat-value">{value}</div><div className={`stat-foot ${warn ? "trend-warn" : "trend-up"}`}><ArrowUpRight size={13} />{foot}</div></div>;
}

function SectionHead({ title, note, action }: { title: string; note?: string; action?: string }) {
  return <div className="section-head"><div><h2>{title}</h2>{note && <p>{note}</p>}</div>{action && <button className="outline-button">{action}<ChevronRight size={14} /></button>}</div>;
}

function Header({ page, setPage, openDrawer }: { page: Page; setPage: (p: Page) => void; openDrawer: (d: Drawer) => void }) {
  const [search, setSearch] = useState("");
  return <div className="topbar"><div className="crumb">NTRO / {page === "actor" ? "ACTOR PROFILE" : page.replace("-", " ").toUpperCase()}</div><div className="top-actions"><div className="search"><Search size={15} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search identifiers..." onKeyDown={(e) => { if (e.key === "Enter" && search) { setPage("actors"); openDrawer({ title: search, eyebrow: "Search result", body: <p className="subcopy">This synthetic lookup is ready for analyst review.</p> }); } }} /></div><button className="icon-button" onClick={() => openDrawer({ title: "Notifications", eyebrow: "Desk updates", body: <div className="activity-list">{activity.slice(0, 2).map((item) => <div className="activity-item" key={item.title}><div className="activity-icon" /><div><strong>{item.title}</strong><p>{item.detail}</p></div><time>{item.time}</time></div>)}</div> })}><Bell size={16} /></button><div className="avatar">AS</div></div></div>;
}

function Sidebar({ page, setPage }: { page: Page; setPage: (p: Page) => void }) {
  return <aside className="sidebar"><div className="brand"><div className="brand-mark">S</div><div className="brand-copy"><strong>Signal Desk</strong><span>NTRO intelligence</span></div></div><div className="nav-label">Investigation</div><nav className="nav">{navItems.map(({ id, label, icon: Icon }) => <button key={id} className={`nav-button ${page === id ? "active" : ""}`} onClick={() => setPage(id)}><Icon size={16} /><span>{label}</span></button>)}</nav><div className="sidebar-foot"><div className="operator"><div className="avatar">AS</div><div><strong>Analyst Singh</strong><span>Desk 04 · online</span></div></div></div></aside>;
}

function ActivityList() { return <div className="activity-list">{activity.map((item) => <div className="activity-item" key={item.title}><div className="activity-icon" /><div><strong>{item.title}</strong><p>{item.detail}</p></div><time>{item.time}</time></div>)}</div>; }

function Overview({ setPage, openDrawer }: { setPage: (p: Page) => void; openDrawer: (d: Drawer) => void }) {
  return <><div className="page-head"><div><div className="eyebrow">Monday, 14 September 2026</div><h1>Intelligence overview</h1><p className="subcopy">A quiet view of what changed across the desk since your last review.</p></div><button className="date-pill"><Clock3 size={14} />01 Sep – 14 Sep <ChevronRight size={14} /></button></div><div className="grid stats-grid"><StatCard icon={Fingerprint} label="Active actors" value="48" foot="6 new this week" /><StatCard icon={Link2} label="New relationships" value="126" foot="18% from last scan" /><StatCard icon={Globe2} label="Infrastructure matches" value="19" foot="4 need review" warn /><StatCard icon={ClipboardCheck} label="Review queue" value="07" foot="2 high confidence" warn /></div><div className="grid two-col" style={{ marginTop: 14 }}><section className="card card-pad chart-card"><SectionHead title="Discovery activity" note="Findings collected over the last 14 days" action="View activity" /><ChartShell><AreaChart data={lineData} xDataKey="date" aspectRatio="2.7 / 1" margin={{ top: 15, right: 15, bottom: 25, left: 15 }}><Area dataKey="findings" fill="var(--chart-1)" stroke="var(--chart-1)" /></AreaChart></ChartShell></section><section className="card card-pad"><SectionHead title="Source health" note="Last successful collection" /><div className="metric-list"><div className="metric-row"><span>Forum archive</span><Badge value="Healthy" /><div className="progress"><span style={{ width: "96%" }} /></div></div><div className="metric-row"><span>Marketplace mirror</span><Badge value="Running" /><div className="progress dark"><span style={{ width: "68%" }} /></div></div><div className="metric-row"><span>Certificate logs</span><Badge value="Healthy" /><div className="progress"><span style={{ width: "91%" }} /></div></div><div className="metric-row"><span>Passive DNS</span><Badge value="Needs review" /><div className="progress"><span style={{ width: "43%" }} /></div></div></div></section></div><div className="grid two-col" style={{ marginTop: 14 }}><section className="card card-pad"><SectionHead title="Recent activity" note="The latest changes in the collection" action="Open activity" /><ActivityList /></section><section className="card table-card"><div className="table-head"><SectionHead title="Priority review" note="Findings that need an analyst" /></div><div className="table-scroll"><table><thead><tr><th>Subject</th><th>Signal</th><th>Status</th></tr></thead><tbody>{actors.slice(0, 4).map((actor) => <tr className="clickable" key={actor.handle} onClick={() => openDrawer({ title: actor.handle, eyebrow: "Priority review", body: <Evidence actor={actor} /> })}><td><strong>{actor.handle}</strong><div className="muted">{actor.category}</div></td><td>{actor.confidence}</td><td><Badge value={actor.status === "Confirmed" ? "High" : "Needs review"} /></td></tr>)}</tbody></table></div></section></div></>;
}

function Evidence({ actor }: { actor: typeof actors[number] }) { return <><div className="drawer-section"><div className="drawer-label">Assessment</div><div className="key-value"><span>Confidence</span><Badge value={actor.confidence} /></div><div className="key-value"><span>Last seen</span><strong>{actor.lastSeen}</strong></div><div className="key-value"><span>Review state</span><strong>{actor.status}</strong></div></div><div className="drawer-section"><div className="drawer-label">Why this link exists</div><p className="subcopy">A shared PGP fingerprint and overlapping posting hours connect this profile to a prior marketplace handle. The match still needs human review.</p></div><div className="drawer-section"><div className="drawer-label">Observed identifiers</div><div className="entity-grid"><div className="entity"><span>PGP</span><span>9F3A...18BC</span></div><div className="entity"><span>Wallet</span><span>bc1q...k4vz</span></div><div className="entity"><span>Forum</span><span>market-north</span></div><div className="entity"><span>Alias</span><span>{actor.aliases.split(" · ")[0]}</span></div></div></div><div className="drawer-section"><div className="review-actions"><button className="primary-button">Confirm link</button><button className="outline-button">Needs review</button></div></div></>; }

function Actors({ setPage, openDrawer }: { setPage: (p: Page) => void; openDrawer: (d: Drawer) => void }) {
  const [query, setQuery] = useState("");
  const [confidence, setConfidence] = useState("All confidence");
  const filtered = useMemo(() => actors.filter((a) => `${a.handle} ${a.aliases} ${a.category}`.toLowerCase().includes(query.toLowerCase()) && (confidence === "All confidence" || a.confidence === confidence)), [query, confidence]);
  return <><div className="page-head"><div><div className="eyebrow">Entity resolution</div><h1>Actor intelligence</h1><p className="subcopy">Search across handles, wallets, PGP fingerprints, and linked infrastructure.</p></div><button className="primary-button" onClick={() => openDrawer({ title: "Export actor set", eyebrow: "Structured output", body: <p className="subcopy">CSV export is ready in this prototype. Select a filtered result set to continue.</p> })}><Download size={14} />Export set</button></div><div className="toolbar"><div className="search" style={{ width: 270 }}><Search size={15} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search actor records..." /></div><select className="filter" value={confidence} onChange={(e) => setConfidence(e.target.value)}><option>All confidence</option><option>High</option><option>Medium</option><option>Low</option><option>Needs review</option></select><select className="filter"><option>All categories</option><option>Stolen data</option><option>Access broker</option><option>Hacking service</option></select><button className="outline-button"><SlidersHorizontal size={14} />More filters</button></div><section className="card table-card"><div className="table-head"><SectionHead title={`${filtered.length} tracked actors`} note="Synthetic records for the analyst console" /></div><div className="table-scroll"><table><thead><tr><th>Handle</th><th>Category</th><th>Markets</th><th>Identifiers</th><th>Confidence</th><th>Last seen</th><th>Status</th></tr></thead><tbody>{filtered.map((actor) => <tr className="clickable" key={actor.handle} onClick={() => setPage("actor")}><td><strong>{actor.handle}</strong><div className="muted">{actor.aliases}</div></td><td>{actor.category}</td><td>{actor.markets}</td><td>{actor.identifiers}</td><td><Badge value={actor.confidence} /></td><td>{actor.lastSeen}</td><td>{actor.status}</td></tr>)}</tbody></table>{!filtered.length && <div className="empty">No actor records match those filters.</div>}</div></section></>;
}

function ActorProfile({ openDrawer }: { openDrawer: (d: Drawer) => void }) {
  const actor = actors[0]; const [tab, setTab] = useState("Evidence");
  return <><div className="page-head"><div><div className="eyebrow">Actors / profile</div><h1>Nightmarket</h1><p className="subcopy">A tracked persona with links across three marketplaces and two archived forums.</p></div><div className="review-actions"><button className="outline-button" onClick={() => openDrawer({ title: "Report preview", eyebrow: "Actor report", body: <ReportPreview /> })}><FileText size={14} />Preview report</button><button className="primary-button"><ClipboardCheck size={14} />Review status</button></div></div><section className="card card-pad"><div className="profile-hero"><div className="profile-id"><div className="profile-avatar">N</div><div><h2>nightmarket</h2><p>Primary handle · first seen 18 May 2025</p><div className="profile-meta"><Badge value="High" /><span className="entity"><Fingerprint size={12} />9F3A...18BC</span><span className="entity"><WalletCards size={12} />bc1q...k4vz</span></div></div></div><div className="mini-stat"><small>Analyst confidence</small><strong>84%</strong></div></div><div className="tabs">{["Evidence", "Activity", "Relationships"].map((item) => <button className={`tab ${tab === item ? "active" : ""}`} key={item} onClick={() => setTab(item)}>{item}</button>)}</div>{tab === "Evidence" ? <div className="grid two-col"><div className="grid"><section className="card card-pad"><SectionHead title="Supporting signals" note="Every link has a visible reason" /><div className="grid">{["PGP fingerprint reused on Market North", "Wallet appeared in two vendor listings", "Writing style overlaps with dormant persona"].map((item, index) => <div className="card card-pad" key={item}><div className="section-head"><div><h3>{item}</h3><p>Observed {index + 2} days ago · source archive</p></div><Badge value={index === 2 ? "Medium" : "High"} /></div><button className="outline-button" onClick={() => openDrawer({ title: "Evidence detail", eyebrow: "Signal review", body: <Evidence actor={actor} /> })}>Why this link exists <ArrowUpRight size={13} /></button></div>)}</div></section><section className="card card-pad chart-card"><SectionHead title="Activity over time" note="Posts and listings linked to this persona" /><ChartShell><LineChart data={lineData} xDataKey="date" aspectRatio="2.7 / 1" margin={{ top: 15, right: 15, bottom: 25, left: 15 }}><Line dataKey="findings" stroke="var(--primary)" /></LineChart></ChartShell></section></div><div className="grid"><section className="card card-pad"><SectionHead title="Identifiers" note="Known values associated with this profile" /><div className="entity-grid"><div className="entity"><Fingerprint size={13} /><span className="mono">9F3A...18BC</span></div><div className="entity"><WalletCards size={13} /><span className="mono">bc1q...k4vz</span></div><div className="entity"><KeyRound size={13} /><span className="mono">0x72A...B19</span></div><div className="entity"><Globe2 size={13} /><span className="mono">onion-7f3a</span></div></div></section><section className="card card-pad"><SectionHead title="Analyst note" /><p className="subcopy">The shared key is a strong signal. Timing and writing style support the link, but the identity remains unconfirmed.</p><button className="outline-button" style={{ marginTop: 14 }}>Add note</button></section></div></div> : <ActivityList />}</section></>;
}

function GraphPage({ openDrawer }: { openDrawer: (d: Drawer) => void }) {
  const nodes = [{ x: 50, y: 45, label: "nightmarket", type: "actor", color: "#f26a4b" }, { x: 24, y: 25, label: "9F3A...18BC", type: "pgp", color: "#2e2e2e" }, { x: 77, y: 25, label: "bc1q...k4vz", type: "wallet", color: "#5e5a52" }, { x: 19, y: 70, label: "market north", type: "market", color: "#a89f8f" }, { x: 79, y: 70, label: "onion-7f3a", type: "infra", color: "#a89f8f" }, { x: 50, y: 82, label: "sablefox", type: "actor", color: "#f26a4b" }];
  return <><div className="page-head"><div><div className="eyebrow">Relationship mapping</div><h1>Graph explorer</h1><p className="subcopy">Start with one entity, then inspect only the relationships worth your attention.</p></div><button className="outline-button"><Download size={14} />Export graph</button></div><div className="toolbar"><input className="text-input" placeholder="Focus on an entity..." /><select className="filter"><option>All entity types</option><option>Actors</option><option>Wallets</option><option>Infrastructure</option></select><select className="filter"><option>All confidence</option><option>High only</option><option>Needs review</option></select><button className="outline-button"><CircleHelp size={14} />How links work</button></div><div className="grid two-col"><section><div className="graph"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><line className="graph-edge high" x1="50" y1="45" x2="24" y2="25" /><line className="graph-edge high" x1="50" y1="45" x2="77" y2="25" /><line className="graph-edge" x1="50" y1="45" x2="19" y2="70" /><line className="graph-edge high" x1="50" y1="45" x2="79" y2="70" /><line className="graph-edge" x1="50" y1="45" x2="50" y2="82" />{nodes.map((node) => <g className="graph-node" key={node.label} onClick={() => openDrawer({ title: node.label, eyebrow: node.type, body: <Evidence actor={actors[0]} /> })}><circle cx={`${node.x}%`} cy={`${node.y}%`} r={node.type === "actor" ? 5 : 3.5} fill={node.color} /><text x={`${node.x}%`} y={`${node.y + 9}%`} textAnchor="middle">{node.label}</text></g>)}</svg></div><div className="graph-legend"><span className="legend-item"><i className="legend-dot" style={{ background: "var(--chart-1)" }} />Actor</span><span className="legend-item"><i className="legend-dot" style={{ background: "var(--primary)" }} />PGP / wallet</span><span className="legend-item"><i className="legend-dot" style={{ background: "var(--chart-4)" }} />Source / infrastructure</span></div></section><section className="card card-pad"><SectionHead title="Selected entity" note="nightmarket · actor" /><div className="key-value"><span>Relationships</span><strong>5</strong></div><div className="key-value"><span>High confidence</span><strong>3</strong></div><div className="key-value"><span>First seen</span><strong>18 May 2025</strong></div><div className="drawer-section"><div className="drawer-label">Why these links exist</div><EvidenceCard title="PGP fingerprint reuse" confidence="High" /><EvidenceCard title="Shared posting hours" confidence="Medium" /><EvidenceCard title="Favicon hash match" confidence="High" /></div></section></div></>;
}

function EvidenceCard({ title, confidence }: { title: string; confidence: string }) { return <div className="key-value"><span>{title}</span><Badge value={confidence} /></div>; }

function Infrastructure({ openDrawer }: { openDrawer: (d: Drawer) => void }) { return <><div className="page-head"><div><div className="eyebrow">Technical correlation</div><h1>Infrastructure</h1><p className="subcopy">Review the fingerprints that connect hidden services to visible infrastructure.</p></div><button className="primary-button" onClick={() => openDrawer({ title: "New correlation", eyebrow: "Synthetic workflow", body: <p className="subcopy">This prototype uses seeded findings. A live scan would enter this queue after collection.</p> })}><Radar size={14} />New correlation</button></div><div className="toolbar"><input className="text-input" placeholder="Search onion, domain, IP..." /><select className="filter"><option>All signals</option><option>Certificate</option><option>Favicon hash</option><option>Server banner</option></select><select className="filter"><option>All confidence</option><option>High</option><option>Needs review</option></select></div><section className="card table-card"><div className="table-head"><SectionHead title="19 candidate matches" note="Passive signals only. No active probing in this prototype." /></div><div className="table-scroll"><table><thead><tr><th>Onion service</th><th>Candidate origin</th><th>Signal</th><th>Strength</th><th>Last seen</th><th>Review</th></tr></thead><tbody>{[{ onion: "onion-7f3a", origin: "185.22.91.40", signal: "Favicon hash", strength: "High", seen: "14 Sep 2026" }, { onion: "onion-c9a1", origin: "northbay.host", signal: "TLS certificate", strength: "Medium", seen: "13 Sep 2026" }, { onion: "onion-21bd", origin: "91.201.44.18", signal: "Server banner", strength: "Needs review", seen: "09 Sep 2026" }].map((row) => <tr className="clickable" key={row.onion} onClick={() => openDrawer({ title: row.onion, eyebrow: "Infrastructure match", body: <div><div className="comparison"><div className="comparison-box"><h3>Hidden service</h3><div className="key-value"><span>Address</span><strong className="mono">{row.onion}</strong></div><div className="key-value"><span>Favicon</span><strong className="mono">8f3a91</strong></div></div><div className="comparison-mark">↔</div><div className="comparison-box"><h3>Candidate origin</h3><div className="key-value"><span>Address</span><strong className="mono">{row.origin}</strong></div><div className="key-value"><span>Favicon</span><strong className="mono">8f3a91</strong></div></div></div><div className="drawer-section"><div className="drawer-label">Assessment</div><Badge value={row.strength} /><p className="subcopy">The same public fingerprint appears on both surfaces. This is a candidate match, not an identity conclusion.</p></div></div> })}><td className="mono">{row.onion}</td><td className="mono">{row.origin}</td><td>{row.signal}</td><td><Badge value={row.strength} /></td><td>{row.seen}</td><td><button className="quiet-button"><ArrowUpRight size={14} /></button></td></tr>)}</tbody></table></div></section></>;
}

function ActivityPage() { return <><div className="page-head"><div><div className="eyebrow">Time-based review</div><h1>Activity</h1><p className="subcopy">Trace movement, timing overlap, and bursts of activity across the evidence set.</p></div><button className="date-pill"><Clock3 size={14} />01 Sep – 14 Sep <ChevronRight size={14} /></button></div><div className="grid two-col"><section className="card card-pad chart-card"><SectionHead title="Event volume" note="All tracked entities" /><ChartShell><BarChart data={barData} xDataKey="source" aspectRatio="2.4 / 1" margin={{ top: 15, right: 15, bottom: 25, left: 15 }}><Bar dataKey="records" fill="var(--chart-1)" /></BarChart></ChartShell></section><section className="card card-pad chart-card"><SectionHead title="Posting pattern" note="Synthetic activity by time of day" /><ChartShell><HeatmapChart data={heatmapData} aspectRatio="2.4 / 1" levelColors={["#e9e4d8", "#f5c0ad", "#f29b7e", "#f26a4b", "#9f3c28"]}>{null}</HeatmapChart></ChartShell></section></div><section className="card card-pad" style={{ marginTop: 14 }}><SectionHead title="Activity stream" note="Filterable events across actors and sources" /><ActivityList /></section></>; }

function Scans() { return <><div className="page-head"><div><div className="eyebrow">Collection layer</div><h1>Scan runs</h1><p className="subcopy">A plain record of what the collection system checked and what it found.</p></div><button className="primary-button"><Radar size={14} />Start synthetic run</button></div><div className="grid stats-grid"><StatCard icon={Database} label="Records collected" value="1,842" foot="12% from last run" /><StatCard icon={Link2} label="Relationships made" value="126" foot="18 new today" /><StatCard icon={AlertTriangle} label="Source issues" value="02" foot="1 needs attention" warn /><StatCard icon={ShieldCheck} label="System status" value="98%" foot="All core services healthy" /></div><section className="card table-card" style={{ marginTop: 14 }}><div className="table-head"><SectionHead title="Recent scan runs" note="Synthetic collection history" /></div><table><thead><tr><th>Run ID</th><th>Source</th><th>Completed</th><th>Records</th><th>New links</th><th>Status</th></tr></thead><tbody>{[["RUN-260914-04", "Forum archive", "14 Sep 2026 · 10:42", "184", "09", "Healthy"], ["RUN-260914-03", "Certificate logs", "14 Sep 2026 · 09:18", "62", "04", "Healthy"], ["RUN-260913-12", "Marketplace mirror", "13 Sep 2026 · 18:06", "97", "17", "Needs review"]].map((row) => <tr key={row[0]}><td className="mono">{row[0]}</td><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td>{row[4]}</td><td><Badge value={row[5]} /></td></tr>)}</tbody></table></section></>; }

function Reports() { const [created, setCreated] = useState(false); return <><div className="page-head"><div><div className="eyebrow">Investigation output</div><h1>Reports</h1><p className="subcopy">Package reviewed evidence for another analyst, a case file, or a later decision.</p></div><button className="primary-button" onClick={() => setCreated(true)}><FileText size={14} />Create report</button></div><div className="grid two-col"><section className="card card-pad"><SectionHead title="Report builder" note="Choose the smallest useful evidence set" /><div className="grid"><label className="drawer-label">Subject<select className="filter" style={{ width: "100%", marginTop: 7 }}><option>nightmarket · actor profile</option><option>sablefox · actor profile</option><option>Infrastructure matches</option></select></label><label className="drawer-label">Evidence depth<select className="filter" style={{ width: "100%", marginTop: 7 }}><option>Reviewed findings only</option><option>All supporting evidence</option><option>Full case context</option></select></label><label className="drawer-label">Output format<select className="filter" style={{ width: "100%", marginTop: 7 }}><option>Report preview</option><option>CSV</option><option>JSON</option></select></label><button className="primary-button" onClick={() => setCreated(true)}>{created ? "Report ready" : "Build report"}<ArrowUpRight size={14} /></button></div></section><ReportPreview /></div><section className="card table-card" style={{ marginTop: 14 }}><div className="table-head"><SectionHead title="Recent reports" note="Export actions are mocked for this frontend" /></div><table><thead><tr><th>Report</th><th>Subject</th><th>Created</th><th>Format</th><th>Status</th></tr></thead><tbody><tr><td><strong>nightmarket-review</strong></td><td>Actor profile</td><td>14 Sep 2026</td><td>PDF preview</td><td><Badge value="Ready" /></td></tr><tr><td><strong>infra-correlation-07</strong></td><td>3 candidate matches</td><td>13 Sep 2026</td><td>JSON</td><td><Badge value="Ready" /></td></tr></tbody></table></section></>; }

function ReportPreview() { return <div className="card card-pad"><SectionHead title="Report preview" note="nightmarket · reviewed evidence" action="Download" /><div className="key-value"><span>Assessment</span><Badge value="High" /></div><div className="key-value"><span>Evidence items</span><strong>07</strong></div><div className="key-value"><span>Limitations</span><strong>Human review pending</strong></div><div className="drawer-section"><div className="drawer-label">Summary</div><p className="subcopy">The profile is connected to two marketplace identities through a reused PGP fingerprint, a wallet address, and overlapping activity patterns.</p></div><div className="drawer-section"><div className="drawer-label">Sources</div><p className="muted">Forum archive · marketplace mirror · certificate logs</p></div></div>; }

function DrawerView({ drawer, close }: { drawer: Drawer; close: () => void }) { if (!drawer) return null; return <><div className="drawer-backdrop" onClick={close} /><aside className="drawer"><div className="drawer-head"><div><div className="eyebrow">{drawer.eyebrow}</div><h2>{drawer.title}</h2></div><button className="icon-button" onClick={close}><X size={16} /></button></div>{drawer.body}</aside></>; }

export default function Home() {
  const [page, setPage] = useState<Page>("overview");
  const [drawer, setDrawer] = useState<Drawer>(null);
  const render = () => { if (page === "overview") return <Overview setPage={setPage} openDrawer={setDrawer} />; if (page === "actors") return <Actors setPage={setPage} openDrawer={setDrawer} />; if (page === "actor") return <ActorProfile openDrawer={setDrawer} />; if (page === "graph") return <GraphPage openDrawer={setDrawer} />; if (page === "infrastructure") return <Infrastructure openDrawer={setDrawer} />; if (page === "activity") return <ActivityPage />; if (page === "scans") return <Scans />; return <Reports />; };
  return <div className="app-shell"><Sidebar page={page} setPage={setPage} /><main className="main"><Header page={page} setPage={setPage} openDrawer={setDrawer} />{render()}<div className="footer-note">Synthetic intelligence workspace · no live collection connected</div></main><DrawerView drawer={drawer} close={() => setDrawer(null)} /></div>;
}
