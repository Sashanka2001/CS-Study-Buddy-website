 // src/components/Schedule.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/schedule";

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");

  const fetchEvents = async () => {
    const res = await axios.get(API_URL);
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async () => {
    if (!title.trim() || !time.trim()) return;
    await axios.post(API_URL, { title, time });
    setTitle("");
    setTime("");
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchEvents();
  };

  const startEditing = (event) => {
    setEditId(event.id);
    setEditTitle(event.title);
    setEditTime(event.time);
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditTitle("");
    setEditTime("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim() || !editTime.trim()) return;
    await axios.put(`${API_URL}/${id}`, { title: editTitle, time: editTime });
    setEditId(null);
    setEditTitle("");
    setEditTime("");
    fetchEvents();
  };

  return (
    <div>
      <h2>Schedule 📑 </h2>
      <input
        type="text"
        placeholder="Event Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Event Time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
      />
      <button onClick={addEvent}>Add Event</button>

      <ul>
        {events.map((ev) => (
          <li key={ev.id}>
            {editId === ev.id ? (
              <>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  type="text"
                  value={editTime}
                  onChange={(e) => setEditTime(e.target.value)}
                />
                <button onClick={() => saveEdit(ev.id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </>
            ) : (
              <>
                <strong>{ev.title}</strong> — {ev.time}{" "}
                <button onClick={() => startEditing(ev)}>Edit</button>{" "}
                <button
                  onClick={() => deleteEvent(ev.id)}
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

export default Schedule;
