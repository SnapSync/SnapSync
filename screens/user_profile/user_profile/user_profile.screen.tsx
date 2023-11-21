import React, { useCallback } from "react";
import { UserProfileStackScreenProps } from "@/types";
import { View, useColorMode } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { Animated } from "react-native";
import { SCREEN_WIDTH } from "@/utils/helper";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useQuery } from "@tanstack/react-query";
import { FetchMe } from "@/api/routes/users.route";
import { useConnectivity } from "@/hooks/useConnectivity";
import UserProfileAnimatedHeader from "@/components/user_profile_animated_header/user_profile_animated_header.component";
import UserProfileNavBar from "@/components/user_profile_navbar/user_profile_navbar.component";
import { BottomSheetModal, useBottomSheetModal } from "@gorhom/bottom-sheet";
import bottomSheetModalStyles from "@/styles/bottomsheet_modal.styles";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const UserProfileScreen = ({
  navigation,
  route,
}: UserProfileStackScreenProps<"UserProfile">) => {
  const { isConnected } = useConnectivity();
  const { dismissAll } = useBottomSheetModal();
  const colorMode = useColorMode();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const scrollY = React.useRef(new Animated.Value(0)).current;
  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const snapPoints = React.useMemo(() => ["25%", "50%"], []);

  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: () => FetchMe(tokenApi),
    enabled: isLoggedIn && isConnected ? true : false,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnReconnect: true,
  });

  React.useEffect(() => {
    return () => dismissAll();
  }, []);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const goBack = () => navigation.goBack();

  return (
    <View style={{ flex: 1 }}>
      <UserProfileNavBar
        withDarkMode={
          data && data.profilePicture
            ? false
            : colorMode === "dark"
            ? true
            : false
        }
        username={data?.username}
        isVerified={data?.isVerified}
        onPressBack={goBack}
        onPressOptions={handlePresentModalPress}
      />

      <AnimatedFlashList
        data={new Array(20).fill(0).map((_, index) => index)}
        renderItem={({ item }) => (
          <View
            style={{
              height: 100,
              backgroundColor: "blue",
              marginVertical: 10,
            }}
          />
        )}
        keyExtractor={(item, index) => index.toString()}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={100}
        ListHeaderComponent={
          <UserProfileAnimatedHeader
            imageHeight={SCREEN_WIDTH}
            scrollY={scrollY}
          />
        }
      />

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        backgroundStyle={[
          colorMode === "dark"
            ? bottomSheetModalStyles.backgroundStyleDark
            : bottomSheetModalStyles.backgroundStyleLight,
        ]}
        handleIndicatorStyle={[
          colorMode === "dark"
            ? bottomSheetModalStyles.handleIndicatorStyleDark
            : bottomSheetModalStyles.handleIndicatorStyleLight,
        ]}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "transparent",
            alignItems: "center",
            justifyContent: "center",
          }}
        ></View>
      </BottomSheetModal>
    </View>
  );
};

export default UserProfileScreen;
