import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscription tiers and status tracking
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  tier: mysqlEnum("tier", ["free", "pro"]).default("free").notNull(),
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }),
  resumeCount: int("resumeCount").default(0).notNull(),
  maxResumes: int("maxResumes").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Resume documents with template selection and ATS metadata
 */
export const resumes = mysqlTable("resumes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  template: varchar("template", { length: 64 }).default("modern").notNull(),
  data: text("data").notNull(), // JSON stringified resume data
  atsScore: int("atsScore"),
  pdfUrl: varchar("pdfUrl", { length: 512 }),
  pdfKey: varchar("pdfKey", { length: 512 }), // S3 key for PDF storage
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Resume = typeof resumes.$inferSelect;
export type InsertResume = typeof resumes.$inferInsert;

/**
 * Job descriptions for analysis and matching
 */
export const jobDescriptions = mysqlTable("jobDescriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }),
  content: text("content").notNull(),
  keywords: text("keywords"), // JSON stringified array of extracted keywords
  skills: text("skills"), // JSON stringified array of required skills
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JobDescription = typeof jobDescriptions.$inferSelect;
export type InsertJobDescription = typeof jobDescriptions.$inferInsert;

/**
 * ATS score history for tracking improvements
 */
export const atsScoreHistory = mysqlTable("atsScoreHistory", {
  id: int("id").autoincrement().primaryKey(),
  resumeId: int("resumeId").notNull().references(() => resumes.id, { onDelete: "cascade" }),
  jobDescriptionId: int("jobDescriptionId").references(() => jobDescriptions.id, { onDelete: "set null" }),
  score: int("score").notNull(),
  matchedKeywords: text("matchedKeywords"), // JSON stringified array
  missingKeywords: text("missingKeywords"), // JSON stringified array
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AtsScoreHistory = typeof atsScoreHistory.$inferSelect;
export type InsertAtsScoreHistory = typeof atsScoreHistory.$inferInsert;

/**
 * Cover letters generated from resumes and job descriptions
 */
export const coverLetters = mysqlTable("coverLetters", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  resumeId: int("resumeId").notNull().references(() => resumes.id, { onDelete: "cascade" }),
  jobDescriptionId: int("jobDescriptionId").notNull().references(() => jobDescriptions.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoverLetter = typeof coverLetters.$inferSelect;
export type InsertCoverLetter = typeof coverLetters.$inferInsert;