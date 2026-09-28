import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useParams } from 'wouter';
import { useForm } from 'react-hook-form';
import { ArrowLeft, ArrowRight, BarChart3, BookOpenCheck, BriefcaseBusiness, Check, CircleCheck, Clock3, Download, FileAudio, FileCheck2, FileSearch, Headphones, LoaderCircle, LockKeyhole, Mic, Pause, Play, Plus, RotateCcw, Search, Sparkles, Target, UploadCloud, UserRound, Volume2, X } from 'lucide-react';
import {
  getGetDashboardSummaryQueryKey, getGetInterviewQueryKey, getListAdminInterviewsQueryKey, getListAdminUsersQueryKey, getListInterviewsQueryKey,
  useAnalyzeResume, useCreateInterview, useGetDashboardSummary, useGetInterview, useListAdminInterviews, useListAdminUsers, useListInterviews, useSubmitInterviewAnswer,
} from '@workspace/api-client-react';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AppShell, AuthFrame, Button, cx, EmptyState, InterviewRow, Logo, PageHeader, PublicNav, QueryState, ScoreRing, SectionLabel, StatCard, StatusPill } from '@/components/hirelens-ui';

const fallbackSummary = { interviewsTaken: 12, averageScore: 78, practiceMinutes: 246, improvement: 18, weakAreas: [{ subject: 'Story structure', score: 52, fullMark: 100 }, { subject: 'Technical depth', score: 64, fullMark: 100 }, { subject: 'Conciseness', score: 71, fullMark: 100 }, { subject: 'Confidence', score: 83, fullMark: 100 }], recentInterviews: [] };
const fallbackInterviews = [
  { id: 'demo-1', role: 'Senior Product Designer', difficulty: 'Medium', type: 'Behavioral', status: 'completed', score: 84, questionCount: 8, completedAt: new Date(Date.now() - 86400000 * 2).toISOString(), createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), questions: [] },
  { id: 'demo-2', role: 'Product Manager', difficulty: 'Hard', type: 'Technical', status: 'completed', score: 72, questionCount: 10, completedAt: new Date(Date.now() - 86400000 * 7).toISOString(), createdAt: new Date(Date.now() - 86400000 * 7).toISOString(), questions: [] },
  { id: 'demo-3', role: 'Design Lead', difficulty: 'Easy', type: 'HR', status: 'completed', score: 79, questionCount: 6, completedAt: new Date(Date.now() - 86400000 * 13).toISOString(), createdAt: new Date(Date.now() - 86400000 * 13).toISOString(), questions: [] },
];

