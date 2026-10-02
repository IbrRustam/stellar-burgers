import { test, expect, Page } from '@playwright/test';
import path from 'path';

const INGREDIENTS_HAR = path.join(__dirname, 'hars/ingredients.har');
const ORDER_HAR = path.join(__dirname, 'hars/order.har');

const BUN_NAME = 'Краторная булка N-200i';
const BUN_ID = '643d69a5c3f7b9001cfa093c';
const MAIN_NAME = 'Биокотлета из марсианской Магнолии';
const MAIN_ID = '643d69a5c3f7b9001cfa0941';
const SAUCE_NAME = 'Соус Spicy-X';
const SAUCE_ID = '643d69a5c3f7b9001cfa0942';

const ingredientCard = (page: Page, id: string) =>
  page.getByTestId(`ingredient-${id}`);

const addIngredientToConstructor = async (page: Page, id: string) => {
  await ingredientCard(page, id)
    .getByRole('button', { name: 'Добавить' })
    .click();
};

test.describe('Конструктор бургера: добавление ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(INGREDIENTS_HAR, {
      url: '**/api/**',
      update: false
    });
    await page.goto('/');
    await expect(ingredientCard(page, BUN_ID)).toBeVisible();
  });

  test('добавление булки кладёт её в верхний и нижний слот конструктора', async ({
    page
  }) => {
    await expect(page.getByTestId('constructor-bun-top-empty')).toBeVisible();

    await addIngredientToConstructor(page, BUN_ID);

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      BUN_NAME
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      BUN_NAME
    );
  });

  test('добавление начинки добавляет её в список конструктора', async ({
    page
  }) => {
    await expect(
      page.getByTestId('constructor-ingredients-list')
    ).toContainText('Выберите начинку');

    await addIngredientToConstructor(page, MAIN_ID);

    await expect(
      page.getByTestId('constructor-ingredients-list')
    ).toContainText(MAIN_NAME);
  });

  test('можно добавить и булку, и несколько начинок одновременно', async ({
    page
  }) => {
    await addIngredientToConstructor(page, BUN_ID);
    await addIngredientToConstructor(page, MAIN_ID);
    await addIngredientToConstructor(page, SAUCE_ID);

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      BUN_NAME
    );
    await expect(
      page.getByTestId('constructor-ingredients-list')
    ).toContainText(MAIN_NAME);
    await expect(
      page.getByTestId('constructor-ingredients-list')
    ).toContainText(SAUCE_NAME);
  });
});

test.describe('Модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(INGREDIENTS_HAR, {
      url: '**/api/**',
      update: false
    });
    await page.goto('/');
    await expect(ingredientCard(page, BUN_ID)).toBeVisible();
  });

  test('клик по ингредиенту открывает модальное окно с данными именно этого ингредиента', async ({
    page
  }) => {
    await ingredientCard(page, MAIN_ID).getByTestId('ingredient-name').click();

    await expect(page).toHaveURL(`/ingredients/${MAIN_ID}`);
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('ingredient-details-name')).toHaveText(
      MAIN_NAME
    );
  });

  test('модальное окно закрывается по клику на крестик', async ({ page }) => {
    await ingredientCard(page, BUN_ID).getByTestId('ingredient-name').click();
    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-close-button').click();

    await expect(page.getByTestId('modal')).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });

  test('модальное окно закрывается по клику на оверлей', async ({ page }) => {
    await ingredientCard(page, SAUCE_ID).getByTestId('ingredient-name').click();
    await expect(page.getByTestId('modal')).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });

    await expect(page.getByTestId('modal')).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Оформление заказа', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer test-access-token',
        url: 'http://localhost:4000'
      }
    ]);
    await page.addInitScript(() => {
      window.localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    await page.routeFromHAR(ORDER_HAR, {
      url: '**/api/**',
      update: false
    });

    await page.goto('/');
    await expect(ingredientCard(page, BUN_ID)).toBeVisible();
  });

  test('после сборки бургера и клика «Оформить заказ» открывается модальное окно с верным номером заказа, конструктор очищается', async ({
    page
  }) => {
    await addIngredientToConstructor(page, BUN_ID);
    await addIngredientToConstructor(page, MAIN_ID);

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText('12345');

    await expect(page.getByTestId('constructor-bun-top-empty')).toBeVisible();
    await expect(
      page.getByTestId('constructor-ingredients-list')
    ).toContainText('Выберите начинку');

    await page.getByTestId('modal-close-button').click();
    await expect(modal).not.toBeVisible();
  });
});
