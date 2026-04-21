import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import PersonnelList from '../../pages/PersonnelList';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import PersonnelDetail from '../../pages/PersonnelDetail';
import userEvent from '@testing-library/user-event';
import PersonnelForm from '../../pages/PersonnelForm';

const user = userEvent.setup();

describe('PersonnelList (integration)', () => {
    it('fetches and displays personnel records from the API', async () =>{
        render(
            <MemoryRouter>
                <PersonnelList />
            </MemoryRouter>
        );

        const jack = await screen.findByText(/Col Jack O'Neill/);
        expect(jack).toBeInTheDocument();
    });

    it('displays no records message when API returns empty array', async () => {
        server.use(
            http.get(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/personnel`, () => {
            return HttpResponse.json([]);
            })
        );

        render(
            <MemoryRouter>
                <PersonnelList />
            </MemoryRouter>
        );

        const message = await screen.findByText('No personnel records found.');
        expect(message).toBeInTheDocument();
    });

    it('displays no records message when API returns error', async () => {
        server.use(
            http.get(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/personnel`, () => {
            return new HttpResponse(null, { status: 500 });
            })
        );

        render(
            <MemoryRouter>
                <PersonnelList />
            </MemoryRouter>
        );

        const message = await screen.findByText('No personnel records found.');
        expect(message).toBeInTheDocument();
    });

    it('navigates to personnel detail when a record is clicked', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
            <Routes>
                <Route path="/" element={<PersonnelList />} />
                <Route path="/personnel/:id" element={<PersonnelDetail />} />
            </Routes>
            </MemoryRouter>
        );

        const jack = await screen.findByText(/Col Jack O'Neill/);
        await user.click(jack);

        const heading = await screen.findByText(/Jack O'Neill/);
        expect(heading).toBeInTheDocument();
    });

    it('navigates to personnel form when Add Personnel button is clicked', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<PersonnelList />} />
                    <Route path="/personnel/new" element={<PersonnelForm />} />
                </Routes>
            </MemoryRouter>
        );

        const addButton = await screen.findByText(/Add Personnel/);
        await user.click(addButton);

        const nameField = await screen.findByLabelText('First Name');
        expect(nameField).toBeInTheDocument();
    });
});