import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  resumes,
  subscriptions,
  jobDescriptions,
  atsScoreHistory,
  coverLetters,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Resume operations
 */
export async function createResume(
  userId: number,
  title: string,
  data: string,
  template: string = "modern"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(resumes).values({
    userId,
    title,
    data,
    template,
  });

  return result;
}

export async function getUserResumes(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(resumes).where(eq(resumes.userId, userId));
}

export async function getResumeById(resumeId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateResume(
  resumeId: number,
  userId: number,
  updates: {
    title?: string;
    data?: string;
    template?: string;
    atsScore?: number;
    pdfUrl?: string;
    pdfKey?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(resumes)
    .set(updates)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));
}

export async function deleteResume(resumeId: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .delete(resumes)
    .where(and(eq(resumes.id, resumeId), eq(resumes.userId, userId)));
}

/**
 * Subscription operations
 */
export async function getOrCreateSubscription(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const existing = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    return existing[0];
  }

  await db.insert(subscriptions).values({
    userId,
    tier: "free",
    resumeCount: 0,
    maxResumes: 1,
  });

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId))
    .limit(1);

  return result[0];
}

export async function updateSubscription(
  userId: number,
  updates: {
    tier?: "free" | "pro";
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    resumeCount?: number;
    maxResumes?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(subscriptions)
    .set(updates)
    .where(eq(subscriptions.userId, userId));
}

/**
 * Job Description operations
 */
export async function createJobDescription(
  userId: number,
  title: string,
  company: string | undefined,
  content: string,
  keywords?: string,
  skills?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(jobDescriptions).values({
    userId,
    title,
    company,
    content,
    keywords,
    skills,
  });
}

export async function getUserJobDescriptions(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(jobDescriptions)
    .where(eq(jobDescriptions.userId, userId));
}

export async function getJobDescriptionById(jobId: number, userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(jobDescriptions)
    .where(
      and(eq(jobDescriptions.id, jobId), eq(jobDescriptions.userId, userId))
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * ATS Score History operations
 */
export async function createAtsScoreRecord(
  resumeId: number,
  jobDescriptionId: number | null,
  score: number,
  matchedKeywords?: string,
  missingKeywords?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(atsScoreHistory).values({
    resumeId,
    jobDescriptionId,
    score,
    matchedKeywords,
    missingKeywords,
  });
}

export async function getResumeAtsHistory(resumeId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(atsScoreHistory)
    .where(eq(atsScoreHistory.resumeId, resumeId));
}

/**
 * Cover Letter operations
 */
export async function createCoverLetter(
  userId: number,
  resumeId: number,
  jobDescriptionId: number,
  content: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(coverLetters).values({
    userId,
    resumeId,
    jobDescriptionId,
    content,
  });
}

export async function getUserCoverLetters(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(coverLetters).where(eq(coverLetters.userId, userId));
}

export async function getCoverLetterById(
  coverLetterId: number,
  userId: number
) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(coverLetters)
    .where(
      and(
        eq(coverLetters.id, coverLetterId),
        eq(coverLetters.userId, userId)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
