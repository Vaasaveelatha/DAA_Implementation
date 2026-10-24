import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const sortxPreferences = mysqlTable("sortx_preferences", {
  id: int("id").autoincrement().primaryKey(),
  visitorKey: varchar("visitorKey", { length: 96 }).notNull().unique(),
  theme: mysqlEnum("theme", ["dark", "light"]).default("dark").notNull(),
  reducedMotion: int("reducedMotion").default(0).notNull(),
  defaultAlgorithm: varchar("defaultAlgorithm", { length: 32 }).default("quick").notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const quizAttempts = mysqlTable("sortx_quiz_attempts", {
  id: int("id").autoincrement().primaryKey(),
  visitorKey: varchar("visitorKey", { length: 96 }).notNull(),
  score: int("score").notNull(),
  total: int("total").notNull(),
  percentage: int("percentage").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const savedDatasets = mysqlTable("sortx_datasets", {
  id: int("id").autoincrement().primaryKey(),
  visitorKey: varchar("visitorKey", { length: 96 }).notNull(),
  name: varchar("name", { length: 120 }).notNull(),
  values: text("values").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const visualizationSessions = mysqlTable("sortx_sessions", {
  id: int("id").autoincrement().primaryKey(),
  visitorKey: varchar("visitorKey", { length: 96 }).notNull(),
  algorithm: varchar("algorithm", { length: 32 }).notNull(),
  elements: int("elements").notNull(),
  comparisons: int("comparisons").notNull(),
  swaps: int("swaps").notNull(),
  accesses: int("accesses").notNull(),
  elapsedMs: int("elapsedMs").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type SortxPreference = typeof sortxPreferences.$inferSelect;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type SavedDataset = typeof savedDatasets.$inferSelect;
export type VisualizationSession = typeof visualizationSessions.$inferSelect;
