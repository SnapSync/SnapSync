import { StyleSheet, View } from "react-native";
import React from "react";
import { Button, ButtonText, Text } from "@gluestack-ui/themed";
import { OnboardingStackScreenProps } from "@/utils/Routes";

type Props = OnboardingStackScreenProps<"Welcome">;

const WelcomeScreen = ({ navigation }: Props) => {
  const goAuth = () => {
    navigation.navigate("Auth");
  };

  return (
    <View style={styles.container}>
      <Text size="md">WelcomeScreen</Text>

      <Button onPress={goAuth}>
        <ButtonText>Go to Login</ButtonText>
      </Button>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