type StoredFeedback = { id: string; role: string; category: string; score: number; createdAt: string };
const ANALYTICS_KEY = 'hirelens-demo-analytics';
const normalizeScore = (score: number) => score <= 10 ? Math.round(score * 10) : Math.round(score);
const readAnalytics = (): StoredFeedback[] => {
  try {
    const saved = JSON.parse(localStorage.getItem(ANALYTICS_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
};
const saveFeedback = (item: StoredFeedback) => {
  const next = [...readAnalytics().filter(existing => existing.id !== item.id), item].slice(-30);
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(next));
};

export function MarketingPage() {
  return <><LandingPage /><LandingExtras /></>;
}

export function LandingExtras() {
  return <section className="landing-extras"><div className="landing-extra-inner"><div className="section-intro"><span className="eyebrow">Built for the next opportunity</span><h2>Practice with a plan,<br /><em>not a guess.</em></h2><p>Start free, then unlock the depth and repetition that keeps your confidence moving forward.</p></div><div className="pricing-grid"><article className="pricing-card"><span className="eyebrow">Free</span><h3>$0</h3><p>For trying the room before your next interview.</p><ul><li><Check size={15} /> 3 practice sessions</li><li><Check size={15} /> Instant answer feedback</li><li><Check size={15} /> Basic history</li></ul><Link href="/signup" className="btn btn-outline btn-full" data-testid="link-pricing-free">Start free</Link></article><article className="pricing-card pricing-card-featured"><span className="eyebrow">Pro / most popular</span><h3>$19 <small>/ month</small></h3><p>For candidates who want a repeatable edge.</p><ul><li><Check size={15} /> Unlimited interviews</li><li><Check size={15} /> Resume lens and tailored prompts</li><li><Check size={15} /> Deep feedback and progress trends</li></ul><Link href="/signup" className="btn btn-yellow btn-full" data-testid="link-pricing-pro">Get Pro</Link></article></div><div className="testimonial-grid"><article><p>“The feedback is direct without being discouraging. I finally stopped rambling in my behavioral answers.”</p><strong>Jordan M.</strong><span>Senior PM candidate</span></article><article><p>“I used the same practice loop for two weeks and walked into my onsite feeling prepared, not lucky.”</p><strong>Priya S.</strong><span>Software engineer</span></article><article><p>“The resume gaps turned into the exact questions I needed to practice next.”</p><strong>Marcus R.</strong><span>Design lead</span></article></div></div></section>;
}

export function LandingPage() {
  return <div className="landing"><PublicNav /><section className="hero"><div className="hero-copy animate-in"><div className="eyebrow"><span className="eyebrow-dot" /> AI practice, without the performance</div><h1>Sound sharper<br /><span>when it counts.</span></h1><p>HireLens is the focused practice room for candidates who want useful feedback, not empty encouragement.</p><div className="hero-actions"><Link href="/signup" className="btn btn-dark btn-lg" data-testid="link-hero-start">Start practicing <ArrowRight size={17} /></Link><a href="#method" className="btn btn-quiet btn-lg" data-testid="link-hero-how">See how it works</a></div><div className="hero-proof"><div className="proof-avatars"><span>JM</span><span>SK</span><span>RT</span><span>+</span></div><p><strong>4.9/5</strong> from candidates practicing this week</p></div></div><div className="hero-art animate-in"><div className="hero-art-grid" /><div className="signal-card"><div className="signal-card-head"><span className="signal-live"><i /> LIVE PRACTICE</span><span>04:28</span></div><div className="signal-wave"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="signal-question"><span>Question 03 / 08</span><strong>Tell me about a time you changed someone's mind.</strong></div><div className="signal-feedback"><div className="feedback-score"><strong>84</strong><span>/ 100</span></div><div><span className="feedback-label">Signal detected</span><strong>Clear thinking, add the result.</strong></div></div></div><div className="hero-sticker sticker-one"><Sparkles size={14} /> Direct feedback</div><div className="hero-sticker sticker-two"><CircleCheck size={14} /> Getting warmer</div></div></section><section className="ticker"><span>Practice for the roles you want</span><strong>PRODUCT</strong><strong>ENGINEERING</strong><strong>DESIGN</strong><strong>MARKETING</strong><strong>OPERATIONS</strong></section><section id="method" className="method section-container"><div className="section-intro"><span className="eyebrow">The method</span><h2>A practice loop that<br /><em>respects your time.</em></h2><p>Every session is short, specific, and built to leave you better than it found you.</p></div><div className="method-grid"><div className="method-card method-card-dark"><span className="method-number">01</span><div className="method-icon"><Headphones size={20} /></div><h3>Answer out loud</h3><p>Real interview prompts, delivered one at a time. Text or voice — choose the way you think best.</p></div><div className="method-card"><span className="method-number">02</span><div className="method-icon"><FileSearch size={20} /></div><h3>Get the signal</h3><p>Feedback that names what landed, what wandered, and the one adjustment worth making next.</p></div><div className="method-card method-card-yellow"><span className="method-number">03</span><div className="method-icon"><Target size={20} /></div><h3>Come back sharper</h3><p>Your weak areas become a practice plan. Progress you can feel, not just a score you can see.</p></div></div></section><section id="signal" className="landing-signal section-container"><div className="signal-panel"><div><span className="eyebrow">Your unfair advantage</span><h2>Less nerves.<br /><span>More signal.</span></h2><p>HireLens helps you find the clearest version of your answer before the room is real.</p><Link href="/signup" className="btn btn-yellow" data-testid="link-signal-start">Build your signal <ArrowRight size={16} /></Link></div><div className="mini-bars"><div><span style={{ height: '36%' }} /><small>Before</small></div><div><span style={{ height: '58%' }} /><small>Session 2</small></div><div><span style={{ height: '83%' }} /><small>Now</small></div><div><span style={{ height: '94%' }} /><small>Ready</small></div></div></div></section><footer className="landing-footer"><Logo /><span>Practice with signal.</span><div><Link href="/login" data-testid="link-footer-login">Sign in</Link><Link href="/signup" data-testid="link-footer-signup">Get started</Link></div></footer></div>;
}

export function LoginPage() {
  const { register, handleSubmit } = useForm<{ email: string; password: string }>();
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();
  return <AuthFrame mode="login"><div className="auth-form"><div className="auth-heading"><span className="eyebrow">Welcome back</span><h1>Pick up where<br />you left off.</h1><p>Your next good answer is closer than you think.</p></div><form onSubmit={handleSubmit(() => { setBusy(true); localStorage.setItem('hirelens-demo-auth', 'true'); setTimeout(() => setLocation('/dashboard'), 500); })}><label>Email address<input {...register('email', { required: true })} type="email" placeholder="you@example.com" data-testid="input-login-email" /></label><label>Password<div className="input-with-action"><input {...register('password', { required: true })} type={showPassword ? 'text' : 'password'} placeholder="••••••••" data-testid="input-login-password" /><button type="button" onClick={() => setShowPassword(!showPassword)} data-testid="button-show-password">{showPassword ? 'Hide' : 'Show'}</button></div></label><div className="form-row"><label className="check-label"><input type="checkbox" data-testid="input-remember" /> <span>Keep me signed in</span></label><button type="button" className="link-button" data-testid="button-forgot-password">Forgot password?</button></div><Button type="submit" className="btn-full" disabled={busy} data-testid="button-login">{busy ? 'Opening your room…' : <>Sign in <ArrowRight size={16} /></>}</Button></form><div className="auth-divider"><span>or continue with</span></div><button className="social-btn" data-testid="button-google-login"><span className="google-mark">G</span> Continue with Google</button><small className="auth-legal">By continuing, you agree to our terms and privacy policy.</small></div></AuthFrame>;
}

export function SignupPage() {
  const { register, handleSubmit } = useForm<{ name: string; email: string; password: string }>();
  const [, setLocation] = useLocation();
  const [busy, setBusy] = useState(false);
  return <AuthFrame mode="signup"><div className="auth-form"><div className="auth-heading"><span className="eyebrow">Make the next move</span><h1>Build a stronger<br />answer bank.</h1><p>One focused session at a time. Your future self will thank you.</p></div><form onSubmit={handleSubmit(() => { setBusy(true); localStorage.setItem('hirelens-demo-auth', 'true'); setTimeout(() => setLocation('/dashboard'), 500); })}><label>Full name<input {...register('name', { required: true })} placeholder="Alex Morgan" data-testid="input-signup-name" /></label><label>Email address<input {...register('email', { required: true })} type="email" placeholder="you@example.com" data-testid="input-signup-email" /></label><label>Create password<input {...register('password', { required: true, minLength: 6 })} type="password" placeholder="At least 6 characters" data-testid="input-signup-password" /></label><label className="check-label"><input type="checkbox" required data-testid="input-terms" /><span>I agree to the terms and privacy policy.</span></label><Button type="submit" className="btn-full" disabled={busy} data-testid="button-signup">{busy ? 'Setting up your room…' : <>Create free account <ArrowRight size={16} /></>}</Button></form><div className="auth-divider"><span>or sign up with</span></div><button className="social-btn" data-testid="button-google-signup"><span className="google-mark">G</span> Continue with Google</button></div></AuthFrame>;
}

export function DashboardPage() {
  const dashboard = useGetDashboardSummary({ query: { queryKey: getGetDashboardSummaryQueryKey() } });
  const interviews = useListInterviews({ query: { queryKey: getListInterviewsQueryKey() } });
  const [, setLocation] = useLocation();
  const [savedResults, setSavedResults] = useState<StoredFeedback[]>([]);
  useEffect(() => setSavedResults(readAnalytics()), []);
  const summary: any = dashboard.data || fallbackSummary;
  const list: any[] = (interviews.data?.length ? interviews.data : summary.recentInterviews?.length ? summary.recentInterviews : fallbackInterviews);
  const areas = summary.weakAreas?.length ? summary.weakAreas : fallbackSummary.weakAreas;
  const trend = savedResults.length
    ? savedResults.map((result, index) => ({ ...result, label: `#${index + 1}`, displayScore: normalizeScore(result.score) }))
    : [{ label: 'Start', displayScore: 62 }, { label: 'Build', displayScore: 70 }, { label: 'Now', displayScore: 78 }];
  const averageScore = normalizeScore(summary.averageScore);
  return <AppShell>
    <PageHeader eyebrow="Monday, October 14" title="Good morning, Alex." description="A little practice today compounds quickly." action={<Link href="/interview/new" className="btn btn-dark" data-testid="link-dashboard-start"><Play size={15} /> Start practice</Link>} />
    <QueryState loading={dashboard.isLoading && !dashboard.data} error={dashboard.isError && !dashboard.data}>
      <div className="stats-grid">
        <StatCard label="Interviews taken" value={summary.interviewsTaken} note="Keep the rhythm" icon={BookOpenCheck} />
        <StatCard label="Average score" value={`${averageScore}%`} note={`${summary.improvement > 0 ? '+' : ''}${summary.improvement}% this month`} accent icon={BarChart3} />
        <StatCard label="Practice time" value={`${summary.practiceMinutes}m`} note="Across all sessions" icon={Clock3} />
      </div>
      <section className="panel chart-panel">
        <SectionLabel>Signal by focus area</SectionLabel>
        <div className="chart-wrap" data-testid="chart-weak-areas"><ResponsiveContainer width="100%" height={190}><BarChart data={areas} margin={{ top: 8, right: 18, left: -18, bottom: 0 }}><CartesianGrid vertical={false} stroke="hsl(42 22% 84%)" /><XAxis dataKey="subject" tickLine={false} axisLine={false} tick={{ fill: 'hsl(222 15% 45%)', fontSize: 10 }} /><YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: 'hsl(222 15% 45%)', fontSize: 10 }} /><Tooltip cursor={{ fill: 'hsl(42 24% 90%)' }} contentStyle={{ borderRadius: 8, border: '1px solid hsl(42 22% 84%)', background: 'hsl(46 43% 98%)', fontSize: 11 }} /><Bar dataKey="score" fill="hsl(182 52% 44%)" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </section>
      <section className="panel chart-panel analytics-panel">
        <SectionLabel action={<span className="chart-caption">{savedResults.length} saved answer{savedResults.length === 1 ? '' : 's'}</span>}>Answer signal over time</SectionLabel>
        <div className="chart-wrap" data-testid="chart-answer-trend"><ResponsiveContainer width="100%" height={190}><LineChart data={trend} margin={{ top: 8, right: 18, left: -18, bottom: 0 }}><CartesianGrid vertical={false} stroke="hsl(42 22% 84%)" /><XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: 'hsl(222 15% 45%)', fontSize: 10 }} /><YAxis domain={[0, 100]} tickLine={false} axisLine={false} tick={{ fill: 'hsl(222 15% 45%)', fontSize: 10 }} /><Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(42 22% 84%)', background: 'hsl(46 43% 98%)', fontSize: 11 }} /><Line type="monotone" dataKey="displayScore" stroke="hsl(28 78% 54%)" strokeWidth={3} dot={{ r: 4, fill: 'hsl(28 78% 54%)', strokeWidth: 0 }} activeDot={{ r: 6 }} /></LineChart></ResponsiveContainer></div>
      </section>
      <div className="dashboard-grid"><div className="dashboard-main">
        <section className="panel focus-panel animate-in"><div className="focus-copy"><span className="eyebrow">Your focus this week</span><h2>Turn story structure<br />into your strength.</h2><p>Your answers have good instincts. Give them a clearer beginning, middle, and result.</p><Link href="/interview/new" className="text-link" data-testid="link-focus-practice">Practice this area <ArrowRight size={15} /></Link></div><div className="focus-visual"><div className="focus-orbit orbit-one" /><div className="focus-orbit orbit-two" /><div className="focus-core">52<span>/100</span></div><span className="orbit-label">story<br />structure</span></div></section>
        <section className="panel"><SectionLabel action={<Link href="/history" className="text-link" data-testid="link-dashboard-history">View all <ArrowRight size={14} /></Link>}>Recent practice</SectionLabel><div className="interview-list">{list.slice(0, 4).map((item: any) => <InterviewRow key={item.id} interview={item} onOpen={() => setLocation(`/interview/${item.id}`)} />)}</div></section>
      </div><aside className="dashboard-aside"><section className="panel score-panel"><SectionLabel>Readiness signal</SectionLabel><ScoreRing score={averageScore} label="average" /><div className="score-trend"><span><i className="trend-dot" /> +{summary.improvement}%</span><small>since your first session</small></div></section><section className="panel weak-panel"><SectionLabel action={<Link href="/interview/new" className="icon-link" data-testid="link-weak-practice"><ArrowRight size={15} /></Link>}>Weak areas</SectionLabel>{areas.slice(0, 4).map((area: any, index: number) => <div className="weak-row" key={area.subject}><span className="weak-index">0{index + 1}</span><div><strong>{area.subject}</strong><div className="progress-track"><span style={{ width: `${area.score}%` }} /></div></div><small>{area.score}</small></div>)}</section></aside></div>
    </QueryState>
  </AppShell>;
}

