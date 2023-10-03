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
