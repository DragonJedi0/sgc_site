import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import PersonnelList from '../pages/PersonnelList';
import { supabase } from '../lib/supabase';

// Mock the supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock the data in supabase
const mockPersonnel = [
    { id: '1', rank: 'Colonel', role: 'Team Leader', team: 'SG-1', status: 'active', prefix: 'Mr.', first_name: 'Jack', middle_name: '', last_name: "O'Neill", suffix: '', personnel_type: 'military' },
    { id: '2', rank: 'Civilian Contractor', role: 'Archeology Expert', team: 'SG-1', status: 'active', prefix: 'Dr.', first_name: 'Daniel', middle_name: '', last_name: 'Jackson', suffix: 'PHD', personnel_type: 'civilian' },
];

describe('PersonnelList', () => {
  it('displays a message when no records are found', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({ data: [], error: null }),
    } as any);

    render(
      <MemoryRouter>
        <PersonnelList />
      </MemoryRouter>
    );

    const message = await screen.findByText('No personnel records found.');
    expect(message).toBeInTheDocument();
  });

  it('displays personnel records when data is returned', async () =>{
    vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockResolvedValueOnce({ data: mockPersonnel, error: null }),
    } as any);

    render(
      <MemoryRouter>
        <PersonnelList />
      </MemoryRouter>
    );

    const jack = await screen.findByText(/Colonel Jack O'Neill/);
    const daniel = await screen.findByText(/Dr. Daniel Jackson PHD/);
    expect(jack).toBeInTheDocument();
    expect(daniel).toBeInTheDocument();
  });
});