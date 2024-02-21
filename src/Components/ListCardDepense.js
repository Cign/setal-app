import React, { useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from "@expo/vector-icons";
import CL from "../Util/static/CategoryLavage";
import Colors from "../Util/static/Colors";

// item: { name, price, image, onPress, date, change }

const SmallCard = ({ item: { item }, action, onPressAction }) => {
  const navigation = useNavigation();

  useEffect(() => {
    console.log("item", item);
  }, []);

  const onPress = () => {
    if (action?.clickable) {
      navigation.navigate(action?.destination, {
        item,
      });
    }
  };


  return (
    <TouchableOpacity onPress={onPressAction ? onPressAction : onPress}>
      <View style={styles.container}>
        <View style={styles.card}>

          <View style={styles.mcontainer}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={2}
              style={styles.coinName}
            >
              {item?.attributes?.objet}
            </Text>
          </View>
          <View style={styles.rcontainer}>
            <View style={styles.bgprice}>
              <Text style={styles.price}>{item?.attributes?.montant}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  logoimg: {
    width: 30,
    height: 30,
    justifyContent: "center",
  },
  coinSymbol: {
    fontSize: 13,
    marginBottom: 5,
    // fontFamily: 'RobotoSlab-Regular',
    color: Colors.thirdRed,
  },
  chart: {
    paddingRight: 0,
    paddingBottom: 10,
    paddingTop: 5,
    marginTop: 10,
  },
  mcontainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
    flex: 2,
  },
  chartContainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 0,
    flex: 1,
  },
  coinName: {
    fontSize: 15,
    marginBottom: 2,
    fontWeight: "bold",
    // fontFamily: 'RobotoSlab-Bold',
    color: "black",
  },
  price: {
    fontSize: 14,
    textAlign: "right",
    color: "#000",
    marginVertical: 3,
  },
  logo: {
    width: 35,
    height: 35,
    alignSelf: "center",
    // backgroundColor: "#CF4600",
    backgroundColor: Colors.baseColor,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    margin: 0,
    opacity: 0.8,
  },
  bgprice: {
    justifyContent: "center",
  },
  rcontainer: {
    flexDirection: "column",
    justifyContent: "center",
    marginLeft: 10,
    paddingRight: 5,
    flex: 1,
  },
  card: {
    flexDirection: "row",
    flex: 1,
    height: 50,
    borderRadius: 20,
    padding: 10,
    justifyContent: "center",
    marginHorizontal: 0,
    marginVertical: 10,
  },
});

export default React.memo(SmallCard);
