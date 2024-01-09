import { useQuery } from '@tanstack/react-query';
import ApiKeys from './apiKeys';
import { getMe } from '..';
import { getReduxStore } from '@/utils/redux/store';

export const useMe = () => {
  const isSignedIn = getReduxStore().AppReducer?.isSignedIn;
  const tokenData = getReduxStore().AppReducer?.tokenData;

  return useQuery({
    queryKey: ApiKeys.me,
    queryFn: getMe,
    enabled: isSignedIn && tokenData !== undefined,
    staleTime: Infinity,
    gcTime: Infinity,
  });
};
