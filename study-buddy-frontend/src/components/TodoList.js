// src/components/TodoList.js
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";
const LISTS_API_URL = "http://localhost:5000/api/lists";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [lists, setLists] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const [selectedListId, setSelectedListId] = useState(null);
  const [newListName, setNewListName] = useState("");
  const [isCreatingList, setIsCreatingList] = useState(false);

  // Fetch existing todos from the API
  const fetchTodos = async (listId = selectedListId) => {
    if (!listId) {
      setTodos([]);
      return;
    }
    const res = await axios.get(`${API_URL}?listId=${listId}`);
    setTodos(res.data);
  };

  const fetchLists = async () => {
    const res = await axios.get(LISTS_API_URL);
    setLists(res.data);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const requestedListId = useMemo(() => {
    const value = params.listId ? Number(params.listId) : null;
    return Number.isFinite(value) ? value : null;
  }, [params.listId]);

  useEffect(() => {
    if (!lists.length) {
      setSelectedListId(null);
      return;
    }

    if (requestedListId && lists.some((list) => list.id === requestedListId)) {
      setSelectedListId(requestedListId);
      return;
    }

    const defaultId = lists[0].id;
    setSelectedListId(defaultId);
    if (!requestedListId) {
      navigate(`/todos/${defaultId}`, { replace: true });
    }
  }, [lists, requestedListId, navigate]);

  useEffect(() => {
    if (selectedListId) {
      fetchTodos(selectedListId);
    }
  }, [selectedListId]);

  const handleAddTodo = async () => {
    if (!task.trim()) return;
    if (!selectedListId) {
      return;
    }
    await axios.post(API_URL, { task, completed: false, listId: selectedListId });
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

  const toggleCompleted = async (todo) => {
    await axios.put(`${API_URL}/${todo.id}`, {
      task: todo.task,
      completed: !todo.completed,
      listId: todo.listId ?? selectedListId,
    });
    if (editId === todo.id) {
      cancelEditing();
    }
    fetchTodos();
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      return;
    }
    const res = await axios.post(LISTS_API_URL, { name: newListName });
    setNewListName("");
    setIsCreatingList(false);
    await fetchLists();
    setSelectedListId(res.data.id);
    navigate(`/todos/${res.data.id}`);
  };

  const handleSelectList = (listId) => {
    setSelectedListId(listId);
    setEditId(null);
    navigate(`/todos/${listId}`);
  };

  const activeTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  const renderTodoItem = (todo) => (
    <li key={todo.id} className={`item${todo.completed ? " item-completed" : ""}`}>
      <div className="item-primary">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.completed}
          onChange={() => toggleCompleted(todo)}
        />
        {editId === todo.id ? (
          <input
            type="text"
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
            className="text-input"
          />
        ) : (
          <span className="item-text">{todo.task}</span>
        )}
      </div>

      <div className="button-group">
        {editId === todo.id ? (
          <>
            <button onClick={() => saveEdit(todo.id)} className="primary">
              Save
            </button>
            <button onClick={cancelEditing} className="secondary">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => startEditing(todo)} className="secondary">
              Edit
            </button>
            <button onClick={() => deleteTodo(todo.id)} className="danger">
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );

  return (
    <section className="todo-layout">
      <aside className="todo-lists-panel">
        <div className="todo-lists-header">
          <h2>Lists</h2>
          <button
            className="primary"
            onClick={() => setIsCreatingList((prev) => !prev)}
          >
            + New List
          </button>
        </div>
        {isCreatingList && (
          <div className="todo-new-list">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="List name"
              className="text-input"
            />
            <div className="button-group">
              <button className="primary" onClick={handleCreateList}>
                Save
              </button>
              <button
                className="secondary"
                onClick={() => {
                  setIsCreatingList(false);
                  setNewListName("");
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <ul className="todo-lists">
          {lists.map((list) => (
            <li
              key={list.id}
              className={
                selectedListId === list.id ? "todo-list-item active" : "todo-list-item"
              }
              onClick={() => handleSelectList(list.id)}
            >
              {list.name}
            </li>
          ))}
          {!lists.length && <li className="todo-empty">Create a list to get started.</li>}
        </ul>
      </aside>

      <section className="panel todo-content">
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

      <div className="todo-section">
        <h3>Active Tasks</h3>
        {activeTodos.length ? (
          <ul className="item-list">{activeTodos.map(renderTodoItem)}</ul>
        ) : (
          <p className="todo-empty">No active tasks right now.</p>
        )}
      </div>

      <div className="todo-section">
        <h3>Completed</h3>
        {completedTodos.length ? (
          <ul className="item-list todo-completed-list">{completedTodos.map(renderTodoItem)}</ul>
        ) : (
          <p className="todo-empty">Finish tasks to see them appear here.</p>
        )}
        </div>
      </section>
    </section>
  );
};

export default TodoList;
