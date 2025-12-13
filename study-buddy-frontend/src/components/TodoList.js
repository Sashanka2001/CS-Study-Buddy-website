// src/components/TodoList.js
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/todos";
const LISTS_API_URL = "http://localhost:5000/api/lists";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState("");
  const [lists, setLists] = useState([]);
  const [selectedListId, setSelectedListId] = useState(null);
  const [editingListId, setEditingListId] = useState(null);
  const [editingListName, setEditingListName] = useState("");
  const [editingOriginalName, setEditingOriginalName] = useState("");
  const editInputRef = useRef(null);

  // Fetch existing todos from the API
  const fetchTodos = useCallback(
    async (listIdParam) => {
      const targetId = listIdParam ?? selectedListId;
      if (!targetId) {
        setTodos([]);
        return;
      }
      const res = await axios.get(`${API_URL}?listId=${targetId}`);
      setTodos(res.data);
    },
    [selectedListId]
  );

  const fetchLists = async () => {
    const res = await axios.get(LISTS_API_URL);
    setLists(res.data);
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const activeList = useMemo(
    () => lists.find((list) => list.id === selectedListId) || null,
    [lists, selectedListId]
  );

  useEffect(() => {
    if (!lists.length) {
      setSelectedListId(null);
      return;
    }

    if (!selectedListId || !lists.some((list) => list.id === selectedListId)) {
      setSelectedListId(lists[0].id);
    }
  }, [lists, selectedListId]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

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

  const beginEditingList = (list) => {
    setEditingListId(list.id);
    setEditingListName(list.name);
    setEditingOriginalName(list.name);
  };

  const cancelEditingList = () => {
    setEditingListId(null);
    setEditingListName("");
    setEditingOriginalName("");
  };

  const handleCreateList = async () => {
    const defaultName = "Untitled list";
    const res = await axios.post(LISTS_API_URL, { name: defaultName });
    await fetchLists();
    setSelectedListId(res.data.id);
    beginEditingList({ id: res.data.id, name: defaultName });
  };

  const handleSelectList = (listId) => {
    setSelectedListId(listId);
    setEditId(null);
  };

  const submitListRename = async () => {
    if (!editingListId) {
      return;
    }
    const trimmed = editingListName.trim();
    if (!trimmed) {
      setEditingListName(editingOriginalName);
      cancelEditingList();
      return;
    }
    await axios.put(`${LISTS_API_URL}/${editingListId}`, { name: trimmed });
    await fetchLists();
    cancelEditingList();
  };

  useEffect(() => {
    if (editingListId && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingListId, lists]);

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
          <button className="primary" onClick={handleCreateList}>
            + New List
          </button>
        </div>
        <ul className="todo-lists">
          {lists.map((list) => (
            <li
              key={list.id}
              className={
                selectedListId === list.id ? "todo-list-item active" : "todo-list-item"
              }
              onClick={() => handleSelectList(list.id)}
              onDoubleClick={() => beginEditingList(list)}
            >
              {editingListId === list.id ? (
                <input
                  ref={editInputRef}
                  type="text"
                  value={editingListName}
                  onChange={(e) => setEditingListName(e.target.value)}
                  onBlur={submitListRename}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submitListRename();
                    }
                    if (e.key === "Escape") {
                      cancelEditingList();
                    }
                  }}
                  className="text-input compact"
                />
              ) : (
                list.name
              )}
            </li>
          ))}
          {!lists.length && <li className="todo-empty">Create a list to get started.</li>}
        </ul>
      </aside>

      <section className="panel todo-content">
        <h2 className="panel-title">
          {activeList ? `${activeList.name} To Do List` : "Todo List"} 🧾
        </h2>
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
