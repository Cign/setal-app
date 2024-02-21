import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../Util/AuthContext";
import Spacing from "../Util/static/Spacing";
import FontSize from "../Util/static/FontSize";
import Colors from "../Util/static/Colors";
import Font from "../Util/static/Fonts";
import { Input } from "tamagui";
import axios from "axios";
import { baseUrl } from "../Util/BaseUrl";

const LoginScreen = () => {
  const navigate = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useAuth();
  const [focus, setFocus] = useState(false);

  // Define the handleLogin function
  const handleLogin = () => {
    // Make a POST request to the authentication endpoint of the API
    axios
      .post(`${baseUrl}/api/auth/local`, {
        // The request body contains the username and password
        identifier: username,
        password: password,
      })
      .then((res) => {
        // If the request is successful, log the token and call the getUserData function with the token
        console.log("Successfully logged in", res.data.jwt);
        getUserData(res.data.jwt);
      })
      .catch((err) => {
        // If the request fails, log an error message
        console.error("Failed to log in");
      });
  };

  const getUserData = async (token) => {
    try {
      const { data } = await axios.get(
        `${baseUrl}/api/users/me?populate[0]=role`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log("Successfully got the USER", data);
      setUser({ ...data, token });
    } catch (err) {
      console.error("Failed to get the user");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View
        style={{
          flex: 1,
          padding: Spacing * 2,
          backgroundColor: "#fff",
        }}
      >
        <SafeAreaView>
          <View
            style={{
              width: "60%",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  fontFamily: Font["poppins-semiBold"],
                  fontSize: FontSize.large,
                  maxWidth: "60%",
                  textAlign: "center",
                  marginVertical: Spacing * 3,
                }}
              >
                Bienvenu(e) sur Setal Manager
              </Text>
              <Text
                style={{
                  fontSize: FontSize.xLarge,
                  color: Colors.baseColor,
                  fontFamily: Font["poppins-bold"],
                }}
              >
                Connectez-vous
              </Text>
            </View>
            <View
              style={{
                marginVertical: Spacing * 2,
              }}
            >
              <Input
                margin={6}
                placeholder="Nom d'utilisateur"
                onChangeText={setUsername}
                style={[styles.shadow, { backgroundColor: Colors.white }]}
                borderRadius={10}
              />
              <Input
                margin={6}
                placeholder="Mot de passe"
                onChangeText={setPassword}
                style={[styles.shadow, { backgroundColor: Colors.white }]}
                borderRadius={10}
                elevation={4}
                shadowColor={Colors.baseColor}
                shadowOpacity={0.17}
                shadowOffset={{
                  width: 0,
                  height: 3,
                }}
              />
            </View>

            <View>
              <Text
                style={{
                  fontFamily: Font["poppins-semiBold"],
                  fontSize: FontSize.small,
                  color: Colors.baseColor,
                  alignSelf: "flex-end",
                }}
              >
                Mot de passe oublié ?
              </Text>
            </View>

            <TouchableOpacity
              style={{
                padding: Spacing / 2,
                backgroundColor: Colors.baseColor,
                marginVertical: Spacing,
                borderRadius: Spacing,
                shadowColor: Colors.primary,
                shadowOffset: {
                  width: 0,
                  height: Spacing,
                },
                shadowOpacity: 0.3,
                shadowRadius: Spacing,
                borderRadius: 10,
              }}
              onPress={() => handleLogin()}
            >
              <Text
                style={{
                  fontFamily: Font["poppins-bold"],
                  color: Colors.onPrimary,
                  textAlign: "center",
                  fontSize: FontSize.large,
                }}
              >
                Connexion
              </Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              onPress={() => navigate("RegisterScreen")}
              style={{
                padding: Spacing,
              }}
            >
              <Text
                style={{
                  fontFamily: Font["poppins-semiBold"],
                  color: Colors.text,
                  textAlign: "center",
                  fontSize: FontSize.small,
                }}
              >
                Créer un nouveau compte
              </Text>
            </TouchableOpacity> */}
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "white",
    marginTop: 20,
  },
  svg: {
    position: "absolute",
    width: Dimensions.get("window").width,
    // top: -170,
  },
  shadow: {
    borderRadius: 20,
    shadowColor: "#ff2e2e",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
});
