// src/components/TodoList.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");

  // Fetch existing todos from the API
  const fetchTodos = async () => {
    const res = await axios.get(API_URL);
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async () => {
    if (!task.trim()) return;
    await axios.post(API_URL, { task });
    setTask("");
    fetchTodos();
  };

  const startEditing = (todo) => {
    setEditId(todo.id);
    setEditTask(todo.task);
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditTask("");
  };

  const saveEdit = async (id) => {
    if (!editTask.trim()) return;
    await axios.put(`${API_URL}/${id}`, { task: editTask });
    setEditId(null);
    setEditTask("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTodos();
  };

  return (
    <section className="panel">
      <h2 className="panel-title">Todo List 🧾</h2>
      <div className="form-grid">
        <input
          type="text"
          value={task}
          placeholder="Enter a task"
          onChange={(e) => setTask(e.target.value)}
          className="text-input"
        />
        <button onClick={handleAddTodo} className="primary">
          Add Task
        </button>
      </div>

      <ul className="item-list">
        {todos.map((todo) => (
          <li key={todo.id} className="item">
            {editId === todo.id ? (
              <>
                <input
                  type="text"
                  value={editTask}
                  onChange={(e) => setEditTask(e.target.value)}
                  className="text-input"
                />
                <div className="button-group">
                  <button onClick={() => saveEdit(todo.id)} className="primary">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="secondary">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="item-text">{todo.task}</span>
                <div className="button-group">
                  <button onClick={() => startEditing(todo)} className="secondary">
                    Edit
                  </button>
                  <button onClick={() => deleteTodo(todo.id)} className="danger">
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TodoList;
