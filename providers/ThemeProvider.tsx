import React from "react";
import { useAppSelector } from "@/utils/redux/store";
import LightTheme, { ITheme } from "@/assets/Color/LightTheme";
import DarkTheme from "@/assets/Color/DarkTheme";

export const ThemeContext = React.createContext<ITheme>(LightTheme);

type Props = {
  children: React.ReactNode;
};

function ThemeProvider({ children }: Props) {
  const ucs = useAppSelector((s) => s.AppReducer.userColorScheme);

  return (
    <ThemeContext.Provider value={ucs === "dark" ? DarkTheme : LightTheme}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;
