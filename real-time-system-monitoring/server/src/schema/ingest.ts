import { z } from "zod";
import { ReleaseDimensionsSchema } from "../registry/releaseContract.js";
import { HEADLINE_METRIC_KEYS } from "../registry/headlineMetrics.js";

export const SUPPORTED_SCHEMA_VERSIONS = ["1"] as const;
export type SupportedSchemaVersion = (typeof SUPPORTED_SCHEMA_VERSIONS)[number];

const headlineEnum = z.enum(HEADLINE_METRIC_KEYS);

const SampleEventSchema = z
  .object({
    type: z.literal("sample"),
    ts: z.number().int().positive(),
    metricKey: headlineEnum,
    value: z.number().finite(),
    count: z.number().int().positive().optional(),
    route: z.string().max(256).optional(),
    region: z.string().max(64).optional(),
  })
  .strict();

const DeployEventSchema = z
  .object({
    type: z.literal("deploy"),
    ts: z.number().int().positive(),
    release: ReleaseDimensionsSchema,
    note: z.string().max(512).optional(),
  })
  .strict();

const LogEventSchema = z
  .object({
    type: z.literal("log"),
    ts: z.number().int().positive(),
    level: z.enum(["error", "warn", "info"]),
    message: z.string().max(2048),
    route: z.string().max(256).optional(),
    release: ReleaseDimensionsSchema.optional(),
  })
  .strict();

export const IngestEventSchema = z.discriminatedUnion("type", [
  SampleEventSchema,
  DeployEventSchema,
  LogEventSchema,
]);

export const IngestBodySchema = z
  .object({
    schemaVersion: z.literal("1"),
    source: z.enum(["live", "synthetic_replay"]),
    release: ReleaseDimensionsSchema.optional(),
    events: z.array(IngestEventSchema).min(1).max(500),
  })
  .strict();

export type IngestBody = z.infer<typeof IngestBodySchema>;
export type IngestEvent = z.infer<typeof IngestEventSchema>;
