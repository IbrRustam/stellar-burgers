import { TIngredient } from '@utils-types';
import { fetchIngredients, ingredientsReducer } from '../ingredients-slice';

describe('редьюсер слайса ingredients', () => {
  const initialState = {
    items: [],
    isLoading: false,
    error: null
  };

  const testIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
    }
  ];

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('должен установить isLoading в true и сбросить error при pending', () => {
    const state = ingredientsReducer(
      { ...initialState, error: 'предыдущая ошибка' },
      { type: fetchIngredients.pending.type }
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен сохранить полученные ингредиенты и снять isLoading при fulfilled', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      {
        type: fetchIngredients.fulfilled.type,
        payload: testIngredients
      }
    );

    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(testIngredients);
  });

  test('должен сохранить текст ошибки и снять isLoading при rejected', () => {
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      {
        type: fetchIngredients.rejected.type,
        error: { message: 'Не удалось загрузить ингредиенты' }
      }
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });
});
