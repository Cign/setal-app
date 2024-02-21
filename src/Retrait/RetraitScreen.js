import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { boxStyle } from "../Util/BaseStyles";
import { FlashList } from "@shopify/flash-list";
import ListCard from "../Components/ListCard";
import { TextInput } from "react-native-element-textinput";
import filter from "lodash.filter";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../Util/AuthContext";
import axios from "axios";
import { baseUrl } from "../Util/BaseUrl";
import ResponseDialog from "../Components/ResponseDialog";
import { XStack, YStack, Sheet, H5, Paragraph, Button, Spacer } from "tamagui";
import Colors from "../Util/static/Colors";
import Spacing from "../Util/static/Spacing";

const RetraitScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState({});
  const [ogData, setOgData] = useState({});
  const [countRetrait, setCountRetrait] = useState(0);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(true);
  const [innerOpen, setInnerOpen] = useState(false);
  const [snapPointsMode, setSnapPointsMode] = useState("percent");
  const [mixedFitDemo, setMixedFitDemo] = useState(false);
  const [prestaToUpdate, setPrestaToUpdate] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [user, setUser] = useAuth();
  const snapPoints = [50];

  const handleSearch = (query) => {
    setQuery(query);
    const formattedQuery = query.toLowerCase();
    console.log("f query", formattedQuery);
    if (formattedQuery === "" || formattedQuery === " ") {
      console.log("here ");
      setData(ogData);
      return;
    }
    const filteredData = filter(data, (presta) => {
      return contains(presta, formattedQuery);
    });
    setData(filteredData);
  };

  const contains = (
    { attributes: { NomCompletClient, montant, Description } },
    query
  ) => {
    console.log("nomcomplet", Description);
    if (
      NomCompletClient?.toLowerCase().includes(query) ||
      montant?.toLowerCase().includes(query) ||
      Description?.toLowerCase().includes(query)
    ) {
      console.log("hit");
      return true;
    }
    return false;
  };

  const openModal = (item) => {
    setPrestaToUpdate(item?.item);
    setOpen(true);
  };

  useFocusEffect(
    React.useCallback(() => {
      const getRetraits = async () => {
        try {
          console.log("Trying hard", user);
          const { data } = await axios.get(
            `${baseUrl}/api/prestations?populate=*&filters[aRetirer]=false`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );
          console.log("Successfully got the prestas RETRAIT $$", data?.data);
          setData(data?.data);
          setOgData(data?.data);
          setCountRetrait(data?.meta?.pagination?.total);
        } catch (err) {
          console.error("Failed to get RETRAIT", err);
        }
      };
      getRetraits();
    }, [])
  );

  const confirmRetrait = async () => {
    try {
      const postData = {
        data: {
          aRetirer: true,
        },
      };

      await axios.put(
        `${baseUrl}/api/prestations/${prestaToUpdate?.id}`,
        postData,
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      console.log("Successfully UPDATED a new PRESTATION");
      setOpen(false);
      setIsModalVisible(true);
      setPrestaToUpdate({});
    } catch (err) {
      console.error("Failed to UPDATE PRESTA", err);
    }
  };

  return (
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}>
      <View style={styles.container}>
        <ResponseDialog
          title={"Retrait de Tapis"}
          message={`Le client ${prestaToUpdate?.attributes?.NomCompletClient} à
          retiré son tapis !`}
          actionButtonText={"Fermer"}
          color={Colors.baseColor}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
        <View style={[styles.sectionTitle, { marginTop: 16 }]}>
          <Text style={{ color: "darkgrey" }}>A retirer:</Text>
          <Text style={{ fontWeight: "bold", marginRight: "7%" }}>
            {" "}
            {countRetrait} tapis
          </Text>
        </View>
        <FlashList
          ListHeaderComponent={
            <TextInput
              value={query}
              style={styles.input}
              inputStyle={styles.inputStyle}
              labelStyle={styles.labelStyle}
              placeholderStyle={styles.placeholderStyle}
              textErrorStyle={styles.textErrorStyle}
              label="Rechercher dans la liste"
              placeholder="Rechercher par le nom, montant, ou type paiement"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                handleSearch(text);
              }}
            />
          }
          data={data}
          renderItem={(item) => (
            <ListCard item={item} onPressAction={() => openModal(item)} />
          )}
          estimatedItemSize={20}
          contentContainerStyle={{ paddingHorizontal: 9.5, paddingBottom: 100 }}
          onEndReachedThreshold={0.2}
        />
        <Sheet
          forceRemoveScrollEnabled={open}
          modal={modal}
          open={open}
          onOpenChange={setOpen}
          snapPoints={snapPoints}
          snapPointsMode={snapPointsMode}
          dismissOnSnapToBottom
          position={position}
          onPositionChange={setPosition}
          zIndex={100_000}
          animation=""
          moveOnKeyboardChange={true}
        >
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Sheet.Handle />
          <Sheet.Frame padding="$4" space="$5">
            <YStack style={{ justifyContent: "center", alignItems: "center", marginTop: 20 }}>
              <H5>Confirmer le retrait </H5>
              <Paragraph>
                Le client {prestaToUpdate?.attributes?.NomCompletClient} à
                retiré son tapis ?
              </Paragraph>
              <XStack>
                <Button
                  size={"$3"}
                  style={{ marginRight: 6, marginVertical: 10 }}
                  focusStyle={{ outlineColor: Colors.baseColor }}
                  backgroundColor={Colors.background}
                  minWidth={90}
                  variant="outlined"
                  onPress={()=>setOpen(false)}
                >
                  Non
                </Button>
                <Button
                  size={"$3"}
                  color="#fff"
                  onPress={confirmRetrait}
                  backgroundColor={Colors.baseColor}
                  style={{ marginVertical: 10, marginHorizontal: 6 }}
                  minWidth={90}
                >
                  Oui
                </Button>
              </XStack>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </View>
    </SafeAreaView>
  );
};

