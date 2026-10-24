import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  BarChart3,
  Beaker,
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Code2,
  Database,
  Eye,
  FlaskConical,
  Gauge,
  GitCompareArrows,
  Layers3,
  Lightbulb,
  ListRestart,
  Menu,
  Moon,
  Pause,
  Play,
  RotateCcw,
  Search,
  ServerCog,
  Settings2,
  ShieldCheck,
  Sparkles,
  StepForward,
  Sun,
  Target,
  Timer,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import {
  ALGORITHMS,
  ALGORITHM_MAP,
  type AlgorithmKey,
  type AlgorithmMeta,
  type DatasetPreset,
  generateDataset,
  parseCustomArray,
  runAlgorithm,
  type SortEvent,
  type SortRun,
  type SortStats,
} from "./lib/algorithms";
import { trpc } from "./lib/trpc";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";

const SPEEDS = [
  { label: "Very slow", delay: 700 },
  { label: "Slow", delay: 360 },
  { label: "Normal", delay: 130 },
  { label: "Fast", delay: 32 },
  { label: "Instant", delay: 0 },
];

const emptyStats: SortStats = { comparisons: 0, swaps: 0, accesses: 0, iteration: 0 };
const sampleArray = [45, 12, 78, 23, 9, 64, 31, 56, 18, 72];

function getVisitorKey() {
  const storageKey = "sortx-visitor-key";
  try {
    const existing = window.localStorage.getItem(storageKey);
    if (existing) return existing;
    const created = `visitor-${crypto.randomUUID()}`;
    window.localStorage.setItem(storageKey, created);
    return created;
  } catch {
    return "visitor-session";
  }
}

