import React from "react";
import { useFocusEffect } from "@react-navigation/native";

// @see -> https://tanstack.com/query/v4/docs/react/react-native#refresh-on-screen-focus
export function useRefreshOnFocus<T>(refetch: () => Promise<T>) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );
}