export function InterviewNewPage() {
  const createInterview = useCreateInterview();
  const [, setLocation] = useLocation();
  const [role, setRole] = useState('Product Manager');
  const [difficulty, setDifficulty] = useState('Medium');
  const [type, setType] = useState('Behavioral');
  const submit = () => createInterview.mutate({ data: { role, difficulty: difficulty as any, type: (type === 'Behavioral' ? 'HR' : type) as any } }, { onSuccess: (interview: any) => setLocation(`/interview/${interview.id}`), onError: () => setLocation('/interview/demo-1') });
  return <AppShell><div className="configure-page"><Link href="/dashboard" className="back-link" data-testid="link-config-back"><ArrowLeft size={15} /> Back to overview</Link><div className="configure-layout"><div className="configure-heading animate-in"><span className="eyebrow">New practice session</span><h1>Make the room<br /><em>feel familiar.</em></h1><p>Choose your setup. HireLens will meet you with the right questions, one at a time.</p><div className="configure-note"><Sparkles size={16} /><span>Average practice session: <strong>12 minutes</strong></span></div></div><div className="configure-form panel animate-in"><div className="form-step"><span className="step-number">01</span><div><label className="field-label">What role are you preparing for?</label><div className="role-input"><BriefcaseBusiness size={17} /><input value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Senior Product Designer" data-testid="input-interview-role" /></div><div className="suggestion-row"><button type="button" onClick={() => setRole('Senior Product Designer')} data-testid="button-role-design">Senior Product Designer</button><button type="button" onClick={() => setRole('Software Engineer')} data-testid="button-role-engineering">Software Engineer</button><button type="button" onClick={() => setRole('Growth Marketer')} data-testid="button-role-marketing">Growth Marketer</button></div></div></div><div className="form-step"><span className="step-number">02</span><div><label className="field-label">Set the difficulty</label><div className="choice-grid">{['Easy', 'Medium', 'Hard'].map((item, i) => <button key={item} type="button" className={cx('choice-card', difficulty === item && 'choice-selected')} onClick={() => setDifficulty(item)} data-testid={`button-difficulty-${item.toLowerCase()}`}><span className="choice-marker">{i + 1}</span><strong>{item}</strong><small>{item === 'Easy' ? 'Build confidence' : item === 'Medium' ? 'Realistic practice' : 'Stretch your thinking'}</small>{difficulty === item && <Check size={16} />}</button>)}</div></div></div><div className="form-step"><span className="step-number">03</span><div><label className="field-label">Choose interview type</label><div className="type-tabs">{['Behavioral', 'Technical', 'HR'].map(item => <button key={item} type="button" className={cx(type === item && 'type-selected')} onClick={() => setType(item)} data-testid={`button-type-${item.toLowerCase()}`}>{item}</button>)}</div></div></div><div className="configure-submit"><div><strong>Ready when you are.</strong><span>8 questions · instant feedback</span></div><Button variant="yellow" onClick={submit} disabled={createInterview.isPending} data-testid="button-start-interview">{createInterview.isPending ? 'Preparing room…' : <>Start interview <ArrowRight size={16} /></>}</Button></div></div></div></div></AppShell>;
}