export default RetraitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing,
    marginHorizontal: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: 16,
  },
  // DAY DASHBOARD STYLES
  dayInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  boxContainer: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderColor: "#2222221a",
    borderRadius: 20,
    borderWidth: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
    position: "relative",
    width: 150,
    gap: 16,
    shadowColor: "#ff2e2e",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
  },
  iconGroup: {
    height: 40,
    position: "relative",
    width: 40,
  },
  iconOverlapGroup: {
    borderRadius: 20,
    height: 40,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  ellipse: {
    backgroundColor: "#e6492d",
    borderRadius: 20,
    height: 40,
    opacity: 0.08,
    position: "absolute",
    top: 0,
    left: 0,
    width: 40,
  },
  boxImage: {
    height: 24,
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
  },
  boxInfoVertical: {
    alignItems: "flex-start",
    display: "flex",
    flexDirection: "column",
    gap: 3,
    position: "relative",
  },
  boxInfoVerticalTitle: {
    color: "#222222",
    // fontFamily: 'DM Sans-Regular',
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: 0,
    // lineHeight: 'normal',
    marginTop: -1,
    opacity: 0.4,
    position: "relative",
  },
  boxInfoVerticalContent: {
    color: "#222222",
    // fontFamily: 'DM Sans-Bold',
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 0,
    // lineHeight: 'normal',
    position: "relative",
  },

  // Outside title text
  sectionTitle: {
    display: "flex",
    flexDirection: "row",
    marginLeft: "6%",
    marginVertical: "2%",
    justifyContent: "space-between",
  },

  input: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "white",
    shadowColor: "#ff2e2e",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.17,
    shadowRadius: 3.05,
    elevation: 4,
    padding: Spacing,
    marginHorizontal: 8,
  },
  inputStyle: { fontSize: 16 },
  labelStyle: { fontSize: 14 },
  placeholderStyle: { fontSize: 16 },
  textErrorStyle: { fontSize: 16 },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "black",
  },
});
