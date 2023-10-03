# http

Very fast HTTP server library based on Bun. Feel free to use it in your projects. Just copy the `lib/src/http.ts` file into your project.

```
[!] To disable the HTTP server logs, inside .env file set the PRODUCTION=false environment variable to true.
```

## Usage

```ts
import { http, Res } from "./lib/src/http";

const str = (val: any) => JSON.stringify(val);

http.get("/", (req) => {
  return new Res(`Hello from home`);
});
http.get("/blog", (req) => {
  return new Res(`Hello from blog`);
});
http.post("/blog/:id", (req) => {
  return new Res(
    `Create post (params: ${str(req.params)}, query: ${str(req.query)})`
  );
});
http.get("/product/:productId", (req) => {
  return new Res(`Product (id: ${req.params.productId})`);
});

const server = http.serve({ port: 3000 });
console.log(`Listening on port ${server.port}...`);

/* Example output
bun main.ts
    [0.11ms] ".env"
    Listening on port 3000...
    10:45:48 PM: 200 GET /product/123
    10:45:52 PM: 200 GET /__endpoints  # special endpoint only available in PRODUCTION=false mode
    10:46:01 PM: 200 POST /blog/456
*/
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run main.ts
```

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
