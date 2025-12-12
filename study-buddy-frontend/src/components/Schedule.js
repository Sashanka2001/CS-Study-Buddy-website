// src/components/Schedule.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/schedule";

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDate, setEditDate] = useState("");

  const fetchEvents = async () => {
    const res = await axios.get(API_URL);
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async () => {
    if (!title.trim() || !time.trim() || !date) return;
    await axios.post(API_URL, { title, time, date });
    setTitle("");
    setTime("");
    setDate("");
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
    setEditDate(event.date || "");
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditTitle("");
    setEditTime("");
    setEditDate("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim() || !editTime.trim() || !editDate) return;
    await axios.put(`${API_URL}/${id}`, {
      title: editTitle,
      time: editTime,
      date: editDate,
    });
    setEditId(null);
    setEditTitle("");
    setEditTime("");
    setEditDate("");
    fetchEvents();
  };

  return (
    <section className="panel">
      <h2 className="panel-title">Schedule 📑</h2>
      <div className="form-grid">
        <input
          type="text"
          placeholder="Event Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-input"
        />
        <input
          type="text"
          placeholder="Event Time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="text-input"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-input"
        />
        <button onClick={addEvent} className="primary">
          Add Event
        </button>
      </div>

      <ul className="item-list">
        {events.map((ev) => (
          <li key={ev.id} className="item">
            {editId === ev.id ? (
              <>
                <div className="form-grid compact">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-input"
                  />
                  <input
                    type="text"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="text-input"
                  />
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    className="text-input"
                  />
                </div>
                <div className="button-group">
                  <button onClick={() => saveEdit(ev.id)} className="primary">
                    Save
                  </button>
                  <button onClick={cancelEditing} className="secondary">
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <span className="item-text">
                  <strong>{ev.title}</strong> — {ev.time}
                  <br />
                  <small>{ev.date ? new Date(ev.date).toLocaleDateString() : ""}</small>
                </span>
                <div className="button-group">
                  <button onClick={() => startEditing(ev)} className="secondary">
                    Edit
                  </button>
                  <button onClick={() => deleteEvent(ev.id)} className="danger">
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

export default Schedule;
