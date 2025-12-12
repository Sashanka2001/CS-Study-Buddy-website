// src/components/Notes.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/notes";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchNotes = async () => {
    const res = await axios.get(API_URL);
    setNotes(res.data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async () => {
    if (!noteText.trim()) return;
    await axios.post(API_URL, { note: noteText });
    setNoteText("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchNotes();
  };

  const startEditing = (note) => {
    setEditId(note.id);
    setEditText(note.note);
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    await axios.put(`${API_URL}/${id}`, { note: editText });
    setEditId(null);
    setEditText("");
    fetchNotes();
  };

  return (
    <section className="panel">
      <h2 className="panel-title">Notes 📚</h2>
      <div className="form-grid">
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write your note here..."
          className="text-area"
        />
        <button onClick={addNote} className="primary">
          Add Note
        </button>
      </div>

      <ul className="item-list">
        {notes.map((n) => (
          <li key={n.id} className="item">
            {editId === n.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="text-area"
                  rows={3}
                />
                <div className="button-group">
                  <button onClick={() => saveEdit(n.id)} className="primary">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="secondary">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="item-text">{n.note}</span>
                <div className="button-group">
                  <button onClick={() => startEditing(n)} className="secondary">
                    Edit
                  </button>
                  <button onClick={() => deleteNote(n.id)} className="danger">
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

export default Notes;
