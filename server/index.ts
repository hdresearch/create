import express from "express";
import path from "path";
import agent from "../agent";
import { Browser, AgentBrowser, Logger } from "nolita";
import inventory from "../extensions/inventory";
import { CustomSchema } from "../extensions/schema";
import "dotenv/config";

const app = express();
const port = 3040;

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});

const cors = {
  origin: ["http://localhost:5173"],
  default: "http://localhost:5173",
};

app.all("*", function (req, res, next) {
  const origin = cors.origin.includes(req?.headers?.origin?.toLowerCase() || "")
    ? req.headers.origin
    : cors.default;
  res.header("Access-Control-Allow-Origin", origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

// In prod, serve the front-end
if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "../app/dist")));
}

app.get("/api/browse", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  const browser = await Browser.create(true);
  const logger = new Logger(["info"], (msg) => {
    return res.write(`data: ${msg}\n\n`);
  });
  const agentBrowser = new AgentBrowser({ 
    agent, 
    browser, 
    logger, 
    inventory, 
    ...(process.env.HDR_API_KEY
      ? {
          collectiveMemoryConfig: {
            endpoint: "https://api.hdr.is",
            apiKey: process.env.HDR_API_KEY,
          },
        }
      : {}),
  });
  const answer = await agentBrowser.browse(
    {
      startUrl: req.query.url as string,
      objective: [req.query.objective as string],
      maxIterations: parseInt(req.query.maxIterations as string) || 10,
    },
    CustomSchema,
  );
  await agentBrowser.close();
  if (answer) {
    res.write(`data: ${JSON.stringify(answer)}\n\n`);
    res.write(`data: {"done": true}\n\n`);
    return res.end();
  } else {
    res.write(`data: {"error": "no answer found"}\n\n`);
    res.write(`data: {"done": true}\n\n`);
    return res.end();
  }
});
