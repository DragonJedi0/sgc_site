import { test, expect } from '@playwright/test';
import { PATHS } from "../src/lib/paths"

test('displays personnel list on personnel home page', async ({ page }) => {
    // Test navigation
    await page.goto(PATHS.PERSONNEL_LIST);

    // Read data
    const heading = page.getByText('SGC Personnel');
    const jack = page.getByText(/Col Jack O'Neill/);

    // Assertions...
    await expect(page).toHaveURL(PATHS.PERSONNEL_LIST);
    await expect(heading).toBeVisible();
    await expect(jack).toBeVisible();
});

test('navigates to personnel detail page from personnel home page', async({ page }) =>{
    await page.goto(PATHS.PERSONNEL_LIST);
    
    await page.getByRole('link', { name: "Col Jack O'Neill" }).click();

    await expect(page.getByRole('heading', { name: "Mr. Jack O'Neill" })).toBeVisible();
    await expect(page.getByText(/Rank: Colonel/)).toBeVisible();
    await expect(page.getByText(/Team: SG-1/)).toBeVisible();
    await expect(page.getByText(/Role: Team Leader/)).toBeVisible();
    await expect(page.getByText(/Status: active/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Back' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete' })).toBeVisible();
});

test('back button returns to list view', async ({ page }) =>{
    await page.goto(PATHS.PERSONNEL_LIST);
    
    await page.getByRole('link', { name: "Col Jack O'Neill" }).click();

    await page.getByRole('button', { name: 'Back' }).click();

    await expect(page).toHaveURL(PATHS.PERSONNEL_LIST);
    await expect(page.getByText('SGC Personnel')).toBeVisible();
    await expect(page.getByText(/Col Jack O'Neill/)).toBeVisible();
});

test('detail page shows correct record data', async ({ page }) =>{
    await page.goto(PATHS.PERSONNEL_LIST);

    await page.getByRole('link', { name: "Maj Charles Kawalsky" }).click();
    
    await expect(page.getByRole('heading', { name: "Mr. Charles Kawalsky" })).toBeVisible();
    await expect(page.getByText(/Rank: Major/)).toBeVisible();
    await expect(page.getByText(/Team: SG-2/)).toBeVisible();
    await expect(page.getByText(/Role: Team Leader/)).toBeVisible();
    await expect(page.getByText(/Status: deceased/)).toBeVisible();
    
    await page.getByRole('button', { name: 'Back' }).click();

    await page.getByRole('link', { name: "2d Lt Carl John Baker III"}).click();
    
    await expect(page.getByRole('heading', { name: "Mr. Carl John Baker III" })).toBeVisible();
    await expect(page.getByText(/Rank: Second Lieutenant/)).toBeVisible();
    await expect(page.getByText(/Team: SG-2/)).toBeVisible();
    await expect(page.getByText(/Role: Combat Support/)).toBeVisible();
    await expect(page.getByText(/Status: kia/)).toBeVisible();
    
    await page.getByRole('button', { name: 'Back' }).click();

    await page.getByRole('link', { name: "Dr. Samantha Alexandra Shepard PHD" }).click();

    await expect(page.getByRole('heading', { name: "Dr. Samantha Alexandra Shepard PHD" })).toBeVisible();
    await expect(page.getByText(/Civilian Contractor/)).toBeVisible();
    await expect(page.getByText(/Team: SG-2/)).toBeVisible();
    await expect(page.getByText(/Role: Computer Expert/)).toBeVisible();
    await expect(page.getByText(/Status: Medical Leave/)).toBeVisible();
});

test('edit button navigates to form with pre-populated data', async ({ page }) =>{
    await page.goto(PATHS.PERSONNEL_LIST);
    
    await page.getByRole('link', { name: "Col Jack O'Neill" }).click();

    await page.getByRole('button', { name: 'Edit' }).click();

    //Assertions...
});

test('cancel button on edit form returns to list view', async ({ page }) =>{
    await page.goto(PATHS.PERSONNEL_LIST);
    
    await page.getByRole('link', { name: "Col Jack O'Neill" }).click();

    await page.getByRole('button', { name: 'Edit' }).click();

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(page).toHaveURL(PATHS.PERSONNEL_LIST);
    await expect(page.getByText('SGC Personnel')).toBeVisible();
    await expect(page.getByText(/Col Jack O'Neill/)).toBeVisible();
});

test('Add Personnel button navigates to empty form', async ({ page }) =>{
    await page.goto(PATHS.PERSONNEL_LIST);

    await page.getByRole('button', { name: 'Add Personnel' }).click();

    // Read empty fields

    // Assertions...
    await expect(page).toHaveURL(PATHS.PERSONNEL_NEW);
    await expect(page.getByText('Add Personnel')).toBeVisible();
});

// Cancel on new form returns to list

// Saving a new record navigates to list

// Saving an edited record navigates to list

// Delete with confirmation returns to list

// Delete cancelled stays on detail page