function formatTime(ms: number) {
  if (!ms) return "0.00s";
  return `${(ms / 1000).toFixed(2)}s`;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={`brand ${compact ? "brand-compact" : ""}`} aria-label="SortX home">
      <span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span>
      <span className="brand-word">Sort<span>X</span></span>
    </Link>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button className="icon-button" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`} title="Toggle theme">
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}

function SiteShell({ children }: { children: React.ReactNode }) {
  const [path] = useLocation();
  const [open, setOpen] = useState(false);
  const nav = [
    ["/visualizer", "Visualizer", Activity],
    ["/algorithms", "Algorithms", Layers3],
    ["/compare", "Compare", GitCompareArrows],
    ["/learn", "Learn", BookOpen],
  ] as const;
  return (
    <div className="app-shell">
      <div className="noise" aria-hidden="true" />
      <header className="topbar">
        <div className="topbar-inner">
          <Logo />
          <nav className={`main-nav ${open ? "is-open" : ""}`} aria-label="Main navigation">
            {nav.map(([href, label, Icon]) => (
              <Link key={href} href={href} className={path === href || (href === "/algorithms" && path.startsWith("/algorithms/")) ? "active" : ""} onClick={() => setOpen(false)}>
                <Icon size={15} />{label}
              </Link>
            ))}
            <Link href="/about" className={path === "/about" ? "active" : ""} onClick={() => setOpen(false)}><CircleHelp size={15} />About</Link>
          </nav>
          <div className="topbar-actions">
            <span className="live-chip"><span className="live-dot" /> Live lab</span>
            <ThemeToggle />
            <button className="icon-button menu-button" onClick={() => setOpen(value => !value)} aria-label="Open navigation">{open ? <X size={18} /> : <Menu size={18} />}</button>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer"><div className="footer-inner"><Logo compact /><span>Interactive visualization for Design &amp; Analysis of Algorithms.</span><span className="footer-status"><ShieldCheck size={14} /> Client-first · event-accurate</span></div></footer>
    </div>
  );
}

function SectionHeading({ eyebrow, title, copy, action }: { eyebrow: string; title: string; copy?: string; action?: React.ReactNode }) {
  return <div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" />{eyebrow}</div><h2>{title}</h2>{copy && <p>{copy}</p>}</div>{action}</div>;
}

function SignalBars({ values = sampleArray, animated = false, compact = false }: { values?: number[]; animated?: boolean; compact?: boolean }) {
  const max = Math.max(...values, 1);
  return <div className={`signal-bars ${animated ? "bars-animated" : ""} ${compact ? "bars-compact" : ""}`} aria-label="Sorting bars preview">
    {values.map((value, index) => <span key={`${index}-${value}`} className="signal-bar" style={{ height: `${Math.max(12, value / max * 100)}%`, animationDelay: `${index * 70}ms` }}><b>{compact ? "" : value}</b></span>)}
  </div>;
}

function HomePage() {
  const [demoValues, setDemoValues] = useState(sampleArray);
  useEffect(() => {
    const timer = window.setInterval(() => setDemoValues(generateDataset("random", 10)), 4200);
    return () => window.clearInterval(timer);
  }, []);
  return <div>
    <section className="hero page-pad">
      <div className="hero-copy">
        <div className="eyebrow"><span className="eyebrow-line" />Interactive algorithm lab <span className="eyebrow-tag">v1.0</span></div>
        <h1>See algorithms<br /><em>think.</em></h1>
        <p className="hero-lede">An interactive visual laboratory for understanding how sorting algorithms work — one comparison, swap and iteration at a time.</p>
        <div className="hero-actions"><Link href="/visualizer" className="button button-primary"><Play size={16} fill="currentColor" /> Start visualizing <ArrowRight size={16} /></Link><Link href="/algorithms" className="button button-secondary">Explore algorithms <ChevronRight size={16} /></Link></div>
        <div className="hero-proof"><span><Check size={14} /> 8 real algorithms</span><span><Check size={14} /> Live operation metrics</span><span><Check size={14} /> No black boxes</span></div>
      </div>
      <div className="hero-visual">
        <div className="hero-orbit orbit-one" /><div className="hero-orbit orbit-two" />
        <div className="lab-window">
          <div className="window-chrome"><span><i /><i /><i /></span><span className="window-label"><Activity size={12} /> sortx / visualizer</span><span className="window-live">RUNNING</span></div>
          <div className="window-meta"><span><b>QUICK SORT</b><small>partition / average case</small></span><span className="window-pulse"><span /> LIVE TRACE</span></div>
          <SignalBars values={demoValues} animated />
          <div className="window-axis"><span>0</span><span>ARRAY STATE</span><span>100</span></div>
          <div className="window-callout"><span className="callout-index">03</span><span><b>Comparing 42 and 18</b><small>42 &gt; 18 → swap candidates</small></span><span className="callout-arrow"><ArrowDown size={15} /></span></div>
          <div className="window-stats"><span><small>COMPARISONS</small><b>17</b></span><span><small>SWAPS</small><b>06</b></span><span><small>ACCESS</small><b>34</b></span><span><small>ELAPSED</small><b>0.42s</b></span></div>
        </div>
        <div className="hero-float float-top"><span className="float-icon cyan"><Zap size={15} /></span><span><small>OPERATION</small><b>COMPARE</b></span></div>
        <div className="hero-float float-bottom"><span className="float-icon green"><Check size={15} /></span><span><small>INVARIANT</small><b>SUFFIX SORTED</b></span></div>
      </div>
    </section>

    <section className="signal-strip"><div className="signal-strip-inner"><span className="signal-strip-item"><span className="signal-dot cyan-dot" /> Data in motion</span><span className="signal-strip-line" /><span className="signal-strip-item">Designed for DAA classrooms</span><span className="signal-strip-line" /><span className="signal-strip-item">Built for curiosity <Sparkles size={14} /></span></div></section>

    <section className="page-pad feature-section"><SectionHeading eyebrow="Why SortX" title="Make the invisible visible." copy="Sorting stops being a block of pseudocode when every comparison has a place, a color, and a consequence." /><div className="feature-grid">
      {[[Eye, "Learn visually", "See invariants form as bars move — not after the fact."], [Gauge, "Feel the tradeoffs", "Watch quadratic work stack up beside a tighter strategy."], [GitCompareArrows, "Compare honestly", "Same input. Independent runs. Metrics that match the work."], [FlaskConical, "Experiment freely", "Generate, pause, step, reset, and make the array yours."]].map(([Icon, title, copy], index) => <div className="feature-card" key={title as string}><span className="feature-number">0{index + 1}</span><Icon size={21} /><h3>{title as string}</h3><p>{copy as string}</p><ArrowRight className="feature-arrow" size={16} /></div>)}
    </div></section>

    <section className="page-pad algorithms-preview"><SectionHeading eyebrow="The toolkit" title="Eight ways to get to ordered." copy="From adjacent swaps to frequency buckets, each algorithm is implemented as a traceable operation stream." action={<Link href="/algorithms" className="text-link">View all algorithms <ArrowRight size={15} /></Link>} /><div className="algorithm-grid">{ALGORITHMS.map((meta, index) => <AlgorithmCard key={meta.key} meta={meta} index={index} />)}</div></section>

    <section className="page-pad complexity-section"><div className="complexity-panel"><div className="complexity-copy"><div className="eyebrow"><span className="eyebrow-line" />Complexity radar</div><h2>Fast is a shape,<br /><em>not a label.</em></h2><p>See where the work goes. SortX turns complexity into a visual signature you can compare at a glance.</p><Link href="/compare" className="button button-secondary">Open comparison lab <ArrowRight size={15} /></Link></div><div className="complexity-chart"><div className="chart-y-label">WORK / n</div><div className="curve curve-cyan" /><div className="curve curve-violet" /><div className="curve curve-coral" /><div className="chart-axis"><span>n=10</span><span>n=50</span><span>n=100</span><span>n=200</span></div><div className="chart-legend"><span><i className="legend-cyan" />O(n log n)</span><span><i className="legend-violet" />O(n)</span><span><i className="legend-coral" />O(n²)</span></div></div></div></section>

    <section className="page-pad how-section"><SectionHeading eyebrow="The loop" title="From data to understanding." /><div className="how-grid">{[["01", "Generate data", "Shape an input that makes the behavior legible."], ["02", "Choose a strategy", "Pick from eight real implementations."], ["03", "Visualize", "Pause, step, and read every operation."], ["04", "Analyze", "Compare the metrics and keep the insight."]].map(([num, title, copy], index) => <div className="how-step" key={num}><span>{num}</span><div><h3>{title}</h3><p>{copy}</p></div>{index < 3 && <ArrowRight size={16} className="how-arrow" />}</div>)}</div></section>

    <section className="page-pad final-cta"><div><div className="eyebrow"><span className="eyebrow-line" />Your next experiment</div><h2>Make one array<br /><em>tell the story.</em></h2></div><Link href="/visualizer" className="button button-primary">Enter the lab <ArrowRight size={16} /></Link></section>
  </div>;
}

function AlgorithmCard({ meta, index }: { meta: AlgorithmMeta; index?: number }) {
  return <Link href={`/algorithms/${meta.key}`} className="algorithm-card" style={{ ["--algorithm-color" as string]: meta.color }}><div className="algorithm-card-top"><span className="algorithm-index">{String((index ?? 0) + 1).padStart(2, "0")}</span><span className="algorithm-signal" /><span className="algorithm-badge">{meta.stable ? "STABLE" : "UNSTABLE"}</span></div><h3>{meta.name}</h3><p>{meta.description}</p><div className="complexity-row"><span><small>AVG</small>{meta.average}</span><span><small>SPACE</small>{meta.space}</span></div><span className="card-link">Trace algorithm <ArrowRight size={14} /></span></Link>;
}

function StatCard({ label, value, icon: Icon, accent = "cyan" }: { label: string; value: string | number; icon: typeof Activity; accent?: string }) {
  return <div className={`stat-card stat-${accent}`}><span className="stat-icon"><Icon size={15} /></span><span><small>{label}</small><b>{value}</b></span></div>;
}

function BarStage({ array, event, mode, maxElements }: { array: number[]; event?: SortEvent; mode: "bar" | "number" | "compact"; maxElements: number }) {
  const min = Math.min(...array, 0);
  const max = Math.max(...array, 1);
  const range = Math.max(1, max - min);
  const compact = mode === "compact" || array.length > 80;
  const itemWidth = compact ? undefined : `${Math.max(20, Math.min(70, 720 / Math.max(array.length, 1)))}px`;
  return <div className={`bar-stage mode-${mode} ${compact ? "is-dense" : ""}`} role="img" aria-label={`Array visualization with ${array.length} elements`}>
    <div className="stage-grid" />
    <div className="bar-baseline" />
    <div className="bar-collection">
      {array.map((value, index) => {
        const active = event?.indices.includes(index);
        const isPivot = event?.pivotIndex === index;
        const isSorted = event?.sorted.includes(index);
        const isRange = event?.activeRange && index >= event.activeRange[0] && index <= event.activeRange[1];
        const type = event?.type;
        const height = Math.max(5, ((value - min) / range) * 92);
        return <div key={`${index}-${value}`} className={`bar-slot ${active ? `is-${type?.toLowerCase()}` : ""} ${isPivot ? "is-pivot" : ""} ${isSorted ? "is-sorted" : ""} ${isRange ? "is-range" : ""}`} style={{ width: itemWidth }}><div className="bar-value" style={{ height: `${height}%` }}><span className="bar-sheen" />{mode === "number" && <b>{value}</b>}</div>{!compact && <small>{index}</small>}</div>;
      })}
    </div>
    <div className="stage-labels"><span>LOW SIGNAL</span><span>LIVE ARRAY STATE · {array.length} ELEMENTS</span><span>HIGH SIGNAL</span></div>
  </div>;
}

function DataGenerator({ onGenerate, disabled }: { onGenerate: (preset: DatasetPreset) => void; disabled?: boolean }) {
  const choices: [DatasetPreset, string][] = [["random", "Random"], ["nearly", "Nearly sorted"], ["reversed", "Reversed"], ["few", "Few unique"], ["high", "High variance"], ["low", "Low variance"]];
  return <div className="generator-row">{choices.map(([preset, label]) => <button key={preset} className="mini-button" onClick={() => onGenerate(preset)} disabled={disabled}>{label}</button>)}</div>;
}

function VisualizerPage() {
  const [baseArray, setBaseArray] = useState(sampleArray);
  const [algorithm, setAlgorithm] = useState<AlgorithmKey>("quick");
  const [speed, setSpeed] = useState(2);
  const [mode, setMode] = useState<"bar" | "number" | "compact">("bar");
  const [custom, setCustom] = useState("");
  const [customError, setCustomError] = useState("");
  const [cursor, setCursor] = useState(0);
  const [status, setStatus] = useState<"idle" | "running" | "paused" | "complete">("idle");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [logOpen, setLogOpen] = useState(true);
  const [notice, setNotice] = useState("");
  const sessionSave = trpc.sortx.sessions.save.useMutation();
  const sessionSaved = useRef(false);
  const run = useMemo(() => runAlgorithm(baseArray, algorithm), [baseArray, algorithm]);
  const event = cursor > 0 ? run.events[Math.min(cursor - 1, run.events.length - 1)] : undefined;
  const displayArray = event?.array ?? baseArray;
  const stats = event?.stats ?? emptyStats;
  const algorithmMeta = ALGORITHM_MAP[algorithm];
  const displayedElapsed = status === "running" && startedAt ? Date.now() - startedAt : elapsed;

  useEffect(() => {
    if (status !== "running") return;
    if (speed === 4) {
      const frame = window.requestAnimationFrame(() => {
        setCursor(run.events.length);
        setElapsed(startedAt ? Date.now() - startedAt : elapsed);
        setStatus("complete");
      });
      return () => window.cancelAnimationFrame(frame);
    }
    const timer = window.setTimeout(() => {
      setCursor(current => {
        const next = Math.min(run.events.length, current + 1);
        if (next >= run.events.length) {
          setStatus("complete");
          setElapsed(startedAt ? Date.now() - startedAt : 0);
        }
        return next;
      });
    }, SPEEDS[speed].delay);
    return () => window.clearTimeout(timer);
  }, [status, cursor, speed, run.events.length, startedAt]);

  useEffect(() => {
    if (status !== "running" || !startedAt) return;
    const timer = window.setInterval(() => setElapsed(Date.now() - startedAt), 100);
    return () => window.clearInterval(timer);
  }, [status, startedAt]);

  useEffect(() => {
    const onKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.code !== "Space" || keyboardEvent.target instanceof HTMLInputElement || keyboardEvent.target instanceof HTMLSelectElement) return;
      keyboardEvent.preventDefault();
      if (status === "running") setStatus("paused");
      else if (status !== "complete") {
        setStartedAt(value => value ?? Date.now());
        setStatus("running");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [status]);

  useEffect(() => {
    if (status !== "complete" || sessionSaved.current) return;
    sessionSaved.current = true;
    sessionSave.mutate({ visitorKey: getVisitorKey(), algorithm, elements: baseArray.length, comparisons: stats.comparisons, swaps: stats.swaps, accesses: stats.accesses, elapsedMs: displayedElapsed });
  }, [status, sessionSave, algorithm, baseArray.length, stats.comparisons, stats.swaps, stats.accesses, displayedElapsed]);

  const reset = useCallback(() => { sessionSaved.current = false; setCursor(0); setStatus("idle"); setElapsed(0); setStartedAt(null); setNotice(""); }, []);
  const generate = (preset: DatasetPreset) => { setBaseArray(generateDataset(preset, baseArray.length)); reset(); setNotice(`${preset[0].toUpperCase()}${preset.slice(1)} dataset ready.`); };
  const step = () => { if (status === "complete") return; setStatus("paused"); setCursor(current => Math.min(run.events.length, current + 1)); };
  const start = () => { if (status === "complete") reset(); setStartedAt(value => value ?? Date.now()); setStatus("running"); };
  const applyCustom = () => { const parsed = parseCustomArray(custom); if (parsed.error) { setCustomError(parsed.error); return; } setCustomError(""); setBaseArray(parsed.values ?? sampleArray); reset(); setNotice("Custom array loaded into the lab."); };
  const progress = run.events.length ? cursor / run.events.length * 100 : 0;
  const opsPerSecond = displayedElapsed > 0 ? Math.round((stats.comparisons + stats.swaps + stats.accesses) / (displayedElapsed / 1000)) : 0;

  return <div className="page-pad visualizer-page">
    <div className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line" />The visualizer</div><h1>Watch the invariant hold.</h1><p>Every highlight below is tied to a real operation in <b>{algorithmMeta.name}</b>. Pause the trace when the idea clicks.</p></div><div className="intro-actions"><span className={`status-badge status-${status}`}><span />{status === "complete" ? "SORTING COMPLETE" : status === "running" ? "TRACE RUNNING" : status === "paused" ? "TRACE PAUSED" : "READY TO TRACE"}</span><span className="shortcut-hint"><kbd>Space</kbd> play / pause</span></div></div>
    <div className="visualizer-layout">
      <section className="visualizer-main">
        <div className="panel stage-panel"><div className="panel-header"><div><span className="panel-kicker">LIVE ARRAY</span><h2>{algorithmMeta.name} <span className="muted-slash">/</span> <span className="panel-subtitle">{baseArray.length} values</span></h2></div><div className="mode-switch" role="group" aria-label="Visualization mode">{([["bar", "Bars"], ["number", "Numbers"], ["compact", "Compact"]] as const).map(([value, label]) => <button key={value} className={mode === value ? "selected" : ""} onClick={() => setMode(value)}>{label}</button>)}</div></div><BarStage array={displayArray} event={event} mode={mode} maxElements={baseArray.length} /><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><div className="stage-legend"><span><i className="legend-bar compare" />Compare</span><span><i className="legend-bar swap" />Swap</span><span><i className="legend-bar sorted" />Sorted</span><span><i className="legend-bar pivot" />Pivot</span><span className="legend-note">{cursor} / {run.events.length} events</span></div></div>
        <div className="control-grid"><div className="panel controls-panel"><div className="panel-header"><div><span className="panel-kicker">COMMAND DECK</span><h2>Control trace</h2></div><Settings2 size={17} className="panel-icon" /></div><div className="control-buttons"><button className="button button-primary control-start" onClick={start} disabled={status === "running"}><Play size={16} fill="currentColor" /> {status === "paused" ? "Resume" : "Start"}</button><button className="button button-secondary" onClick={() => setStatus("paused")} disabled={status !== "running"}><Pause size={16} /> Pause</button><button className="button button-secondary" onClick={step} disabled={status === "running" || status === "complete"}><StepForward size={16} /> Step</button><button className="button button-ghost" onClick={reset}><RotateCcw size={16} /> Reset</button><button className="button button-ghost instant-button" onClick={() => { setSpeed(4); start(); }} disabled={status === "running"}><Zap size={15} /> Instant</button></div><div className="speed-control"><div className="control-label"><span>Playback speed</span><b>{SPEEDS[speed].label}</b></div><input type="range" min="0" max="4" value={speed} onChange={event => setSpeed(Number(event.target.value))} aria-label="Playback speed" /><div className="range-labels"><span>Very slow</span><span>Instant</span></div></div></div>
          <div className="panel selection-panel"><div className="panel-header"><div><span className="panel-kicker">STRATEGY</span><h2>Choose algorithm</h2></div><ChevronDown size={17} className="panel-icon" /></div><select value={algorithm} onChange={event => { setAlgorithm(event.target.value as AlgorithmKey); reset(); }} aria-label="Choose sorting algorithm">{ALGORITHMS.map(meta => <option key={meta.key} value={meta.key}>{meta.name}</option>)}</select><div className="algorithm-mini-meta"><span><small>AVERAGE</small><b>{algorithmMeta.average}</b></span><span><small>SPACE</small><b>{algorithmMeta.space}</b></span><span><small>{algorithmMeta.stable ? "STABLE" : "UNSTABLE"}</small><b>{algorithmMeta.inPlace ? "IN-PLACE" : "AUXILIARY"}</b></span></div></div></div>
        <div className="data-panel-grid"><div className="panel generator-panel"><div className="panel-header"><div><span className="panel-kicker">INPUT SHAPER</span><h2>Generate dataset</h2></div><Database size={17} className="panel-icon" /></div><div className="generator-size"><div className="control-label"><span>Array size</span><b>{baseArray.length}</b></div><input type="range" min="10" max="100" value={Math.min(100, baseArray.length)} onChange={event => { setBaseArray(generateDataset("random", Number(event.target.value))); reset(); }} aria-label="Array size" /></div><DataGenerator onGenerate={generate} disabled={status === "running"} /><div className="custom-input"><label htmlFor="custom-array">Custom array</label><div className="input-row"><input id="custom-array" value={custom} onChange={event => setCustom(event.target.value)} placeholder="45, 12, 78, 34, 9..." /><button className="mini-button mini-button-accent" onClick={applyCustom}>Load</button></div>{customError && <span className="inline-error">{customError}</span>}</div></div><div className="panel happening-panel"><div className="panel-header"><div><span className="panel-kicker">TRACE INTELLIGENCE</span><h2>What’s happening?</h2></div><span className="operation-type">{event?.type ?? "IDLE"}</span></div><div className="happening-copy"><span className="operation-index">{event ? String(event.id + 1).padStart(2, "0") : "--"}</span><div><h3>{event?.message ?? "Ready when you are."}</h3><p>{event?.explanation ?? `Choose an algorithm and press Start. ${algorithmMeta.keyIdea}`}</p></div></div><div className="stats-grid"><StatCard label="Comparisons" value={formatNumber(stats.comparisons)} icon={Search} accent="cyan" /><StatCard label="Swaps" value={formatNumber(stats.swaps)} icon={Zap} accent="coral" /><StatCard label="Accesses" value={formatNumber(stats.accesses)} icon={Activity} accent="violet" /><StatCard label="Iteration" value={formatNumber(stats.iteration)} icon={ListRestart} accent="green" /><StatCard label="Elapsed" value={formatTime(displayedElapsed)} icon={Timer} accent="amber" /><StatCard label="Ops / sec" value={formatNumber(opsPerSecond)} icon={Gauge} accent="cyan" /></div></div></div>
        <div className="panel operation-log"><button className="log-toggle" onClick={() => setLogOpen(value => !value)}><span><span className="panel-kicker">AUDIT TRAIL</span><h2>Operation log <small>{run.events.length} events</small></h2></span>{logOpen ? <ChevronDown size={17} /> : <ChevronRight size={17} />}</button>{logOpen && <div className="log-list">{run.events.slice(Math.max(0, cursor - 7), Math.max(0, cursor)).reverse().map(log => <div className={`log-item log-${log.type.toLowerCase()}`} key={log.id}><span>{String(log.id + 1).padStart(2, "0")}</span><b>{log.type}</b><p>{log.message}</p><small>{log.stats.comparisons} cmp · {log.stats.swaps} swp</small></div>)}{cursor === 0 && <div className="empty-log"><Activity size={18} /><span>Step into the trace and each operation will appear here.</span></div>}</div>}</div>
      </section>
      <aside className="visualizer-rail"><div className="panel info-panel"><div className="panel-header"><div><span className="panel-kicker">ALGORITHM NOTE</span><h2>{algorithmMeta.name}</h2></div><span className="algorithm-color-dot" style={{ background: algorithmMeta.color }} /></div><p>{algorithmMeta.description}</p><div className="key-idea"><Lightbulb size={16} /><span><small>KEY IDEA</small><b>{algorithmMeta.keyIdea}</b></span></div><div className="complexity-list"><ComplexityLine label="Best case" value={algorithmMeta.best} /><ComplexityLine label="Average" value={algorithmMeta.average} /><ComplexityLine label="Worst case" value={algorithmMeta.worst} /><ComplexityLine label="Space" value={algorithmMeta.space} /></div><div className="meta-pills"><span>{algorithmMeta.stable ? "Stable" : "Unstable"}</span><span>{algorithmMeta.inPlace ? "In-place" : "Out-of-place"}</span></div><Link href={`/algorithms/${algorithmMeta.key}`} className="panel-link">Open detailed explainer <ArrowRight size={14} /></Link></div><div className="panel completion-panel"><div className="completion-icon">{status === "complete" ? <Check size={20} /> : <Target size={20} />}</div><span className="panel-kicker">{status === "complete" ? "TRACE COMPLETE" : "SESSION STATUS"}</span><h3>{status === "complete" ? "Sorted with intent." : "Find the signal."}</h3><p>{status === "complete" ? `This ${algorithmMeta.name} run used ${stats.comparisons} comparisons and ${stats.swaps} swaps.` : "Try the same dataset with a second algorithm. The contrast is the lesson."}</p>{status === "complete" && <div className="completion-total"><span>Total operations</span><b>{formatNumber(stats.comparisons + stats.swaps + stats.accesses)}</b></div>}</div><div className="panel note-panel"><span className="panel-kicker">LAB NOTE</span><p>“The right visualization doesn't replace the proof. It lets you see where the proof is happening.”</p><span className="note-author">— SortX learning system</span></div></aside>
    </div>{notice && <div className="toast-note"><Check size={15} />{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={14} /></button></div>}
  </div>;
}

function ComplexityLine({ label, value }: { label: string; value: string }) { return <div><span>{label}</span><b>{value}</b></div>; }

function AlgorithmsPage() {
  const [query, setQuery] = useState("");
  const metadataQuery = trpc.sortx.metadata.useQuery(undefined, { staleTime: Infinity });
  const filtered = ALGORITHMS.filter(meta => `${meta.name} ${meta.description} ${meta.eyebrow}`.toLowerCase().includes(query.toLowerCase()));
  const metadataCount = metadataQuery.data?.algorithms.length ?? ALGORITHMS.length;
  return <div className="page-pad content-page"><div className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line" />Algorithm explorer</div><h1>The strategy shelf.</h1><p>Eight algorithms. Eight different ways to make order emerge. Open any card for a trace, a use case, and the tradeoffs behind the notation.</p></div><div className="search-box"><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Find an algorithm" aria-label="Find an algorithm" /></div></div><div className="explorer-toolbar"><span>{filtered.length} of {metadataCount} strategies indexed</span><span className="toolbar-rule" /><span className="toolbar-note"><Activity size={14} /> {metadataQuery.isError ? "Local metadata fallback" : "Synced metadata"} · Each card links to a live visual demo</span></div><div className="algorithm-grid explorer-grid">{filtered.map((meta, index) => <AlgorithmCard key={meta.key} meta={meta} index={index} />)}</div></div>;
}

function AlgorithmDetailPage({ keyName }: { keyName: AlgorithmKey }) {
  const meta = ALGORITHM_MAP[keyName] ?? ALGORITHM_MAP.quick;
  const [demoArray, setDemoArray] = useState(() => generateDataset("random", 12));
  const demoRun = useMemo(() => runAlgorithm(demoArray, meta.key), [demoArray, meta.key]);
  const [demoStep, setDemoStep] = useState(0);
  const demoEvent = demoStep ? demoRun.events[Math.min(demoStep - 1, demoRun.events.length - 1)] : undefined;
  return <div className="page-pad detail-page"><div className="detail-top"><Link href="/algorithms" className="back-link"><ArrowRight size={14} className="back-arrow" /> Back to explorer</Link><div className="detail-kicker"><span className="algorithm-color-dot" style={{ background: meta.color }} /> {meta.eyebrow}</div><h1>{meta.name}</h1><p>{meta.description}</p><div className="detail-actions"><Link href={`/visualizer?algorithm=${meta.key}`} className="button button-primary">Open in visualizer <ArrowRight size={16} /></Link><button className="button button-secondary" onClick={() => { setDemoArray(generateDataset("random", 12)); setDemoStep(0); }}><RotateCcw size={15} /> New example</button></div></div><div className="detail-grid"><div><div className="panel detail-demo"><div className="panel-header"><div><span className="panel-kicker">INTERACTIVE EXAMPLE</span><h2>See {meta.name} in motion</h2></div><button className="mini-button mini-button-accent" onClick={() => setDemoStep(value => Math.min(demoRun.events.length, value + 1))}><StepForward size={14} /> Step</button></div><BarStage array={demoEvent?.array ?? demoArray} event={demoEvent} mode="bar" maxElements={demoArray.length} /><div className="demo-footer"><span>{demoStep} / {demoRun.events.length} operations</span><div className="progress-track"><span style={{ width: `${demoRun.events.length ? demoStep / demoRun.events.length * 100 : 0}%` }} /></div><span>{demoEvent?.type ?? "READY"}</span></div></div><div className="panel explainer-panel"><div className="panel-header"><div><span className="panel-kicker">THE IDEA</span><h2>Why it works</h2></div><Lightbulb size={17} className="panel-icon" /></div><p className="large-copy">{meta.keyIdea}</p><div className="use-case-grid"><div><small>USE IT FOR</small>{meta.useCases.map(item => <span key={item}><Check size={13} /> {item}</span>)}</div><div><small>TRADEOFFS</small>{meta.cons.map(item => <span key={item}><ArrowRight size={13} /> {item}</span>)}</div></div></div></div><aside className="detail-rail"><div className="panel complexity-panel-small"><span className="panel-kicker">COMPLEXITY PROFILE</span><div className="detail-complexity"><ComplexityLine label="Best" value={meta.best} /><ComplexityLine label="Average" value={meta.average} /><ComplexityLine label="Worst" value={meta.worst} /><ComplexityLine label="Space" value={meta.space} /></div><div className="meta-pills"><span>{meta.stable ? "Stable" : "Unstable"}</span><span>{meta.inPlace ? "In-place" : "Out-of-place"}</span></div></div><div className="panel pseudocode-panel"><div className="panel-header"><div><span className="panel-kicker">PSEUDOCODE</span><h2>Trace the logic</h2></div><Code2 size={17} className="panel-icon" /></div><pre>{meta.pseudocode.map((line, index) => <code key={`${line}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span>{line}</code>)}</pre></div><div className="panel pro-con"><span className="panel-kicker">DECISION NOTE</span><h3>When to use it</h3><div className="pro-list">{meta.pros.map(item => <span key={item}><Check size={14} />{item}</span>)}</div></div></aside></div></div>;
}

