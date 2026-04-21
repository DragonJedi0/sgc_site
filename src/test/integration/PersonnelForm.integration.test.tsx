import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import PersonnelList from '../../pages/PersonnelList';
import { http, HttpResponse } from 'msw';
import { server } from '../../mocks/server';
import PersonnelDetail from '../../pages/PersonnelDetail';
import userEvent from '@testing-library/user-event';
import PersonnelForm from '../../pages/PersonnelForm';
import { mockEntry } from '../../lib/mockData';
import { handlers } from '../../mocks/handlers';

const user = userEvent.setup();


describe('PersonnelForm (integration)', () => {
    it('should show empty fields for new entries', async () =>{
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path='/' element={<PersonnelList />} />
                    <Route path="/personnel/new" element={<PersonnelForm />} />
                </Routes>
            </MemoryRouter>
        );

        await user.click(await screen.findByText('Add Personnel'));

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

    it('should insert values into database after clicking save', async () =>{
        let body: unknown;
        
        server.use(
            http.post(`${import.meta.env.VITE_SUPABASE_URL}/rest/v1/personnel`, async ({ request }) =>{
            body = await request.json();
            return HttpResponse.json([body], { status: 201 });
            })
        );

        render(
            <MemoryRouter initialEntries={['/personnel/new']}>
                <Routes>
                    <Route path="/personnel/new" element={<PersonnelForm />} />
                    <Route path='/' element={<PersonnelList />} />
                </Routes>
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

        expect(body).toMatchObject(mockEntry);
    });

    it('should display error message when insert fails');
    it('should convert empty prefix and rank to null on submit');
    it('should show values of record to edit');
    it('should update values into database after clicking save');
    it('should navigate back to personnel list when cancelling');
});