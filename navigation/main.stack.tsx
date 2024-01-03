import HomeScreen from "@/screens/main_stack/home/home.screen";
import { MainStackParamList } from "@/types";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import DiscoveryStack from "./discovery.stack";
import ProfileStack from "./profile.stack";
import * as Contacts from "expo-contacts";
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Icon,
  useColorMode,
} from "@gluestack-ui/themed";
import { useMe } from "@/api/queries/useMe";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { HomeIcon, SearchIcon, Users2 } from "lucide-react-native";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator<MainStackParamList>();

const MainStack = () => {
  const colorMode = useColorMode();

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const tokenApi = useSelector((state: RootState) => state.auth.tokenApi);

  // React.useEffect(() => {
  //   (async () => {
  //     const { status } = await Contacts.requestPermissionsAsync();
  //     if (status === "granted") {
  //       const { data } = await Contacts.getContactsAsync({
  //         fields: [Contacts.Fields.ContactType, Contacts.Fields.PhoneNumbers],
  //       });

  //       const digits: Array<string> = [];

  //       for (let i = 0; i < data.length; i++) {
  //         const contactType = data[i].contactType;
  //         const phoneNumbers = data[i].phoneNumbers;
  //         if (
  //           phoneNumbers &&
  //           phoneNumbers.length > 0 &&
  //           contactType === "person"
  //         ) {
  //           const d = phoneNumbers[0].digits;
  //           if (d) digits.push(d);
  //         }
  //       }

  //       console.log(digits);
  //     }
  //   })();
  // }, []);

  const { data } = useMe(isLoggedIn, tokenApi);

  return (
    <Tab.Navigator
      // tabBar={() => null} // Utilizzato per nascondere la tab bar
      initialRouteName="Home"
      backBehavior="history"
      screenOptions={{
        tabBarHideOnKeyboard: Platform.OS === "android",
        tabBarLabelStyle: {
          display: "none",
        },
      }}
    >
      <Tab.Screen
        name="DiscoveryStack"
        component={DiscoveryStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            return <Icon as={Users2} size="md" color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            return <Icon as={HomeIcon} size="md" color={color} />;
          },
        }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStack}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Avatar
                size="xs"
                borderWidth={focused ? 2 : 0}
                borderColor={color}
              >
                <AvatarFallbackText>
                  {data?.username || data?.fullname}
                </AvatarFallbackText>
                {data?.profilePicture ? (
                  <AvatarImage
                    source={{
                      uri: data.profilePicture.url,
                    }}
                  />
                ) : null}
              </Avatar>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default MainStack;
