import { test, expect } from '@playwright/test';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { PATHS } from "../src/lib/paths"
import { e2eTestRecords } from "../src/lib/mockData"
import { extractName } from './testUtils';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

const e2eTestRec = e2eTestRecords.e2eTestRec;
const e2eTestRec2 = e2eTestRecords.e2eTestRec2;
const e2eTestRec3 = e2eTestRecords.e2eTestRec3;
const e2eTestMilitary = e2eTestRecords.e2eTestMilitary;
const e2eTestCivilian = e2eTestRecords.e2eTestCivilian;

test.describe('read and verify', () => {
    const displayName = extractName(e2eTestRec).displayName;
    const link = extractName(e2eTestRec).link;
    // const rec2Link = extractName(e2eTestRec2).link;
    // const rec3Link = extractName(e2eTestRec3).link;

    test.describe.configure({ mode: 'serial' });
    
    test.beforeAll(async () => {
        // Clean leftover records from previous runs
        await supabase
            .from('personnel')
            .delete()
            .eq('first_name', e2eTestRec.first_name)
            .eq('last_name', e2eTestRec.last_name);
        await supabase
            .from('personnel')
            .delete()
            .eq('first_name', e2eTestRec2.first_name)
            .eq('last_name', e2eTestRec2.last_name);
        await supabase
            .from('personnel')
            .delete()
            .eq('first_name', e2eTestRec3.first_name)
            .eq('last_name', e2eTestRec3.last_name);

        // Insert fresh data
        await supabase
            .from('personnel')
            .insert([e2eTestRec, e2eTestRec2, e2eTestRec3]);
    });

    test.afterAll(async () =>{
        await supabase
            .from('personnel')
            .delete()
            .eq('first_name', e2eTestRec.first_name)
            .eq('last_name', e2eTestRec.last_name);
        await supabase
            .from('personnel')
            .delete()
            .eq('first_name', e2eTestRec2.first_name)
            .eq('last_name', e2eTestRec2.last_name);
        await supabase
            .from('personnel')
            .delete()
            .eq('first_name', e2eTestRec3.first_name)
            .eq('last_name', e2eTestRec3.last_name);
    });

    test('displays personnel list on personnel home page', async ({ page }) => {
        // Test navigation
        await page.goto(PATHS.PERSONNEL_LIST);

        // Read data
        const heading = page.getByText('SGC Personnel');
        const sam = page.getByText(link);

        // Assertions...
        await expect(page).toHaveURL(PATHS.PERSONNEL_LIST);
        await expect(heading).toBeVisible();
        await expect(sam).toBeVisible();
    });

    test('navigates to personnel detail page from personnel home page', async({ page }) =>{
        await page.goto(PATHS.PERSONNEL_LIST);
        
        await page.getByRole('link', { name: link }).click();

        await expect(page.getByRole('heading', { name: displayName })).toBeVisible();
        await expect(page.getByText(new RegExp(`Rank: ${e2eTestRec.rank}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Team: ${e2eTestRec.team}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Role: ${e2eTestRec.role}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Status: ${e2eTestRec.status}`))).toBeVisible();
        await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
    });

    test('back button returns to list view', async ({ page }) =>{
        await page.goto(PATHS.PERSONNEL_LIST);
        
        await page.getByRole('link', { name: link }).click();

        await page.getByRole('button', { name: 'Back' }).click();

        await expect(page).toHaveURL(PATHS.PERSONNEL_LIST);
        await expect(page.getByText('SGC Personnel')).toBeVisible();
        await expect(page.getByText(link)).toBeVisible();
    });

    test('detail page shows correct record data', async ({ page }) =>{
        await page.goto(PATHS.PERSONNEL_LIST);

        await page.getByRole('link', { name: link}).click();
        
        await expect(page.getByRole('heading', { name: displayName })).toBeVisible();
        await expect(page.getByText(new RegExp(`Rank: ${e2eTestRec.rank}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Team: ${e2eTestRec.team}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Role: ${e2eTestRec.role}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Status: ${e2eTestRec.status}`))).toBeVisible();
        
        await page.getByRole('button', { name: 'Back' }).click();

        await page.getByRole('link', { name: extractName(e2eTestRec2).link }).click();

        await expect(page.getByRole('heading', { name: extractName(e2eTestRec2).displayName })).toBeVisible();
        await expect(page.getByText(new RegExp(`Rank: ${e2eTestRec2.rank}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Team: ${e2eTestRec2.team}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Role: ${e2eTestRec2.role}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Status: ${e2eTestRec2.status}`))).toBeVisible();
        
        await page.getByRole('button', { name: 'Back' }).click();
        
        await page.getByRole('link', { name: extractName(e2eTestRec3).link }).click();
        
        await expect(page.getByRole('heading', { name: extractName(e2eTestRec3).displayName })).toBeVisible();
        await expect(page.getByText(/Civilian Contractor/)).toBeVisible();
        await expect(page.getByText(new RegExp(`Team: ${e2eTestRec3.team}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Role: ${e2eTestRec3.role}`))).toBeVisible();
        await expect(page.getByText(new RegExp(`Status: ${e2eTestRec3.status}`))).toBeVisible();
    });

    test('edit button navigates to form with pre-populated data', async ({ page }) =>{
        await page.goto(PATHS.PERSONNEL_LIST);
        
        await page.getByRole('link', { name: link }).click();

        await page.getByRole('button', { name: 'Edit' }).click();

        //Assertions...
        await expect(page.getByLabel('Prefix')).toHaveValue(`${e2eTestRec.prefix}`);
        await expect(page.getByLabel('First Name')).toHaveValue(`${e2eTestRec.first_name}`);
        await expect(page.getByLabel('Middle Name')).toHaveValue(`${e2eTestRec.middle_name}`);
        await expect(page.getByLabel('Last Name')).toHaveValue(`${e2eTestRec.last_name}`);
        await expect(page.getByLabel('Suffix')).toHaveValue(`${e2eTestRec.suffix}`);
        await expect(page.getByLabel('Rank')).toHaveValue(`${e2eTestRec.rank}`);
        await expect(page.getByLabel('Role')).toHaveValue(`${e2eTestRec.role}`);
        await expect(page.getByLabel('Team')).toHaveValue(`${e2eTestRec.team}`);
        await expect(page.getByLabel('Personnel Type')).toHaveValue(`${e2eTestRec.personnel_type}`);
        await expect(page.getByLabel('Status')).toHaveValue(`${e2eTestRec.status}`);
    });

    test('cancel button on edit form returns to list view', async ({ page }) =>{
        await page.goto(PATHS.PERSONNEL_LIST);
        
        await page.getByRole('link', { name: link }).click();

        await page.getByRole('button', { name: 'Edit' }).click();

        await page.getByRole('button', { name: 'Cancel' }).click();

        await expect(page).toHaveURL(PATHS.PERSONNEL_LIST);
        await expect(page.getByText('SGC Personnel')).toBeVisible();
        await expect(page.getByText(link)).toBeVisible();
    });

    test('Add Personnel button navigates to empty form', async ({ page }) =>{
        await page.goto(PATHS.PERSONNEL_LIST);

        await page.getByRole('button', { name: 'Add Personnel' }).click();

        // Assertions...
        await expect(page).toHaveURL(PATHS.PERSONNEL_NEW);
        await expect(page.getByText('Add Personnel')).toBeVisible();
        await expect(page.getByLabel('Status')).toHaveValue('active');
    });

    test('new form cancel button returns to list view', async ({ page }) =>{
        await page.goto(PATHS.PERSONNEL_LIST);

        await page.getByRole('button', { name: 'Add Personnel' }).click();

        await page.getByRole('button', { name: 'Cancel' }).click();

        await expect(page).toHaveURL(PATHS.PERSONNEL_LIST);
        await expect(page.getByText('SGC Personnel')).toBeVisible();
        await expect(page.getByText(link)).toBeVisible();
    });
});

