import { Router, type IRouter } from "express";
import {
  AnalyzeResumeBody,
  AnalyzeResumeResponse,
  AnswerFeedback,
  CreateInterviewBody,
  CreateInterviewResponse,
  GetDashboardSummaryResponse,
  GetInterviewParams,
  GetInterviewResponse,
  ListAdminInterviewsResponse,
  ListAdminUsersResponse,
  ListInterviewsResponse,
  SubmitInterviewAnswerBody,
  SubmitInterviewAnswerParams,
  SubmitInterviewAnswerResponse,
} from "@workspace/api-zod";

// HireLens runs in self-contained demo mode. Questions, analysis, and feedback
// are app-owned mock responses so the product never requires an AI provider key.

type Question = {
  id: string;
  prompt: string;
  category: string;
  answered: boolean;
};

type Interview = {
  id: string;
  role: string;
  difficulty: string;
  type: string;
  status: "in_progress" | "completed";
  score: number | null;
  questionCount: number;
  completedAt: string | null;
  createdAt: string;
  questions: Question[];
};

const questionBank: Record<string, string[]> = {
  "Java Dev": [
    "Walk me through how you would design a thread-safe cache in Java.",
    "What happens inside the JVM when a class is loaded?",
    "How would you diagnose a slow Spring Boot endpoint in production?",
    "Explain the difference between composition and inheritance.",
    "Tell me about a time you made a system more reliable.",
  ],
  "Python Dev": [
    "How would you structure a Python service that needs to process a large queue?",
    "Explain Python's GIL and when it matters.",
    "How would you make a FastAPI endpoint observable in production?",
    "When would you choose a generator over a list?",
    "Tell me about a Python project you are proud of.",
  ],
  HR: [
    "Tell me about a time you had to influence a decision without authority.",
    "How do you handle disagreement with a teammate?",
    "What is a piece of feedback that changed how you work?",
    "Tell me about a project that did not go to plan.",
    "What kind of team environment helps you do your best work?",
  ],
};

const makeQuestions = (role: string, type: string): Question[] => {
  const prompts = questionBank[role] ?? questionBank.HR;
  return prompts.map((prompt, index) => ({
    id: `q-${index + 1}`,
    prompt: type === "HR" && role !== "HR" ? questionBank.HR[index] : prompt,
    category: type === "HR" ? "Behavioral" : index === 0 ? "Core concepts" : "Problem solving",
    answered: false,
  }));
};

const interviews: Interview[] = [
  {
    id: "int-001",
    role: "Java Dev",
    difficulty: "Medium",
    type: "Technical",
    status: "completed",
    score: 8.4,
    questionCount: 5,
    completedAt: "2026-09-25T14:30:00.000Z",
    createdAt: "2026-09-25T14:00:00.000Z",
    questions: makeQuestions("Java Dev", "Technical").map((question) => ({ ...question, answered: true })),
  },
  {
    id: "int-002",
    role: "Python Dev",
    difficulty: "Hard",
    type: "Technical",
    status: "completed",
    score: 7.8,
    questionCount: 5,
    completedAt: "2026-09-23T11:20:00.000Z",
    createdAt: "2026-09-23T10:45:00.000Z",
    questions: makeQuestions("Python Dev", "Technical").map((question) => ({ ...question, answered: true })),
  },
  {
    id: "int-003",
    role: "HR",
    difficulty: "Easy",
    type: "HR",
    status: "completed",
    score: 9.1,
    questionCount: 5,
    completedAt: "2026-09-21T16:10:00.000Z",
    createdAt: "2026-09-21T15:40:00.000Z",
    questions: makeQuestions("HR", "HR").map((question) => ({ ...question, answered: true })),
  },
];

const users = [
  { id: "usr-001", name: "Alex Morgan", email: "alex.morgan@example.com", plan: "Pro", interviews: 12, joinedAt: "2026-08-12T00:00:00.000Z", status: "Active" },
  { id: "usr-002", name: "Priya Shah", email: "priya.shah@example.com", plan: "Free", interviews: 4, joinedAt: "2026-09-02T00:00:00.000Z", status: "Active" },
  { id: "usr-003", name: "Sam Wilson", email: "sam.wilson@example.com", plan: "Pro", interviews: 9, joinedAt: "2026-08-21T00:00:00.000Z", status: "Active" },
];

const router: IRouter = Router();

