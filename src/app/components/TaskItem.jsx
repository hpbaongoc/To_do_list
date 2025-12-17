"use client";

export default function TaskItem({ task, onEdit, onDelete, toggleStatus }) {
  return (
    <div
      className="
        p-5 rounded-2xl 
        bg-white/40 dark:bg-gray-900/30 
        backdrop-blur-lg 
        border border-white/20 dark:border-gray-700/40
        shadow-lg hover:shadow-2xl 
        transition-all hover:scale-[1.01]
        flex flex-col gap-3
      "
    >
      <div className="flex justify-between">
        <h3 className={`text-lg font-semibold ${task.status === "completed" ? "line-through opacity-50" : ""}`}>
          {task.text}
        </h3>

        <button
          onClick={() => toggleStatus(task.id)}
          className="text-sm px-3 py-1 rounded-lg bg-purple-200 dark:bg-purple-700 text-purple-800 dark:text-purple-100 hover:opacity-80 transition"
        >
          {task.status === "completed" ? "Khôi phục" : "Hoàn thành"}
        </button>
      </div>

      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Deadline: {new Date(task.deadline).toLocaleString("vi-VN")}
      </p>

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => onEdit(task)}
          className="flex-1 py-2 rounded-xl bg-blue-500 text-white hover:opacity-90 transition"
        >
          Sửa
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="flex-1 py-2 rounded-xl bg-red-500 text-white hover:opacity-90 transition"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}
