import express from "express";
import cors from "cors";
import todoRoutes from "./routes/todos.js";
const app = express();

app.use(cors());
app.use(express.json());

app.use("/todos", todoRoutes);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
