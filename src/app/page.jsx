// app/page.jsx
"use client";

import { useEffect, useMemo, useState } from "react";
import LoginForm from "./components/LoginForm";
import AddTaskForm from "./components/AddTaskForm";
import EditTaskModal from "./components/EditTaskModal";
import TaskList from "./components/TaskList";
import LoadingOverlay from "./components/LoadingOverlay";

const STORAGE_KEY = "todo_app_tasks_v1";

export default function Page() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI control
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [sortBy, setSortBy] = useState("deadline");

  // Edit modal
  const [editingTask, setEditingTask] = useState(null);

  // load tasks from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setTasks(parsed);
        }
      }
    } catch (e) {
      console.error("Failed to read tasks:", e);
    }
  }, []);

  // save tasks on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error("Failed to save tasks:", e);
    }
  }, [tasks]);

  // Helpers
  const addTask = (taskData) => {
    // taskData: { title, description, priority, deadline, status? }
    const newTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      title: (taskData.title ?? "").trim(),
      description: taskData.description ?? "",
      status: taskData.status ?? "pending",
      priority: taskData.priority ?? "medium",
      deadline: taskData.deadline ?? "",
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (updated) => {
    setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleStatus = (id) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: t.status === "completed" ? "pending" : "completed",
            }
          : t
      )
    );
  };

  const openEditModal = (task) => {
    setEditingTask(task);
  };

  const closeEditModal = () => {
    setEditingTask(null);
  };

  // Filtering / Searching / Sorting
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // search (safe)
    if (searchQuery && searchQuery.trim() !== "") {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((t) => {
        const title = (t.title ?? "").toLowerCase();
        const description = (t.description ?? "").toLowerCase();
        return title.includes(q) || description.includes(q);
      });
    }

    // status filter
    if (filterStatus !== "all") {
      result = result.filter((t) => t.status === filterStatus);
    }

    // priority filter
    if (filterPriority !== "all") {
      result = result.filter((t) => t.priority === filterPriority);
    }

    // sort
    result.sort((a, b) => {
      if (sortBy === "deadline") {
        const da = a.deadline ? new Date(a.deadline) : new Date(8640000000000000); // far future if empty
        const db = b.deadline ? new Date(b.deadline) : new Date(8640000000000000);
        return da - db;
      } else if (sortBy === "priority") {
        const order = { high: 0, medium: 1, low: 2 };
        return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
      } else if (sortBy === "createdAt") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

    return result;
  }, [tasks, searchQuery, filterStatus, filterPriority, sortBy]);

  // simple simulated loading for UX when adding/updating (optional)
  const withLoading = async (fn) => {
    setLoading(true);
    try {
      await new Promise((r) => setTimeout(r, 300)); // tiny delay
      await fn();
    } finally {
      setLoading(false);
    }
  };

  // handle add from form
  const handleAdd = (title, deadline, extra = {}) => {
    // extra can include description, priority, status
    withLoading(() => {
      addTask({
        title,
        deadline,
        description: extra.description ?? "",
        priority: extra.priority ?? "medium",
      });
    });
  };

  const handleUpdate = (updatedTask) => {
    withLoading(() => updateTask(updatedTask));
  };

  const handleDelete = (id) => {
    withLoading(() => deleteTask(id));
  };

  // login handler (simulated)
  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {loading && <LoadingOverlay />}

      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold">Quản Lý Công Việc</h1>
              <p className="text-sm text-gray-500">Chào mừng bạn quay trở lại!</p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsLoggedIn(false)}
                className="px-4 py-2 rounded-lg border hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Đăng xuất
              </button>
            </div>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: add form + stats */}
            <div className="space-y-6 lg:col-span-1">
              <AddTaskForm addTask={(title, deadline) => handleAdd(title, deadline)} primaryColor="#6d28d9" />

              <div className="p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/10 shadow">
                <h3 className="font-semibold mb-3">Thống kê</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-white/40 dark:bg-gray-700/40">
                    <div className="text-sm text-gray-600">Tổng công việc</div>
                    <div className="text-xl font-bold">{tasks.length}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/40 dark:bg-gray-700/40">
                    <div className="text-sm text-gray-600">Hoàn thành</div>
                    <div className="text-xl font-bold">{tasks.filter((t) => t.status === "completed").length}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/40 dark:bg-gray-700/40">
                    <div className="text-sm text-gray-600">Đang làm</div>
                    <div className="text-xl font-bold">{tasks.filter((t) => t.status === "in-progress").length}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-white/40 dark:bg-gray-700/40">
                    <div className="text-sm text-gray-600">Chờ xử lý</div>
                    <div className="text-xl font-bold">{tasks.filter((t) => t.status === "pending").length}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column: filters + list */}
            <div className="lg:col-span-2 space-y-6">
              <div className="p-5 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border border-white/10">
                <div className="flex flex-col lg:flex-row gap-3 items-center">
                  <input
                    type="text"
                    placeholder="🔍 Tìm kiếm công việc..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border bg-white/70 dark:bg-gray-700/70"
                  />

                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-4 py-3 rounded-lg border bg-white/70 dark:bg-gray-700/70">
                    <option value="all">Tất cả trạng thái</option>
                    <option value="pending">Chờ xử lý</option>
                    <option value="in-progress">Đang làm</option>
                    <option value="completed">Hoàn thành</option>
                  </select>

                  <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-4 py-3 rounded-lg border bg-white/70 dark:bg-gray-700/70">
                    <option value="all">Tất cả mức độ</option>
                    <option value="high">Cao</option>
                    <option value="medium">Trung bình</option>
                    <option value="low">Thấp</option>
                  </select>

                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-4 py-3 rounded-lg border bg-white/70 dark:bg-gray-700/70">
                    <option value="deadline">Sắp xếp: Deadline</option>
                    <option value="priority">Sắp xếp: Mức độ</option>
                    <option value="createdAt">Sắp xếp: Mới nhất</option>
                  </select>
                </div>
              </div>

              <TaskList
                tasks={filteredTasks}
                onEdit={(task) => openEditModal(task)}
                onDelete={(id) => handleDelete(id)}
                toggleStatus={(id) => toggleStatus(id)}
              />
            </div>
          </div>

          <div id="modal-root">
            {editingTask && (
              <EditTaskModal
                task={editingTask}
                updateTask={(t) => handleUpdate(t)}
                closeModal={() => closeEditModal()}
                primaryColor="#6d28d9"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
