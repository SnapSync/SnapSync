import { View, Text } from "@gluestack-ui/themed";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Button } from "react-native";

const SettingsScreen = () => {
  const queryClient = useQueryClient();

  const clearCache = () => {
    console.log("Clearing cache...");
    console.log(JSON.stringify(queryClient.getQueryCache().findAll(), null, 2));
    queryClient.clear();
    console.log("Cache cleared!");
  };

  return (
    <View
      flex={1}
      backgroundColor="transparent"
      alignItems="center"
      justifyContent="center"
    >
      <Button title="Clear Cache" onPress={clearCache} />
    </View>
  );
};

export default SettingsScreen;
