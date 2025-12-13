import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/todos';
const LISTS_API_URL = 'http://localhost:5000/api/lists';

const ListDetail = () => {
  const { listId } = useParams();
  const navigate = useNavigate();
  const numericListId = Number(listId);

  const [list, setList] = useState(null);
  const [listName, setListName] = useState('');
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editId, setEditId] = useState(null);
  const [editTask, setEditTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [renaming, setRenaming] = useState(false);

  const fetchList = async (id, showLoading = false) => {
    if (showLoading) {
      setLoading(true);
    }
    try {
      const [listsRes, todosRes] = await Promise.all([
        axios.get(LISTS_API_URL),
        axios.get(`${API_URL}?listId=${id}`),
      ]);

      const found = listsRes.data.find((item) => item.id === id);
      if (!found) {
        setError('List not found.');
        setList(null);
        setTodos([]);
        return;
      }

      setList(found);
      setListName(found.name);
      setTodos(todosRes.data);
      setError('');
    } catch (err) {
      setError('Unable to load this list right now.');
      setList(null);
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!Number.isFinite(numericListId)) {
      setError('Invalid list identifier.');
      setLoading(false);
      return;
    }
    fetchList(numericListId, true);
  }, [numericListId]);

  const handleAddTodo = async () => {
    if (!task.trim() || !list) {
      return;
    }
    await axios.post(API_URL, {
      task,
      completed: false,
      listId: list.id,
    });
    setTask('');
    await fetchList(list.id);
  };

  const startEditing = (todo) => {
    setEditId(todo.id);
    setEditTask(todo.task);
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditTask('');
  };

  const saveEdit = async (id) => {
    if (!editTask.trim()) {
      return;
    }
    await axios.put(`${API_URL}/${id}`, { task: editTask });
    cancelEditing();
    await fetchList(list.id);
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    await fetchList(list.id);
  };

  const toggleCompleted = async (todo) => {
    await axios.put(`${API_URL}/${todo.id}`, {
      task: todo.task,
      completed: !todo.completed,
      listId: todo.listId ?? list.id,
    });
    if (editId === todo.id) {
      cancelEditing();
    }
    await fetchList(list.id);
  };

  const submitRename = async () => {
    const trimmed = listName.trim();
    if (!list || !trimmed) {
      setListName(list ? list.name : '');
      setRenaming(false);
      return;
    }
    await axios.put(`${LISTS_API_URL}/${list.id}`, { name: trimmed });
    setRenaming(false);
    await fetchList(list.id);
  };

  const activeTodos = useMemo(
    () => todos.filter((todo) => !todo.completed),
    [todos]
  );

  const completedTodos = useMemo(
    () => todos.filter((todo) => todo.completed),
    [todos]
  );

  const renderTodoItem = (todo) => (
    <li key={todo.id} className={`item${todo.completed ? ' item-completed' : ''}`}>
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
    <section className="list-detail-wrapper">
      <div className="list-detail-nav">
        <button className="secondary" onClick={() => navigate('/lists')}>
          ← Back to Lists
        </button>
      </div>

      <section className="panel list-detail">
        {loading ? (
          <p className="todo-empty">Loading list…</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : (
          <>
            <div className="list-detail-header">
              {renaming ? (
                <input
                  type="text"
                  value={listName}
                  onChange={(e) => setListName(e.target.value)}
                  onBlur={submitRename}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      submitRename();
                    }
                    if (e.key === 'Escape') {
                      setListName(list.name);
                      setRenaming(false);
                    }
                  }}
                  className="text-input"
                />
              ) : (
                <h2 className="panel-title">{list.name} To Do List 🧾</h2>
              )}
              {!renaming && (
                <button className="secondary" onClick={() => setRenaming(true)}>
                  Rename
                </button>
              )}
            </div>

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
                <ul className="item-list todo-completed-list">
                  {completedTodos.map(renderTodoItem)}
                </ul>
              ) : (
                <p className="todo-empty">Finish tasks to see them appear here.</p>
              )}
            </div>
          </>
        )}
      </section>
    </section>
  );
};

export default ListDetail;
