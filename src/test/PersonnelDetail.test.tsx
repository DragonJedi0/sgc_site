import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import PersonnelDetail from '../pages/PersonnelDetail';
import { supabase } from '../lib/supabase';
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();

// Mock the supabase client
vi.mock('../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock the data in supabase
const mockPersonnel = [
    { id: '1', rank: 'Colonel', role: 'Team Leader', team: 'SG-1', status: 'active', prefix: 'Mr.', first_name: 'Jack', middle_name: '', last_name: "O'Neill", suffix: '', personnel_type: 'military' },
    { id: '2', rank: '', role: 'Archeology Expert', team: 'SG-1', status: 'active', prefix: 'Dr.', first_name: 'Daniel', middle_name: '', last_name: 'Jackson', suffix: '', personnel_type: 'civilian' },
    { id: '3', rank: 'Second Lieutenant', role: 'Combat Support', team: 'SG-2', status: 'active', prefix: 'Mr.', first_name: 'Carl', middle_name: 'John', last_name: 'Baker', suffix: 'III', personnel_type: 'military' },
];

describe('PersonnelDetail', () => {
    it('displays a message when no records are found', async () => {
        vi.mocked(supabase.from).mockReturnValueOnce({
            select: vi.fn().mockReturnValueOnce({
              eq: vi.fn().mockReturnValueOnce({
                single: vi.fn().mockResolvedValueOnce({
                  data: null,
                  error: null
                }),
              }),
            }),
        } as any);

        render(
          <MemoryRouter initialEntries={['/personnel/1']}>
            <Routes>
              <Route path="/personnel/:id" element={<PersonnelDetail />} />
            </Routes>
          </MemoryRouter>
        );

        const message = await screen.findByText('Personnel record not found.');
        expect(message).toBeInTheDocument();
      });

    it('displays error message when fetch fails', async () =>{
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ 
              data: null, 
              error: { message: 'connection failed', code: '500' } 
            }),
          }),
        }),
      } as any);

      render(
        <MemoryRouter initialEntries={['/personnel/1']}>
          <Routes>
            <Route path="/personnel/:id" element={<PersonnelDetail />} />
          </Routes>
        </MemoryRouter>
      );

      const message = await screen.findByText('Error 500: connection failed');
      expect(message).toBeInTheDocument();
    });

    it('displays the detailed records when data is returned', async () => {
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ data: mockPersonnel[0], error: null }),
          }),
        }),
      } as any);

      render(
        <MemoryRouter initialEntries={['/personnel/1']}>
          <Routes>
            <Route path="/personnel/:id" element={<PersonnelDetail />} />
          </Routes>
        </MemoryRouter>
      );

      const name = await screen.findByText(/Jack O'Neill/);
      const rank = await screen.findByText(/Colonel/);
      const team = await screen.findByText(/SG-1/);
      const role = await screen.findByText(/Team Leader/);
      const status = await screen.findByText(/active/);
      expect(name).toBeInTheDocument();
      expect(rank).toBeInTheDocument();
      expect(team).toBeInTheDocument();
      expect(role).toBeInTheDocument();
      expect(status).toBeInTheDocument();
    });

    it('should retun to List view after confirming delete record', async () =>{
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ data: mockPersonnel[2], error: null }),
          }),
        }),
      } as any);

      vi.spyOn(window, 'confirm').mockReturnValueOnce(true);

      const deleteRecord = vi.fn().mockReturnValueOnce({
        eq: vi.fn().mockResolvedValueOnce({ error: null }),
      });

      vi.mocked(supabase.from).mockReturnValueOnce({
        delete: deleteRecord,
      } as any);

      render(
        <MemoryRouter initialEntries={['/personnel/3']}>
          <Routes>
            <Route path="/personnel/:id" element={<PersonnelDetail />} />
          </Routes>
        </MemoryRouter>
      );

      await user.click(await screen.findByText('Delete'));

      expect(deleteRecord).toHaveBeenCalled();
    });

    it('should stay on detail page after cancelling delete', async () =>{
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn().mockReturnValueOnce({
          eq: vi.fn().mockReturnValueOnce({
            single: vi.fn().mockResolvedValueOnce({ data: mockPersonnel[2], error: null }),
          }),
        }),
      } as any);

      vi.spyOn(window, 'confirm').mockReturnValueOnce(false);

      render(
        <MemoryRouter initialEntries={['/personnel/3']}>
          <Routes>
            <Route path="/personnel/:id" element={<PersonnelDetail />} />
          </Routes>
        </MemoryRouter>
      );

      await user.click(await screen.findByText('Delete'));

      const carl = await screen.findByText(/Carl John Baker III/);

      expect(carl).toBeInTheDocument();
    });
});