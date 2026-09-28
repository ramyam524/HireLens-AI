import { createInsertSchema } from "drizzle-zod";
import { jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const interviewsTable = pgTable("hirelens_interviews", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 128 }).notNull().default("demo-user"),
  role: text("role").notNull(),
  difficulty: text("difficulty").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("in_progress"),
  score: text("score"),
  questionCount: text("question_count").notNull().default("5"),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  questions: jsonb("questions").notNull(),
});

export const resumeAnalysesTable = pgTable("hirelens_resume_analyses", {
  id: varchar("id", { length: 64 }).primaryKey(),
  userId: varchar("user_id", { length: 128 }).notNull().default("demo-user"),
  filename: text("filename").notNull(),
  atsScore: text("ats_score").notNull(),
  summary: text("summary").notNull(),
  missingSkills: jsonb("missing_skills").notNull(),
  strengths: jsonb("strengths").notNull(),
  questions: jsonb("questions").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertInterviewSchema = createInsertSchema(interviewsTable).omit({
  createdAt: true,
});
export type InterviewRecord = typeof interviewsTable.$inferSelect;
export type InsertInterview = z.infer<typeof insertInterviewSchema>;
export type ResumeAnalysisRecord = typeof resumeAnalysesTable.$inferSelect;