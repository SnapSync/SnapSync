import {
  Icon,
  Input,
  InputField,
  SearchIcon,
  View,
} from "@gluestack-ui/themed";
import React from "react";
import {
  Animated,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
  TouchableOpacity,
} from "react-native";
import animatedSearchBarStyles from "./animated_search_bar.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import i18n from "@/lang";

type Props = {
  fullWidth: number;
  shrinkWidth: number;

  defaultQuery?: string;
  onChangeQuery?: (query: string) => void;

  onFocus?: () => void;
  onBlur?: () => void;
  onPressCancel?: () => void;
  onPressEnter?: (text: string) => void;

  placeholder?: string;
  withDarkMode?: boolean;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const AnimatedSearchBar = ({
  fullWidth,
  shrinkWidth,
  defaultQuery,
  onChangeQuery,
  onFocus,
  onBlur,
  onPressCancel,
  onPressEnter,
  placeholder,
  withDarkMode = false,
}: Props) => {
  const insets = useSafeAreaInsets();

  const inputRef = React.useRef<any>(null);

  const [viewWidth] = React.useState(new Animated.Value(fullWidth));
  const [cancelPosition] = React.useState(new Animated.Value(0));
  const [opacity] = React.useState(new Animated.Value(0));

  const [searchBarFocused, setSearchBarFocused] = React.useState(false);
  const [query, setQuery] = React.useState(defaultQuery);

  const _onFocus = () => {
    onFocus?.();
    setSearchBarFocused(true);
    Animated.timing(viewWidth, {
      toValue: shrinkWidth,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      // Appena finisce l'animazione del viewWidth, mostro il cancel button
      Animated.parallel([
        Animated.timing(cancelPosition, {
          toValue: insets.right + Layout.DefaultMarginHorizontal,
          duration: 250,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 100,
          useNativeDriver: false,
        }),
      ]).start();
    });
  };

  const _onBlur = () => {
    onBlur?.();
    inputRef.current?.blur();
    setSearchBarFocused(false);
    // Nascondo il cancel button
    Animated.parallel([
      Animated.timing(cancelPosition, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }),
    ]).start(() => {
      // Aspetto che il cancel button sia stato nascosto prima di animare la viewWidth
      Animated.timing(viewWidth, {
        toValue: fullWidth,
        duration: 250,
        useNativeDriver: false,
      }).start();
    });
  };

  const _onChangeText = (text: string) => {
    setQuery(text);
    onChangeQuery?.(text);
  };

  const _onPressCancel = () => {
    _onBlur();
    onPressCancel?.();
    _onChangeText("");
  };

  const _onSubmitEditing = (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => {
    _onBlur();
    onPressEnter?.(query || "");
  };

  return (
    <View style={animatedSearchBarStyles.container}>
      <Animated.View
        style={[
          animatedSearchBarStyles.search,
          {
            width: viewWidth,
            position: "absolute",
            left: insets.left + Layout.DefaultMarginHorizontal,
            alignSelf: "center",
          },
          searchBarFocused === true ? undefined : { justifyContent: "center" },
        ]}
      >
        <Input
          width="100%"
          alignItems="center"
          justifyContent="flex-start"
          rounded="$xl"
          borderWidth={0}
          bgColor={withDarkMode ? "$backgroundDark800" : "$backgroundLight100"}
          height={50}
        >
          <Icon
            as={SearchIcon}
            size="sm"
            color="$backgroundLight400"
            marginLeft={10}
          />
          <InputField
            ref={inputRef}
            onBlur={_onBlur}
            onFocus={_onFocus}
            value={query}
            onChangeText={_onChangeText}
            onSubmitEditing={_onSubmitEditing}
            placeholder={placeholder}
            keyboardAppearance={withDarkMode ? "light" : "dark"}
            selectionColor={withDarkMode ? "white" : "black"}
            returnKeyType="search"
          />
        </Input>
      </Animated.View>

      <AnimatedTouchable
        style={[
          animatedSearchBarStyles.cancelSearch,
          { right: cancelPosition },
        ]}
        onPress={_onPressCancel}
      >
        <Animated.Text
          style={[
            animatedSearchBarStyles.cancelSearchText,
            { opacity: opacity },
            {
              color: withDarkMode ? "#A3A3A3" : "#525252",
            },
          ]}
        >
          {i18n.t("cancel")}
        </Animated.Text>
      </AnimatedTouchable>
    </View>
  );
};

export default AnimatedSearchBar;

// DARK -> #404040 | #A3A3A3
// LIGHT -> #F1F1F1 | #525252
