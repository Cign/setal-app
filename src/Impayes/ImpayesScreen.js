import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';


const ImpayesScreen = () => {

  const navigate = useNavigation();

  return (
    <View style={styles.container}>
      <ScrollView style={styles.bodyContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigate.goBack()}>
            <Entypo name="chevron-left" color="#fff" size={30} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Impayes</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default ImpayesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'white',
  },
  svg: {
    position: 'absolute',
    width: Dimensions.get('window').width,
    // top: -170,
  },
  bodyContainer: {
    marginTop: 15,
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginEnd: 30,
  },
});