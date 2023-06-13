import express, { Request, Response } from "express";
import cors from "cors";

import { getGameOutcome } from "./helpers";

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.post("/spin", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  const result = getGameOutcome();
  res.send(JSON.stringify(result));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
