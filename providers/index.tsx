import React from "react";
import "./NetworkInfo";
import AppLoadingProvider from "./AppLoadingProvider";
import "./Localization";
import Notification from "./Notification";
import ThemeProvider from "./ThemeProvider";
import ThemeListener from "./ThemeListener";
import { StatusBar } from "expo-status-bar";
import { useAppSelector } from "@/utils/redux/store";

type Props = {
  children: React.ReactNode;
};

/**
 * Providers for `global` transactions.
 * The `CustomProvider` is used to `monitor` and take action at every moment of the application.
 */
function CustomProvider({ children }: Props) {
  const ucs = useAppSelector((s) => s.AppReducer.userColorScheme);

  return (
    <AppLoadingProvider>
      <ThemeProvider>
        <Notification>
          {children}

          <ThemeListener />
          <StatusBar style={ucs === "dark" ? "light" : "dark"} />
        </Notification>
      </ThemeProvider>
    </AppLoadingProvider>
  );
}

export default CustomProvider;
