import { test as base, expect } from '@playwright/test';
// import mockDogResponse from './mock-data/dog-response.json';
import { MainPage } from './fixtures/main';

const test = base.extend<{ mainPage: MainPage }>({
  mainPage: async ({ page }, use) => {
    const mainPage = new MainPage(page);
    await use(mainPage);
  },
});

test('has title', async ({ page, mainPage }) => {
  await mainPage.goto();

  await expect(page).toHaveTitle(/Playwright Memory Game/);
});

test('show loading', async ({ mainPage }) => {
  await mainPage.goto();

  await expect(mainPage.cardsContainer).not.toBeVisible();
  await expect(mainPage.loading).toBeVisible();
  await expect(mainPage.counter).toHaveText('Counter: 0');
});

test('shows cards', async ({ mainPage }) => {
  await mainPage.goto(true);

  await expect(mainPage.cardsContainer).toBeVisible();
  await expect(mainPage.loading).not.toBeVisible();

  await expect(mainPage.counter).toHaveText('Counter: 0');
});

test('clicks on card display img', async ({ mainPage }) => {
  await mainPage.goto(true);
  const card = mainPage.getCard('BPswUgFkK');
  await card.dispatchEvent('click');

  await expect(card.locator('img').first()).toBeVisible()
  await expect(mainPage.counter).toHaveText('Counter: 0');
});

test('clicks on two different cards go back to hide after 500ms', async ({ mainPage }) => {
  await mainPage.goto(true);
  const card = mainPage.getCard('BPswUgFkK');
  await card.dispatchEvent('click');

  const secondCard = mainPage.getCard('aQ2yTXC_C');
  await secondCard.dispatchEvent('click');

  await mainPage.waitUndoFlipped();

  await expect(card.locator('img').first()).not.toBeVisible()
  await expect(secondCard.locator('img').first()).not.toBeVisible()

  await expect(mainPage.counter).toHaveText('Counter: 1');
});
