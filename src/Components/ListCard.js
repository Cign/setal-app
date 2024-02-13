import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import CL from '../Util/static/CategoryLavage';
import Colors from '../Util/static/Colors';

// item: { name, price, image, onPress, date, change }

const SmallCard = ({ item: { item }, action, onPressAction }) => {

  const navigation = useNavigation();

  useEffect(() => {
    console.log("item", item)
  }, [])

  const onPress = () => {
    if (action?.clickable) {
      navigation.navigate(action?.destination, {
        item
      })
    }
  }

  const ReturnIcon = () => {
    let icon;

    switch (item?.attributes?.category_lavage?.data?.attributes?.name) {
      case CL.tapis:
        icon = <FontAwesome5 name="scroll" size={24} color={Colors.background} />;
        break;
      case CL.voiture:
        icon = <FontAwesome5 name="car-alt" size={24} color={Colors.background} />;
        break;
      case CL.moto:
        icon = <FontAwesome5 name="motorcycle" size={24} color={Colors.background} />;
        break;
      case CL.local:
        icon = <FontAwesome5 name="building" size={24} color={Colors.background} />;
        break;
      default:
        icon = <FontAwesome5 name="car-alt" size={24} color={Colors.background} />;
    }
    return (
      <>
        {icon}
      </>
    );
  }

  return (
    <TouchableOpacity onPress={onPressAction ? onPressAction : onPress}>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.logo}>
            <ReturnIcon />
          </View>
          <View style={styles.mcontainer}>
            <Text
              adjustsFontSizeToFit
              numberOfLines={2}
              style={styles.coinName}>
              {item?.attributes?.NomCompletClient}
            </Text>
            <Text style={styles.coinSymbol}>{item?.attributes?.type_lavage?.data?.attributes?.title?.toUpperCase()}</Text>
          </View>
          <View style={styles.rcontainer}>
            <View style={styles.bgprice}>
              <Text style={styles.price}>{item?.attributes?.montant}</Text>
            </View>
            <Text
              style={[
                styles.price,
                { color: item?.attributes?.mode_paiement?.data?.attributes?.name === "Impaye" ? Colors?.thirdRed : '#000' },
              ]}>
              {item?.attributes?.mode_paiement?.data?.attributes?.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logoimg: {
    width: 30,
    height: 30,
    justifyContent: 'center',
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
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    flex: 2,
  },
  chartContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 0,
    flex: 1,
  },
  coinName: {
    fontSize: 15,
    marginBottom: 2,
    fontWeight: 'bold',
    // fontFamily: 'RobotoSlab-Bold',
    color: "black",
  },
  price: {
    fontSize: 14,
    textAlign: 'right',
    color: "#000",
    marginVertical: 3,
  },
  logo: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    // backgroundColor: "#CF4600",
    backgroundColor: Colors.baseColor,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    opacity: 0.8
  },
  bgprice: {
    justifyContent: 'center',
  },
  rcontainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: 10,
    paddingRight: 5,
    flex: 1,
  },
  card: {
    flexDirection: 'row',
    flex: 1,
    height: 50,
    borderRadius: 20,
    padding: 10,
    justifyContent: 'center',
    marginHorizontal: 0,
    marginVertical: 10,

  },
});

export default React.memo(SmallCard);