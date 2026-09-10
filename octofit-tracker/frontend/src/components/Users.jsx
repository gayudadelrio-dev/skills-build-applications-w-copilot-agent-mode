import { useEffect, useMemo, useState } from 'react';

const apiBase = import.meta.env.VITE_CODESPACE_NAME
  ? `https://${import.meta.env.VITE_CODESPACE_NAME}-8000.app.github.dev/api`
  : 'http://localhost:8000/api';

function normalizePayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function Users() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = useMemo(() => `${apiBase}/users/`, []);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
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
        setError(err.message || 'Unable to load users.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUsers();

    return () => {
      active = false;
    };
  }, [apiUrl]);

  if (loading) return <p className="text-light">Loading users...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card bg-dark text-light border-secondary">
      <div className="card-body">
        <h3 className="card-title">Users</h3>
        <ul className="list-group list-group-flush">
          {items.map((user) => (
            <li key={user._id || user.id || user.username} className="list-group-item bg-dark text-light border-secondary">
              <strong>{user.fullName || user.username}</strong>
              <div className="small text-secondary">{user.email || 'No email'}</div>
              <div className="small text-secondary">Level: {user.fitnessLevel || 'N/A'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
