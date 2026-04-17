import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import PersonnelDetail from '../pages/PersonnelDetail';
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
    { id: '2', rank: 'Civilian Contractor', role: 'Archeology Expert', team: 'SG-1', status: 'active', prefix: 'Dr.', first_name: 'Daniel', middle_name: '', last_name: 'Jackson', suffix: '', personnel_type: 'civilian' },
];

describe('PersonnelDetail', () => {
    it('displays a message when no records are found', async () => {
        vi.mocked(supabase.from).mockReturnValueOnce({
            select: vi.fn().mockReturnValueOnce({
              eq: vi.fn().mockReturnValueOnce({
                single: vi.fn().mockResolvedValueOnce({ data: null, error: { message: 'not found' } }),
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
});