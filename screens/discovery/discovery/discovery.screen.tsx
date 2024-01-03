import React from "react";
import {
  View,
  useColorMode,
  Text,
  ScrollView,
  Button,
  ButtonText,
  Pressable,
  Icon,
  CloseIcon,
  ButtonSpinner,
  Spinner,
  Input,
  InputField,
} from "@gluestack-ui/themed";
import i18n from "@/lang";
import { IApiUser } from "@/interfaces/users.interface";
import { DiscoveryStackScreenProps } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import UserItem from "@/components/user_item/user_item.component";
import { Alert } from "react-native";
import { useQuery } from "@tanstack/react-query";
import DiscoveryKeys from "./discovery.keys";
import { FetchSuggestions } from "@/api/routes/friendships.route";
import Animated from "react-native-reanimated";
import { Divider } from "@gluestack-ui/themed";
import { SearchByQuery } from "@/api/routes/searches.route";
import { Skeleton } from "moti/skeleton";
import { useDenyFriendship } from "@/api/mutations/useDenyFriendship";
import { useAcceptFriendship } from "@/api/mutations/useAcceptFriendship";
import { useCreateFriendship } from "@/api/mutations/useCreateFriendship";
import { useInfiniteIncominFriendshipRequests } from "@/api/queries/useInfiniteIncominRequests";

const AnimatedView = Animated.createAnimatedComponent(View);

