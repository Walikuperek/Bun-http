import { reqLog } from "./logging";
import { ImmutableArr } from "./immutable-array";

export class Req extends Request {
  private _body: any = {};
  public params: { [key: string]: string } = {};
  public query: { [key: string]: string } = {};
  get body(): any {
    return this._body;
  }
  set body(val: any) {
    this._body = val;
  }
}

export class Res extends Response {}

export type Endpoint = {
  path: string; // /blog/:id
  handler: (req: Req) => Res;
  pathArr?: (string | any)[]; // ['blog', ':id']
  method?: string;
};

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

const Params = {
  fromPathArray(endpointPath: string[], requestPath: string[]) {
    const params: { [key: string]: string } = {};
    endpointPath.forEach((p, i) => {
      if (!p.startsWith(":")) return;
      params[p.slice(1)] = requestPath[i];
    });
    return params;
  },
};

export class Router {
  endpoints: Endpoints = new Endpoints();

  constructor() {
    if (Bun.env.PRODUCTION == "false") {
      // [DEV ONLY] Adds showcase page with all endpoints
      this.endpoints.push(AdminEndpoints.showcase(this.endpoints));
    }
  }

  // Request init from Bun
  async route(req: Request) {
    const url = new URL(req.url);
    const path = url.pathname;
    const query = url.searchParams;
    const pathArr = path.split("/");
    const log = (status: number) =>
      reqLog({ status, method: req.method, path });

    const endpoint = this.endpoints.getByPath(path);
    if (!endpoint) {
      log(404);
      return new Res("Not found", { status: 404 });
    }
    if (req.method !== endpoint.method) {
      log(405);
      return new Res("Method not allowed", { status: 405 });
    }

    const request = new Req(req);
    request.params = Params.fromPathArray(endpoint.pathArr ?? [], pathArr);
    request.query = Object.fromEntries(query.entries());
    if (req.method !== "GET" && req.method !== "HEAD") {
      request.body = await req.json();
    }
    const response = endpoint.handler(request);
    log(response.status);
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
    this.router.endpoints.push({ path, handler, method: "GET" });
  },

  post(path: string, handler: (req: Req) => Res) {
    this.router.endpoints.push({ path, handler, method: "POST" });
  },

  put(path: string, handler: (req: Req) => Res) {
    this.router.endpoints.push({ path, handler, method: "PUT" });
  },

  delete(path: string, handler: (req: Req) => Res) {
    this.router.endpoints.push({ path, handler, method: "DELETE" });
  },

  patch(path: string, handler: (req: Req) => Res) {
    this.router.endpoints.push({ path, handler, method: "PATCH" });
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

/**
 * [DEV ONLY] Adds showcase page with all endpoints
 */
class AdminEndpoints {
  static showcase(endpoints: Endpoint[]): Endpoint {
    return {
      path: "/__endpoints",
      method: "GET",
      handler: (req) =>
        new Response(
          "<h1>Endpoints:</h1>\n<ol>\n" +
            endpoints
              .filter((e) => !e.path.startsWith("/__"))
              .map((e) => "  <li>" + e.path + "</li>")
              .sort()
              .join("\n") +
            "\n</ol>",
          {
            headers: {
              "Content-Type": "text/html",
            },
          }
        ),
    };
  }
}
