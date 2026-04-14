import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link } from 'react-router-dom';

type Personnel = {
  id: string;
  name: string;
  rank: string;
  role: string;
  team: string | null;
  status: string;
};

export default function PersonnelList() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPersonnel() {
      const { data, error } = await supabase.from('personnel').select('*');
      if (error) console.error(error);
      else setPersonnel(data);
      setLoading(false);
    }

    fetchPersonnel();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>SGC Personnel</h1>
      {personnel.length === 0 ? (
        <p>No personnel records found.</p>
      ) : (
        <ul>
          {personnel.map((p) => (
            <li key={p.id}>
                <Link to={`/personnel/${p.id}`}>{p.name} — {p.rank} — {p.role}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}