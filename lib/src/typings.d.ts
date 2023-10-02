/**
 * [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) represents an HTTP request.
 *
 * @example
 * ```ts
 * const request = new Req("https://quak.com.pl/");
 * await fetch(request);
 * ```
 *
 * @example
 * ```ts
 * const request = new Req("https://quak.com.pl/");
 * await fetch(request);
 * ```
 */
declare class Req extends Request {
  params: { [key: string]: string };
  query: { [key: string]: string };
}

/**
 * Represents an HTTP [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
 *
 * Use it to get the body of the response, the status code, and other information.
 *
 * @example
 * ```ts
 * const response: Res = await fetch("https://quak.com.pl/");
 * await response.text();
 * ```
 * @example
 * ```ts
 * const response: Res = await fetch("https://quak.com.pl/");
 * await Bun.write("quak_home.html", response);
 * ```
 */
declare class Res extends Response {}

/**
 * An array-like structure that is immutable.
 */
declare class ImmutableArr<T> extends Array<T> {
  constructor(...args: T[]);
  override push(...args: T[]);
  override unshift(...args: T[]);
}
