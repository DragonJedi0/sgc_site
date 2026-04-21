import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import PersonnelForm from '../pages/PersonnelForm';
import { supabase } from '../lib/supabase';
import userEvent from '@testing-library/user-event';
import PersonnelList from '../pages/PersonnelList';
import { mockEntry, mockPersonnel } from '../lib/mockData';

const user = userEvent.setup();

// Mock the supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));


describe('PersonnelForm', () => {
  it('should show empty fields for new entries', () =>{
    render(
        <MemoryRouter>
            <PersonnelForm />
        </MemoryRouter>
    );

    expect(screen.getByLabelText('Prefix')).toHaveValue('');
    expect(screen.getByLabelText('First Name')).toHaveValue('');
    expect(screen.getByLabelText('Middle Name')).toHaveValue('');
    expect(screen.getByLabelText('Last Name')).toHaveValue('');
    expect(screen.getByLabelText('Suffix')).toHaveValue('');
    expect(screen.getByLabelText('Rank')).toHaveValue('');
    expect(screen.getByLabelText('Team')).toHaveValue('');
    expect(screen.getByLabelText('Role')).toHaveValue('');
    expect(screen.getByLabelText('Personnel Type')).toHaveValue('military');
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
    await user.type(screen.getByLabelText('First Name'), mockEntry.first_name);
    await user.type(screen.getByLabelText('Middle Name'), mockEntry.middle_name);
    await user.type(screen.getByLabelText('Last Name'), mockEntry.last_name);
    await user.type(screen.getByLabelText('Suffix'), mockEntry.suffix);
    await user.type(screen.getByLabelText('Team'), mockEntry.team);
    await user.type(screen.getByLabelText('Role'), mockEntry.role);
      // Select dropdown value
    await user.selectOptions(screen.getByLabelText('Rank'), mockEntry.rank);
    await user.selectOptions(screen.getByLabelText('Prefix'), mockEntry.prefix);
    await user.selectOptions(screen.getByLabelText('Personnel Type'), mockEntry.personnel_type);
    await user.selectOptions(screen.getByLabelText('Status'), mockEntry.status);

    // click save
    await user.click(screen.getByText('Save'));


    expect(insertMock).toHaveBeenCalled();
  });

  it('should display error message when insert fails', async () => {
    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: vi.fn().mockResolvedValueOnce({ error: { message: 'insert failed' } }),
    } as any);

    render(
      <MemoryRouter>
        <PersonnelForm />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('First Name'), mockEntry.first_name);
    await user.type(screen.getByLabelText('Last Name'), mockEntry.last_name);
    await user.type(screen.getByLabelText('Role'), mockEntry.role);
    await user.click(screen.getByText('Save'));

    const error = await screen.findByText('insert failed');
    expect(error).toBeInTheDocument();
  });

  it('should convert empty prefix and rank to null on submit', async () => {
    const insertMock = vi.fn().mockResolvedValueOnce({ error: null });

    vi.mocked(supabase.from).mockReturnValueOnce({
      insert: insertMock,
    } as any);

    render(
      <MemoryRouter>
        <PersonnelForm />
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText('First Name'), mockEntry.first_name);
    await user.type(screen.getByLabelText('Last Name'), mockEntry.last_name);
    await user.type(screen.getByLabelText('Role'), mockEntry.role);
    await user.click(screen.getByText('Save'));

    expect(insertMock).toHaveBeenCalledWith(
      expect.objectContaining({ prefix: null, rank: null })
    );
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

    expect(await screen.findByLabelText('Prefix')).toHaveValue("Mr.");
    expect(await screen.findByLabelText('First Name')).toHaveValue("Jack");
    expect(await screen.findByLabelText('Middle Name')).toHaveValue('');
    expect(await screen.findByLabelText('Last Name')).toHaveValue("O'Neill");
    expect(await screen.findByLabelText('Suffix')).toHaveValue('');
    expect(await screen.findByLabelText('Rank')).toHaveValue('Colonel');
    expect(await screen.findByLabelText('Team')).toHaveValue('SG-1');
    expect(await screen.findByLabelText('Role')).toHaveValue('Team Leader');
    expect(await screen.findByLabelText('Personnel Type')).toHaveValue("military");
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
    await user.selectOptions(await screen.findByLabelText('Status'), "kia");
    // click save
    await user.click(screen.getByText('Save'));

    // Expected behavior
    expect(updateMock).toHaveBeenCalled();
  });

  it('should navigate back to personnel list when cancelling', async () =>{
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