test.describe('write then delete', () =>{
    // Prevent skipped clean ups
    test.beforeEach(async () => {
        await supabase
            .from('personnel')
            .delete()
            .eq('first_name', e2eTestMilitary.first_name)
            .eq('last_name', e2eTestMilitary.last_name);
    });

    // Clean database after tests
    test.afterEach(async () => {
        await supabase
            .from('personnel')
            .delete()
            .eq('first_name', e2eTestMilitary.first_name)
            .eq('last_name', e2eTestMilitary.last_name);
    });

    // Saving a new record navigates to list
    test('saving a new record navigates to list view', async ({ page }) =>{        
        await page.goto(PATHS.PERSONNEL_LIST);

        await page.getByRole('button', { name: 'Add Personnel' }).click();

        // Select Options
        await page.getByLabel('Prefix').selectOption(e2eTestMilitary.prefix ?? '');
        await page.getByLabel('Rank').selectOption(e2eTestMilitary.rank ?? '');
        await page.getByLabel('Personnel Type').selectOption(e2eTestMilitary.personnel_type ?? '');
        await page.getByLabel('Status').selectOption(e2eTestMilitary.status ?? '');
        // Fill fields
        await page.getByLabel('First Name').fill(e2eTestMilitary.first_name ?? '');
        await page.getByLabel('Middle Name').fill(e2eTestMilitary.middle_name ?? '');
        await page.getByLabel('Last Name').fill(e2eTestMilitary.last_name ?? '');
        await page.getByLabel('Suffix').fill(e2eTestMilitary.suffix ?? '');
        await page.getByLabel('Role').fill(e2eTestMilitary.role ?? '');
        await page.getByLabel('Team').fill(e2eTestMilitary.team ?? '');
        
        await page.getByRole("button", { name: "Save" }).click();

        const link = extractName(e2eTestMilitary).link;

        await expect(page).toHaveURL(PATHS.PERSONNEL_LIST);
        await expect(page.getByText('SGC Personnel')).toBeVisible();
        await expect(page.getByText(link)).toBeVisible();
    });
});

// Saving an edited record navigates to list

// Delete with confirmation returns to list

// Delete cancelled stays on detail page