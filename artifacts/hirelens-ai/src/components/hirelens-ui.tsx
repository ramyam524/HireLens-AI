import { Link, useLocation } from 'wouter';
import { type ReactNode, useState } from 'react';
import {
  ArrowRight, BarChart3, BookOpenCheck, BriefcaseBusiness, ChevronDown,
  CircleHelp, Clock3, FileText, History, Home, LogOut, Menu, Mic,
  Play, Plus, Radar, Settings2, ShieldCheck, Sparkles, Target, UserRound, X,
} from 'lucide-react';

export const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return <Link href="/" className={cx('brand-mark', inverse && 'brand-mark-inverse')} data-testid="link-logo">
    <span className="brand-mark-dot" /> <span>hirelens<span className="brand-mark-ai"> ai</span></span>
  </Link>;
}

export function Mark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  return <span className={cx('hl-mark', `hl-mark-${size}`)} aria-hidden="true"><span /></span>;
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/interview/new', label: 'Practice room', icon: Play },
  { href: '/history', label: 'Interview history', icon: History },
  { href: '/resume', label: 'Resume lens', icon: FileText },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  return <div className="app-shell">
    <aside className={cx('app-sidebar', open && 'app-sidebar-open')}>
      <div className="sidebar-top"><Logo inverse /><button className="icon-btn mobile-only" onClick={() => setOpen(false)} aria-label="Close menu" data-testid="button-close-menu"><X size={18} /></button></div>
      <div className="sidebar-kicker">Practice room</div>
      <nav className="sidebar-nav">
        {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} onClick={() => setOpen(false)} className={cx('sidebar-link', location === href && 'sidebar-link-active')} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={17} /><span>{label}</span>{href === '/interview/new' && <span className="nav-plus"><Plus size={13} /></span>}</Link>)}
      </nav>
      <div className="sidebar-lower">
        <Link href="/admin" className={cx('sidebar-link', location === '/admin' && 'sidebar-link-active')} data-testid="link-nav-admin"><ShieldCheck size={17} /><span>Admin console</span></Link>
        <div className="sidebar-rule" />
        <div className="sidebar-coach">
          <div className="coach-pulse"><Radar size={16} /></div>
          <div><strong>Keep the streak alive</strong><span>2 sessions this week</span></div>
        </div>
        <button className="sidebar-profile" data-testid="button-profile"><span className="avatar">AM</span><span className="profile-copy"><strong>Alex Morgan</strong><small>Free plan</small></span><ChevronDown size={15} /></button>
      </div>
    </aside>
    {open && <button className="sidebar-scrim mobile-only" onClick={() => setOpen(false)} aria-label="Close navigation" data-testid="button-scrim" />}
    <main className="app-main">
      <header className="app-topbar">
        <button className="icon-btn mobile-only" onClick={() => setOpen(true)} aria-label="Open menu" data-testid="button-open-menu"><Menu size={20} /></button>
        <div className="topbar-breadcrumb">Workspace <span>/</span> <strong>{location === '/dashboard' ? 'Overview' : location.split('/')[1] || 'home'}</strong></div>
        <div className="topbar-actions"><button className="topbar-help" data-testid="button-help"><CircleHelp size={17} /> <span>Help center</span></button><button className="icon-btn" aria-label="Settings" data-testid="button-settings"><Settings2 size={17} /></button></div>
      </header>
      <div className="page-wrap">{children}</div>
    </main>
  </div>;
}

export function PublicNav() {
  return <header className="public-nav"><Logo /><nav><a href="#method" data-testid="link-method">How it works</a><a href="#signal" data-testid="link-signal">The signal</a></nav><div className="public-nav-actions"><Link href="/login" className="btn btn-quiet" data-testid="link-login">Sign in</Link><Link href="/signup" className="btn btn-dark btn-sm" data-testid="link-signup">Get started <ArrowRight size={15} /></Link></div></header>;
}

export function Button({ children, variant = 'dark', className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'dark' | 'yellow' | 'quiet' | 'outline' }) {
  return <button className={cx('btn', `btn-${variant}`, className)} {...props}>{children}</button>;
}

export function PageHeader({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: ReactNode }) {
  return <div className="page-header animate-in"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}</div>{action && <div className="page-header-action">{action}</div>}</div>;
}

