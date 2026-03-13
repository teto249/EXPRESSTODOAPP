export const getAllTodosQuery = "SELECT * FROM todo";

export const createTodoQuery =
  "INSERT INTO todo (description, completed) VALUES ($1, $2) RETURNING *";

export const getTodoByIdQuery = "SELECT * FROM todo WHERE todo_id = $1";

export const updateTodoQuery = "UPDATE todo SET description = $1, completed = $2 WHERE todo_id = $3 RETURNING *";

export const deleteTodoQuery = "DELETE FROM todo WHERE todo_id = $1 RETURNING *";

