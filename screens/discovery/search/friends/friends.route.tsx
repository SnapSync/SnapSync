import {
  Spinner,
  View,
  useColorMode,
  Text,
  Button,
  ButtonIcon,
  ButtonText,
} from "@gluestack-ui/themed";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import friendsKeys from "./queries";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { FetchUserFriends } from "@/api/routes/friendships.route";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IApiUser } from "@/interfaces/users.interface";
import { FlashList } from "@shopify/flash-list";
import UserItem from "@/components/user_item/user_item.component";
import { Layout } from "@/costants/Layout";
import i18n from "@/lang";
import { Contact2Icon } from "lucide-react-native";

type Props = {
  onPressUser?: (user: IApiUser) => void;
  onPressSearchContacts?: () => void;
};

const FriendsRoute = ({ onPressUser }: Props) => {
  const colorMode = useColorMode();
  const insets = useSafeAreaInsets();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const {
    fetchNextPage,
    fetchPreviousPage,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    ...result
  } = useInfiniteQuery({
    queryKey: friendsKeys.infinite,
    initialPageParam: 1,
    staleTime: Infinity,
    gcTime: Infinity,
    enabled: isLoggedIn,
    // refetchOnWindowFocus: false,
    // refetchInterval: false,
    // refetchOnMount: false,
    // refetchIntervalInBackground: false,
    queryFn: async ({ pageParam }) => FetchUserFriends(pageParam, tokenApi),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <View
      style={[
        {
          flex: 1,
          paddingLeft: insets.left + Layout.DefaultMarginHorizontal,
          paddingRight: insets.right + Layout.DefaultMarginHorizontal,
        },
      ]}
    >
      <FlashList
        data={result.data?.pages.map((page) => page.data).flat()}
        estimatedItemSize={50}
        renderItem={({ item }) => (
          <UserItem
            user={item}
            onPress={() => onPressUser?.(item)}
            withDarkMode={colorMode === "dark" ? true : false}
            showUnfriendButton={true}
            // onPressUnfriend={() => unfriend(item.id, item.username)}
          />
        )}
        keyExtractor={(_, index) => index.toString()}
        onEndReached={() => {
          if (hasNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={() => {
          if (!result.isLoading && !result.isError) {
            return (
              <View
                style={{
                  width: "100%",
                  // height: 20,
                  alignSelf: "center",
                  // borderRadius: 16,
                  padding: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                }}
                bgColor={
                  colorMode === "dark"
                    ? "$backgroundDark700"
                    : "$backgroundLight100"
                }
                rounded="$lg"
              >
                <Text
                  fontFamily="Inter-SemiBold"
                  fontSize={14}
                  color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
                >
                  {i18n.t("search.noResults.friendsTitle")}
                </Text>
                <Button
                  action="secondary"
                  size="sm"
                  rounded="$lg"
                  gap={10}
                  width="100%"
                >
                  <ButtonIcon as={Contact2Icon} size="sm" />
                  <ButtonText fontFamily="Inter-SemiBold">
                    {i18n.t("search.noResults.friendsButton")}
                  </ButtonText>
                </Button>
              </View>
            );
          }

          return null;
        }}
        ListFooterComponent={() =>
          isFetchingNextPage && <Spinner size="small" />
        }
      />
    </View>
  );
};

export default FriendsRoute;
