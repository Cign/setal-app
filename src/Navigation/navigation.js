import "react-native-gesture-handler";
import React, { useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
    StyleSheet,
    Text,
    View,
    image,
    TouchableOpacity,
} from "react-native";

import { Ionicons } from '@expo/vector-icons';

import Entypo from "react-native-vector-icons/Entypo";
import { useAuth } from "../Util/AuthContext";

import PrestationClientScreen from "../PrestationClient/PrestationClientScreen"
import ImpayesScreen from "../Impayes/ImpayesScreen"
import LoginScreen from "../Auth/Login"
import NewPrestationScreen from "../NewPrestation/NewPrestationScreen"
import CModal from "../Components/CModal"
import AbonneScreen from "../Abonne/AbonneScreen"
import NewAbonneScreen from "../NewAbonne/NewAbonne"
import RetraitScreen from "../Retrait/RetraitScreen";
import DetailsAbonneScreen from "../Abonne/DetailsAbonne";
import DashboardScreen from "../Admin/Dashboard/Dashboard"

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

export function BottomTabs() {
    const [user] = useAuth()

    const [modalVisible, setModalVisible] = useState(false);

    const openModal = () => {
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    if (!user) {
        return (
            <Stack.Navigator screenOptions={{ unmountOnBlur: true, headerShown: false }}>
                <Stack.Screen
                    name="LoginScreen"
                    component={LoginScreen}
                />
                {/* <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
        /> */}
            </Stack.Navigator>
        )
    }
    return (
        <>
            <Tab.Navigator screenOptions={screenOptions}>
                <Tab.Screen name="Accueil" component={PrestationClientScreen} options={{ headerShown: false }} />
                <Tab.Screen name="Abonnements" component={AbonneNavigator} options={{ headerShown: false }}/>
                <Tab.Screen name=" " component={NewPrestationScreen} options={{ title: 'Nouvelle Prestation', tabBarButton: (props) => <CustomTabBarButton {...props}  /> }} /> 
                <Tab.Screen name="Impayes" component={ImpayesScreen} />
                <Tab.Screen name="Retraits" component={RetraitScreen} />
                <Tab.Screen name="AdminBoard" component={DashboardScreen} />
                {/* //onPress={openModal} => show the modal
      <Tab.Screen name="Messages" component={NotificationScreen} /> */}
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
        }
        else if (route.name === "Abonnements") {
            iconName = "users";
        }
        else if (route.name === "Retraits") {
            iconName = "list";
        }

        // You can return any component that you like here!
        return <Entypo name={iconName} size={props?.size} color={props?.color} />;
    },
    tabBarActiveTintColor: "#FF2E2E",
    tabBarInactiveTintColor: "#464962",
    tabBarStyle: [
        {
            position: 'absolute',
            bottom: 25,
            right: 20,
            left: 20,
            elevation: 1,
            backgroundColor: "#fff",
            borderRadius: 20,
            height: 90,
            ...styles.shadow
        },
    ],
    tabBarHideOnKeyboard: true,
    // tabBarShowLabel: false,
    

});

const CustomTabBarButton = (props) => {
    return (<TouchableOpacity
        style={{
            top: -20,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow,
        }}
        onPress={props?.onPress}
    >
        <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#FF2E2E",
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Entypo name={"plus"} size={24} color={"#fff"} />
        </View>
    </TouchableOpacity>)
}


const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#7F5DF0",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
})

const AbonneNavigator = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="AbonneScreen"
      screenOptions={{ unmountOnBlur: true, headerShown: true }}
    >
      <Stack.Screen
        name="Abonnés"
        component={AbonneScreen}
      />
      <Stack.Screen
        name="NewAbonneScreen"
        component={NewAbonneScreen}
        options={{ title:"Créer nouvel abonné"}}
      />
      <Stack.Screen
        name="DetailsAbonneScreen"
        component={DetailsAbonneScreen}
        options={{ title:"Infos sur l'abonné"}}
      />
    </Stack.Navigator>
  );
};


