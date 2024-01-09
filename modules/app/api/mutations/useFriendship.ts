import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiKeys from '../queries/apiKeys';
import { acceptFriendRequest, destroyFriendRequest, sendFriendRequest } from '..';
import { IResult, isIError } from '@/utils/network/Abstract';
import { IFriendshipStatusDTO } from '../../types/IFriendshipStatusDTO';

type FriendshipStatus = IResult<IFriendshipStatusDTO>;

export function useCreateFriendship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: number }) => sendFriendRequest(data.userId),
    onMutate: async (variables) => {
      // Cancello la query per evitare inconsistenze
      await queryClient.cancelQueries({
        queryKey: ApiKeys.show(variables.userId),
      });

      // In caso di successo aggiorno isNotSynced
      queryClient.setQueryData<FriendshipStatus>(ApiKeys.show(variables.userId), (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            result: {
              ...oldData.result,
              outgoingRequest: true,
              isNotSynced: true,
            },
          };
        }
      });
    },
    onSuccess: (data, variables, context) => {
      // In case di successo aggiorno isNotSynced
      queryClient.setQueryData<FriendshipStatus>(ApiKeys.show(variables.userId), () => {
        return {
          ...data,
          result: {
            ...data.result,
            isNotSynced: false,
          },
        };
      });
    },
    onError: (error, variables, context) => {
      // TODO
      // 404 -> L'utente non esiste, torno allo stato iniziale
      // 400 -> Succede quando l'utente prova ad aggiungere se stesso, oppure se l'utente loggato ha bloccato l'utente che sta cercando di aggiungere
      if (isIError(error) && error.status === 404) {
        console.log('404');
      } else {
        console.log(error);
      }
      // In caso di errore ripristino isNotSynced
      // queryClient.setQueryData(ApiKeys.show(variables.userId), (oldData: any) => {
      //   return {
      //     ...oldData,
      //     outgoingRequest: false,
      //     isNotSynced: false,
      //   };
      // });
    },
  });
}

export function useDestroyFriendship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: number }) => destroyFriendRequest(data.userId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ApiKeys.show(variables.userId),
      });

      queryClient.setQueryData<FriendshipStatus>(ApiKeys.show(variables.userId), (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            result: {
              ...oldData.result,
              outgoingRequest: false,
              isFriend: false,
              isNotSynced: true,
            },
          };
        }
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<FriendshipStatus>(ApiKeys.show(variables.userId), () => {
        return {
          ...data,
          result: {
            ...data.result,
            isNotSynced: false,
          },
        };
      });

      // TODO: Rimuovere l'utente dalla lista degli amici
    },
    onError: (error, variables, context) => {
      console.log('onError', error, variables, context);
    },
  });
}

export function useAcceptFriendship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: number }) => acceptFriendRequest(data.userId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ApiKeys.show(variables.userId),
      });

      queryClient.setQueryData<FriendshipStatus>(ApiKeys.show(variables.userId), (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            result: {
              ...oldData.result,
              isFriend: true,
              incomingRequest: false,
              isNotSynced: true,
            },
          };
        }
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<FriendshipStatus>(ApiKeys.show(variables.userId), () => {
        return {
          ...data,
          result: {
            ...data.result,
            isNotSynced: false,
          },
        };
      });
    },
    onError: (error, variables, context) => {
      console.log('onError', error, variables, context);
    },
  });
}

export function useRejectFriendship() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: number }) => acceptFriendRequest(data.userId),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({
        queryKey: ApiKeys.show(variables.userId),
      });

      queryClient.setQueryData<FriendshipStatus>(ApiKeys.show(variables.userId), (oldData) => {
        if (oldData) {
          return {
            ...oldData,
            result: {
              ...oldData.result,
              incomingRequest: false,
              isNotSynced: true,
            },
          };
        }
      });
    },
    onSuccess: (data, variables, context) => {
      queryClient.setQueryData<FriendshipStatus>(ApiKeys.show(variables.userId), () => {
        return {
          ...data,
          result: {
            ...data.result,
            isNotSynced: false,
          },
        };
      });
    },
    onError: (error, variables, context) => {
      console.log('onError', error, variables, context);
    },
  });
}
