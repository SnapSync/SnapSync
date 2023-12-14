import HomeScreen from "@/screens/main/home/home.screen";
import { MainStackParamList } from "@/types";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DiscoveryStack from "./discovery.stack";
import ProfileStack from "./profile.stack";
import * as Contacts from "expo-contacts";

const Tab = createMaterialTopTabNavigator<MainStackParamList>();

const MainStack = () => {
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

  return (
    <Tab.Navigator
      tabBar={() => null}
      initialRouteName="Home"
      backBehavior="history"
    >
      <Tab.Screen name="DiscoveryStack" component={DiscoveryStack} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainStack;