export function InterviewPage() {
  const { id = 'demo-1' } = useParams<{ id: string }>();
  const interviewQuery = useGetInterview(id, { query: { enabled: !!id, queryKey: getGetInterviewQueryKey(id) } });
  const submitAnswer = useSubmitInterviewAnswer();
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<any>(null);
  const [recording, setRecording] = useState(false);
  const [audio, setAudio] = useState(false);
  const fallbackQuestion = { id: 'q1', prompt: 'Tell me about a time you changed someone’s mind.', category: 'Influence & communication', answered: false };
  const interview: any = interviewQuery.data || { id, role: 'Senior Product Designer', difficulty: 'Medium', type: 'Behavioral', status: 'in_progress', questionCount: 8, questions: [fallbackQuestion, { id: 'q2', prompt: 'What is a product decision you would make differently today?', category: 'Product thinking', answered: false }] };
  const questions = interview.questions?.length ? interview.questions : [fallbackQuestion];
  const question = questions[index % questions.length];
  useEffect(() => () => { window.speechSynthesis?.cancel(); }, []);
  useEffect(() => { window.speechSynthesis?.cancel(); setAudio(false); }, [question.id]);
  const speakQuestion = () => {
    if (!('speechSynthesis' in window)) return;
    if (audio) {
      window.speechSynthesis.cancel();
      setAudio(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(question.prompt);
    utterance.rate = 0.92;
    utterance.pitch = 1;
    utterance.onend = () => setAudio(false);
    utterance.onerror = () => setAudio(false);
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setAudio(true);
  };
  const persistFeedback = (result: any) => saveFeedback({
    id: `${id}-${question.id}`,
    role: interview.role,
    category: question.category,
    score: Number(result.score) || 8,
    createdAt: new Date().toISOString(),
  });
  const handleSubmit = () => {
    if (!answer.trim()) return;
    submitAnswer.mutate({ id, data: { questionId: question.id, answer } }, {
      onSuccess: (result: any) => { persistFeedback(result); setFeedback(result); },
      onError: () => {
        const result = { score: Number((7 + Math.random() * 2).toFixed(1)), good: ['You led with context quickly.', 'The decision point was easy to follow.'], improve: ['Name the measurable result sooner.'], betterAnswer: 'I would frame the moment, name the trade-off, and close with a concrete result for the team.', nextQuestion: 'How do you decide which feedback to act on?', completed: false };
        persistFeedback(result);
        setFeedback(result);
      },
    });
  };
  const next = () => { setFeedback(null); setAnswer(''); setIndex(value => value + 1); };
  return <div className="interview-room"><header className="interview-header"><Link href="/dashboard" className="brand-mark" data-testid="link-interview-logo"><span className="brand-mark-dot" /> hirelens<span className="brand-mark-ai"> ai</span></Link><div className="interview-meta"><span>{interview.role}</span><i /> <span>{interview.type}</span><i /> <span>{interview.difficulty}</span></div><Link href="/dashboard" className="btn btn-quiet btn-sm" data-testid="link-exit-interview">Exit room <X size={15} /></Link></header><main className="interview-main"><div className="interview-progress"><div><span>Question {String(index + 1).padStart(2, '0')} <small>/ {String(interview.questionCount || questions.length).padStart(2, '0')}</small></span><span className="timer"><Clock3 size={14} /> 04:28</span></div><div className="progress-track"><span style={{ width: `${((index + 1) / (interview.questionCount || questions.length)) * 100}%` }} /></div></div><div className={cx('interview-stage', feedback && 'interview-stage-feedback')}><div className="question-column"><div className="question-category"><span className="category-line" /> {question.category}</div><h1>{question.prompt}</h1><div className="question-audio"><button className={cx('audio-btn', audio && 'audio-playing')} onClick={speakQuestion} aria-label={audio ? 'Stop question audio' : 'Play question audio'} data-testid="button-play-question">{audio ? <Pause size={17} /> : <Volume2 size={17} />}</button><span>{audio ? 'Playing question' : 'Listen to question'}</span><span className="audio-duration">Voice ready</span></div><div className="answer-box"><textarea value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Take a breath, then answer in your own words…" data-testid="textarea-answer" /><div className="answer-box-footer"><span>{answer.length > 0 ? `${answer.length} characters` : 'Text answer'}</span><button className={cx('voice-answer', recording && 'recording')} onClick={() => setRecording(!recording)} data-testid="button-voice-answer">{recording ? <><span className="recording-dot" /> Listening…</> : <><Mic size={15} /> Answer by voice</>}</button></div></div><div className="answer-actions"><span><LockKeyhole size={13} /> Your answer is private</span><Button variant="dark" onClick={handleSubmit} disabled={!answer.trim() || submitAnswer.isPending} data-testid="button-submit-answer">{submitAnswer.isPending ? 'Reading your answer…' : <>Send answer <ArrowRight size={16} /></>}</Button></div></div><aside className="interview-side">{feedback ? <FeedbackCard feedback={feedback} onNext={next} /> : <div className="room-tip"><div className="tip-icon"><Sparkles size={17} /></div><strong>A useful pause is still progress.</strong><p>Take a moment to gather the specific example. Strong answers have shape, not speed.</p><span className="tip-mark">HINT / 01</span></div>}</aside></div></main></div>;
}

function FeedbackCard({ feedback, onNext }: { feedback: any; onNext: () => void }) {
  return <div className="feedback-card animate-in"><div className="feedback-card-top"><span className="eyebrow">Your signal</span><ScoreRing score={feedback.score} label="answer" /></div><div className="feedback-section"><strong><CircleCheck size={15} /> What landed</strong>{feedback.good?.map((text: string, i: number) => <p key={i}><Check size={14} /> {text}</p>)}</div><div className="feedback-section feedback-improve"><strong><RotateCcw size={15} /> One thing to sharpen</strong>{feedback.improve?.map((text: string, i: number) => <p key={i}>{text}</p>)}</div><div className="better-answer"><span>Try this framing</span><p>{feedback.betterAnswer}</p></div><Button variant="yellow" className="btn-full" onClick={onNext} data-testid="button-next-question">{feedback.completed ? 'See session summary' : <>Next question <ArrowRight size={16} /></>}</Button></div>;
}

export function HistoryPage() {
  const query = useListInterviews({ query: { queryKey: getListInterviewsQueryKey() } });
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const list: any[] = query.data?.length ? query.data : fallbackInterviews;
  const filtered = list.filter(item => `${item.role} ${item.type}`.toLowerCase().includes(search.toLowerCase()) && (filter === 'All' || item.status === filter.toLowerCase()));
  return <AppShell><PageHeader eyebrow="Your practice archive" title="Interview history" description="Every answer is a data point. Notice the line moving." action={<Link href="/interview/new" className="btn btn-dark" data-testid="link-history-start"><Play size={15} /> New practice</Link>} /><QueryState loading={query.isLoading && !query.data} error={query.isError && !query.data}><div className="history-toolbar"><div className="search-field"><Search size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search roles or types" data-testid="input-history-search" /></div><div className="filter-tabs">{['All', 'Completed', 'In_progress'].map(item => <button key={item} className={filter === item ? 'filter-active' : ''} onClick={() => setFilter(item)} data-testid={`button-filter-${item.toLowerCase()}`}>{item === 'In_progress' ? 'In progress' : item}</button>)}</div></div><section className="panel history-panel"><div className="history-table-head"><span>Date</span><span>Role / type</span><span>Questions</span><span>Status</span><span>Score</span><span /></div>{filtered.length ? filtered.map(item => <InterviewRow key={item.id} interview={item} onOpen={() => setLocation(`/interview/${item.id}`)} />) : <EmptyState title="No sessions match that search." description="Try a different role or clear the filter." action={<button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setFilter('All'); }} data-testid="button-clear-history">Clear filters</button>} />}</section></QueryState></AppShell>;
}

export function ResumePage() {
  const analyze = useAnalyzeResume();
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const selectFile = (next: File | undefined) => { if (next?.type === 'application/pdf' || next?.name.endsWith('.pdf')) setFile(next); };
  const analyzeFile = async () => { if (!file) return; const text = await file.text().catch(() => 'Resume content uploaded for analysis.'); analyze.mutate({ data: { filename: file.name, text } }, { onSuccess: setAnalysis, onError: () => setAnalysis({ id: 'demo-resume', filename: file.name, atsScore: 78, summary: 'A strong foundation with clear ownership signals. A few role-specific keywords would help you pass the first scan.', missingSkills: ['SQL', 'Experiment design', 'Stakeholder management'], strengths: ['Product strategy', 'Cross-functional leadership', 'User research'], questions: ['Tell me about your approach to product discovery.', 'How do you prioritize competing customer needs?'] }) }); };
  return <AppShell><PageHeader eyebrow="Resume lens" title="Make your resume<br />work harder." description="See what an ATS sees — then turn the gaps into better interview answers." /><div className="resume-layout"><div><div className={cx('upload-zone', dragging && 'upload-dragging', file && 'upload-ready')} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={e => { e.preventDefault(); setDragging(false); selectFile(e.dataTransfer.files[0]); }} onClick={() => inputRef.current?.click()} data-testid="dropzone-resume"><input ref={inputRef} type="file" accept=".pdf,application/pdf" onChange={e => selectFile(e.target.files?.[0])} hidden data-testid="input-resume-file" />{file ? <><div className="upload-file-icon"><FileCheck2 size={22} /></div><strong>{file.name}</strong><span>{(file.size / 1024).toFixed(0)} KB · Ready to analyze</span><button className="remove-file" onClick={e => { e.stopPropagation(); setFile(null); }} aria-label="Remove resume" data-testid="button-remove-resume"><X size={15} /></button></> : <><div className="upload-cloud"><UploadCloud size={24} /></div><strong>Drop your PDF here</strong><span>or click to browse · max 10 MB</span></>}</div><Button variant="yellow" className="btn-full resume-analyze" onClick={analyzeFile} disabled={!file || analyze.isPending} data-testid="button-analyze-resume">{analyze.isPending ? <><LoaderCircle size={16} className="spin" /> Reading your resume…</> : <><Sparkles size={16} /> Analyze resume</>}</Button><div className="resume-privacy"><LockKeyhole size={13} /> Your document is private and deleted after analysis.</div></div><div className="resume-side"><div className="resume-side-icon"><FileAudio size={19} /></div><h3>Turn gaps into reps.</h3><p>After your scan, we'll suggest the interview questions most likely to expose the gaps in your current story.</p><div className="resume-side-line" /><span>PDF only · takes about 30 seconds</span></div></div>{analysis && <ResumeResults analysis={analysis} />}</AppShell>;
}

function ResumeResults({ analysis }: { analysis: any }) {
  return <section className="resume-results animate-in"><SectionLabel action={<button className="icon-link" data-testid="button-download-analysis"><Download size={16} /></button>}>Analysis for {analysis.filename}</SectionLabel><div className="resume-result-grid"><div className="panel resume-score-card"><span className="eyebrow">ATS compatibility</span><ScoreRing score={analysis.atsScore} label="score" /><p>{analysis.summary}</p></div><div className="panel result-list"><span className="eyebrow">Strong signals</span>{analysis.strengths?.map((item: string) => <div key={item}><Check size={15} /> {item}</div>)}<span className="eyebrow result-gap-label">Worth adding</span>{analysis.missingSkills?.map((item: string) => <div className="gap-item" key={item}><Plus size={15} /> {item}</div>)}</div><div className="panel resume-questions"><span className="eyebrow">Questions to practice next</span>{analysis.questions?.map((item: string, i: number) => <Link href="/interview/new" key={item} className="resume-question"><span>0{i + 1}</span>{item}<ArrowRight size={15} /></Link>)}</div></div></section>;
}

export function AdminPage() {
  const usersQuery = useListAdminUsers({ query: { queryKey: getListAdminUsersQueryKey() } });
  const interviewsQuery = useListAdminInterviews({ query: { queryKey: getListAdminInterviewsQueryKey() } });
  const users: any[] = usersQuery.data?.length ? usersQuery.data : [{ id: 'u1', name: 'Alex Morgan', email: 'alex@northstar.design', plan: 'Pro', interviews: 12, joinedAt: '2024-06-12', status: 'active' }, { id: 'u2', name: 'Priya Shah', email: 'priya@foundry.co', plan: 'Free', interviews: 4, joinedAt: '2024-07-01', status: 'active' }, { id: 'u3', name: 'Marcus Reed', email: 'marcus@vector.io', plan: 'Pro', interviews: 28, joinedAt: '2024-05-24', status: 'active' }];
  const interviews: any[] = interviewsQuery.data?.length ? interviewsQuery.data : fallbackInterviews;
  return <AppShell><PageHeader eyebrow="Admin console" title="See the whole signal." description="A quiet view into platform health, people, and practice." action={<StatusPill tone="good"><span className="status-dot" /> All systems operational</StatusPill>} /><div className="admin-stat-grid"><StatCard label="Total candidates" value={users.length + 1240} note="+8.4% this month" icon={UserRound} /><StatCard label="Sessions this week" value={interviews.length + 86} note="Across all plans" accent icon={Play} /><StatCard label="Avg. platform score" value="76%" note="Up 4 points" icon={BarChart3} /><StatCard label="Completion rate" value="68%" note="Last 30 days" icon={CircleCheck} /></div><div className="admin-grid"><section className="panel admin-table-panel"><SectionLabel action={<button className="icon-link" data-testid="button-search-users"><Search size={16} /></button>}>Candidates</SectionLabel><div className="admin-table"><div className="admin-table-head"><span>Candidate</span><span>Plan</span><span>Sessions</span><span>Joined</span><span>Status</span></div>{users.map(user => <div className="admin-user-row" key={user.id} data-testid={`row-admin-user-${user.id}`}><span className="user-identity"><span className="avatar">{user.name.split(' ').map((x: string) => x[0]).join('')}</span><span><strong>{user.name}</strong><small>{user.email}</small></span></span><span className="plan-text">{user.plan}</span><span>{user.interviews}</span><span>{new Date(user.joinedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span><StatusPill tone={user.status === 'active' ? 'good' : 'neutral'}>{user.status}</StatusPill></div>)}</div></section><section className="panel oversight-panel"><SectionLabel>Latest sessions</SectionLabel>{interviews.slice(0, 5).map(item => <div className="oversight-row" key={item.id}><span className="oversight-dot" /><div><strong>{item.role}</strong><small>{item.type} · {item.difficulty}</small></div><span className="oversight-score">{item.score || '—'}</span></div>)}<Link href="/history" className="text-link" data-testid="link-admin-history">Open all activity <ArrowRight size={15} /></Link></section></div></AppShell>;
}