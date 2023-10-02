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
