import { useEffect, useMemo, useState } from 'react';

const apiUrl = import.meta.env.VITE_CODESPACE_NAME && import.meta.env.VITE_CODESPACE_NAME.trim() !== ''
  ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/leaderboard`
  : 'http://localhost:8000/api/leaderboard';

function normalizePayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function Leaderboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadLeaderboard() {
      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const payload = await response.json();
        if (!active) return;
        setItems(normalizePayload(payload));
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load leaderboard.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadLeaderboard();

    return () => {
      active = false;
    };
  }, [apiUrl]);

  if (loading) return <p className="text-light">Loading leaderboard...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card bg-dark text-light border-secondary">
      <div className="card-body">
        <h3 className="card-title">Leaderboard</h3>
        <ul className="list-group list-group-flush">
          {items.map((entry) => (
            <li key={entry._id || entry.id || entry.username} className="list-group-item bg-dark text-light border-secondary">
              <strong>#{entry.rank || 1} - {entry.username}</strong>
              <div className="small text-secondary">Score: {entry.score || 0}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
