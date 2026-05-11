import express from "express"
import { MatchRouter } from "./routes/matches.js";
import http from "http"
import { attachWebsocketServer } from "./ws/server.js";
import { log } from "console";

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0"

const app = express();
const server = http.createServer(app);


app.use(express.json());

app.get("/" , (req , res) => {
   res.send("hello from express server")
})

app.use("/matches" , MatchRouter)

const { broadcastMatchCreated } = attachWebsocketServer(server);
app.locals.broadcastMatchCreated = broadcastMatchCreated

app.listen(PORT , HOST , () => {
  const baseUrl = HOST === '0.0.0.0' ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`

  console.log(`The server is running on http://localhost:${PORT}`)
  console.log(`Websocket server is running on ${baseUrl.replace('http' , 'ws')}/ws`)
})