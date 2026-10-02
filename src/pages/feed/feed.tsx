import { useEffect } from 'react';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectFeedOrders } from '@selectors';
import { feedWsConnect, feedWsDisconnect } from '@slices';
import { FEED_WS_URL } from '../../utils/ws-url';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);

  useEffect(() => {
    dispatch(feedWsConnect(FEED_WS_URL));
    return () => {
      dispatch(feedWsDisconnect());
    };
  }, [dispatch]);

  const handleGetFeeds = () => {
    dispatch(feedWsDisconnect());
    dispatch(feedWsConnect(FEED_WS_URL));
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
