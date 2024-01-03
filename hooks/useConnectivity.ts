import { useState } from "react";
import NetInfo from "@react-native-community/netinfo";
import React from "react";

/**
 * Returns information about internet connectivity.
 * @example const {isConnected} = useConnectivity();
 */
export const useConnectivity = () => {
  // const [isLoading, setLoading] = useState<boolean>(true);
  const [isConnected, setConnected] = useState<boolean | null>(null);

  React.useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setConnected(state.isConnected);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isConnected: isConnected,
  };
};
