 // src/components/TodoList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");

  // Fetch existing todos
  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Add new todo
  const handleAddTodo = async () => {
    if (!task.trim()) return;
    await axios.post(API_URL, { task });
    setTask("");
    fetchTodos();
  };

  // Start editing a todo
  const startEditing = (todo) => {
    setEditId(todo.id);
    setEditTask(todo.task);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditId(null);
    setEditTask("");
  };

  // Save edited todo
  const saveEdit = async (id) => {
    if (!editTask.trim()) return;
    await axios.put(`${API_URL}/${id}`, { task: editTask });
    setEditId(null);
    setEditTask("");
    fetchTodos();
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  return (
    <div>
      <h2>Todo List🧾</h2>
      <input
        type="text"
        value={task}
        placeholder="Enter a task"
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={handleAddTodo}>Add Task</button>

      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {editId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                {todo.task}{" "}
                <button onClick={() => startEditing(todo)}>Edit</button>{" "}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  style={{ color: "red" }}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