const DiscoveryScreen = ({
  navigation,
}: DiscoveryStackScreenProps<"Discovery">) => {
  const insets = useSafeAreaInsets();
  const colorMode = useColorMode();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [query, setQuery] = React.useState("");

  const denyFriendshipMutation = useDenyFriendship();

  const acceptFriendshipMutation = useAcceptFriendship();

  const createFriendshipMutation = useCreateFriendship();

  const { data } = useInfiniteIncominFriendshipRequests(isLoggedIn, tokenApi);

  const { data: peopleYouMayKnowData } = useQuery({
    queryKey: DiscoveryKeys.infinitePeopleYouMayKnow,
    queryFn: () => FetchSuggestions(tokenApi),
    enabled: isLoggedIn,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const {
    data: searchData,
    isLoading: searchIsLoading,
    refetch: searchRefetch,
  } = useQuery({
    queryKey: DiscoveryKeys.search(query),
    queryFn: () => SearchByQuery(query, tokenApi),
    enabled: false,
  });

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 0) searchRefetch();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const goToReceivedFriendRequests = () => {
    navigation.navigate("IncomingFriendRequests", {
      total: data && data.pages && data.pages[0] && data.pages[0].total,
    });
  };

  const reject = (userId: number) => {
    Alert.alert(
      i18n.t("rejectAlert.title"),
      i18n.t("rejectAlert.description"),
      [
        {
          text: i18n.t("cancel"),
          style: "cancel",
        },
        {
          text: i18n.t("reject"),
          onPress: () => {
            denyFriendshipMutation.mutate({ userId, tokenApi });
          },
          style: "destructive",
        },
      ]
    );
  };

  const accept = (userId: number) => {
    acceptFriendshipMutation.mutate({ userId, tokenApi });
  };

  const sent = (userId: number) => {
    createFriendshipMutation.mutate({ userId, tokenApi });
  };

  const goToUserProfile = (user: IApiUser, from?: "incoming" | "friends") => {
    navigation.navigate("UserProfileStack", {
      screen: "UserProfile",
      params: {
        ...user,
        friendshipLoader:
          from === "incoming"
            ? "incoming"
            : from === "friends"
            ? undefined
            : "add",
      },
    });
  };

  const _onChangeText = (text: string) => {
    setQuery(text);
  };

  return (
    <View flex={1} backgroundColor="transparent">
      <View
        width="100%"
        backgroundColor="transparent"
        paddingTop={20}
        paddingLeft={insets.left + Layout.ScreenPaddingHorizontal}
        paddingRight={insets.right + Layout.ScreenPaddingHorizontal}
      >
        <Input>
          <InputField
            placeholder={i18n.t("discoveryScreen.searchPlaceholder")}
            value={query}
            onChangeText={_onChangeText}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardAppearance={colorMode === "dark" ? "dark" : "light"}
          />
        </Input>
      </View>
      <Divider my={20} />
      <ScrollView
        contentContainerStyle={{
          // paddingTop: 20,
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
        backgroundColor="transparent"
      >
        {query.length > 0 ? (
          <View backgroundColor="transparent" gap="$5">
            <View backgroundColor="transparent">
              {searchIsLoading ? (
                <>
                  <Skeleton
                    height={24}
                    width={"30%"}
                    colorMode={colorMode === "dark" ? "dark" : "light"}
                  />
                  {new Array(5).fill(0).map((_, index) => (
                    <UserItem isLoading key={index} />
                  ))}
                </>
              ) : searchData && searchData.friends.length > 0 ? (
                <>
                  <Text fontFamily="Inter_600SemiBold" size="md">
                    {i18n.t("friends")}
                  </Text>
                  {searchData.friends.map((user: IApiUser) => (
                    <UserItem
                      user={user}
                      onPress={() => goToUserProfile(user, "friends")}
                      key={`${user.id}friends`}
                    />
                  ))}
                </>
              ) : null}
            </View>
            <View backgroundColor="transparent">
              {searchIsLoading ? (
                <>
                  <Skeleton
                    height={24}
                    width={"30%"}
                    colorMode={colorMode === "dark" ? "dark" : "light"}
                  />
                  {new Array(5).fill(0).map((_, index) => (
                    <UserItem isLoading key={index} />
                  ))}
                </>
              ) : searchData && searchData.received.length > 0 ? (
                <>
                  <Text fontFamily="Inter_600SemiBold" size="md">
                    {i18n.t("incomingFriendRequests")}
                  </Text>
                  {searchData.received.map((user: IApiUser) => (
                    <UserItem
                      user={user}
                      onPress={() => goToUserProfile(user, "incoming")}
                      key={`${user.id}received`}
                    />
                  ))}
                </>
              ) : null}
            </View>
            <View backgroundColor="transparent">
              {searchIsLoading ? (
                <>
                  <Skeleton
                    height={24}
                    width={"30%"}
                    colorMode={colorMode === "dark" ? "dark" : "light"}
                  />
                  {new Array(5).fill(0).map((_, index) => (
                    <UserItem isLoading key={index} />
                  ))}
                </>
              ) : searchData && searchData.sent.length > 0 ? (
                <>
                  <Text fontFamily="Inter_600SemiBold" size="md">
                    {i18n.t("outgoingFriendRequests")}
                  </Text>
                  {searchData.sent.map((user: IApiUser) => (
                    <UserItem
                      user={user}
                      onPress={() => goToUserProfile(user, "incoming")}
                      key={`${user.id}received`}
                    />
                  ))}
                </>
              ) : null}
            </View>
            <View backgroundColor="transparent">
              {searchIsLoading ? (
                <>
                  <Skeleton
                    height={24}
                    width={"30%"}
                    colorMode={colorMode === "dark" ? "dark" : "light"}
                  />
                  {new Array(5).fill(0).map((_, index) => (
                    <UserItem isLoading key={index} />
                  ))}
                </>
              ) : searchData && searchData.others.length > 0 ? (
                <>
                  <Text fontFamily="Inter_600SemiBold" size="md">
                    {i18n.t("othersResults")}
                  </Text>
                  {searchData.others.map((user: IApiUser) => (
                    <UserItem
                      user={user}
                      onPress={() => goToUserProfile(user)}
                      key={`${user.id}others`}
                    />
                  ))}
                </>
              ) : null}
            </View>
          </View>
        ) : (
          <View backgroundColor="transparent" gap="$5">
            <View backgroundColor="transparent">
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                bgColor="transparent"
                width="$full"
              >
                <Text fontFamily="Inter_600SemiBold" size="md">
                  {i18n.t("incomingFriendRequests")}
                </Text>
                <Button variant="link" onPress={goToReceivedFriendRequests}>
                  <ButtonText fontFamily="Inter_600SemiBold">
                    Vedi tutto
                  </ButtonText>
                </Button>
              </View>
              {data?.pages[0]?.data.map((user: IApiUser) => (
                <View
                  flexDirection="row"
                  alignItems="center"
                  key={user.id}
                  backgroundColor="transparent"
                >
                  <UserItem
                    user={user}
                    onPress={() => goToUserProfile(user, "incoming")}
                  />
                  <View
                    backgroundColor="transparent"
                    height="$full"
                    flexDirection="row"
                    gap="$2"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      size="sm"
                      borderRadius="$full"
                      disabled={
                        (denyFriendshipMutation.isPending ||
                          acceptFriendshipMutation.isPending) &&
                        (denyFriendshipMutation.variables?.userId === user.id ||
                          acceptFriendshipMutation.variables?.userId ===
                            user.id)
                      }
                      onPress={() => accept(user.id)}
                    >
                      {(denyFriendshipMutation.isPending ||
                        acceptFriendshipMutation.isPending) &&
                      (denyFriendshipMutation.variables?.userId === user.id ||
                        acceptFriendshipMutation.variables?.userId ===
                          user.id) ? (
                        <ButtonSpinner size="small" />
                      ) : (
                        <ButtonText>{i18n.t("accept")}</ButtonText>
                      )}
                    </Button>
                    <Pressable
                      onPress={() => reject(user.id)}
                      disabled={
                        (denyFriendshipMutation.isPending ||
                          acceptFriendshipMutation.isPending) &&
                        (denyFriendshipMutation.variables?.userId === user.id ||
                          acceptFriendshipMutation.variables?.userId ===
                            user.id)
                      }
                    >
                      {(denyFriendshipMutation.isPending ||
                        acceptFriendshipMutation.isPending) &&
                      (denyFriendshipMutation.variables?.userId === user.id ||
                        acceptFriendshipMutation.variables?.userId ===
                          user.id) ? (
                        <Spinner size="small" />
                      ) : (
                        <Icon
                          as={CloseIcon}
                          size="sm"
                          color={
                            colorMode === "dark"
                              ? "$textDark0"
                              : "$textLight950"
                          }
                        />
                      )}
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
            <View backgroundColor="transparent">
              <View
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                bgColor="transparent"
                width="$full"
                marginTop="$6"
              >
                <Text fontFamily="Inter_600SemiBold" size="md">
                  {i18n.t("suggestionsForYou")}
                </Text>
              </View>
              {peopleYouMayKnowData?.data.map((user: IApiUser) => (
                <AnimatedView
                  flexDirection="row"
                  alignItems="center"
                  key={user.id}
                  backgroundColor="transparent"
                  // exiting={SlideOutLeft}
                >
                  <UserItem user={user} onPress={() => goToUserProfile(user)} />
                  <View
                    backgroundColor="transparent"
                    height="$full"
                    flexDirection="row"
                    gap="$2"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Button
                      size="sm"
                      borderRadius="$full"
                      disabled={
                        createFriendshipMutation.isPending &&
                        createFriendshipMutation.variables?.userId === user.id
                      }
                      onPress={() => sent(user.id)}
                    >
                      {createFriendshipMutation.isPending &&
                      createFriendshipMutation.variables?.userId === user.id ? (
                        <ButtonSpinner size="small" />
                      ) : (
                        <ButtonText>{i18n.t("add")}</ButtonText>
                      )}
                    </Button>
                  </View>
                </AnimatedView>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DiscoveryScreen;
