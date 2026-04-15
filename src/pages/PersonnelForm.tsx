import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type PersonnelFormData = {
  name: string;
  rank: string;
  role: string;
  team: string;
  status: string;
};

const defaultForm: PersonnelFormData = {
  name: '',
  rank: '',
  role: '',
  team: '',
  status: 'active',
};

export default function PersonnelForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<PersonnelFormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const isEditing = Boolean(id);
  const [fetching, setFetching] = useState(isEditing);

  useEffect(() => {
    if (!isEditing) return;

    async function fetchPerson() {
      const { data, error } = await supabase
        .from('personnel')
        .select('*')
        .eq('id', id)
        .single();
      if (error) console.error(error);
      else setForm(data);
      setFetching(false);
    }

    fetchPerson();
  }, [id, isEditing]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (isEditing) {
      const { error } = await supabase
        .from('personnel')
        .update(form)
        .eq('id', id);
      if (error) console.error(error);
    } else {
      const { error } = await supabase
        .from('personnel')
        .insert(form);
      if (error) console.error(error);
    }

    setLoading(false);
    navigate('/');
  }

  if (fetching) return <p>Loading...</p>;
  
  return (
    <div>
      <h1>{isEditing ? 'Edit Personnel' : 'Add Personnel'}</h1>
      <form onSubmit={handleSubmit}>
        <label>Name<input name="name" value={form.name} onChange={handleChange} required /></label>
        <label>Rank<input name="rank" value={form.rank} onChange={handleChange} required /></label>
        <label>Role<input name="role" value={form.role} onChange={handleChange} required /></label>
        <label>Team<input name="team" value={form.team} onChange={handleChange} /></label>
        <label>
          Status
          <select name="status" value={form.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="kia">KIA</option>
          </select>
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
        <button type="button" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  );
}