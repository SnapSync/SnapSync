import { useQuery } from '@tanstack/react-query';
import ApiKeys from './apiKeys';
import { myFriendsCount } from '..';
import { getReduxStore } from '@/utils/redux/store';

export const useMyFriendsCount = () => {
  const isSignedIn = getReduxStore().AppReducer?.isSignedIn;
  const tokenData = getReduxStore().AppReducer?.tokenData;

  return useQuery({
    queryKey: ApiKeys.myFriendsCount,
    queryFn: myFriendsCount,
    enabled: isSignedIn && tokenData !== undefined,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
