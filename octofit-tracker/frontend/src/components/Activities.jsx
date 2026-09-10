import { useEffect, useMemo, useState } from 'react';
import { getApiBaseUrl, normalizePayload } from '../utils/api.js';

export default function Activities() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = useMemo(() => `${getApiBaseUrl()}/activities/`, []);

  useEffect(() => {
    let active = true;

    async function loadActivities() {
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
        setError(err.message || 'Unable to load activities.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadActivities();

    return () => {
      active = false;
    };
  }, [apiUrl]);

  if (loading) return <p className="text-light">Loading activities...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card bg-dark text-light border-secondary">
      <div className="card-body">
        <h3 className="card-title">Activities</h3>
        <ul className="list-group list-group-flush">
          {items.map((activity) => (
            <li key={activity._id || activity.id || activity.type} className="list-group-item bg-dark text-light border-secondary">
              <strong>{activity.type}</strong>
              <div className="small text-secondary">{activity.durationMinutes || 0} minutes</div>
              <div className="small text-secondary">{activity.notes || 'No notes'}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
