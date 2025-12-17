// app/components/EditTaskModal.jsx
"use client";

import { useEffect, useState } from "react";

export default function EditTaskModal({ task, updateTask, closeModal, primaryColor = "#6d28d9" }) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [deadline, setDeadline] = useState(task?.deadline ? task.deadline.slice(0, 16) : "");
  const [status, setStatus] = useState(task?.status ?? "pending");
  const [priority, setPriority] = useState(task?.priority ?? "medium");

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setDeadline(task?.deadline ? task.deadline.slice(0, 16) : "");
    setStatus(task?.status ?? "pending");
    setPriority(task?.priority ?? "medium");
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...task,
      title: title.trim(),
      description,
      status,
      priority,
      deadline: deadline ? new Date(deadline).toISOString() : "",
    };
    updateTask(updated);
    closeModal();
  };

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
      <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-6 rounded-2xl w-full max-w-lg border" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-2xl font-bold mb-4" style={{ color: primaryColor }}>Chỉnh Sửa Công Việc</h3>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block mb-1 text-sm">Tiêu đề</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-gray-800/60" required />
          </div>

          <div>
            <label className="block mb-1 text-sm">Mô tả</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-gray-800/60" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block mb-1 text-sm">Trạng thái</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-gray-800/60">
                <option value="pending">Chờ xử lý</option>
                <option value="in-progress">Đang làm</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 text-sm">Mức độ</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-gray-800/60">
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1 text-sm">Deadline</label>
            <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="w-full px-3 py-2 rounded-lg border bg-white/80 dark:bg-gray-800/60" />
          </div>

          <div className="flex gap-3 mt-4">
            <button type="button" onClick={closeModal} className="flex-1 py-2 rounded-lg border">Hủy</button>
            <button type="submit" className="flex-1 py-2 rounded-lg text-white" style={{ background: primaryColor }}>Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}
