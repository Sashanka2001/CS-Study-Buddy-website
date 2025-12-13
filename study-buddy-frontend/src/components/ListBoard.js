import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LISTS_API_URL = 'http://localhost:5000/api/lists';

const ListBoard = () => {
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchLists = async () => {
    setLoading(true);
    try {
      const res = await axios.get(LISTS_API_URL);
      setLists(res.data);
      setError('');
    } catch (err) {
      setError('Unable to load lists right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      return;
    }

    try {
      const res = await axios.post(LISTS_API_URL, { name: newListName });
      setNewListName('');
      await fetchLists();
      navigate(`/lists/${res.data.id}`);
    } catch (err) {
      setError('Could not create list. Try again.');
    }
  };

  const handleDeleteList = async (id) => {
    try {
      await axios.delete(`${LISTS_API_URL}/${id}`);
      await fetchLists();
    } catch (err) {
      setError('Could not delete list.');
    }
  };

  return (
    <section className="panel list-board">
      <h2 className="panel-title">Your Lists</h2>
      <div className="form-grid">
        <input
          type="text"
          value={newListName}
          placeholder="Give your list a name"
          onChange={(e) => setNewListName(e.target.value)}
          className="text-input"
        />
        <button onClick={handleCreateList} className="primary">
          + New List
        </button>
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <p className="todo-empty">Loading lists…</p>
      ) : lists.length ? (
        <ul className="item-list list-board-items">
          {lists.map((list) => (
            <li key={list.id} className="item">
              <span className="item-text">{list.name}</span>
              <div className="button-group">
                <button
                  className="secondary"
                  onClick={() => navigate(`/lists/${list.id}`)}
                >
                  Open
                </button>
                <button className="danger" onClick={() => handleDeleteList(list.id)}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="todo-empty">Create your first list to begin organising tasks.</p>
      )}
    </section>
  );
};

export default ListBoard;
