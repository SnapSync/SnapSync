import React from "react";
import { useQuery } from "@tanstack/react-query";
import { FetchAllUsers } from "@/api/routes/users.route";
import { FlashList } from "@shopify/flash-list";
import UserItem from "@/components/user_item/user_item.component";
import { DiscoveryStackScreenProps } from "@/types";
import { View } from "@gluestack-ui/themed";
import { IApiUser } from "@/interfaces/users.interface";

const SearchScreen = ({ navigation }: DiscoveryStackScreenProps<"Search">) => {
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: () => FetchAllUsers(),
  });

  const goToProfile = (item: IApiUser) =>
    navigation.navigate("UserProfileStack", {
      screen: "UserProfile",
      params: { ...item },
    });

  return (
    <View flex={1}>
      <FlashList
        data={data?.data}
        estimatedItemSize={50}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <UserItem user={item} onPress={() => goToProfile(item)} />
        )}
      />
    </View>
  );
};

export default SearchScreen;
