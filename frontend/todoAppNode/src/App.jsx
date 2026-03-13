import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  FiCheckCircle,
  FiCircle,
  FiEdit2,
  FiPlus,
  FiSave,
  FiTrash2,
  FiX,
} from "react-icons/fi";

const API_URL = "http://localhost:8080/todos";

function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTodos = async () => {
      try {
        setError("");
        const response = await axios.get(API_URL);
        setTodos(response.data);
      } catch (err) {
        setError(err.response?.data?.err || "Failed to load todos.");
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const completedCount = useMemo(
    () => todos.filter((todo) => todo.completed).length,
    [todos],
  );

  const pendingCount = todos.length - completedCount;

  const visibleTodos = useMemo(() => {
    if (filter === "active") return todos.filter((todo) => !todo.completed);
    if (filter === "completed") return todos.filter((todo) => todo.completed);
    return todos;
  }, [filter, todos]);

  const handleAddTodo = async (event) => {
    event.preventDefault();
    const trimmed = description.trim();
    if (!trimmed) return;

    try {
      setError("");
      const response = await axios.post(API_URL, {
        description: trimmed,
        completed: false,
      });
      setTodos((prev) => [...prev, response.data]);
      setDescription("");
    } catch (err) {
      setError(err.response?.data?.err || "Failed to add todo.");
    }
  };

  const toggleTodo = async (id) => {
    const target = todos.find((todo) => todo.todo_id === id);
    if (!target) return;

    try {
      setError("");
      const response = await axios.put(`${API_URL}/${id}`, {
        description: target.description,
        completed: !target.completed,
      });
      setTodos((prev) =>
        prev.map((todo) => (todo.todo_id === id ? response.data : todo)),
      );
    } catch (err) {
      setError(err.response?.data?.err || "Failed to update todo.");
    }
  };

  const removeTodo = async (id) => {
    try {
      setError("");
      await axios.delete(`${API_URL}/${id}`);
      setTodos((prev) => prev.filter((todo) => todo.todo_id !== id));
      if (editingTodo === id) {
        setEditingTodo(null);
        setEditText("");
      }
    } catch (err) {
      setError(err.response?.data?.err || "Failed to delete todo.");
    }
  };

  const startEditing = (todo) => {
    setEditingTodo(todo.todo_id);
    setEditText(todo.description);
  };

  const cancelEdit = () => {
    setEditingTodo(null);
    setEditText("");
  };

  const saveEdit = async () => {
    const trimmed = editText.trim();
    if (!trimmed) return;

    const target = todos.find((todo) => todo.todo_id === editingTodo);
    if (!target) return;

    try {
      setError("");
      const response = await axios.put(`${API_URL}/${editingTodo}`, {
        description: trimmed,
        completed: target.completed,
      });
      setTodos((prev) =>
        prev.map((todo) =>
          todo.todo_id === editingTodo ? response.data : todo,
        ),
      );
      setEditingTodo(null);
      setEditText("");
    } catch (err) {
      setError(err.response?.data?.err || "Failed to save changes.");
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_0%_0%,#1f2937_0%,#0f172a_42%,#020617_100%)] text-slate-100">
      <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <header className="rounded-3xl border border-slate-700/70 bg-slate-900/70 p-6 shadow-2xl shadow-slate-950/30 backdrop-blur md:p-8">
          <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">
            Personal Task Board
          </p>
          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">PERN Todo App</h1>
          <p className="mt-2 text-slate-300">
            Axios-powered UI connected to your Node API.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-cyan-500/40 bg-cyan-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-cyan-200">{todos.length}</p>
              <p className="text-xs uppercase tracking-wide text-cyan-100/80">
                Total
              </p>
            </div>
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-emerald-200">
                {completedCount}
              </p>
              <p className="text-xs uppercase tracking-wide text-emerald-100/80">
                Done
              </p>
            </div>
            <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3 text-center">
              <p className="text-2xl font-bold text-amber-200">
                {pendingCount}
              </p>
              <p className="text-xs uppercase tracking-wide text-amber-100/80">
                Pending
              </p>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-3xl border border-slate-700/70 bg-slate-900/70 p-5 backdrop-blur">
          <form
            onSubmit={handleAddTodo}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add a task..."
              className="w-full rounded-xl border border-slate-600 bg-slate-950/70 px-4 py-3 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-900 transition hover:bg-cyan-300"
            >
              <FiPlus size={18} />
              Add
            </button>
          </form>

          <div className="mt-4 flex gap-2">
            {[
              { key: "all", label: "All" },
              { key: "active", label: "Active" },
              { key: "completed", label: "Completed" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setFilter(item.key)}
                className={`rounded-lg px-3 py-1.5 text-sm transition ${
                  filter === item.key
                    ? "bg-slate-100 text-slate-900"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          )}
        </section>

        <section className="mt-6 space-y-3">
          {loading && (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 text-center text-slate-400">
              Loading todos...
            </div>
          )}

          {!loading && visibleTodos.length === 0 && (
            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-6 text-center text-slate-400">
              No tasks in this filter yet.
            </div>
          )}

          {visibleTodos.map((todo) => (
            <article
              key={todo.todo_id}
              className="flex items-start gap-3 rounded-2xl border border-slate-700/60 bg-slate-900/70 p-4"
            >
              <button
                type="button"
                onClick={() => toggleTodo(todo.todo_id)}
                className="pt-1 text-slate-300 transition hover:text-emerald-300"
                aria-label="Toggle completion"
              >
                {todo.completed ? (
                  <FiCheckCircle size={22} />
                ) : (
                  <FiCircle size={22} />
                )}
              </button>

              <div className="min-w-0 flex-1">
                {editingTodo === todo.todo_id ? (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      className="w-full rounded-lg border border-slate-600 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-400 transition focus:ring-2"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={saveEdit}
                        className="inline-flex items-center gap-1 rounded-lg bg-emerald-400 px-3 py-2 text-sm font-medium text-slate-900"
                      >
                        <FiSave size={14} />
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1 rounded-lg bg-slate-700 px-3 py-2 text-sm font-medium text-slate-100"
                      >
                        <FiX size={14} />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h2
                      className={`truncate text-base font-medium ${
                        todo.completed
                          ? "text-slate-500 line-through"
                          : "text-slate-100"
                      }`}
                    >
                      {todo.description}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Status: {todo.completed ? "Completed" : "Pending"}
                    </p>
                  </>
                )}
              </div>

              {editingTodo !== todo.todo_id && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(todo)}
                    className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-cyan-300"
                    aria-label="Edit task"
                  >
                    <FiEdit2 size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeTodo(todo.todo_id)}
                    className="rounded-lg p-2 text-slate-300 transition hover:bg-slate-800 hover:text-rose-300"
                    aria-label="Delete task"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              )}
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

export default App;
