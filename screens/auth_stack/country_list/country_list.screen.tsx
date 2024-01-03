import React from "react";
import { AuthStackScreenProps } from "@/types";
import * as CountryList from "country-codes-list";
import { View, Divider } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import i18n from "@/lang";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { updatePhoneNumberCountry } from "@/redux/features/authentication/authenticationSlice";
import { ICountryList } from "@/interfaces/countries_list.interface";
import { Platform } from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Layout } from "@/costants/Layout";
import CountryListItem from "@/components/country_list_item/country_list_item.component";

// TODO: Da ottimizzare questa schermata, in particolare la ricerca

const CountryListScreen = ({
  navigation,
}: AuthStackScreenProps<"CountryList">) => {
  const headerHeight = useHeaderHeight();
  const insets = useSafeAreaInsets();

  const authDto = useSelector(
    (state: RootState) => state.authentication.authDto
  );

  const dispatch = useDispatch();

  const [countries, setCountries] = React.useState<Array<ICountryList>>([]);

  const AllCountryList = React.useMemo(() => {
    return CountryList.all();
  }, []);

  const AllCountries: Array<ICountryList> = React.useMemo(() => {
    const all = CountryList.all().map((country) => {
      return {
        countryCode: country.countryCode,
        dialCode: country.countryCallingCode,
        name: i18n.t(`countries.${country.countryCode.toUpperCase()}`),
        flag: country.flag,
      };
    });

    return all;
  }, []);

  const [searchText, setSearchText] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (Platform.OS === "ios") {
      navigation.setOptions({
        headerSearchBarOptions: {
          onChangeText: (event) => setSearchText(event.nativeEvent.text),
          placeholder: i18n.t("search"),
          // textColor: colorMode === "dark" ? "#FCFCFC" : "#171717",
          hideWhenScrolling: false,
          cancelButtonText: i18n.t("cancel"),
        },
      });
    }
  }, [navigation, Platform.OS]);

  React.useEffect(() => {
    if (searchText && searchText.length > 0) {
      // Filtro per nome
      setCountries(
        AllCountries.filter((country) =>
          country.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setCountries(AllCountries);
    }
  }, [searchText]);

  const _onPress = (item: ICountryList) => {
    // Da AllCountryList recupero l'oggetto che ha countryCode uguale a quello selezionato
    const country = AllCountryList.find(
      (country) => country.countryCode === item.countryCode
    );

    if (country) {
      dispatch(updatePhoneNumberCountry(country));
      navigation.goBack();
    }
  };

  const _keyExtractor = (item: ICountryList, index: number) => {
    return index.toString();
  };

  const _renderItem = React.useCallback(
    ({ item }: { item: ICountryList }) => {
      return (
        <CountryListItem
          item={item}
          onPress={_onPress}
          isSelected={
            authDto?.phoneNumberCountry?.countryCode.toLowerCase() ===
            item.countryCode.toLowerCase()
          }
        />
      );
    },
    [authDto]
  );

  return (
    <View flex={1} backgroundColor="transparent">
      <FlashList
        data={countries}
        contentContainerStyle={{
          paddingTop: Platform.OS === "ios" ? 0 : headerHeight + 20,
          paddingLeft: insets.left + Layout.ScreenPaddingHorizontal,
          paddingRight: insets.right + Layout.ScreenPaddingHorizontal,
          paddingBottom: insets.bottom,
        }}
        contentInsetAdjustmentBehavior="automatic"
        keyExtractor={_keyExtractor}
        renderItem={_renderItem}
        ItemSeparatorComponent={() => <Divider />}
        estimatedItemSize={50}
      />
    </View>
  );
};

export default CountryListScreen;
