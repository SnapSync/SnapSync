import React from "react";
import CountryPicker, {
  getCallingCode,
  DARK_THEME,
  DEFAULT_THEME,
  Flag,
} from "react-native-country-picker-modal";
import { CountryCode, Country } from "react-native-country-picker-modal";
import {
  StyleProp,
  TextInputProps,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { CountryFilterProps } from "react-native-country-picker-modal/lib/CountryFilter";
import phoneNumberInputStyles from "./phone_number_input.styles";
import { View, Text, Input, InputField } from "@gluestack-ui/themed";

type Props = {
  defaultCode?: CountryCode;
  withDarkTheme?: boolean;
  autoFocus?: boolean;
  defaultValue?: string;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  onChangeCountry?: (country: Country) => void;
  onChangeText?: (text: string) => void;
  onChangeFormattedText?: (text: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  textContainerStyle?: StyleProp<ViewStyle>;
  textInputProps?: TextInputProps;
  textInputStyle?: StyleProp<TextStyle>;
  // codeTextStyle?: StyleProp<TextStyle>;
  countryPickerButtonStyle?: StyleProp<ViewStyle>;
  filterProps?: CountryFilterProps;
  countryPickerProps?: any;
  flagSize?: number;
};

const PhoneNumberInput = (props: Props) => {
  const refPreviousCountryCode = React.useRef<CountryCode | undefined>(
    props.defaultCode ? props.defaultCode : undefined
  );
  const refPreviousCode = React.useRef<string | undefined>(
    props.defaultCode ? props.defaultCode : undefined
  );
  const refSelectedCountry = React.useRef<Country | undefined>(undefined);

  const [code, setCode] = React.useState<string | undefined>(
    props.defaultCode ? props.defaultCode : undefined
  );
  const [number, setNumber] = React.useState<string>(
    props.value ? props.value : props.defaultValue ? props.defaultValue : ""
  );
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const [countryCode, setCountryCode] = React.useState<CountryCode | undefined>(
    props.defaultCode ? props.defaultCode : undefined
  );
  const [disabled] = React.useState<boolean>(
    props.disabled ? props.disabled : false
  );

  React.useEffect(() => {
    async function getCountryCode() {
      if (props.defaultCode) {
        const code = await getCallingCode(props.defaultCode);
        setCode(code);
      }
    }

    getCountryCode();
  }, []);

  React.useEffect(() => {
    if (
      refPreviousCountryCode.current !== countryCode &&
      refPreviousCode.current !== code
    ) {
      refPreviousCountryCode.current = countryCode;
      refPreviousCode.current = code;
      if (props.onChangeFormattedText) {
        if (
          refSelectedCountry.current &&
          refSelectedCountry.current.callingCode[0]
        ) {
          props.onChangeFormattedText(
            `+${refSelectedCountry.current.callingCode[0]}${number}`
          );
        } else {
          props.onChangeFormattedText(number);
        }
      }
    }
  }, [countryCode, code]);

  const onSelect = (country: Country) => {
    setCountryCode(country.cca2);
    setCode(country.callingCode[0] as CountryCode);
    refSelectedCountry.current = country;

    if (props.onChangeCountry) {
      props.onChangeCountry(country);
    }
  };

  const renderFlagButton = () => {
    return (
      <Flag
        countryCode={countryCode as CountryCode}
        flagSize={props.flagSize ? props.flagSize : DEFAULT_THEME.flagSize}
      />
    );
  };

  const onChangeText = (text: string) => {
    setNumber(text);

    props.onChangeText?.(text);

    if (props.onChangeFormattedText) {
      if (code) {
        props.onChangeFormattedText(text.length > 0 ? `+${code}${text}` : text);
      } else {
        props.onChangeFormattedText(text);
      }
    }
  };

  return (
    <View
      style={[
        phoneNumberInputStyles.container,
        props.containerStyle ? props.containerStyle : {},
      ]}
    >
      <TouchableOpacity
        style={[
          phoneNumberInputStyles.flagButtonView,
          props.countryPickerButtonStyle ? props.countryPickerButtonStyle : {},
        ]}
        disabled={disabled}
        onPress={() => setModalVisible(true)}
      >
        <CountryPicker
          onSelect={onSelect}
          withEmoji
          withFilter
          withFlag
          filterProps={props.filterProps}
          countryCode={countryCode}
          withCallingCode
          disableNativeModal={disabled}
          visible={modalVisible}
          theme={props.withDarkTheme ? DARK_THEME : DEFAULT_THEME}
          renderFlagButton={renderFlagButton}
          onClose={() => setModalVisible(false)}
          {...props.countryPickerProps}
        />
        {code && (
          <Text
            style={[
              phoneNumberInputStyles.codeText,
              // props.codeTextStyle ? props.codeTextStyle : {},
            ]}
            color={props.withDarkTheme ? "$textDark0" : "$textLight750"}
          >{`+${code}`}</Text>
        )}
      </TouchableOpacity>
      <View
        style={[
          phoneNumberInputStyles.textContainer,
          props.textContainerStyle ? props.textContainerStyle : {},
        ]}
      >
        <Input
          size={"sm"}
          variant={"underlined"}
          isInvalid={false}
          isDisabled={props.disabled ? props.disabled : false}
          isRequired={false}
          width={"100%"}
        >
          <InputField
            // onChangeText={_handleChangeText}
            // value={authDto.fullName}
            placeholder={props.placeholder}
            keyboardType="number-pad"
            autoFocus={props.autoFocus}
            // maxLength={AuthFullNameMaxLength}
            keyboardAppearance={props.withDarkTheme ? "dark" : "default"}
            onChangeText={onChangeText}
            value={number}
            editable={disabled ? false : true}
            selectionColor={props.withDarkTheme ? "white" : "dark"}
            {...props.textInputProps}
          />
        </Input>
      </View>
    </View>
  );
};

export default PhoneNumberInput;
