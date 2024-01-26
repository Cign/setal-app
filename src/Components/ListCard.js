import React, {useEffect} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
// import {observer} from 'mobx-react-lite';
// import {CoinsAvatar} from 'components/coinsAvatar';
// import {LineChart} from 'react-native-chart-kit';
// import {formatPrice} from '../utils';
// import {Colors} from 'utils/colors';
import Entypo from 'react-native-vector-icons/Entypo';
import { Ionicons } from '@expo/vector-icons';

// item: { name, price, image, onPress, date, change }

const SmallCard = ({item: {item, index}}) => {
    useEffect(()=> {
        console.log("item", item)
    }, [])
    return (
      <TouchableOpacity  onPress={item.onPress ? item.onPress : null}>
        <View style={styles.container}>
          <View style={styles.card}>
            <View style={styles.logo}>
              {/* <CoinsAvatar
                style={styles.logoimg}
                coin={item.coin}
                source={item.image}
              /> */}
              <Ionicons name="car-sport-outline" size={24} color="black" />
            </View>
            <View style={styles.mcontainer}>
              <Text
                adjustsFontSizeToFit
                numberOfLines={2}
                style={styles.coinName}>
                {item?.name}
              </Text>
              <Text style={styles.coinSymbol}>{item?.type?.toUpperCase()}</Text>
            </View>
            <View style={styles.rcontainer}>
              <View style={styles.bgprice}>
                <Text style={styles.price}>{item?.price}</Text>
              </View>
              <Text
                style={[
                  styles.price,
                  {color: item?.change > 0 ? '#5cb85c' : '#B35F00'},
                ]}>
                {item?.payment}
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
    color: "#B35F00",
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
    // fontWeight: '500',
    color: "#000",
    marginVertical: 3,
  },
  logo: {
    width: 35,
    height: 35,
    alignSelf: 'center',
    backgroundColor: "#CF4600",
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    opacity:0.8
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
    // backgroundColor: Colors.card,
    justifyContent: 'center',
    marginHorizontal: 0,
    marginVertical: 10,
    
  },
});

export default React.memo(SmallCard);