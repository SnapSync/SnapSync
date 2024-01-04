/* eslint-disable react/jsx-no-useless-fragment */
import React, { useEffect } from "react";
import { Appearance } from "react-native";
import throttle from "lodash.throttle";
import { SetColorShceme } from "@/modules/app/redux/appSlice";
import { useAppDispatch, useAppSelector } from "@/utils/redux/store";
import { addStoreDataAsync, getStoreDataAsync } from "@/helpers/storage";
import { storeEnum } from "@/helpers/storage/Abstract";

export default function ThemeListener() {
  const ucm = useAppSelector((s) => s.AppReducer.userColorScheme);
  // const dispatch = useAppDispatch();

  // const handleColorModeChange = (
  //   preferences: Appearance.AppearancePreferences
  // ) => {
  //   dispatch(SetColorShceme(preferences?.colorScheme));
  // };

  // useEffect(() => {
  //   // Esso viene triggerato quando l'utenet cambia il tema del dispositivo
  //   Appearance.addChangeListener(
  //     throttle(handleColorModeChange, 100, { leading: false, trailing: true })
  //   );

  //   return () => {
  //     // Appearance.removeChangeListener(handleColorModeChange);
  //   };
  // }, [dispatch]);

  React.useEffect(() => {
    const updateAsyncStorage = async () => {
      let colorScheme = await getStoreDataAsync(storeEnum.ColorMode);
      if (colorScheme !== ucm)
        await addStoreDataAsync(storeEnum.ColorMode, JSON.stringify(ucm));
    };

    updateAsyncStorage();
  }, [ucm]);

  return null;
}
