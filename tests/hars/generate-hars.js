const fs = require('fs');
const path = require('path');

const API_URL = 'https://norma.education-services.ru/api';

const ingredient = (overrides) => ({
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  __v: 0,
  ...overrides
});

const ingredients = [
  ingredient(),
  ingredient({
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  }),
  ingredient({
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  }),
  ingredient({
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Плоды Фалленианского дерева',
    type: 'main',
    proteins: 20,
    fat: 5,
    carbohydrates: 55,
    calories: 77,
    price: 874,
    image: 'https://code.s3.yandex.net/react/code/sp_1.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sp_1-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sp_1-large.png'
  })
];

const user = { email: 'test-user@stellar-burgers.test', name: 'Test User' };

const newOrder = {
  _id: '66f000000000000000000001',
  ingredients: [ingredients[0]._id, ingredients[1]._id, ingredients[0]._id],
  status: 'done',
  name: 'Краторный люминесцентный бургер',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:05.000Z',
  number: 12345,
  price: ingredients[0].price * 2 + ingredients[1].price
};

const buildEntry = ({ method, url, status = 200, body }) => {
  const text = JSON.stringify(body);
  return {
    startedDateTime: '2026-01-01T00:00:00.000Z',
    time: 1,
    request: {
      method,
      url,
      httpVersion: 'HTTP/1.1',
      cookies: [],
      headers: [{ name: 'content-type', value: 'application/json' }],
      queryString: [],
      headersSize: -1,
      bodySize: -1
    },
    response: {
      status,
      statusText: 'OK',
      httpVersion: 'HTTP/1.1',
      cookies: [],
      headers: [{ name: 'content-type', value: 'application/json; charset=utf-8' }],
      content: {
        size: text.length,
        mimeType: 'application/json; charset=utf-8',
        text
      },
      redirectURL: '',
      headersSize: -1,
      bodySize: -1
    },
    cache: {},
    timings: { send: 0, wait: 0, receive: 0 }
  };
};

const buildHar = (entries) => ({
  log: {
    version: '1.2',
    creator: { name: 'stellar-burgers-mocks', version: '1.0' },
    entries
  }
});

const ingredientsHar = buildHar([
  buildEntry({
    method: 'GET',
    url: `${API_URL}/ingredients`,
    body: { success: true, data: ingredients }
  })
]);

const orderHar = buildHar([
  buildEntry({
    method: 'GET',
    url: `${API_URL}/ingredients`,
    body: { success: true, data: ingredients }
  }),
  buildEntry({
    method: 'GET',
    url: `${API_URL}/auth/user`,
    body: { success: true, user }
  }),
  buildEntry({
    method: 'POST',
    url: `${API_URL}/orders`,
    body: {
      success: true,
      name: newOrder.name,
      order: newOrder
    }
  })
]);

fs.writeFileSync(
  path.join(__dirname, 'ingredients.har'),
  JSON.stringify(ingredientsHar, null, 2)
);
fs.writeFileSync(
  path.join(__dirname, 'order.har'),
  JSON.stringify(orderHar, null, 2)
);

console.log('HAR files generated: ingredients.har, order.har');