router.get("/dashboard/summary", (_req, res) => {
  const recentInterviews = interviews.slice(0, 3);
  const scores = interviews.filter((interview) => interview.score !== null).map((interview) => interview.score as number);
  res.json(GetDashboardSummaryResponse.parse({
    interviewsTaken: 12,
    averageScore: scores.reduce((sum, score) => sum + score, 0) / scores.length,
    practiceMinutes: 184,
    improvement: 18.4,
    weakAreas: [
      { subject: "Clarity", score: 78, fullMark: 100 },
      { subject: "Technical depth", score: 68, fullMark: 100 },
      { subject: "Structure", score: 84, fullMark: 100 },
      { subject: "Confidence", score: 73, fullMark: 100 },
      { subject: "Examples", score: 89, fullMark: 100 },
    ],
    recentInterviews,
  }));
});

router.get("/interviews", (_req, res) => {
  res.json(ListInterviewsResponse.parse(interviews));
});

router.post("/interviews", (req, res) => {
  const parsed = CreateInterviewBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const created: Interview = {
    id: `int-${crypto.randomUUID().slice(0, 8)}`,
    ...parsed.data,
    status: "in_progress",
    score: null,
    questionCount: 5,
    completedAt: null,
    createdAt: new Date().toISOString(),
    questions: makeQuestions(parsed.data.role, parsed.data.type),
  };
  interviews.unshift(created);
  res.status(201).json(CreateInterviewResponse.parse(created));
});

router.get("/interviews/:id", (req, res) => {
  const params = GetInterviewParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const interview = interviews.find((item) => item.id === params.data.id);
  if (!interview) {
    res.status(404).json({ error: "Interview not found" });
    return;
  }
  res.json(GetInterviewResponse.parse(interview));
});

router.post("/interviews/:id/answers", (req, res) => {
  const params = SubmitInterviewAnswerParams.safeParse(req.params);
  const body = SubmitInterviewAnswerBody.safeParse(req.body);
  if (!params.success || !body.success) {
    const message = !params.success
      ? params.error.message
      : body.success
        ? "Invalid answer"
        : body.error.message;
    res.status(400).json({ error: message });
    return;
  }
  const interview = interviews.find((item) => item.id === params.data.id);
  if (!interview) {
    res.status(404).json({ error: "Interview not found" });
    return;
  }
  const questionIndex = interview.questions.findIndex((question) => question.id === body.data.questionId);
  if (questionIndex === -1) {
    res.status(404).json({ error: "Question not found" });
    return;
  }
  const answer = body.data.answer;
  if (typeof answer !== "string") {
    res.status(400).json({ error: "Answer must be text" });
    return;
  }
  interview.questions[questionIndex].answered = true;
  const answeredCount = interview.questions.filter((question) => question.answered).length;
  const completed = answeredCount === interview.questions.length;
  const score = Number((7 + Math.random() * 2).toFixed(1));
  if (completed) {
    interview.status = "completed";
    interview.score = Number((score + 0.6).toFixed(1));
    interview.completedAt = new Date().toISOString();
  }
  res.json(SubmitInterviewAnswerResponse.parse({
    score: Number(score.toFixed(1)),
    good: ["You used a clear structure", "Your answer connected the idea to a practical outcome"],
    improve: ["Name the trade-off explicitly", "Add one concrete result or metric"],
    betterAnswer: "A stronger answer would define the approach, explain the trade-off you considered, and finish with the outcome you achieved.",
    nextQuestion: completed ? null : interview.questions[answeredCount].prompt,
    completed,
  }));
});

router.post("/resume/analyze", (req, res) => {
  const parsed = AnalyzeResumeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  res.json(AnalyzeResumeResponse.parse({
    id: `resume-${crypto.randomUUID().slice(0, 8)}`,
    filename: parsed.data.filename,
    atsScore: 82,
    summary: "A strong engineering resume with relevant delivery experience. Tightening impact metrics and adding a few platform keywords would increase match quality.",
    missingSkills: ["System design", "Cloud architecture", "Observability"],
    strengths: ["Clear ownership language", "Relevant technical keywords", "Concise project descriptions"],
    questions: [
      "You mention owning a service end to end. How did you decide what to measure?",
      "Tell me about the most difficult production issue you resolved.",
      "How would you explain your system's architecture to a new teammate?",
    ],
  }));
});

router.get("/admin/users", (_req, res) => {
  res.json(ListAdminUsersResponse.parse(users));
});

router.get("/admin/interviews", (_req, res) => {
  res.json(ListAdminInterviewsResponse.parse(interviews));
});

export default router;