import { useEffect, useMemo, useState } from 'react';

const apiUrl = import.meta.env.VITE_CODESPACE_NAME && import.meta.env.VITE_CODESPACE_NAME.trim() !== ''
  ? `https://${import.meta.env.VITE_CODESPACE_NAME.trim()}-8000.app.github.dev/api/workouts`
  : 'http://localhost:8000/api/workouts';

function normalizePayload(payload) {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
}

export default function Workouts() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadWorkouts() {
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
        setError(err.message || 'Unable to load workouts.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadWorkouts();

    return () => {
      active = false;
    };
  }, [apiUrl]);

  if (loading) return <p className="text-light">Loading workouts...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card bg-dark text-light border-secondary">
      <div className="card-body">
        <h3 className="card-title">Workouts</h3>
        <ul className="list-group list-group-flush">
          {items.map((workout) => (
            <li key={workout._id || workout.id || workout.name} className="list-group-item bg-dark text-light border-secondary">
              <strong>{workout.name}</strong>
              <div className="small text-secondary">{workout.category || 'General'} • {workout.durationMinutes || 0} min</div>
              <div className="small text-secondary">{workout.description || 'No description'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
