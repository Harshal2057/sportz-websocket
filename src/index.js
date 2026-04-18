import express from "express"

const port = 8000;

const app = express();

app.use(express.json());

app.get("/" , (req , res) => {
   res.send("hello from express server")
})

app.listen(port , () => {
  console.log(`The server is running on http://localhost:${port}`)
})