function ComparePage() {
  const [selected, setSelected] = useState<AlgorithmKey[]>(["bubble", "merge", "quick"]);
  const [size, setSize] = useState(28);
  const [seed, setSeed] = useState(() => generateDataset("random", 28));
  const runs = useMemo(() => selected.map(key => ({ key, meta: ALGORITHM_MAP[key], run: runAlgorithm(seed, key) })), [selected, seed]);
  const chartData = runs.map(({ meta, run }) => ({ name: meta.name.replace(" Sort", ""), comparisons: run.stats.comparisons, swaps: run.stats.swaps, operations: run.stats.comparisons + run.stats.swaps + run.stats.accesses, fill: meta.color }));
  const toggle = (key: AlgorithmKey) => setSelected(current => current.includes(key) ? current.filter(item => item !== key) : current.length < 4 ? [...current, key] : current);
  return <div className="page-pad content-page compare-page"><div className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line" />Comparison lab</div><h1>Same input.<br /><em>Different stories.</em></h1><p>Run the same array through two to four independent implementations. The counts below come from the same event engine as the visualizer.</p></div><button className="button button-secondary" onClick={() => setSeed(generateDataset("random", size))}><RotateCcw size={15} /> Regenerate input</button></div><div className="compare-controls panel"><div><span className="panel-kicker">SELECT STRATEGIES · {selected.length}/4</span><div className="compare-pills">{ALGORITHMS.map(meta => <button key={meta.key} onClick={() => toggle(meta.key)} className={selected.includes(meta.key) ? "selected" : ""} style={{ ["--pill-color" as string]: meta.color }}><span />{meta.name.replace(" Sort", "")}</button>)}</div></div><div className="compare-size"><span>Input size <b>{size}</b></span><input type="range" min="12" max="60" value={size} onChange={event => { const next = Number(event.target.value); setSize(next); setSeed(generateDataset("random", next)); }} aria-label="Comparison input size" /></div></div><div className="compare-layout"><div className="panel chart-panel"><div className="panel-header"><div><span className="panel-kicker">PERFORMANCE CHART</span><h2>Operation footprint</h2></div><span className="chart-note"><span className="live-dot" /> same input / {seed.length} values</span></div><div className="big-chart"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData} barGap={10}><CartesianGrid strokeDasharray="3 3" stroke="var(--line-soft)" vertical={false} /><XAxis dataKey="name" tick={{ fill: "var(--text-muted)", fontSize: 12 }} axisLine={false} tickLine={false} /><YAxis tick={{ fill: "var(--text-muted)", fontSize: 11 }} axisLine={false} tickLine={false} width={36} /><ChartTooltip contentStyle={{ background: "var(--surface-strong)", border: "1px solid var(--line)", borderRadius: 12, color: "var(--text)" }} /><Bar dataKey="operations" radius={[5, 5, 0, 0]}>{chartData.map((entry) => <Cell key={entry.name} fill={entry.fill} fillOpacity={0.9} />)}</Bar></BarChart></ResponsiveContainer></div><div className="chart-footnote"><span><i className="legend-cyan" />total operations (comparisons + swaps + accesses)</span><span>Lower is quieter.</span></div></div><div className="panel compare-table-panel"><div className="panel-header"><div><span className="panel-kicker">RUN BREAKDOWN</span><h2>Metric readout</h2></div><BarChart3 size={17} className="panel-icon" /></div><div className="comparison-table">{runs.map(({ meta, run }) => <div className="comparison-row" key={meta.key}><div className="comparison-name"><span className="algorithm-color-dot" style={{ background: meta.color }} /><b>{meta.name}</b></div><span>{formatNumber(run.stats.comparisons)} <small>cmp</small></span><span>{formatNumber(run.stats.swaps)} <small>swp</small></span><span>{formatNumber(run.stats.accesses)} <small>acc</small></span></div>)}</div><div className="table-head"><span>ALGORITHM</span><span>COMPARE</span><span>SWAP</span><span>ACCESS</span></div></div></div><div className="panel complexity-table-panel"><div className="panel-header"><div><span className="panel-kicker">COMPLEXITY TABLE</span><h2>Know the shape before you run.</h2></div><Link href="/learn" className="text-link">Read the primer <ArrowRight size={14} /></Link></div><div className="complexity-table"><div className="complexity-table-head"><span>Algorithm</span><span>Best</span><span>Average</span><span>Worst</span><span>Space</span><span>Stable</span></div>{selected.map(key => { const meta = ALGORITHM_MAP[key]; return <div className="complexity-table-row" key={key}><span><i className="table-dot" style={{ background: meta.color }} />{meta.name}</span><b>{meta.best}</b><b>{meta.average}</b><b>{meta.worst}</b><b>{meta.space}</b><span>{meta.stable ? "Yes" : "No"}</span></div>; })}</div></div></div>;
}

