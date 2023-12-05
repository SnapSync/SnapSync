import HomeScreen from "@/screens/main/home/home.screen";
import { MainStackParamList } from "@/types";
import React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import DiscoveryStack from "./discovery.stack";
import ProfileScreen from "@/screens/profile/profile/profile.screen";
import ProfileStack from "./profile.stack";

const Tab = createMaterialTopTabNavigator<MainStackParamList>();

const MainStack = () => {
  // React.useEffect(() => {
  //   (async () => {
  //     const { status } = await Contacts.requestPermissionsAsync();
  //     if (status === "granted") {
  //       const { data } = await Contacts.getContactsAsync({
  //         fields: [
  //           Contacts.Fields.PhoneNumbers,
  //           Contacts.Fields.Nickname,
  //           Contacts.Fields.FirstName,
  //           Contacts.Fields.LastName,
  //           Contacts.Fields.Name,
  //         ],
  //       });

  //       console.log(data.filter((contact) => contact.nickname !== undefined));
  //     }
  //   })();
  // }, []);

  return (
    <Tab.Navigator
      tabBar={() => null}
      initialRouteName="Home"
      backBehavior="history"
    >
      <Tab.Screen name="Discovery" component={DiscoveryStack} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} />
    </Tab.Navigator>
  );
};

export default MainStack;
