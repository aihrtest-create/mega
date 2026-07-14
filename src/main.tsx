import { createRoot } from "react-dom/client";
import React, { useEffect, useState } from "react";
import App from "./app/App.tsx";
import "./styles/index.css";

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3002' : '');

function ShortLinkResolver({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shortId = params.get('id');

    // Only resolve if id is present and we don't already have lead in the URL
    // (If both are present, we'll just let the app handle it, but normally it shouldn't happen)
    if (shortId && !params.get('lead')) {
      setLoading(true);
      fetch(`${API_BASE}/api/shorten?id=${encodeURIComponent(shortId)}`)
        .then(res => {
          if (!res.ok) throw new Error("Short link not found or expired");
          return res.json();
        })
        .then(data => {
          if (data.leadId) {
            // Replace the URL to include lead and sig instead of id
            const newUrl = new URL(window.location.href);
            newUrl.searchParams.delete('id');
            newUrl.searchParams.set('lead', data.leadId);
            if (data.sig) {
              newUrl.searchParams.set('sig', data.sig);
            }
            window.history.replaceState({}, '', newUrl.toString());
          }
        })
        .catch(err => {
          console.error(err);
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans p-6 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Ссылка не найдена</h1>
          <p className="text-gray-400">Возможно, срок действия ссылки истек или она неверна.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-sans p-6">
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-emerald-400 font-medium tracking-wide">Загрузка...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

createRoot(document.getElementById("root")!).render(
  <ShortLinkResolver>
    <App />
  </ShortLinkResolver>
);