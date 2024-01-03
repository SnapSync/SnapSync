import { Animated, StyleSheet, TextInput, Easing } from "react-native";
import React, { useRef, useState } from "react";
import {
  ChevronLeftIcon,
  Icon,
  View,
  Text,
  Pressable,
  useColorMode,
  Button,
  ButtonIcon,
} from "@gluestack-ui/themed";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/utils/helper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchIcon } from "lucide-react-native";
import { Layout } from "@/costants/Layout";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import i18n from "@/lang";
import HomeSearchContentComponent from "./home_search_content/home_search_content.component";

const AnimatedView = Animated.createAnimatedComponent(View);

export const HEADER_HEIGHT = 80;

type Props = {};

const HomeSearch = (props: Props) => {
  const colorMode = useColorMode();
  const insets = useSafeAreaInsets();
  const bottomTabBarHeight = useBottomTabBarHeight();

  const inputBoxTranslateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const backButtonOpacity = useRef(new Animated.Value(0)).current;
  const contentTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const contentOpacity = useRef(new Animated.Value(0)).current;

  const [isFocused, setIsFocused] = useState(false);
  const [keyword, setKeyword] = useState("");

  const inputRef = useRef<TextInput>(null);

  const _onFocus = () => {
    setIsFocused(true);

    Animated.parallel([
      Animated.timing(inputBoxTranslateX, {
        duration: 200,
        toValue: 0,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(backButtonOpacity, {
        duration: 200,
        toValue: 1,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        duration: 0,
        toValue: 0,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        duration: 200,
        toValue: 1,
        delay: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {
      inputRef.current?.focus();
    });
  };

  const _onBlur = () => {
    setIsFocused(false);

    inputRef.current?.blur();

    Animated.parallel([
      Animated.timing(inputBoxTranslateX, {
        duration: 200,
        toValue: SCREEN_WIDTH,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(backButtonOpacity, {
        duration: 50,
        toValue: 0,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        duration: 200,
        toValue: 0,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslateY, {
        duration: 200,
        toValue: SCREEN_HEIGHT,
        delay: 200,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start(() => {});

    setKeyword("");
  };

  const _onSubmitEditing = () => {
    console.log("submit: ", keyword);
  };

  // TODO: Su android quando faccio il focus, la tasiera si apre, ma il contenuto si sposta verso l'alto: devo risolvere questo problema, facendo in modo che la tastera vada sopra il contenuto

  return (
    <>
      <View
        style={[
          styles.header,
          {
            height: HEADER_HEIGHT + insets.top,
            paddingTop: insets.top,
            paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
            paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          },
        ]}
      >
        <View style={[styles.headerInner]}>
          <Text fontFamily="Inter_900Black" size="xl">
            SnapSync
          </Text>
          <Button
            onPress={_onFocus}
            style={[styles.searchIconBox]}
            action="secondary"
            borderRadius="$full"
            variant="solid"
          >
            <ButtonIcon as={SearchIcon} size="sm" />
          </Button>
          <AnimatedView
            style={[
              styles.inputBox,
              {
                transform: [
                  {
                    translateX: inputBoxTranslateX,
                  },
                ],
              },
            ]}
          >
            <Animated.View
              style={{
                opacity: backButtonOpacity,
              }}
            >
              <Pressable
                onPress={_onBlur}
                style={[styles.backIconBox]}
                borderRadius="$full"
              >
                <Icon
                  as={ChevronLeftIcon}
                  size="md"
                  color={colorMode === "dark" ? "$textDark0" : "$textLight950"}
                />
              </Pressable>
            </Animated.View>
            <TextInput
              ref={inputRef}
              placeholder={i18n.t("homeScreen.searchPlaceholder")}
              placeholderTextColor={
                colorMode === "dark" ? "#A3A3A3" : "#A3A3A3"
              }
              clearButtonMode="always"
              value={keyword}
              onChangeText={setKeyword}
              selectionColor={colorMode === "dark" ? "#FCFCFC" : "#171717"}
              keyboardAppearance={colorMode === "dark" ? "dark" : "light"}
              returnKeyType="search"
              onSubmitEditing={_onSubmitEditing}
              style={[
                styles.input,
                {
                  backgroundColor: colorMode === "dark" ? "#262626" : "#F5F5F5",
                  color: colorMode === "dark" ? "#FCFCFC" : "#171717",
                },
              ]}
            />
          </AnimatedView>
        </View>
      </View>

      <HomeSearchContentComponent
        headerHeight={HEADER_HEIGHT}
        contentOpacity={contentOpacity}
        contentTranslateY={contentTranslateY}
      />
    </>
  );
};

export default HomeSearch;

const styles = StyleSheet.create({
  header: {
    backgroundColor: "transparent",
  },
  headerInner: {
    flex: 1,
    overflow: "hidden",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "relative",
    backgroundColor: "transparent",
  },
  searchIconBox: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  inputBox: {
    height: "100%",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  backIconBox: {
    // width: 40,
    // height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontFamily: "Inter_400Regular",
  },
});
