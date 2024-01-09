import { useQuery } from '@tanstack/react-query';
import ApiKeys from './apiKeys';
import { showFriendship } from '..';
import { getReduxStore } from '@/utils/redux/store';

export const useShowFriendship = (id: number) => {
  const isSignedIn = getReduxStore().AppReducer?.isSignedIn;
  const tokenData = getReduxStore().AppReducer?.tokenData;

  return useQuery({
    queryKey: ApiKeys.show(id),
    queryFn: () => showFriendship(id),
    enabled: isSignedIn && tokenData && id > 0, // Only run the query if the user is signed in and the id is not null
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
