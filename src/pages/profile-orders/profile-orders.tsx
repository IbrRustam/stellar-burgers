import { useEffect } from 'react';
import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectProfileOrders } from '@selectors';
import { profileOrdersWsConnect, profileOrdersWsDisconnect } from '@slices';
import { getUserOrdersWsUrl } from '../../utils/ws-url';
import { getCookie } from '../../utils/cookie';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectProfileOrders);

  useEffect(() => {
    const accessToken = getCookie('accessToken');
    if (!accessToken) return;

    dispatch(profileOrdersWsConnect(getUserOrdersWsUrl(accessToken)));
    return () => {
      dispatch(profileOrdersWsDisconnect());
    };
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
