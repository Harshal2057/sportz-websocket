import { z } from "zod";

/**
 * MatchStatus enum (must match Prisma EXACTLY)
 */
export const matchStatusEnum = z.enum([
  "SCHEDULED",
  "LIVE",
  "FINISHED",
  "CANCELLED",
]);

/**
 * Query params for listing matches
 */
export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
  status: matchStatusEnum.optional(),
});

/**
 * Route param: Match ID (UUID)
 */
export const matchIdParamSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Create Match Schema
 */
export const createMatchSchema = z.object({
  sport: z.string().min(1, "Sport is required"),
  homeTeam: z.string().min(1, "Home team is required"),
  awayTeam: z.string().min(1, "Away team is required"),

  startTime: z.iso.datetime(),
  endTime: z.iso.datetime(),

  status: matchStatusEnum.default("SCHEDULED"),

  homeScore: z.coerce.number().int().nonnegative().optional(),
  awayScore: z.coerce.number().int().nonnegative().optional(),
}).superRefine((data , ctx) => {
  const start = new Date(data.startTime)
  const end = new Date(data.endTime)

  if (end <= start) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "endTime must be chronologically after startTime",
      path: ["endTime"]
    })
  }
});

/**
 * Update Match Status
 */
export const updateMatchStatusSchema = z.object({
  status: matchStatusEnum,
});

/**
 * Update Score Schema
 */
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});

/**
 * Commentary Schema
 */
export const createCommentarySchema = z.object({
  matchId: z.string().uuid(),

  actor: z.string().min(1, "Actor is required"),
  message: z.string().min(1, "Message is required"),

  minute: z.coerce.number().int().nonnegative(),
  sequenceNo: z.coerce.number().int().nonnegative(),

  details: z.any().optional(), // JSON field
});