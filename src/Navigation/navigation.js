import "react-native-gesture-handler";
import React from "react";
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

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();



const screenOptions = ({ route }) => ({
    tabBarIcon: (props) => {
        let iconName;

        if (route.name === "Accueil") {
            iconName = "home";
        } else if (route.name === "Impayes") {
            iconName = "price-tag";
        }
        if (route.name === " ") {
            return <CustomTabBarButton {...props} />
        } 
        else if (route.name === "Abonnés") {
          iconName = "users";
        }
        else if (route.name === "Retrait") {
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
    headerShown: false,
    
});

const CustomTabBarButton = (props) => {
    return (<TouchableOpacity
        style={{
            top: -20,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow,
        }}
        onPress={props?.onClick}
    >
        <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: "#FF2E2E",
            justifyContent: 'center',
            alignItems: 'center',
        }}>
            <Entypo name={"plus"} size={props?.size} color={"#fff"} />
        </View>
    </TouchableOpacity>)
}



export function BottomTabs() {
    const [user] = useAuth()

    

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
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Accueil" component={PrestationClientScreen} />
            <Tab.Screen name="Abonnés" component={PrestationClientScreen} />
            <Tab.Screen name=" " component={PrestationClientScreen} />
            <Tab.Screen name="Impayes" component={ImpayesScreen} />
            <Tab.Screen name="Retrait" component={ImpayesScreen} />
            {/* <Tab.Screen name="Details" component={ListSearch} />
      <Tab.Screen name="Messages" component={NotificationScreen} /> */}
        </Tab.Navigator>
    );
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

// const TicketBookingNavigator = ({ navigation }) => {
//   return (
//     <Stack.Navigator
//       initialRouteName="DashboardScreen"
//       screenOptions={{ unmountOnBlur: true, headerShown: false }}
//     >
//       <Stack.Screen
//         name="AccueilScreen"
//         component={RAlterHome}
//       />
//       <Stack.Screen
//         name="TicketSearchListScreen"
//         component={ListSearch}
//       />
//       <Stack.Screen
//         name="SeatSelectionScreen"
//         component={SeatSelectionScreen}
//       />
//     </Stack.Navigator>
//   );
// };


