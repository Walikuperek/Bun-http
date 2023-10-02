import { http, Res } from "./lib/src/http";

const str = (val: any) => JSON.stringify(val);

http.get("/", (req) => {
  return new Res(`Hello from home`);
});
http.get("/blog", (req) => {
  return new Res(`Hello from blog`);
});
http.get("/blog/:id", (req) => {
  return new Res(`Post (params: ${str(req.params)}, query: ${str(req.query)})`);
});
http.get("/product/:productId", (req) => {
  return new Res(`Product (id: ${req.params.productId})`);
});

http.serve({ port: 3000 });
console.log("Listening on port 3000...");
