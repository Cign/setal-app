import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import ListCardAction from "../Components/ListCardAction";
import { TextInput } from "react-native-element-textinput";
import filter from "lodash.filter";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../Util/AuthContext";
import axios from "axios";
import { baseUrl } from "../Util/BaseUrl";
import ResponseDialog from "../Components/ResponseDialog";
import {
  ToggleGroup,
  XStack,
  YStack,
  Sheet,
  H5,
  Paragraph,
  Label,
  Button,
} from "tamagui";
import Colors from "../Util/static/Colors";
import Spacing from "../Util/static/Spacing";

const ImpayeScreen = () => {
  const [data, setData] = useState("");
  const [ogData, setOgData] = useState([]);
  const [countImpayes, setCountImpayes] = useState(0);
  const [totalImpayes, setTotalImpayes] = useState(0);
  const [query, setQuery] = useState("");
  const [user, setUser] = useAuth();
  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(true);
  const [prestaToUpdate, setPrestaToUpdate] = useState({});
  const [snapPointsMode, setSnapPointsMode] = useState("percent");
  const snapPoints = [50, 25];
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modePaiement, setModePaiement] = useState("");

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
    setOpen(true);
    setPrestaToUpdate(item?.item);
  };

  const confirmPay = async () => {
    // set the value at montant field on the coresponding prestation id
    try {
      const postData = {
        data: {
          Versement: prestaToUpdate?.attributes?.montant,
          mode_paiement: modePaiement,
          aPaye: true,
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

  useFocusEffect(
    React.useCallback(() => {
      const getImpayes = async () => {
        try {
          console.log("Trying hard", user);
          const { data } = await axios.get(
            `${baseUrl}/api/prestations?populate=*&filters[aPaye]=false`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );
          console.log("Successfully got the prestas IMPAYES $$", data?.data);
          setData(data?.data);
          setOgData(data?.data);
          setCountImpayes(data?.meta?.pagination?.total);
        } catch (err) {
          console.error("Failed to get IMPAYES", err);
        }
      };
      const getTotalImpayes = async () => {
        try {
          console.log("Trying hard", user);
          const { data } = await axios.get(
            `${baseUrl}/api/prestations/totalImpayes`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );
          setTotalImpayes(data?.totalImpayes);
        } catch (err) {
          console.error("Failed to get TOTAL IMPAYES", err);
        }
      };
      getImpayes();
      getTotalImpayes();
    }, [])
  );

  return (
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject }}>
      <View style={styles.container}>
        <ResponseDialog
          title={"Reglement impayé"}
          message={`Le client  ${prestaToUpdate?.attributes?.NomCompletClient} à
          versé la somme due !`}
          actionButtonText={"Fermer"}
          color={Colors.baseColor}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
        <View style={styles.dayInfoContainer}>
          <View style={[styles.boxContainer, { width: "100%" }]}>
            <View style={styles.iconGroup}>
              <View style={styles.iconOverlapGroup}>
                <View style={styles.ellipse} />
                <Entypo name="cross" color={Colors.baseColor} size={30} />
              </View>
            </View>
            <View style={styles.boxInfoVertical}>
              <Text style={styles.boxInfoVerticalTitle}>Total des impayés</Text>
              <Text style={styles.boxInfoVerticalContent}>{totalImpayes}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.sectionTitle, { marginTop: 16 }]}>
          <Text style={{ color: "darkgrey" }}>Liste des Impayés:</Text>
          <Text style={{ fontWeight: "bold", marginRight: "7%" }}>
            {" "}
            {countImpayes} Impayé(s)
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
            <ListCardAction
              item={item}
              screen={"Impaye"}
              onPressAction={() => openModal(item)}
            />
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
            <YStack
              style={{
                justifyContent: "center",
                alignItems: "center",
                marginTop: 20,
              }}
            >
              <H5>Confirmer le paiement </H5>
              <Paragraph>
                Est ce que le client{" "}
                {prestaToUpdate?.attributes?.NomCompletClient} a payé la somme
                due ?
              </Paragraph>
              <XStack
                style={{
                  alignSelf: "center",
                }}
              >
                <Label
                  width={80}
                  justifyContent="flex-end"
                  size={"$4"}
                  htmlFor={"pay"}
                >
                  {"Mode"}
                </Label>
                <View>
                  <ToggleGroup
                    orientation={"horizontal"}
                    id={"pay"}
                    type={"single"}
                    size={"$3"}
                    disableDeactivation={true}
                    onValueChange={setModePaiement}
                    style={styles.shadowStyle}
                  >
                    <ToggleGroup.Item value={1} aria-label="Left aligned">
                      <FontAwesome5 name="om" size={24} color="black" />
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value={2} aria-label="Center aligned">
                      <MaterialCommunityIcons
                        name="penguin"
                        size={24}
                        color="black"
                      />
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value={3} aria-label="Right aligned">
                      <FontAwesome5 name="money-bill" size={24} color="black" />
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value={4} aria-label="Right aligned">
                      <FontAwesome5 name="bitcoin" size={24} color="black" />
                    </ToggleGroup.Item>
                    <ToggleGroup.Item value={5} aria-label="Right aligned">
                      <FontAwesome5
                        name="exclamation-triangle"
                        size={24}
                        color="black"
                      />
                    </ToggleGroup.Item>
                  </ToggleGroup>
                </View>
              </XStack>
              <Button
                size={"$3"}
                color="#fff"
                onPress={confirmPay}
                backgroundColor={Colors.baseColor}
                style={{ marginVertical: 10, marginHorizontal: 6 }}
                minWidth={"45%"}
              >
                Valider
              </Button>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </View>
    </SafeAreaView>
  );
};

export default ImpayeScreen;

const styles = StyleSheet.create({
  container: {
    padding: Spacing,
    flex: 1,
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
    marginTop: 20,
    padding: Spacing,
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
    gap: 16,
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
    // lineHeight: 1,
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
    // lineHeight: 1,
    position: "relative",
  },

  // Outside title text
  sectionTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 8,
    padding: Spacing,
  },

  input: {
    height: 50,
    padding: Spacing,
    marginHorizontal: 8,
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
  },
  inputStyle: { fontSize: 16 },
  labelStyle: { fontSize: 14 },
  placeholderStyle: { fontSize: 16 },
  textErrorStyle: { fontSize: 16 },
});
