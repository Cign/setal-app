import "react-native-gesture-handler";
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Text,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";

import Entypo from "react-native-vector-icons/Entypo";
import { useAuth } from "../Util/AuthContext";

import PrestationClientScreen from "../PrestationClient/PrestationClientScreen";
import ImpayesScreen from "../Impayes/ImpayesScreen";
import LoginScreen from "../Auth/Login";
import NewPrestationScreen from "../NewPrestation/NewPrestationScreen";
import CModal from "../Components/CModal";
import AbonneScreen from "../Abonne/AbonneScreen";
import NewAbonneScreen from "../NewAbonne/NewAbonne";
import RetraitScreen from "../Retrait/RetraitScreen";
import DetailsAbonneScreen from "../Abonne/DetailsAbonne";
import DashboardScreen from "../Admin/Dashboard/Dashboard";
import Colors from "../Util/static/Colors";

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

export function BottomTabs() {
  const [user] = useAuth();

  const [modalVisible, setModalVisible] = useState(false);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  if (!user) {
    return (
      <Stack.Navigator
        screenOptions={{ unmountOnBlur: true, headerShown: false }}
      >
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        {/* <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
        /> */}
      </Stack.Navigator>
    );
  }
  if (user?.role?.type === "admin") {
    return <AdminNavigator />;
  }
  //   {"blocked": false, "confirmed": true, "createdAt": "2024-02-01T23:24:14.829Z", "email": "kader@setal.sn", "id": 2, "provider": "local", "role": {"createdAt": "2024-02-01T19:01:54.171Z", "description": "Employe qui s'occupe des shifts", "id": 7, "name": "Shift", "type": "shift", "updatedAt": "2024-02-20T00:47:18.762Z"}
  return (
    <>
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="Accueil"
          component={PrestationClientScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Abonnements"
          component={AbonneNavigator}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name=" "
          component={NewPrestationScreen}
          options={{
            title: "Nouvelle Prestation",
            tabBarButton: (props) => <CustomTabBarButton {...props} />,
          }}
        />
        <Tab.Screen name="Impayes" component={ImpayesScreen} />
        <Tab.Screen name="Retraits" component={RetraitScreen} />
      </Tab.Navigator>
      <CModal visible={modalVisible} onClose={closeModal} />
    </>
  );
}

const screenOptions = ({ route }) => ({
  tabBarIcon: (props) => {
    let iconName;

    if (route.name === "Accueil") {
      iconName = "home";
    } else if (route.name === "Impayes") {
      iconName = "price-tag";
    } else if (route.name === "Abonnements") {
      iconName = "users";
    } else if (route.name === "Retraits") {
      iconName = "list";
    }

    // You can return any component that you like here!
    return <Entypo name={iconName} size={props?.size} color={props?.color} />;
  },
  tabBarActiveTintColor: "#FF2E2E",
  tabBarInactiveTintColor: "#464962",
  tabBarStyle: [
    {
      position: "absolute",
      bottom: 25,
      right: 20,
      left: 20,
      elevation: 1,
      backgroundColor: "#fff",
      borderRadius: 20,
      height: 90,
      ...styles.shadow,
    },
  ],
  tabBarHideOnKeyboard: true,
  // tabBarShowLabel: false,
});

const CustomTabBarButton = (props) => {
  return (
    <TouchableOpacity
      style={{
        top: -20,
        justifyContent: "center",
        alignItems: "center",
        ...styles.shadow,
      }}
      onPress={props?.onPress}
    >
      <View
        style={{
          width: 70,
          height: 70,
          borderRadius: 35,
          backgroundColor: "#FF2E2E",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Entypo name={"plus"} size={24} color={"#fff"} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});

const BackButton = (props) => {
  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor: "white",
          padding: 8,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 25,
          flexDirection: "row",
        },
        { paddingLeft: Platform.OS === "ios" ? 8 : 16 },
      ]}
      activeOpacity={0.6}
      onPress={() => navigation.goBack()}
      {...props}
    >
      <Ionicons name="chevron-back-sharp" size={24} color={Colors.baseColor} />
      <Text style={{ color: Colors.baseColor }}>Retour</Text>
    </TouchableOpacity>
  );
};

const AbonneNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="AbonneScreen"
      screenOptions={{
        unmountOnBlur: true,
        headerShown: true,
      }}
    >
      <Stack.Screen name="Abonnés" component={AbonneScreen} />
      <Stack.Screen
        name="NewAbonneScreen"
        component={NewAbonneScreen}
        options={{
          title: "Créer nouvel abonné",
          headerLeft: (props) => <BackButton {...props} />,
        }}
      />
      <Stack.Screen
        name="DetailsAbonneScreen"
        component={DetailsAbonneScreen}
        options={{
          title: "Infos sur l'abonné",
          headerLeft: (props) => <BackButton {...props} />,
        }}
      />
    </Stack.Navigator>
  );
};

const AdminNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="DashboardScreen"
      screenOptions={{
        unmountOnBlur: true,
        headerShown: true,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};
