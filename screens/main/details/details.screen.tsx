import { Animated } from "react-native";
import { useTheme } from "@react-navigation/native";
import { useCardAnimation } from "@react-navigation/stack";
import { RootStackScreenProps } from "@/types";
import React from "react";
import { Image } from "expo-image";
import { SCREEN_WIDTH } from "@/utils/helper";
import { View, Text } from "@gluestack-ui/themed";
import { Button } from "react-native";

const DetailsScreen = ({
  navigation,
  route,
}: RootStackScreenProps<"Details">) => {
  const { colors } = useTheme();
  const { current } = useCardAnimation();

  // React.useEffect(() => {
  //   console.log("DetailsScreen", current.progress);
  // }, [current.progress]);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("transitionStart", (e) => {
  //     // Do something
  //     console.log("transitionStart", e);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("transitionEnd", (e) => {
  //     // Do something
  //     console.log("transitionEnd", e);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("gestureStart", (e) => {
  //     // Do something
  //     console.log("gestureStart", e);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("gestureEnd", (e) => {
  //     // Do something
  //     console.log("gestureEnd", e);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  // React.useEffect(() => {
  //   const unsubscribe = navigation.addListener("gestureCancel", (e) => {
  //     // Do something
  //     console.log("gestureCancel", e);
  //   });

  //   return unsubscribe;
  // }, [navigation]);

  return (
    <Animated.View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
        transform: [
          {
            scale: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0.9, 1],
              extrapolate: "clamp",
            }),
          },
        ],
      }}
    >
      <Animated.View
        style={{
          padding: 16,
          width: "90%",
          maxWidth: 400,
          borderRadius: 3,
          backgroundColor: colors.card,
          transform: [
            {
              scale: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
                extrapolate: "clamp",
              }),
            },
          ],
        }}
      >
        <Text>
          Mise en place is a French term that literally means “put in place.” It
          also refers to a way cooks in professional kitchens and restaurants
          set up their work stations—first by gathering all ingredients for a
          recipes, partially preparing them (like measuring out and chopping),
          and setting them all near each other. Setting up mise en place before
          cooking is another top tip for home cooks, as it seriously helps with
          organization. It’ll pretty much guarantee you never forget to add an
          ingredient and save you time from running back and forth from the
          pantry ten times.
        </Text>
        <Button
          title="Okay"
          color={colors.primary}
          // style={{ alignSelf: 'flex-end' }}
          onPress={navigation.goBack}
        />
      </Animated.View>
    </Animated.View>
  );
};

export default DetailsScreen;
