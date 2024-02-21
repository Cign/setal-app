import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import Colors from "../Util/static/Colors";
import Entypo from "react-native-vector-icons/Entypo";

const Card = ({ title, number, icon }) => {
  const isTablet = Dimensions.get("screen").width > 719;

  if (!isTablet) {
    return null; // Render nothing if the device is not a tablet
  }

  return (
    <View style={styles.card}>
      <View style={styles.title}>
        <View style={styles.iconContainer}>
          <Entypo name={icon} color={Colors.background} size={0} />
        </View>
        <Text style={styles.titleText}>{title}</Text>
        <View style={styles.percent}>
          {/* <Text style={styles.percentText}>20%</Text> */}
        </View>
      </View>
      <View style={styles.data}>
        <Text style={styles.dataText}>{number}</Text>
        <View style={styles.range}>
          <View style={styles.fill}></View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#fff",
    // boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    maxWidth: 320,
    minWidth: 260,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 3,
  },
  title: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    position: "relative",
    padding: 8,
    backgroundColor: Colors.baseColor,
    width: 30,
    height: 30,
    borderRadius: 9999,
  },
  titleText: {
    marginLeft: 8,
    color: Colors.baseColor,
    fontSize: 18,
  },
  percent: {
    marginLeft: 8,
    color: Colors.baseColor,
    fontWeight: "600",
    flexDirection: "row",
    alignItems: "center",
  },
  percentText: {
    marginLeft: 4,
  },
  data: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  dataText: {
    marginTop: 16,
    marginBottom: 16,
    color: Colors.baseColor,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: "700",
    textAlign: "left",
  },
  range: {
    position: "relative",
    backgroundColor: Colors.baseColor,
    width: "100%",
    height: 8,
    borderRadius: 4,
  },
  fill: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: Colors.baseColor,
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});

export default Card;
