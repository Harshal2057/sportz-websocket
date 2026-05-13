import express from "express"
import { MatchRouter } from "./routes/matches.js";
import http from "http"
import { attachWebSocketServer } from "./ws/server.js";
import { log } from "console";
import { securityMiddleware } from "../arcjet.js";
import { commentaryRouter } from "./routes/commentry.js";

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0"

const app = express();
const server = http.createServer(app);


app.use(express.json());

app.get("/" , (req , res) => {
   res.send("hello from express server")
})

app.use(securityMiddleware());

app.use("/matches" , MatchRouter)
app.use("/matches/:id/commentary" , commentaryRouter)

const { broadcastMatchCreated, broadcastCommentary } = attachWebSocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated;
app.locals.broadcastCommentary = broadcastCommentary;

server.listen(PORT , HOST , () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`

  console.log(`The server is running on http://localhost:${PORT}`)
  console.log(`Websocket server is running on ${baseUrl.replace('http' , 'ws')}/ws`)
})