import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import {useNavigation} from '@react-navigation/native';
import { useAuth } from "../Util/AuthContext";


const LoginScreen = () => {

  const navigate = useNavigation();
  const [user, setUser] = useAuth();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.bodyContainer}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => setUser("test")}>
            <Entypo name="chevron-left" color="#000" size={30} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Login</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LoginScreen;

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
    color: '#000',
    flex: 1,
    textAlign: 'center',
    marginEnd: 30,
  },
});