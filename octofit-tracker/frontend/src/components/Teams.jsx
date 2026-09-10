import { useEffect, useMemo, useState } from 'react';
import { getApiBaseUrl, normalizePayload } from '../utils/api.js';

export default function Teams() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const apiUrl = useMemo(() => `${getApiBaseUrl()}/teams/`, []);

  useEffect(() => {
    let active = true;

    async function loadTeams() {
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
        setError(err.message || 'Unable to load teams.');
      } finally {
        if (active) setLoading(false);
      }
    }

    loadTeams();

    return () => {
      active = false;
    };
  }, [apiUrl]);

  if (loading) return <p className="text-light">Loading teams...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="card bg-dark text-light border-secondary">
      <div className="card-body">
        <h3 className="card-title">Teams</h3>
        <ul className="list-group list-group-flush">
          {items.map((team) => (
            <li key={team._id || team.id || team.name} className="list-group-item bg-dark text-light border-secondary">
              <strong>{team.name}</strong>
              <div className="small text-secondary">{team.description || 'No description'}</div>
              <div className="small text-secondary">Members: {team.members?.length || 0}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
