import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type Personnel = {
  id: string;
  name: string;
  rank: string;
  role: string;
  team: string | null;
  status: string;
};

export default function PersonnelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [person, setPerson] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPerson() {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.error(error);
      else setPerson(data);
      setLoading(false);
    }

    fetchPerson();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!person) return <p>Personnel record not found.</p>;

  return (
    <div>
      <h1>{person.name}</h1>
      <p>Rank: {person.rank}</p>
      <p>Role: {person.role}</p>
      <p>Team: {person.team ?? 'Unassigned'}</p>
      <p>Status: {person.status}</p>
      <button onClick={() => navigate('/')}>Back</button>
      <button onClick={() => navigate('/personnel/${person.id}/edit')}>Edit</button>
    </div>
  );
}