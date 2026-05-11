import { z } from "zod";

/**
 * Release / deploy dimension contract (CI env → beacon metadata).
 * Map from CI: GITHUB_SHA, GITHUB_RUN_ID, npm_package_version, NODE_ENV, etc.
 */
export const ReleaseDimensionsSchema = z
  .object({
    commit: z.string().max(64).optional(),
    buildId: z.string().max(128).optional(),
    version: z.string().max(64).optional(),
    environment: z.string().max(32).optional(),
    service: z.string().max(64).optional(),
    region: z.string().max(32).optional(),
  })
  .strict();

export type ReleaseDimensions = z.infer<typeof ReleaseDimensionsSchema>;
