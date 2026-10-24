import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, sortxPreferences, quizAttempts, savedDatasets, visualizationSessions } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

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
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values: InsertUser = { openId: user.openId };
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
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; }
  else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function savePreference(input: { visitorKey: string; theme?: "dark" | "light"; reducedMotion?: boolean; defaultAlgorithm?: string }) {
  const db = await getDb();
  if (!db) return { available: false };
  const values = {
    visitorKey: input.visitorKey,
    ...(input.theme ? { theme: input.theme } : {}),
    ...(input.reducedMotion !== undefined ? { reducedMotion: input.reducedMotion ? 1 : 0 } : {}),
    ...(input.defaultAlgorithm ? { defaultAlgorithm: input.defaultAlgorithm } : {}),
  };
  await db.insert(sortxPreferences).values(values).onDuplicateKeyUpdate({ set: values });
  return { available: true };
}

export async function getPreference(visitorKey: string) {
  const db = await getDb();
  if (!db) return { available: false as const, preference: null };
  const result = await db.select().from(sortxPreferences).where(eq(sortxPreferences.visitorKey, visitorKey)).limit(1);
  return { available: true as const, preference: result[0] ?? null };
}

export async function saveQuizAttempt(input: { visitorKey: string; score: number; total: number }) {
  const db = await getDb();
  if (!db) return { available: false };
  const percentage = input.total ? Math.round(input.score / input.total * 100) : 0;
  await db.insert(quizAttempts).values({ ...input, percentage });
  return { available: true, percentage };
}

export async function saveDataset(input: { visitorKey: string; name: string; values: number[] }) {
  const db = await getDb();
  if (!db) return { available: false };
  await db.insert(savedDatasets).values({ visitorKey: input.visitorKey, name: input.name, values: JSON.stringify(input.values) });
  return { available: true };
}

export async function saveVisualizationSession(input: { visitorKey: string; algorithm: string; elements: number; comparisons: number; swaps: number; accesses: number; elapsedMs: number }) {
  const db = await getDb();
  if (!db) return { available: false };
  await db.insert(visualizationSessions).values(input);
  return { available: true };
}
