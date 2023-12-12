import React from "react";
import { AuthStackScreenProps } from "@/types";
import * as CountryList from "country-codes-list";
import { View, useColorMode, Divider } from "@gluestack-ui/themed";
import { FlashList } from "@shopify/flash-list";
import i18n from "@/lang";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import { updatePhoneNumberCountry } from "@/redux/features/authentication/authenticationSlice";
import { ICountryList } from "@/interfaces/countries_list.interface";
import CountryItem from "@/components/country_list/country_item/country_item.component";

const CountryListScreen = ({
  navigation,
}: AuthStackScreenProps<"CountryList">) => {
  const colorMode = useColorMode();

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
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: (event) => setSearchText(event.nativeEvent.text),
        placeholder: i18n.t("search"),
        // textColor: colorMode === "dark" ? "#FCFCFC" : "#171717",
        hideWhenScrolling: false,
        cancelButtonText: i18n.t("cancel"),
      },
    });
  }, [navigation]);

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

  return (
    <View flex={1} backgroundColor="transparent">
      <FlashList
        data={countries}
        contentInsetAdjustmentBehavior="automatic"
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => {
          return (
            <CountryItem
              item={item}
              onPress={_onPress}
              isSelected={
                authDto?.phoneNumberCountry?.countryCode.toLowerCase() ===
                item.countryCode.toLowerCase()
              }
            />
          );
        }}
        ItemSeparatorComponent={() => <Divider />}
        estimatedItemSize={50}
      />
    </View>
  );
};

export default CountryListScreen;
