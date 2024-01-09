import { useInfiniteQuery } from '@tanstack/react-query';
import ApiKeys from './apiKeys';
import { myFriends } from '..';
import { getReduxStore } from '@/utils/redux/store';

export const useMyInfiniteFriendsList = () => {
  const isSignedIn = getReduxStore().AppReducer?.isSignedIn;
  const tokenData = getReduxStore().AppReducer?.tokenData;

  return useInfiniteQuery({
    queryKey: ApiKeys.myInfiniteFriendsList,
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => myFriends(pageParam),
    enabled: isSignedIn && tokenData !== undefined,
    staleTime: Infinity,
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.result.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.result.prevCursor,
  });
};
