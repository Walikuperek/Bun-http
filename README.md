# http

Very fast HTTP server library based on Bun. Feel free to use it in your projects. Just copy the `lib/src/http.ts` file into your project.

```
[!] To disable the HTTP server logs create .env file next to package.json, inside your .env file set the PRODUCTION=true environment variable.
```

## Usage

```ts
import { http, Res } from "./lib/src/http";

const str = (val: any) => JSON.stringify(val);

http.get("/", (req) => {
  return new Res(`Hello from home`);
});
http.get("/product/:productId", (req) => {
  return new Res(`Product (id: ${req.params.productId})`);
});
http.post("/blog/create", (req) => {
  return new Res(`
    params: ${str(req.params)},
    query: ${str(req.query)},
    body: ${str(req.body)}
  `);
});

const server = http.serve({ port: 3000 });
console.log(`Listening on port ${server.port}...`);

/* Example output
bun main.ts
    [0.90ms] ".env"
    Listening on port 3000...
    8:27:48 PM: 200 GET /
    8:27:52 PM: 405 GET /blog/123
    8:27:56 PM: 200 POST /blog/123
*/
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun main.ts
```

This project was created using `bun init` in bun v1.0.1. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
