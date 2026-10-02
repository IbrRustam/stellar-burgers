const API_URL = process.env.BURGER_API_URL || '';

export const WS_URL = API_URL.replace(/^http/, 'ws').replace(/\/api\/?$/, '');

export const FEED_WS_URL = `${WS_URL}/orders/all`;

export const getUserOrdersWsUrl = (accessToken: string) => {
  const token = accessToken.replace('Bearer ', '');
  return `${WS_URL}/orders?token=${token}`;
};
