import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getPreference, saveDataset, savePreference, saveQuizAttempt, saveVisualizationSession } from "./db";

const algorithmMetadata = [
  { key: "bubble", name: "Bubble Sort", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true },
  { key: "selection", name: "Selection Sort", best: "O(n²)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: false },
  { key: "insertion", name: "Insertion Sort", best: "O(n)", average: "O(n²)", worst: "O(n²)", space: "O(1)", stable: true },
  { key: "merge", name: "Merge Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(n)", stable: true },
  { key: "quick", name: "Quick Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n²)", space: "O(log n)", stable: false },
  { key: "heap", name: "Heap Sort", best: "O(n log n)", average: "O(n log n)", worst: "O(n log n)", space: "O(1)", stable: false },
  { key: "shell", name: "Shell Sort", best: "O(n log n)", average: "O(n^1.5)", worst: "O(n²)", space: "O(1)", stable: false },
  { key: "counting", name: "Counting Sort", best: "O(n + k)", average: "O(n + k)", worst: "O(n + k)", space: "O(n + k)", stable: true },
] as const;

const visitorKey = z.string().min(8).max(96);

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  sortx: router({
    metadata: publicProcedure.query(() => ({ algorithms: algorithmMetadata, version: "1.0" })),
    preference: router({
      get: publicProcedure.input(z.object({ visitorKey })).query(({ input }) => getPreference(input.visitorKey)),
      save: publicProcedure.input(z.object({ visitorKey, theme: z.enum(["dark", "light"]).optional(), reducedMotion: z.boolean().optional(), defaultAlgorithm: z.string().max(32).optional() })).mutation(({ input }) => savePreference(input)),
    }),
    quiz: router({
      save: publicProcedure.input(z.object({ visitorKey, score: z.number().int().min(0), total: z.number().int().min(1).max(100) })).mutation(({ input }) => saveQuizAttempt(input)),
    }),
    datasets: router({
      save: publicProcedure.input(z.object({ visitorKey, name: z.string().min(1).max(120), values: z.array(z.number().int()).min(2).max(200) })).mutation(({ input }) => saveDataset(input)),
    }),
    sessions: router({
      save: publicProcedure.input(z.object({ visitorKey, algorithm: z.string().max(32), elements: z.number().int().min(2).max(200), comparisons: z.number().int().min(0), swaps: z.number().int().min(0), accesses: z.number().int().min(0), elapsedMs: z.number().int().min(0) })).mutation(({ input }) => saveVisualizationSession(input)),
    }),
  }),
});

export type AppRouter = typeof appRouter;
