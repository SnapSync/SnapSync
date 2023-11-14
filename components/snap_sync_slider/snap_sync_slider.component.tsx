import React from "react";
import { Image } from "expo-image";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  Icon,
  MessageCircleIcon,
  View,
  useColorMode,
} from "@gluestack-ui/themed";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import snapSyncSliderstyles, {
  SNAP_SYNC_BORDER_WIDTH,
  SNAP_SYNC_SLIDER_SIZE,
} from "./snap_sync_slider.styles";
import { Layout } from "@/costants/Layout";
import { TouchableOpacity } from "react-native";
import { Smile } from "lucide-react-native";

type Props = {
  size: number;
  leftImageUrl: string;
  leftImageBlurHash?: string;
  rightImageUrl: string;
  rightImageBlurHash?: string;

  hideFooter?: boolean;
  onPressReactions?: () => void;
  onPressComments?: () => void;
};

type GestureContext = {
  startX: number;
  // Altre proprietà del context, se necessario
};

const SnapSyncSlider = ({
  size,
  leftImageUrl,
  leftImageBlurHash,
  rightImageUrl,
  rightImageBlurHash,
  hideFooter = false,
  onPressReactions,
  onPressComments,
}: Props) => {
  const colorMode = useColorMode();

  const initialTranslateX = React.useMemo(() => {
    return (size - SNAP_SYNC_SLIDER_SIZE * 2) / 2;
  }, [size, SNAP_SYNC_SLIDER_SIZE]);

  const initialLeftWidth = React.useMemo(() => {
    return size / 2;
  }, [size]);

  const initialRightWidth = React.useMemo(() => {
    return size / 2;
  }, [size]);

  const translateX = useSharedValue(initialTranslateX);
  const leftWidth = useSharedValue(initialLeftWidth);
  const rightWidth = useSharedValue(initialRightWidth);

  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    GestureContext
  >({
    onStart: (_, ctx) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      //  Verifico che il valore di translateX non esca dai limiti imposti
      let trX = ctx.startX + event.translationX;
      if (trX < -(SNAP_SYNC_SLIDER_SIZE + SNAP_SYNC_BORDER_WIDTH)) return; // Esce a sinistra
      if (trX > size - (SNAP_SYNC_SLIDER_SIZE + SNAP_SYNC_BORDER_WIDTH)) return; // Esce a destra

      translateX.value = trX;

      leftWidth.value = size / 2 + event.translationX;
      rightWidth.value = size / 2 - event.translationX;
    },
    onEnd: (_, ctx) => {
      // Ripoistiono il valore di translateX al centro dello slider
      translateX.value = withTiming(initialTranslateX, {
        duration: 500,
      });

      // Riposiziono i valori di leftWidth e rightWidth
      leftWidth.value = withTiming(initialLeftWidth, {
        duration: 500,
      });
      rightWidth.value = withTiming(initialRightWidth, {
        duration: 500,
      });
    },
  });

  const sStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const lStyle = useAnimatedStyle(() => {
    return {
      width: leftWidth.value,
    };
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      width: rightWidth.value,
      left: leftWidth.value,
    };
  });

  return (
    <View style={{ width: size, height: size, overflow: "hidden" }}>
      <Animated.View style={{ width: size * 2, height: size }}>
        <Animated.View
          style={[
            snapSyncSliderstyles.imageContainer,
            lStyle,
            snapSyncSliderstyles.leftImage,
            {
              borderColor:
                colorMode === "dark" ? Layout.DarkBgc : Layout.LightBgc,
            },
          ]}
        >
          <Image
            style={snapSyncSliderstyles.image}
            source={{ uri: leftImageUrl }}
            placeholder={leftImageBlurHash}
          />
        </Animated.View>
        <Animated.View
          style={[
            snapSyncSliderstyles.imageContainer,
            rStyle,
            snapSyncSliderstyles.rightImage,
            {
              borderColor:
                colorMode === "dark" ? Layout.DarkBgc : Layout.LightBgc,
            },
          ]}
        >
          <Image
            style={snapSyncSliderstyles.image}
            source={{ uri: rightImageUrl }}
            placeholder={rightImageBlurHash}
          />
        </Animated.View>
      </Animated.View>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          style={[
            sStyle,
            snapSyncSliderstyles.sliderContainer,
            {
              top: size / 2 - SNAP_SYNC_SLIDER_SIZE / 2,
              left: SNAP_SYNC_SLIDER_SIZE / 2,
              backgroundColor:
                colorMode === "dark" ? Layout.DarkBgc : Layout.LightBgc,
            },
          ]}
        >
          <View style={snapSyncSliderstyles.slider}>
            <Icon
              as={ArrowLeftIcon}
              width={18}
              height={18}
              color={colorMode === "dark" ? Layout.LightBgc : Layout.DarkBgc}
            />
          </View>
          <View style={snapSyncSliderstyles.slider}>
            <Icon
              as={ArrowRightIcon}
              width={18}
              height={18}
              color={colorMode === "dark" ? Layout.LightBgc : Layout.DarkBgc}
            />
          </View>
        </Animated.View>
      </PanGestureHandler>

      {!hideFooter && (
        <View
          style={[
            {
              width: size,
            },
            snapSyncSliderstyles.viewFooter,
          ]}
        >
          <View style={snapSyncSliderstyles.reactionsAndCommentsContainer}>
            <TouchableOpacity
              style={snapSyncSliderstyles.reactionsAndCommentsItem}
              onPress={onPressComments}
            >
              <Icon
                as={MessageCircleIcon}
                width={18}
                height={18}
                color={Layout.LightBgc}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={snapSyncSliderstyles.reactionsAndCommentsItem}
              onPress={onPressReactions}
            >
              <Icon as={Smile} width={18} height={18} color={Layout.LightBgc} />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

export default SnapSyncSlider;
