// app/components/AddTaskForm.jsx
"use client";

import { useState } from "react";

export default function AddTaskForm({ addTask, primaryColor = "#6d28d9" }) {
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    addTask(title.trim(), deadline);
    setTitle("");
    setDeadline("");
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-md border border-white/10 shadow">
      <h2 className="text-xl font-bold mb-4" style={{ color: primaryColor }}>Thêm Công Việc</h2>

      <input
        type="text"
        placeholder="Tiêu đề công việc"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-4 py-3 rounded-lg mb-3 bg-white/70 dark:bg-gray-800/60 border"
        required
      />

      <input
        type="datetime-local"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full px-4 py-3 rounded-lg mb-4 bg-white/70 dark:bg-gray-800/60 border"
      />

      <button type="submit" className="w-full py-3 rounded-lg text-white font-semibold" style={{ background: primaryColor }}>
        Thêm Công Việc
      </button>
    </form>
  );
}
