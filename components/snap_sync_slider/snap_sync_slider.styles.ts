import { Layout } from "@/costants/Layout";
import { StyleSheet } from "react-native";

export const SNAP_SYNC_SLIDER_SIZE = 50;
export const SNAP_SYNC_BORDER_WIDTH = 1.5;

const snapSyncSliderstyles = StyleSheet.create({
  imageContainer: {
    width: "100%",
    height: "100%",
    position: "absolute",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  leftImage: {
    borderRightWidth: SNAP_SYNC_BORDER_WIDTH,
    borderStyle: "solid",
  },
  rightImage: {
    borderLeftWidth: SNAP_SYNC_BORDER_WIDTH,
    borderStyle: "solid",
  },
  sliderContainer: {
    width: SNAP_SYNC_SLIDER_SIZE,
    height: SNAP_SYNC_SLIDER_SIZE,
    borderRadius: 16,
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    overflow: "hidden",
  },
  slider: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  viewFooter: {
    backgroundColor: "transparent",
    paddingHorizontal: Layout.DefaultMarginHorizontal,
    paddingBottom: 10,
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  reactionsAndCommentsContainer: {
    backgroundColor: "transparent",
    flexDirection: "column",
    gap: 10,
  },
  reactionsAndCommentsItem: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0, 0, 0, 0.70)",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default snapSyncSliderstyles;