export function StatCard({ label, value, note, accent = false, icon: Icon }: { label: string; value: string | number; note?: string; accent?: boolean; icon?: typeof BarChart3 }) {
  return <div className={cx('stat-card animate-in', accent && 'stat-card-accent')} data-testid={`stat-${label.toLowerCase().replaceAll(' ', '-')}`}><div className="stat-top"><span>{label}</span>{Icon && <Icon size={16} />}</div><strong>{value}</strong>{note && <small>{note}</small>}</div>;
}

export function ScoreRing({ score, label = 'overall score' }: { score: number; label?: string }) {
  const displayScore = score <= 10 ? Math.round(score * 10) : Math.round(score);
  const dash = Math.max(0, Math.min(100, displayScore)) * 2.51;
  return <div className="score-ring" data-testid={`score-ring-${label.replaceAll(' ', '-')}`}><svg viewBox="0 0 100 100"><circle className="ring-bg" cx="50" cy="50" r="40" /><circle className="ring-progress" cx="50" cy="50" r="40" strokeDasharray={`${dash} 251`} /></svg><div><strong>{displayScore}</strong><span>{label}</span></div></div>;
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return <div className="empty-state"><div className="empty-icon"><Sparkles size={20} /></div><h3>{title}</h3><p>{description}</p>{action}</div>;
}

export function QueryState({ loading, error, children, label = 'Loading data' }: { loading?: boolean; error?: boolean; children: ReactNode; label?: string }) {
  if (loading) return <div className="skeleton-stack" aria-label={label} data-testid="state-loading"><div className="skeleton skeleton-lg" /><div className="skeleton skeleton-row" /><div className="skeleton skeleton-row" /></div>;
  if (error) return <div className="error-state" data-testid="state-error"><Target size={19} /><div><strong>We couldn't load that yet.</strong><span>Check your connection and give it another try.</span></div><button className="btn btn-outline btn-sm" onClick={() => window.location.reload()} data-testid="button-retry">Retry</button></div>;
  return <>{children}</>;
}

export function StatusPill({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'good' | 'warn' | 'live' }) {
  return <span className={cx('status-pill', `status-${tone}`)} data-testid="status-pill">{children}</span>;
}

export function InterviewRow({ interview, onOpen }: { interview: any; onOpen?: () => void }) {
  const date = interview.completedAt || interview.createdAt;
  const displayScore = typeof interview.score === 'number' ? (interview.score <= 10 ? Math.round(interview.score * 10) : Math.round(interview.score)) : null;
  return <button className="interview-row" onClick={onOpen} data-testid={`row-interview-${interview.id}`}><span className="row-date">{date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '—'}</span><span className="row-role"><strong>{interview.role}</strong><small>{interview.type} · {interview.difficulty}</small></span><span className="row-questions">{interview.questionCount} questions</span><StatusPill tone={interview.status === 'completed' ? 'good' : 'live'}>{interview.status === 'completed' ? 'Completed' : 'In progress'}</StatusPill><span className="row-score">{displayScore ?? '—'}{displayScore !== null ? '/100' : ''}</span><ArrowRight size={16} className="row-arrow" /></button>;
}

export function SectionLabel({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return <div className="section-label"><h2>{children}</h2>{action}</div>;
}

export function AuthFrame({ children, mode }: { children: ReactNode; mode: 'login' | 'signup' }) {
  return <div className="auth-page"><div className="auth-visual"><div className="auth-visual-grid" /><Logo inverse /><div className="auth-quote"><span className="eyebrow">A clearer signal</span><h1>Practice until your thinking sounds like <em>you.</em></h1><p>HireLens gives you the calm, direct rehearsal room your next opportunity deserves.</p><div className="auth-stat"><strong>+18 pts</strong><span>average improvement after 4 sessions</span></div></div><div className="auth-visual-foot"><span>hirelens.ai / 2024</span><span>Built for the thoughtful candidate</span></div></div><div className="auth-form-wrap"><div className="auth-form-top"><Logo /><span>{mode === 'login' ? 'New here?' : 'Already have an account?'} <Link href={mode === 'login' ? '/signup' : '/login'} data-testid={`link-auth-${mode === 'login' ? 'signup' : 'login'}`}>{mode === 'login' ? 'Create account' : 'Sign in'}</Link></span></div>{children}</div></div>;
}