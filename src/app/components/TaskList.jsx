// app/components/TaskList.jsx
"use client";

import TaskItem from "./TaskItem";

export default function TaskList({ tasks = [], onEdit, onDelete, toggleStatus }) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">Chưa có công việc nào. Hãy thêm công việc đầu tiên!</div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onEdit={onEdit} onDelete={onDelete} toggleStatus={toggleStatus} />
      ))}
    </div>
  );
}
