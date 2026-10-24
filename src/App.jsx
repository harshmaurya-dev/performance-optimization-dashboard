import { useCallback, useMemo, useState } from 'react';
import { Activity, ArrowDownRight, ArrowUpRight, CheckCircle2, CircleHelp, Download, Gauge, Layers3, Plus, RefreshCw, Search, ShieldCheck, SlidersHorizontal, Zap } from 'lucide-react';

const initialRecords = [
  { id: 'OPT-1042', title: 'Reduce checkout API latency', area: 'API Performance', owner: 'Maya Patel', status: 'In progress', priority: 'High', impact: 28 },
  { id: 'OPT-1041', title: 'Optimize dashboard bundle size', area: 'Frontend', owner: 'Jordan Lee', status: 'Review', priority: 'Medium', impact: 18 },
  { id: 'OPT-1040', title: 'Add caching to reports endpoint', area: 'Infrastructure', owner: 'Alex Morgan', status: 'Completed', priority: 'High', impact: 34 },
  { id: 'OPT-1039', title: 'Improve image delivery strategy', area: 'Frontend', owner: 'Sam Rivera', status: 'In progress', priority: 'Low', impact: 12 },
  { id: 'OPT-1038', title: 'Review database query plans', area: 'Database', owner: 'Taylor Kim', status: 'Blocked', priority: 'High', impact: 22 },
  { id: 'OPT-1037', title: 'Tune worker concurrency', area: 'Infrastructure', owner: 'Maya Patel', status: 'Completed', priority: 'Medium', impact: 16 },
];
const statuses = ['All status', 'In progress', 'Review', 'Completed', 'Blocked'];
const areas = ['All areas', 'API Performance', 'Frontend', 'Infrastructure', 'Database'];

