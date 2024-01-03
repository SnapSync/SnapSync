import React, { useState } from "react";
import { Dimensions } from "react-native";

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });

  React.useEffect(() => {
    const onResize = () => {
      setWindowSize({
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height,
      });
    };

    Dimensions.addEventListener("change", onResize);

    // return () => {
    //   Dimensions.removeEventListener("change", onResize);
    // };
  }, []);

  // Controllo se lo schermo è orizzontale o verticale
  const isPortrait = () => {
    const dim = Dimensions.get("screen");
    return dim.height >= dim.width;
  };

  // Controllo se lo schermo è piccolo
  const isSmallScreen = () => {
    const dim = Dimensions.get("screen");
    return dim.width <= 768;
  };

  // Controllo se lo schermo è medio
  const isMediumScreen = () => {
    const dim = Dimensions.get("screen");
    return dim.width > 768 && dim.width <= 1024;
  };

  // Controllo se lo schermo è grande
  const isLargeScreen = () => {
    const dim = Dimensions.get("screen");
    return dim.width > 1024;
  };

  // Controllo se lo schermo è extra large
  const isExtraLargeScreen = () => {
    const dim = Dimensions.get("screen");
    return dim.width > 1440;
  };

  // Controllo se lo schermo è extra extra large
  const isExtraExtraLargeScreen = () => {
    const dim = Dimensions.get("screen");
    return dim.width > 1920;
  };

  return {
    isPortrait,
    with: windowSize.width,
    height: windowSize.height,
  };
};
