import { ThemeContext } from "@/providers/ThemeProvider";
import { useContext } from "react";

function useTheme() {
  return useContext(ThemeContext);
}

export default useTheme;
