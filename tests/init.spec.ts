import { test as base, expect } from '@playwright/test';
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

test('change furry show loading', async ({ mainPage }) => {
  await mainPage.goto();
  await mainPage.selectFurry('Cat');

  await expect(mainPage.cardsContainer).not.toBeVisible();
  await expect(mainPage.loading).toBeVisible();

  await expect(mainPage.counter).toHaveText('Counter: 0');
});

test('reset game', async ({ mainPage }) => {
  await mainPage.goto(true);

  const card = mainPage.getCard('BPswUgFkK');
  await card.dispatchEvent('click');

  const secondCard = mainPage.getCard('aQ2yTXC_C');
  await secondCard.dispatchEvent('click');

  await mainPage.waitUndoFlipped();

  await expect(mainPage.counter).toHaveText('Counter: 1');

  mainPage.resetBtn.click();

  await expect(mainPage.counter).toHaveText('Counter: 0');
});

[
  { name: 'Cat', ids: ['a3', 'cfs'] },
  { name: 'Dog', ids: ['BPswUgFkK', 'aQ2yTXC_C'] }
].forEach((furry) => {
  test.describe(`Furry ${furry.name}`, () => {
    test.beforeEach(async ({ mainPage }) => {
      await mainPage.goto(true);

      await mainPage.selectFurry(furry.name);
    });

    test(`clicks on card with id ${furry.ids[0]} display img`, async ({ mainPage }) => {
      const card = mainPage.getCard(furry.ids[0]);
      await card.dispatchEvent('click');

      await expect(card.locator('img').first()).toBeVisible()
      await expect(mainPage.counter).toHaveText('Counter: 0');
    });

    test(`clicks cards with id ${furry.ids[0]} and ${furry.ids[1]} go back to hide after 500ms`, async ({ mainPage }) => {
      const card = mainPage.getCard(furry.ids[0]);
      await card.dispatchEvent('click');

      const secondCard = mainPage.getCard(furry.ids[1]);
      await secondCard.dispatchEvent('click');

      await mainPage.waitUndoFlipped();

      await expect(card.locator('img').first()).not.toBeVisible()
      await expect(secondCard.locator('img').first()).not.toBeVisible()

      await expect(mainPage.counter).toHaveText('Counter: 1');
    });
  });
});
