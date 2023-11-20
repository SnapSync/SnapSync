import React from "react";
import { UserProfileStackScreenProps } from "@/types";
import {
  ChevronLeftIcon,
  Icon,
  View,
  useColorMode,
  ScrollView,
  Text,
  ThreeDotsIcon,
} from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import { Animated } from "react-native";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/helper";
// import { Image } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { useQuery } from "@tanstack/react-query";
import { FetchMe } from "@/api/routes/users.route";
import { useConnectivity } from "@/hooks/useConnectivity";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import VerifiedBadge from "@/components/verified_badge/verified_badge.component";
import { AnimatedScrollView } from "@kanelloc/react-native-animated-header-scroll-view";
import { ImageBackground, Image } from "expo-image";

let width = 375;
let height = 508;

// Calcolo il rapporto tra la larghezza dello schermo e quella dell'immagine
const ratio = width / height;

const AnimatedImageBackground =
  Animated.createAnimatedComponent(ImageBackground);

const AnimatedImage = Animated.createAnimatedComponent(Image);

const UserProfileScreen = ({
  navigation,
  route,
}: UserProfileStackScreenProps<"UserProfile">) => {
  const colorMode = useColorMode();
  const insets = useSafeAreaInsets();

  const { isConnected } = useConnectivity();

  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const { data } = useQuery({
    queryKey: ["me"],
    queryFn: () => FetchMe(tokenApi),
    enabled: isLoggedIn,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnReconnect: true,
  });

  const goBack = () => navigation.goBack();

  return (
    <View style={{ flex: 1 }}>
      {/* <TouchableOpacity
        onPress={goBack}
        style={{
          position: "absolute",
          left: 24,
          top: insets.top + 40,
        }}
      >
        <Icon as={ChevronLeftIcon} size="sm" color={Layout.LightBgc} />
      </TouchableOpacity> */}
      {/* <AnimatedImageBackground
        source={{
          uri: data?.profilePictureUrl,
        }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          height: SCREEN_WIDTH,
          transform: [
            {
              scale: scrollY.interpolate({
                inputRange: [-150, 0],
                outputRange: [2, 1],
                extrapolateLeft: "extend",
                extrapolateRight: "clamp",
              }),
            },
          ],
        }}
      /> */}

      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        style={{
          backgroundColor: "red",
        }}
      >
        <Animated.Image
          style={{
            height: SCREEN_WIDTH,
            width: SCREEN_WIDTH,
            transform: [
              {
                translateY: scrollY.interpolate({
                  inputRange: [
                    -SCREEN_WIDTH,
                    0,
                    SCREEN_WIDTH,
                    SCREEN_WIDTH + 1,
                  ],
                  outputRange: [
                    SCREEN_WIDTH / 2,
                    0,
                    SCREEN_WIDTH * 0.75,
                    SCREEN_WIDTH * 0.75,
                  ],
                }),
              },
              {
                scale: scrollY.interpolate({
                  inputRange: [
                    -SCREEN_WIDTH,
                    0,
                    SCREEN_WIDTH,
                    SCREEN_WIDTH + 1,
                  ],
                  outputRange: [2, 1, 0.5, 0.5],
                }),
              },
            ],
          }}
          source={{
            uri: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?h=360&w=360&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww",
          }}
        />
        {new Array(20).fill(0).map((_, index) => (
          <View
            key={index}
            style={{ height: 100, backgroundColor: "blue", marginVertical: 10 }}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
};

export default UserProfileScreen;
