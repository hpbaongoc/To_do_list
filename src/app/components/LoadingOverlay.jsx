// app/components/LoadingOverlay.jsx
"use client";

export default function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="p-6 rounded-2xl bg-white/30 dark:bg-gray-800/30 border shadow-lg">
        <div className="h-10 w-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}
