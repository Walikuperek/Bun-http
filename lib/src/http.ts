const log = (val: any) => console.assert(Bun.env.PRODUCTION === "true", val);

export class Req extends Request {
  public params: { [key: string]: string } = {};
  public query: { [key: string]: string } = {};
}

export class Res extends Response {}

// Immutable array like structure
export class ImmutableArr<T> extends Array<T> {
  constructor(...args: T[]) {
    super(...args.map((e) => Object.assign({}, e)));
  }

  override push(...args: T[]) {
    return super.push(...args.map((e) => Object.assign({}, e)));
  }

  override unshift(...args: T[]) {
    return super.unshift(...args.map((e) => Object.assign({}, e)));
  }
}

export type Endpoint = {
  path: string; // /blog/:id
  handler: (req: Req) => Res;
  pathArr?: (string | any)[]; // ['blog', ':id']
};

/**
 *
 * ```ts
 *   const e: Endpoint = {path: '/'}
 *   const endpoints = new Endpoints(e)
 *   e.path = '/blog'
 *   endpoints.push(e) // can be endpoints.unshift(e) as well
 *   e.path = '/blog/:id' // endpoints are immutable, won't affect any element
 *   console.log(endpoints) // [{"path": "/"}, {"path": "/blog"}]
 * ```
 */
export class Endpoints extends ImmutableArr<Endpoint> {
  override push(...endpoints: Endpoint[]) {
    endpoints.forEach((e) => (e.pathArr = e.path.split("/")));
    return super.push(...endpoints);
  }

  override unshift(...endpoints: Endpoint[]) {
    endpoints.forEach((e) => (e.pathArr = e.path.split("/")));
    return super.unshift(...endpoints);
  }

  getByPath(path: string) {
    const endpoint = this.find((e) => {
      const pathArr = path.split("/");
      if (e.path === path) return true;
      if (!e.pathArr) return false;
      if (e.pathArr.length !== pathArr.length) return false;
      return e.pathArr.every((p, i) => {
        if (p.startsWith(":")) {
          return true;
        }
        return p === pathArr[i];
      });
    });
    return endpoint;
  }
}
export class Router {
  endpoints: Endpoints = new Endpoints();

  constructor() {
    if (Bun.env.PRODUCTION == "false") {
      // [DEV] Adds showcase page with all endpoints
      this.endpoints.push({
        path: "/__endpoints",
        handler: (req) =>
          new Response(
            "Endpoints:\n" +
              this.endpoints
                .filter((e) => !e.path.startsWith("/__"))
                .map((e) => "  " + e.path)
                .sort()
                .join("\n")
          ),
      });
    }
  }

  // Request init from Bun
  route(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname;
    const query = url.searchParams;
    const pathArr = path.split("/");

    const endpoint = this.endpoints.getByPath(path);
    if (!endpoint) return new Res("Not found", { status: 404 });

    const params: { [key: string]: string } = {};
    endpoint.pathArr?.forEach((p, i) => {
      if (!p.startsWith(":")) return;
      params[p.slice(1)] = pathArr[i];
    });
    const request = new Req(req);
    request.params = params;
    request.query = Object.fromEntries(query.entries());
    const response = endpoint.handler(request);

    log(
      `${new Date().toLocaleTimeString()}: ${response.status} ${
        req.method
      } ${pathArr.join("/")}`
    );
    return response;
  }
}

export type ServeOptions = { port?: number };
const defaultServeOptions: ServeOptions = {
  port: 3000,
};

export const http = {
  router: new Router(),

  get(path: string, handler: (req: Req) => Res) {
    this.router.endpoints.push({ path, handler });
  },

  post(path: string, handler: (req: Req) => Res) {
    this.router.endpoints.push({ path, handler });
  },

  put(path: string, handler: (req: Req) => Res) {
    this.router.endpoints.push({ path, handler });
  },

  delete(path: string, handler: (req: Req) => Res) {
    this.router.endpoints.push({ path, handler });
  },

  patch(path: string, handler: (req: Req) => Res) {
    this.router.endpoints.push({ path, handler });
  },

  serve(opts = defaultServeOptions) {
    return Bun.serve({
      port: opts.port,
      fetch(req) {
        return http.router.route(req);
      },
      error(err) {
        return new Res(`<p>${err}\n${err.stack}</pre>`, {
          headers: {
            "Content-Type": "text/html",
          },
        });
      },
    });
  },
};
