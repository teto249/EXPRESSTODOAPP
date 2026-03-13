import { Router } from "express";
import {
  getAllTodosQuery,
  createTodoQuery,
  updateTodoQuery,
  deleteTodoQuery,
  getTodoByIdQuery,
} from "../queries.js/queries.js";
import pool from "../db.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { description, completed } = req.body;
    if (
      !description ||
      description.trim() === 0 ||
      typeof description !== "string"
    ) {
      return res.status(400).json({ err: "Description is required" });
    }
    if (typeof completed !== "boolean") {
      return res.status(400).json({ err: "Completed must be a boolean" });
    }

    const newTodo = await pool.query(createTodoQuery, [
      description,
      completed || false,
    ]);
    res.status(201).json(newTodo.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal server error" });
  }
});
// Get all todos
router.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query(getAllTodosQuery);
    res.status(200).json(allTodos.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal server error" });
  }
});

//update a todo

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
    const todo = await pool.query(getTodoByIdQuery, [id]);
    if (todo.rows.length === 0) {
      return res.status(404).json({ err: "Todo not found" });
    }
    if (
      !description ||
      description.trim() === 0 ||
      typeof description !== "string"
    ) {
      return res.status(400).json({ err: "Description is required" });
    }
    if (typeof completed !== "boolean") {
      return res.status(400).json({ err: "Completed must be a boolean" });
    }
    const updateTodo = await pool.query(updateTodoQuery, [
      description,
      completed,
      id,
    ]);
    res.status(200).json(updateTodo.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query(deleteTodoQuery, [id]);
    res.status(200).json(deleteTodo.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Internal server error" });
  }
});

export default router;