function LearnPage() {
  const [active, setActive] = useState("what");
  const topics = [{ id: "what", title: "What is sorting?", copy: "Sorting rearranges values into an order that makes the next operation predictable. The order can be ascending, descending, alphabetical, or domain-specific." }, { id: "complexity", title: "Read complexity", copy: "Big-O describes how the work grows as n grows. It is not a stopwatch — it is a shape. Compare the slope, then inspect the constants and memory behavior." }, { id: "stability", title: "Stable vs unstable", copy: "A stable algorithm keeps equal values in their original relative order. That matters when sorting records by one field after another." }, { id: "divide", title: "Divide and conquer", copy: "Merge Sort and Quick Sort shrink a large problem into smaller regions, solve them, and combine the result. The recursion is a strategy for reducing cognitive load." }, { id: "comparison", title: "Comparison vs counting", copy: "Comparison sorts learn by asking which of two values comes first. Counting Sort skips those questions when the value range is small and known." }];
  const item = topics.find(topic => topic.id === active) ?? topics[0];
  return <div className="page-pad content-page learn-page"><div className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line" />Learn sorting</div><h1>Build the mental model.</h1><p>A compact field guide for the moments when the bars move faster than the intuition. Read a concept, then test it in the lab.</p></div><Link href="/quiz" className="button button-primary"><Trophy size={15} /> Test your knowledge</Link></div><div className="learn-layout"><div className="learn-nav panel">{topics.map((topic, index) => <button key={topic.id} onClick={() => setActive(topic.id)} className={active === topic.id ? "active" : ""}><span>0{index + 1}</span>{topic.title}<ChevronRight size={15} /></button>)}</div><div className="learn-content"><div className="panel concept-panel"><div className="concept-ornament"><span /><span /><span /></div><span className="panel-kicker">CONCEPT / 0{topics.findIndex(topic => topic.id === active) + 1}</span><h2>{item.title}</h2><p className="large-copy">{item.copy}</p><div className="concept-example"><div><span className="panel-kicker">TRY THE IDEA</span><h3>One array. Three lenses.</h3><p>Take <code>[5, 2, 8, 2]</code>. A comparison sort asks questions. A stable sort remembers which 2 came first. A complexity lens asks how that work grows.</p></div><Link href="/visualizer" className="button button-secondary">Open the lab <ArrowRight size={15} /></Link></div></div><div className="learn-cards"><div className="panel learn-card"><span className="learn-card-icon"><Layers3 size={16} /></span><h3>In-place</h3><p>Uses constant or small auxiliary memory while rearranging the same array.</p></div><div className="panel learn-card"><span className="learn-card-icon violet"><Database size={16} /></span><h3>Stable</h3><p>Equal values preserve their original relative order after the run.</p></div><div className="panel learn-card"><span className="learn-card-icon amber"><Gauge size={16} /></span><h3>Adaptive</h3><p>Gets faster when the input is already close to the target order.</p></div></div></div></div></div>;
}

