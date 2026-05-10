import express from "express"
import { MatchRouter } from "./routes/matches.js";

const port = 8000;

const app = express();

app.use(express.json());

app.get("/" , (req , res) => {
   res.send("hello from express server")
})

app.use("/matches" , MatchRouter)

app.listen(port , () => {
  console.log(`The server is running on http://localhost:${port}`)
})