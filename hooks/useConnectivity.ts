import { useRef, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

/**
 * Returns information about internet connectivity.
 * @example const [isConnected, checkConnection] = useConnectivity();
 */
function useConnectivity() {
  const [isConnected, setConnected] = useState<boolean | null>(null);
  const ref = useRef<[typeof isConnected, () => void] | null>(null);

  if (ref.current === null) {
    const checkConnection = () => {
      NetInfo.fetch().then((state) => {
        setConnected(!!state.isConnected);
      });
    };

    ref.current = [isConnected, checkConnection];
    ref.current[1]();
  }
  ref.current[0] = isConnected;

  return ref.current;
}

export default useConnectivity;
