import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

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

  async function handleDelete() {
    if(!person) return;
    if(!confirm('Are you sure you want to delete this recored?')) return;

    const { error } = await supabase
      .from('personnel')
      .delete()
      .eq('id', person.id);
    
    if (error) console.error(error);
    else navigate('/');
  }

  return (
    <div>
      <h1>
        {person.prefix ? `${person.prefix} ` : ''}
        {person.first_name} 
        {person.middle_name ? ` ${person.middle_name}` : ''} 
        {person.last_name}
        {person.suffix ? ` ${person.suffix}` : ''}
      </h1>
      <p>Rank: {person.rank ?? 'N/A'}</p>
      <p>Role: {person.role}</p>
      <p>Team: {person.team ?? 'Unassigned'}</p>
      <p>Personnel Type: {person.personnel_type}</p>
      <p>Status: {person.status}</p>
    </div>
  );
}