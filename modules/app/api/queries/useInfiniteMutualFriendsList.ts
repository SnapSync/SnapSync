import { useInfiniteQuery } from '@tanstack/react-query';
import ApiKeys from './apiKeys';
import { mutualFriends } from '..';
import { getReduxStore } from '@/utils/redux/store';

export const useInfiniteMutualFriendsList = (id: number, size?: number) => {
  const isSignedIn = getReduxStore().AppReducer?.isSignedIn;
  const tokenData = getReduxStore().AppReducer?.tokenData;

  return useInfiniteQuery({
    queryKey: ApiKeys.infiniteMutualFriendsList(id),
    initialPageParam: 1,
    queryFn: ({ pageParam = 1 }) => mutualFriends(id, pageParam, size),
    enabled: isSignedIn && tokenData && id > 0, // Only fetch if signed in and id is truthy
    staleTime: Infinity,
    gcTime: Infinity,
    getNextPageParam: (lastPage) => lastPage.result.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.result.prevCursor,
  });
};
