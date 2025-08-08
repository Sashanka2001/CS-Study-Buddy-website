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
    <div>
      <h2>Notes 📚</h2>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Write your note here..."
      />
      <br />
      <button onClick={addNote}>Add Note</button>

      <ul>
        {notes.map((n) => (
          <li key={n.id}>
            {editId === n.id ? (
              <>
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={3}
                  cols={40}
                />
                <br />
                <button onClick={() => saveEdit(n.id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                {n.note}{" "}
                <button onClick={() => startEditing(n)}>Edit</button>{" "}
                <button
                  onClick={() => deleteNote(n.id)}
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

export default Notes;
