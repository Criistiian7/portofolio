/** 5-minute processing-time window start (epoch ms). */
export function floorTo5m(ts: number): number {
  const fiveMin = 5 * 60 * 1000;
  return Math.floor(ts / fiveMin) * fiveMin;
}

/** UTC hour bucket id for TTL partitioning (hours since epoch). */
export function hourBucketId(ts: number): number {
  return Math.floor(ts / 3600000);
}