const QUIZ = [{ question: "Which family uses divide and conquer to split the input into smaller regions?", options: ["Bubble Sort", "Merge Sort", "Counting Sort", "Selection Sort"], correct: 1, explanation: "Merge Sort divides the array into halves, recursively sorts them, then merges the ordered runs." }, { question: "Which algorithm can run in O(n + k) when k, the value range, is bounded?", options: ["Quick Sort", "Heap Sort", "Counting Sort", "Insertion Sort"], correct: 2, explanation: "Counting Sort uses frequency buckets instead of comparing pairs." }, { question: "What does stable mean in sorting?", options: ["It always runs in linear time", "It never uses extra memory", "Equal values keep their original relative order", "It cannot be paused"], correct: 2, explanation: "Stability preserves the relative order of records with equal keys." }, { question: "Which algorithm is adaptive and often excellent on nearly-sorted input?", options: ["Insertion Sort", "Heap Sort", "Counting Sort", "Quick Sort"], correct: 0, explanation: "Insertion Sort only shifts the inversions it encounters, so a nearly sorted input is cheap." }];

function QuizPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [complete, setComplete] = useState(false);
  const quizSave = trpc.sortx.quiz.save.useMutation();
  const question = QUIZ[index];
  const score = answers.filter((answer, answerIndex) => answer === QUIZ[answerIndex].correct).length;
  const choose = (choice: number) => { if (selected !== null) return; setSelected(choice); setAnswers(current => [...current, choice]); };
  const next = () => { if (index === QUIZ.length - 1) { setComplete(true); quizSave.mutate({ visitorKey: getVisitorKey(), score, total: QUIZ.length }); } else { setIndex(current => current + 1); setSelected(null); } };
  const restart = () => { setIndex(0); setAnswers([]); setSelected(null); setComplete(false); };
  return <div className="page-pad content-page quiz-page"><div className="page-intro"><div><div className="eyebrow"><span className="eyebrow-line" />Practice mode</div><h1>Test your intuition.</h1><p>Four quick checks for the ideas behind the movement. Answer once, then read the why.</p></div><div className="quiz-score-chip"><Trophy size={15} /> {complete ? `${score} / ${QUIZ.length}` : `${index + 1} / ${QUIZ.length}`}</div></div>{complete ? <div className="panel quiz-complete"><div className="completion-icon"><Trophy size={24} /></div><span className="panel-kicker">SESSION COMPLETE</span><h2>{score >= 3 ? "The signal is clear." : "Good first trace."}</h2><p>You got <b>{score} out of {QUIZ.length}</b> correct — {Math.round(score / QUIZ.length * 100)}% accuracy. The best next move is to open the visualizer and make one concept move.</p><div className="quiz-result-grid"><span><small>CORRECT</small><b>{score}</b></span><span><small>INCORRECT</small><b>{QUIZ.length - score}</b></span><span><small>PERCENTAGE</small><b>{Math.round(score / QUIZ.length * 100)}%</b></span></div><div className="hero-actions"><button className="button button-primary" onClick={restart}>Run it again <RotateCcw size={15} /></button><Link href="/visualizer" className="button button-secondary">Open visualizer <ArrowRight size={15} /></Link></div></div> : <div className="quiz-layout"><div className="panel quiz-card"><div className="quiz-progress"><span style={{ width: `${(index + 1) / QUIZ.length * 100}%` }} /></div><div className="quiz-card-header"><span className="panel-kicker">QUESTION {String(index + 1).padStart(2, "0")}</span><span>{index + 1} of {QUIZ.length}</span></div><h2>{question.question}</h2><div className="quiz-options">{question.options.map((option, optionIndex) => <button key={option} className={selected === optionIndex ? optionIndex === question.correct ? "correct" : "incorrect" : selected !== null && optionIndex === question.correct ? "correct" : ""} onClick={() => choose(optionIndex)}><span className="option-letter">{String.fromCharCode(65 + optionIndex)}</span>{option}{selected !== null && optionIndex === question.correct && <Check size={16} />}</button>)}</div>{selected !== null && <div className={`quiz-feedback ${selected === question.correct ? "feedback-correct" : "feedback-incorrect"}`}><span>{selected === question.correct ? "Correct trace." : "Not quite."}</span><p>{question.explanation}</p></div>}<div className="quiz-footer"><span>{selected === null ? "Choose one answer to continue." : "Your answer is locked for this question."}</span><button className="button button-primary" onClick={next} disabled={selected === null}>{index === QUIZ.length - 1 ? "See result" : "Next question"} <ArrowRight size={15} /></button></div></div><div className="panel quiz-aside"><span className="panel-kicker">FIELD NOTE</span><h3>Good questions are instruments.</h3><p>The quiz is not a gate. It is a fast way to find the idea worth visualizing next.</p><div className="aside-line"><Sparkles size={15} /><span>Scores are kept in this session for a quiet, local-first experience.</span></div></div></div>}</div>;
}

