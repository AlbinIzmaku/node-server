import http from "node:http";
import fs from "node:fs";
import { URL } from "node:url";
import querystring from "node:querystring";

const server = http
  .createServer((request, response) => {
    const { headers, method, url } = request;
    const parsedUrl = new URL(url, `http://${headers.host}`);

    if (method === "GET" && url === "/") {
      response.writeHead(200, { "content-type": "text/html" });
      fs.createReadStream("./index.html").pipe(response);
      return;
    }

    if (method === "GET" && parsedUrl.pathname === "/login") {
      response.writeHead(200, { "content-type": "text/html" });
      fs.createReadStream("./login.html").pipe(response);

      return;
    }

    if (method === "POST" && parsedUrl.pathname === "/login") {
      let body = "";

      request.on("data", (chunk) => {
        body += chunk.toString();
      });

      request.on("end", () => {
        const data = querystring.parse(body);
        const username = data.uname;

        response.writeHead(302, {
          location: `/hello?user=${encodeURIComponent(username)}`,
        });

        response.end();
      });

      return;
    }

    if (method === "GET" && parsedUrl.pathname === "/hello") {
      const username = parsedUrl.searchParams.get("user");

      response.writeHead(200, { "content-type": "text/html" });
      response.end(`<h1>Hello ${username}</h1>`);
      return;
    }

    response.writeHead(404, { "content-type": "text/plain" });
    response.end("Not found");
  })
  .listen(3000);
