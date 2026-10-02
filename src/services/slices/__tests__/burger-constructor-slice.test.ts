import { TIngredient } from '@utils-types';
import {
  addIngredient,
  burgerConstructorReducer,
  clearConstructor,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from '../burger-constructor-slice';

describe('редьюсер слайса burgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const testBun: TIngredient = {
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
  };

  const testMain: TIngredient = {
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
  };

  const testSauce: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
  };

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = burgerConstructorReducer(undefined, {
      type: 'UNKNOWN_ACTION'
    });
    expect(state).toEqual(initialState);
  });

  test('addIngredient с булкой должен положить её в поле bun', () => {
    const state = burgerConstructorReducer(
      initialState,
      addIngredient(testBun)
    );

    expect(state.bun).not.toBeNull();
    expect(state.bun?._id).toBe(testBun._id);
    expect(typeof state.bun?.id).toBe('string');
    expect(state.ingredients).toHaveLength(0);
  });

  test('addIngredient с начинкой/соусом должен добавить её в конец массива ingredients и присвоить уникальный id', () => {
    const stateAfterFirst = burgerConstructorReducer(
      initialState,
      addIngredient(testMain)
    );
    const state = burgerConstructorReducer(
      stateAfterFirst,
      addIngredient(testSauce)
    );

    expect(state.ingredients).toHaveLength(2);
    expect(state.ingredients[0]._id).toBe(testMain._id);
    expect(state.ingredients[1]._id).toBe(testSauce._id);
    expect(typeof state.ingredients[0].id).toBe('string');
    expect(typeof state.ingredients[1].id).toBe('string');
    expect(state.ingredients[0].id).not.toBe(state.ingredients[1].id);
  });

  test('removeIngredient должен удалить ингредиент по его id', () => {
    const stateWithIngredients = burgerConstructorReducer(
      burgerConstructorReducer(initialState, addIngredient(testMain)),
      addIngredient(testSauce)
    );
    const idToRemove = stateWithIngredients.ingredients[0].id;

    const state = burgerConstructorReducer(
      stateWithIngredients,
      removeIngredient(idToRemove)
    );

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(testSauce._id);
  });

  test('moveIngredientUp должен поменять местами ингредиент с предыдущим', () => {
    const stateWithIngredients = burgerConstructorReducer(
      burgerConstructorReducer(initialState, addIngredient(testMain)),
      addIngredient(testSauce)
    );

    const state = burgerConstructorReducer(
      stateWithIngredients,
      moveIngredientUp(1)
    );

    expect(state.ingredients[0]._id).toBe(testSauce._id);
    expect(state.ingredients[1]._id).toBe(testMain._id);
  });

  test('moveIngredientUp не должен ничего менять для первого элемента (index === 0)', () => {
    const stateWithIngredients = burgerConstructorReducer(
      burgerConstructorReducer(initialState, addIngredient(testMain)),
      addIngredient(testSauce)
    );

    const state = burgerConstructorReducer(
      stateWithIngredients,
      moveIngredientUp(0)
    );

    expect(state.ingredients[0]._id).toBe(testMain._id);
    expect(state.ingredients[1]._id).toBe(testSauce._id);
  });

  test('moveIngredientDown должен поменять местами ингредиент со следующим', () => {
    const stateWithIngredients = burgerConstructorReducer(
      burgerConstructorReducer(initialState, addIngredient(testMain)),
      addIngredient(testSauce)
    );

    const state = burgerConstructorReducer(
      stateWithIngredients,
      moveIngredientDown(0)
    );

    expect(state.ingredients[0]._id).toBe(testSauce._id);
    expect(state.ingredients[1]._id).toBe(testMain._id);
  });

  test('moveIngredientDown не должен ничего менять для последнего элемента', () => {
    const stateWithIngredients = burgerConstructorReducer(
      burgerConstructorReducer(initialState, addIngredient(testMain)),
      addIngredient(testSauce)
    );

    const state = burgerConstructorReducer(
      stateWithIngredients,
      moveIngredientDown(1)
    );

    expect(state.ingredients[0]._id).toBe(testMain._id);
    expect(state.ingredients[1]._id).toBe(testSauce._id);
  });

  test('clearConstructor должен очистить и булку, и список ингредиентов', () => {
    const filledState = burgerConstructorReducer(
      burgerConstructorReducer(initialState, addIngredient(testBun)),
      addIngredient(testMain)
    );

    const state = burgerConstructorReducer(filledState, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
