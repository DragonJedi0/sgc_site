import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import PersonnelForm from '../pages/PersonnelForm';
import { supabase } from '../lib/supabase';
import userEvent from '@testing-library/user-event';
import PersonnelList from '../pages/PersonnelList';

const user = userEvent.setup();

// Mock the supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock data 
const name = "Eli Hawk";
const rank = "Lieutenant";
const team = "SG-2";
const role = "Technical Expert";
const status = "active";
const mockPersonnel = [
    { id: '1', name: "Jack O'Neill", rank: 'Colonel', role: 'Team Leader', team: 'SG-1', status: 'active' },
    { id: '2', name: 'Dr. Daniel Jackson', rank: 'Civilian Contractor', role: 'Archeology Expert', team: 'SG-1', status: 'active' },
];

describe('PersonnelForm', () => {
  it('should show empty fields for new entries', () =>{
    render(
        <MemoryRouter>
            <PersonnelForm />
        </MemoryRouter>
    );

    expect(screen.getByLabelText('Name')).toHaveValue('');
    expect(screen.getByLabelText('Rank')).toHaveValue('');
    expect(screen.getByLabelText('Team')).toHaveValue('');
    expect(screen.getByLabelText('Role')).toHaveValue('');
    expect(screen.getByLabelText('Status')).toHaveValue('active');
  });

  it('should insert values into database after clicking save', async () => {
    // Save to mock db
    const insertMock = vi.fn().mockResolvedValueOnce({ error: null });

    vi.mocked(supabase.from).mockReturnValueOnce({
        insert: insertMock,
    } as any);

    render(
        <MemoryRouter>
            <PersonnelForm />
        </MemoryRouter>
    );

    // Type into fields
    await user.type(screen.getByLabelText('Name'), name);
    await user.type(screen.getByLabelText('Rank'), rank);
    await user.type(screen.getByLabelText('Team'), team);
    await user.type(screen.getByLabelText('Role'), role);
      // Select dropdown value
    await user.selectOptions(screen.getByLabelText('Status'), status);

    // click save
    await user.click(screen.getByText('Save'));


    expect(insertMock).toHaveBeenCalled();
  });

  it('should show values of record to edit', async () =>{
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({ data: mockPersonnel[0], error: null }),
        }),
      }),
    } as any);

    render(
        <MemoryRouter initialEntries={['/personnel/1/edit']}>
            <Routes>
                <Route path="/personnel/:id/edit" element={<PersonnelForm />} />
            </Routes>
        </MemoryRouter>
    );

    expect(await screen.findByLabelText('Name')).toHaveValue("Jack O'Neill");
    expect(await screen.findByLabelText('Rank')).toHaveValue('Colonel');
    expect(await screen.findByLabelText('Team')).toHaveValue('SG-1');
    expect(await screen.findByLabelText('Role')).toHaveValue('Team Leader');
    expect(await screen.findByLabelText('Status')).toHaveValue('active');
  });

  it('should update values into database after clicking save', async () => {
    // Populate mock database with data
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({ data: mockPersonnel[1], error: null }),
        }),
      }),
    } as any);

    const updateMock = vi.fn().mockReturnValueOnce({
      eq: vi.fn().mockResolvedValueOnce({ error: null }),
    });

    // Save to mock db
    vi.mocked(supabase.from).mockReturnValueOnce({
        update: updateMock,
    } as any);

    render(
        <MemoryRouter initialEntries={['/personnel/2/edit']}>
            <Routes>
                <Route path="/personnel/:id/edit" element={<PersonnelForm />} />
            </Routes>
        </MemoryRouter>
    );

    // Type into fields
    await user.type(await screen.findByLabelText('Name'), "Doctor Jackson");
    // click save
    await user.click(screen.getByText('Save'));

    // Expected behavior
    expect(updateMock).toHaveBeenCalled();
  });

  it('should navigate back to personnel list', async () =>{
    // Populate mock database with data
    vi.mocked(supabase.from).mockReturnValueOnce({
      select: vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockReturnValueOnce({
          single: vi.fn().mockResolvedValueOnce({ data: mockPersonnel[1], error: null }),
        }),
      }),
    } as any);

    vi.mocked(supabase.from).mockReturnValueOnce({
            select: vi.fn().mockResolvedValueOnce({ data: mockPersonnel, error: null }),
        } as any);

    render(
        <MemoryRouter initialEntries={['/personnel/2/edit']}>
            <Routes>
                <Route path="/personnel/:id/edit" element={<PersonnelForm />} />
                <Route path="/" element={<PersonnelList />} />
            </Routes>
        </MemoryRouter>
    );

    await user.click(await screen.findByText('Cancel'));



    const title = await screen.findByText(/SGC Personnel/);

    expect(title).toBeInTheDocument();
  });
});