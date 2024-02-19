import { Dimensions } from "react-native";

const isTablet = Dimensions.get("screen").width > 720;
let Spacing = 3;

if (isTablet) {
  // Render nothing if the device is not a tablet
  Spacing = 20;
}

export default Spacing;
