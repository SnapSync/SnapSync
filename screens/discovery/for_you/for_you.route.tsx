import React from "react";
import { useQuery } from "@tanstack/react-query";
import ForYouKeys from "./for_you.keys";
import { FetchSuggestions } from "@/api/routes/friendships.route";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { IApiUser } from "@/interfaces/users.interface";
import { Button, ButtonText, View } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import UserItem, {
  USER_ITEM_MIN_HEIGHT,
} from "@/components/user_item/user_item.component";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import i18n from "@/lang";
import { useFocusEffect } from "@react-navigation/native";

type Props = {
  goToProfile?: (item: IApiUser) => void;
};

const ForYouRoute = ({ goToProfile }: Props) => {
  const insets = useSafeAreaInsets();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  const { data } = useQuery({
    queryKey: ForYouKeys.suggestions,
    queryFn: () => FetchSuggestions(tokenApi),
    enabled: isLoggedIn,
    // gcTime: Infinity,
    // staleTime: Infinity,
  });

  useFocusEffect(
    React.useCallback(() => {
      console.log("ForYou focused");
    }, [])
  );

  return (
    <View flex={1} backgroundColor="transparent">
      <FlashList
        data={data?.data || []}
        estimatedItemSize={USER_ITEM_MIN_HEIGHT}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingBottom: insets.bottom,
        }}
        renderItem={({ item }) => (
          <View
            flex={1}
            backgroundColor="transparent"
            key={item.id}
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <UserItem user={item} onPress={() => goToProfile?.(item)} />
            <View
              height="100%"
              backgroundColor="transparent"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                action="secondary"
                variant="solid"
                size="sm"
                borderRadius="$3xl"
              >
                <ButtonText>
                  {i18n.t("userProfileScreen.friendship.add")}
                </ButtonText>
              </Button>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ForYouRoute;
