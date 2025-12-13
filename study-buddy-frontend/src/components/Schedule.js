// src/components/Schedule.js
import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import lottieWeb from "lottie-web";
import catAnimation from "../assets/cat.json";

const API_URL = "http://localhost:5000/api/schedule";

const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const parseDateKey = (key) => {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const Schedule = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState(() => formatDateKey(new Date()));
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editDate, setEditDate] = useState("");
  const [emoji, setEmoji] = useState("");
  const [editEmoji, setEditEmoji] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()));
  const [monthCursor, setMonthCursor] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const fetchEvents = async () => {
    const res = await axios.get(API_URL);
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const addEvent = async () => {
    const payloadDate = date || selectedDate;
    if (!title.trim() || !time.trim() || !payloadDate) return;
    await axios.post(API_URL, { title, time, date: payloadDate, emoji });
    setTitle("");
    setTime("");
    setEmoji("");
    setDate(selectedDate);
    fetchEvents();
  };

  const eventMap = useMemo(() => {
    return events.reduce((acc, ev) => {
      if (!ev.date) {
        return acc;
      }
      const key = ev.date.slice(0, 10);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(ev);
      return acc;
    }, {});
  }, [events]);

  const monthLabel = useMemo(() => {
    const dateObj = new Date(monthCursor.year, monthCursor.month, 1);
    return dateObj.toLocaleString(undefined, { month: "long", year: "numeric" });
  }, [monthCursor]);

  const todayKey = useMemo(() => formatDateKey(new Date()), []);

  const calendarDays = useMemo(() => {
    const firstOfMonth = new Date(monthCursor.year, monthCursor.month, 1);
    const offset = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(firstOfMonth);
    gridStart.setDate(firstOfMonth.getDate() - offset);

    const days = [];
    for (let index = 0; index < 42; index += 1) {
      const current = new Date(gridStart);
      current.setDate(gridStart.getDate() + index);
      const key = formatDateKey(current);
      days.push({
        key,
        date: current,
        isCurrentMonth: current.getMonth() === monthCursor.month,
        isToday: key === todayKey,
      });
    }
    return days;
  }, [monthCursor, todayKey]);

  const startEditing = (event) => {
    setEditId(event.id);
    setEditTitle(event.title);
    setEditTime(event.time);
    setEditDate(event.date || selectedDate);
    setEditEmoji(event.emoji || "");
  };

  const cancelEditing = () => {
    setEditId(null);
    setEditTitle("");
    setEditTime("");
    setEditDate("");
    setEditEmoji("");
  };

  const saveEdit = async (id) => {
    if (!editTitle.trim() || !editTime.trim() || !editDate) {
      return;
    }

    await axios.put(`${API_URL}/${id}`, {
      title: editTitle,
      time: editTime,
      date: editDate,
      emoji: editEmoji,
    });

    cancelEditing();
    fetchEvents();
  };

  const deleteEvent = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchEvents();
  };

  const setMonthAndSelect = (year, month, day = 1) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const safeDay = Math.min(day, daysInMonth);
    const key = formatDateKey(new Date(year, month, safeDay));
    setMonthCursor({ year, month });
    setSelectedDate(key);
    setDate(key);
  };

  const goToPrevMonth = () => {
    const prevMonth = monthCursor.month - 1;
    const year = prevMonth < 0 ? monthCursor.year - 1 : monthCursor.year;
    const month = (prevMonth + 12) % 12;
    const currentDay = parseDateKey(selectedDate).getDate();
    setMonthAndSelect(year, month, currentDay);
  };

  const goToNextMonth = () => {
    const nextMonth = monthCursor.month + 1;
    const year = nextMonth > 11 ? monthCursor.year + 1 : monthCursor.year;
    const month = nextMonth % 12;
    const currentDay = parseDateKey(selectedDate).getDate();
    setMonthAndSelect(year, month, currentDay);
  };

  const goToCurrentMonth = () => {
    const now = new Date();
    setMonthAndSelect(now.getFullYear(), now.getMonth(), now.getDate());
  };

  const handleSelectDate = (key) => {
    const dateObj = parseDateKey(key);
    setMonthCursor({ year: dateObj.getFullYear(), month: dateObj.getMonth() });
    setSelectedDate(key);
    setDate(key);
  };

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) {
      return "";
    }
    return parseDateKey(selectedDate).toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  }, [selectedDate]);

  const filteredEvents = useMemo(
    () => events.filter((ev) => ev.date === selectedDate),
    [events, selectedDate]
  );

  const mascotRef = useRef(null);

  useEffect(() => {
    if (!mascotRef.current) {
      return undefined;
    }

    const animation = lottieWeb.loadAnimation({
      container: mascotRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: catAnimation,
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <>
      <div
        className="schedule-mascot"
        aria-hidden="true"
        ref={mascotRef}
        style={{ width: 220, height: 220 }}
      />
      <section className="schedule-layout">
        <aside className="panel schedule-sidebar">
          <div className="schedule-calendar">
            <div className="calendar-header">
              <div className="calendar-month">
                <button className="secondary" onClick={goToPrevMonth}>
                  ←
                </button>
                <span className="calendar-title">{monthLabel}</span>
                <button className="secondary" onClick={goToNextMonth}>
                  →
                </button>
              </div>
              <button className="secondary" onClick={goToCurrentMonth}>
                Today
              </button>
            </div>

            <div className="calendar-weekdays">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <span key={day} className="calendar-weekday">
                  {day}
                </span>
              ))}
            </div>

            <div className="calendar-grid">
              {calendarDays.map((day) => {
                const dayEvents = eventMap[day.key] || [];
                const summary = dayEvents.slice(0, 3);
                const overflow = dayEvents.length - summary.length;
                const isSelected = day.key === selectedDate;

                return (
                  <button
                    type="button"
                    key={day.key}
                    onClick={() => handleSelectDate(day.key)}
                    className={`calendar-cell${
                      day.isCurrentMonth ? "" : " calendar-outside"
                    }${day.isToday ? " calendar-today" : ""}${isSelected ? " calendar-selected" : ""}`}
                  >
                    <span className="calendar-date">{day.date.getDate()}</span>
                    <div className="calendar-events">
                      {summary.map((ev) => (
                        <div key={ev.id} className="calendar-event-pill">
                          <span className="calendar-event-emoji">{ev.emoji || "•"}</span>
                          <div className="calendar-event-meta">
                            <span className="calendar-event-title">{ev.title}</span>
                            <span className="calendar-event-time">{ev.time}</span>
                          </div>
                        </div>
                      ))}
                      {overflow > 0 && (
                        <span className="calendar-more">+{overflow} more</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
        <section className="panel schedule-content">
          <h2 className="panel-title">Schedule 📑</h2>
          <p className="schedule-selected-date">{selectedDateLabel}</p>

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
              type="text"
              placeholder="Emoji (optional)"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              className="text-input"
              maxLength={4}
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-input"
            />
            <button className="primary" onClick={addEvent}>
              Add Event
            </button>
          </div>

          <div className="schedule-day-section">
            <h3>Events on {selectedDateLabel || "this day"}</h3>
            {filteredEvents.length ? (
              <ul className="item-list schedule-day-list">
                {filteredEvents.map((ev) => (
                  <li key={`day-${ev.id}`} className="item schedule-day-item">
                    <span className="item-text">
                      {ev.emoji && <span className="schedule-emoji">{ev.emoji}</span>}
                      <strong>{ev.title}</strong> — {ev.time}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="todo-empty">No events scheduled for this date.</p>
            )}
          </div>

          <div className="schedule-all-section">
            <h3>All Events</h3>
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
                          type="text"
                          value={editEmoji}
                          onChange={(e) => setEditEmoji(e.target.value)}
                          className="text-input"
                          maxLength={4}
                        />
                        <input
                          type="date"
                          value={editDate}
                          onChange={(e) => setEditDate(e.target.value)}
                          className="text-input"
                        />
                      </div>
                      <div className="button-group">
                        <button className="primary" onClick={() => saveEdit(ev.id)}>
                          Save
                        </button>
                        <button className="secondary" onClick={cancelEditing}>
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="item-text">
                        {ev.emoji && <span className="schedule-emoji">{ev.emoji}</span>}
                        <strong>{ev.title}</strong> — {ev.time}
                        <br />
                        <small>
                          {ev.date
                            ? parseDateKey(ev.date).toLocaleDateString()
                            : ""}
                        </small>
                      </span>
                      <div className="button-group">
                        <button className="secondary" onClick={() => startEditing(ev)}>
                          Edit
                        </button>
                        <button className="danger" onClick={() => deleteEvent(ev.id)}>
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </section>
    </>
  );
};

export default Schedule;