function AboutPage() {
  return <div className="page-pad content-page about-page"><div className="about-hero"><div><div className="eyebrow"><span className="eyebrow-line" />Project notes</div><h1>Interactive Visualization<br /><em>of Sorting Algorithms.</em></h1><p>Built as a Design and Analysis of Algorithms project — with enough instrumentation to make the ideas inspectable.</p></div><div className="about-stamp"><Beaker size={25} /><span>DAA<br /><b>PROJECT</b></span></div></div><div className="about-grid"><div className="panel about-card about-objective"><span className="panel-kicker">PROJECT OBJECTIVE</span><h2>Turn execution into intuition.</h2><p>SortX helps students understand how algorithms behave by mapping every comparison, swap, overwrite, pivot, and merge into a visual event they can pause and examine.</p><div className="about-rule" /><div className="about-quote">“One array. Eight strategies. Zero hand-waving.”</div></div><div className="panel about-card"><span className="panel-kicker">TECHNOLOGY STACK</span><div className="stack-list"><span><Code2 size={16} />React + TypeScript</span><span><Gauge size={16} />Event-driven animation</span><span><BarChart3 size={16} />Recharts metrics</span><span><ServerCog size={16} />Express + tRPC API</span><span><Database size={16} />Drizzle + managed MySQL</span></div></div><div className="panel about-card"><span className="panel-kicker">LEARNING OUTCOMES</span><div className="outcome-list"><span><Check size={14} />Recognize algorithm invariants</span><span><Check size={14} />Read complexity as a shape</span><span><Check size={14} />Choose a strategy with intent</span><span><Check size={14} />Explain tradeoffs out loud</span></div></div><div className="panel about-card editable-card"><span className="panel-kicker">PROJECT DETAILS · EDITABLE</span><p>Keep this block clearly editable for your submission.</p><div className="editable-grid">{["Student Name", "University", "Department", "Course", "Faculty"].map(label => <label key={label}>{label}<input placeholder={`Add ${label.toLowerCase()}`} /></label>)}</div></div></div></div>;
}

function App() {
  return <ThemeProvider defaultTheme="dark" switchable><SiteShell><Router /></SiteShell></ThemeProvider>;
}

function Router() {
  const [path] = useLocation();
  if (path === "/") return <HomePage />;
  if (path === "/visualizer") return <VisualizerPage />;
  if (path === "/algorithms") return <AlgorithmsPage />;
  if (path.startsWith("/algorithms/")) return <AlgorithmDetailPage keyName={(path.split("/")[2] as AlgorithmKey) || "quick"} />;
  if (path === "/compare") return <ComparePage />;
  if (path === "/learn") return <LearnPage />;
  if (path === "/quiz") return <QuizPage />;
  if (path === "/about") return <AboutPage />;
  return <HomePage />;
}

export default App;
