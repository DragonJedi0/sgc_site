import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

type Personnel = {
  id: string;
  prefix: string | null;
  first_name: string;
  middle_name: string | null;
  last_name: string;
  suffix: string | null;
  rank: string | null;
  role: string;
  team: string | null;
  personnel_type: string;
  status: string;
};

export default function PersonnelList() {
  const [personnel, setPersonnel] = useState<Personnel[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <div>
        <ul>
          {personnel.map((p) => (
            <li key={p.id}>
              <Link to={`/personnel/${p.id}`}>
                {p.prefix ? `${p.prefix} ` : ''}{p.first_name} {p.middle_name ? `${p.middle_name} ` : ''}{p.last_name}{p.suffix ? ` ${p.suffix}` : ''} — {p.rank} — {p.role}
              </Link>
            </li>
          ))}
        </ul>
        <button onClick={() => navigate('/personnel/new')}>Add Personnel</button>
        </div>
      )}
    </div>
  );
}