export default function App() {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All status');
  const [areaFilter, setAreaFilter] = useState('All areas');
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('Frontend');
  const [priority, setPriority] = useState('Medium');
  const [formError, setFormError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();
    return records.filter((record) => {
      const matchesQuery = !query || [record.id, record.title, record.area, record.owner].some((value) => value.toLowerCase().includes(query));
      return matchesQuery && (statusFilter === 'All status' || record.status === statusFilter) && (areaFilter === 'All areas' || record.area === areaFilter);
    });
  }, [records, search, statusFilter, areaFilter]);

  const completeCount = useMemo(() => records.filter((record) => record.status === 'Completed').length, [records]);
  const activeCount = useMemo(() => records.filter((record) => ['In progress', 'Review'].includes(record.status)).length, [records]);
  const blockedCount = useMemo(() => records.filter((record) => record.status === 'Blocked').length, [records]);

  const updateStatus = useCallback((id, status) => {
    setRecords((current) => current.map((record) => record.id === id ? { ...record, status } : record));
    setNotice(`Initiative ${id} updated to ${status}.`);
  }, []);

  const exportCsv = useCallback(() => {
    const csvCell = (value) => '"' + String(value).replaceAll('"', '""') + '"';
    const rows = [['ID', 'Initiative', 'Area', 'Owner', 'Status', 'Priority', 'Estimated impact'], ...filteredRecords.map((r) => [r.id, r.title, r.area, r.owner, r.status, r.priority, r.impact + '%'])];
    const csv = rows.map((row) => row.map(csvCell).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'performance-initiatives.csv';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('CSV export prepared for the current filtered list.');
  }, [filteredRecords]);

  const refresh = useCallback(() => {
    setLoading(true);
    setNotice('');
    window.setTimeout(() => {
      setLoading(false);
      setNotice('Dashboard refreshed. Demo data is up to date.');
    }, 350);
  }, []);

  const createInitiative = (event) => {
    event.preventDefault();
    const cleanTitle = title.trim();
    if (cleanTitle.length < 4) {
      setFormError('Enter an initiative title with at least 4 characters.');
      return;
    }
    if (cleanTitle.length > 120) {
      setFormError('Keep the title under 120 characters.');
      return;
    }
    const nextId = 'OPT-' + (1043 + records.length - initialRecords.length);
    setRecords((current) => [{ id: nextId, title: cleanTitle, area, owner: 'You', status: 'In progress', priority, impact: 0 }, ...current]);
    setTitle('');
    setFormError('');
    setShowCreate(false);
    setSearch('');
    setStatusFilter('All status');
    setAreaFilter('All areas');
    setNotice('Optimization initiative created successfully.');
  };

  const clearFilters = () => { setSearch(''); setStatusFilter('All status'); setAreaFilter('All areas'); };

  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Activity size={19}/></span><span>PERFORMANCE<span className="brand-sub">OPERATIONS</span></span></div>
      <div className="workspace"><span className="pulse"/> Core Infrastructure <span className="chevron">⌄</span></div>
      <div className="nav-label">WORKSPACE</div>
      <a className="nav-item active" href="#overview"><Gauge size={17}/> Overview</a>
      <a className="nav-item" href="#initiatives"><Layers3 size={17}/> Initiatives <span className="nav-count">{records.length}</span></a>
      <a className="nav-item" href="#health"><Activity size={17}/> System health</a>
      <button className="nav-item nav-button" onClick={exportCsv}><Download size={17}/> Reports</button>
      <div className="sidebar-bottom"><div className="health-card"><div className="health-title"><span className="pulse"/> All systems operational</div><p>Demo environment · No live API connected</p><div className="health-bar"><span/></div></div><div className="profile"><span className="avatar">HM</span><span><strong>Harsh Maurya</strong><small>Performance engineer</small></span></div></div>
    </aside>
    <main className="main-content" id="overview">
      <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>Overview</strong></div><div className="top-actions"><span className="env-pill"><i/> Demo environment</span><span className="avatar small">HM</span></div></header>
      <section className="page-heading"><div><div className="eyebrow">ENGINEERING / PERFORMANCE</div><h1>Performance overview</h1><p>Monitor system efficiency and track optimization work across your infrastructure.</p></div><div className="heading-actions"><span className="updated"><span className="pulse"/> Updated just now</span><button className="button secondary" onClick={refresh} disabled={loading}><RefreshCw size={14} className={loading ? 'spin' : ''}/>{loading ? 'Refreshing…' : 'Refresh data'}</button><button className="button primary" onClick={() => { setShowCreate(true); setFormError(''); }}><Plus size={15}/> New initiative</button></div></section>
      {notice && <div className="notice" role="status"><CheckCircle2 size={16}/><span>{notice}</span><button aria-label="Dismiss message" onClick={() => setNotice('')}>×</button></div>}
      <section className="metrics-grid" aria-label="Performance metrics">
        <article className="metric-card"><div className="metric-top">Average response time <span className="metric-icon"><Activity size={15}/></span></div><div className="metric-value">184 <small>ms</small></div><div className="metric-foot"><span className="change down"><ArrowDownRight size={13}/> 12.8%</span><span className="muted">vs previous period</span></div></article>
        <article className="metric-card"><div className="metric-top">Throughput <span className="metric-icon"><Zap size={15}/></span></div><div className="metric-value">2,840 <small>req/min</small></div><div className="metric-foot"><span className="change up"><ArrowUpRight size={13}/> 8.4%</span><span className="muted">vs previous period</span></div></article>
        <article className="metric-card"><div className="metric-top">Optimization score <span className="metric-icon"><ShieldCheck size={15}/></span></div><div className="metric-value">92.6 <small>/100</small></div><div className="metric-foot"><span className="change up"><ArrowUpRight size={13}/> 4.2%</span><span className="muted">vs previous period</span></div></article>
        <article className="metric-card"><div className="metric-top">Active initiatives <span className="metric-icon"><Layers3 size={15}/></span></div><div className="metric-value">{activeCount} <small>items</small></div><div className="metric-foot"><span className="change neutral">{blockedCount} blocked</span><span className="muted">requires attention</span></div></article>
      </section>
      <section className="middle-grid">
        <article className="panel"><div className="panel-heading"><div><h2>Response time trend</h2><p>Average API latency across the last 7 days</p></div><span className="small-pill">Last 7 days ⌄</span></div><div className="chart-summary">184 <small>ms</small> <span className="change down"><ArrowDownRight size={13}/> 12.8%</span></div><svg className="chart" viewBox="0 0 620 180" preserveAspectRatio="none" role="img" aria-label="Illustrative response time trend decreasing over seven days"><defs><linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#78a5ff" stopOpacity=".24"/><stop offset="1" stopColor="#78a5ff" stopOpacity="0"/></linearGradient></defs><g stroke="#8090aa" strokeOpacity=".16" strokeDasharray="3 5"><path d="M0 20H620M0 55H620M0 90H620M0 125H620M0 160H620"/></g><path d="M0 44 C30 50 45 75 88 68 S150 82 176 91 S240 61 265 82 S320 103 354 111 S410 96 442 120 S500 103 530 128 S585 126 620 139 L620 180 L0 180Z" fill="url(#chartFill)"/><path d="M0 44 C30 50 45 75 88 68 S150 82 176 91 S240 61 265 82 S320 103 354 111 S410 96 442 120 S500 103 530 128 S585 126 620 139" fill="none" stroke="#78a5ff" strokeWidth="3" strokeLinecap="round"/></svg><div className="chart-legend"><span><i className="legend-dot blue"/> Response time</span><span><i className="legend-dot gray"/> Target: 200 ms</span><span className="muted">Illustrative sample data</span></div></article>
        <article className="panel" id="health"><div className="panel-heading"><div><h2>Initiative status</h2><p>Current delivery progress</p></div><button className="icon-button" aria-label="Status details" onClick={() => setNotice('Status counts are calculated from the current initiative list.')}><CircleHelp size={17}/></button></div><div className="donut-row"><div className="donut" style={{'--done': (records.length ? completeCount / records.length * 100 : 0) + '%', '--active': (records.length ? (completeCount + activeCount) / records.length * 100 : 0) + '%'}}><div><strong>{records.length}</strong><span>Total</span></div></div><div className="status-legend"><div><i className="legend-dot green"/><span>Completed</span><strong>{completeCount}</strong></div><div><i className="legend-dot blue"/><span>In progress / review</span><strong>{activeCount}</strong></div><div><i className="legend-dot amber"/><span>Blocked</span><strong>{blockedCount}</strong></div></div></div><div className="completion-note"><ShieldCheck size={16}/><span><strong>{records.length ? Math.round(completeCount / records.length * 100) : 0}%</strong> of initiatives completed</span></div></article>
      </section>
      <section className="panel table-panel" id="initiatives"><div className="panel-heading table-heading"><div><h2>Optimization initiatives</h2><p>Prioritize work and review current delivery status.</p></div><button className="button secondary" onClick={exportCsv}><Download size={14}/> Export CSV</button></div><div className="table-toolbar"><label className="search-box"><Search size={15}/><input aria-label="Search initiatives" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search initiatives..."/></label><label className="filter-select"><SlidersHorizontal size={14}/><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><label className="filter-select"><select aria-label="Filter by area" value={areaFilter} onChange={(event) => setAreaFilter(event.target.value)}>{areas.map((value) => <option key={value}>{value}</option>)}</select></label><span className="results-count">{filteredRecords.length} results</span></div><div className="table-scroll"><table><thead><tr><th>INITIATIVE</th><th>AREA</th><th>PRIORITY</th><th>EST. IMPACT</th><th>STATUS</th><th>OWNER</th></tr></thead><tbody>{filteredRecords.map((record) => <tr key={record.id}><td><div className="initiative-title"><span className="ticket-id">{record.id}</span><strong>{record.title}</strong></div></td><td><span className="area-label">{record.area}</span></td><td><span className={'priority ' + record.priority.toLowerCase()}><i/> {record.priority}</span></td><td><div className="impact"><strong>{record.impact ? record.impact + '%' : '—'}</strong><span className="impact-track"><i style={{width: Math.min(record.impact, 100) + '%'}}/></span></div></td><td><select className={'status-select ' + record.status.toLowerCase().replaceAll(' ', '-')} aria-label={'Status for ' + record.id} value={record.status} onChange={(event) => updateStatus(record.id, event.target.value)}>{statuses.slice(1).map((status) => <option key={status}>{status}</option>)}</select></td><td><div className="owner"><span className="owner-avatar">{record.owner.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>{record.owner}</div></td></tr>)}</tbody></table>{filteredRecords.length === 0 && <div className="empty-state"><div className="empty-icon"><Search size={21}/></div><strong>No data found</strong><p>No initiatives match your search or selected filters.</p><button className="button secondary" onClick={clearFilters}>Clear filters</button></div>}</div><div className="table-footer"><span>Showing <strong>{filteredRecords.length}</strong> of <strong>{records.length}</strong> initiatives</span><span className="footer-note"><span className="pulse"/> Local demo workspace <CircleHelp size={14}/></span></div></section>
      <footer className="footer"><span>Performance Ops <span>·</span> ENG-84718</span><span>Core Infrastructure Overhaul · Sample data</span></footer>
    </main>
    {showCreate && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreate(false); }}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-heading"><div><span className="eyebrow">OPTIMIZATION WORKFLOW</span><h2 id="modal-title">New initiative</h2><p>Add an item to your performance backlog.</p></div><button className="icon-button" aria-label="Close form" onClick={() => setShowCreate(false)}>×</button></div><form onSubmit={createInitiative} noValidate><label className="field-label" htmlFor="initiative-title">Initiative title</label><input id="initiative-title" autoFocus maxLength={120} value={title} onChange={(event) => { setTitle(event.target.value); setFormError(''); }} placeholder="e.g. Reduce API response latency" aria-invalid={Boolean(formError)} aria-describedby={formError ? 'form-error' : undefined}/><div className="field-hint">{title.length}/120 characters</div><div className="form-row"><div><label className="field-label" htmlFor="initiative-area">Area</label><select id="initiative-area" value={area} onChange={(event) => setArea(event.target.value)}>{areas.slice(1).map((value) => <option key={value}>{value}</option>)}</select></div><div><label className="field-label" htmlFor="initiative-priority">Priority</label><select id="initiative-priority" value={priority} onChange={(event) => setPriority(event.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></div></div>{formError && <p className="form-error" id="form-error" role="alert">{formError}</p>}<div className="modal-actions"><button type="button" className="button secondary" onClick={() => setShowCreate(false)}>Cancel</button><button type="submit" className="button primary">Create initiative</button></div></form></section></div>}
  </div>;
}
