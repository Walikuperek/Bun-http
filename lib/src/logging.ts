/**
 * Logs only in development mode
 *
 * *To disable logging in production, set the* `PRODUCTION` *environment variable to `true`*
 */
export const log = (val: any) =>
  console.assert(Bun.env.PRODUCTION === "true", val);

/**
 * Logs only in development mode
 * @example 8:27:56 PM: 200 POST /blog/123
 */
export const reqLog = (
  val: { status?: number; method?: string; path?: string } & { now?: string }
) => {
  val = {
    now: new Date().toLocaleTimeString(),
    status: 200,
    method: "GET",
    path: "/",
    ...val,
  };
  return log(`${val.now}: ${val.status} ${val.method} ${val.path}`);
};
