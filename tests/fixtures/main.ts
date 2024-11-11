import type { Page, Locator } from '@playwright/test';

export class MainPage {
  readonly loading: Locator;
  readonly cardsContainer: Locator;
  readonly counter: Locator;
  readonly resetBtn: Locator;

  constructor(public readonly page: Page) {
    this.cardsContainer = this.page.getByTestId('cards-container');
    this.loading = this.page.getByTestId('loading');
    this.counter = this.page.getByTestId('counter');
    this.resetBtn = this.page.getByTestId('reset-btn');
  }

  async goto(mockingImg = false) {
    if (mockingImg) {

      await this.page.route('https://api.thedogapi.com/v1/images/search?limit=8', async route => {
        return route.fulfill({ path: './tests/mock-data/dog-response.json' });
      });
      await this.page.route('https://api.thecatapi.com/v1/images/search?limit=8', async route => {
        return route.fulfill({ path: './tests/mock-data/cat-response.json' });
      });
      await this.page.route('**/*.{png,jpg,jpeg}', route => route.fulfill({ path: './tests/mock-data/image.png' }));
    }
    await this.page.goto('/');
  }

  getCard(id: string): Locator {
    // return this.cardsContainer.locator(`[data-testid=card-${id}]`).first()
    return this.cardsContainer.getByTestId(`card-${id}`).first()
  }

  waitUndoFlipped() {
    return this.page.waitForTimeout(500)
  }

  selectFurry(furry) {
    this.page.getByRole('combobox').selectOption(furry);
    return this.page.waitForTimeout(500);
  }
}