import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import ListCardPrestaAbonne from "../Components/ListCardPrestaAbonne";
import { YStack, Sheet, Label, Input, Button } from "tamagui";
import { TextInput } from "react-native-element-textinput";
import filter from "lodash.filter";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../Util/AuthContext";
import axios from "axios";
import { baseUrl } from "../Util/BaseUrl";
import { useRoute } from "@react-navigation/native";
import ResponseDialog from "../Components/ResponseDialog";
import ActionModal from "../Components/ActionModal";
import Colors from "../Util/static/Colors";
import Spacing from "../Util/static/Spacing";

const DetailsAbonneScreen = () => {
  const route = useRoute();
  const { item } = route.params;
  const [data, setData] = useState([]);
  const [ogData, setOgData] = useState([]);
  const [countAbonnePrestas, setAbonnePrestas] = useState(0);
  const [query, setQuery] = useState("");
  const [montant, setMontant] = useState("");
  const [user, setUser] = useAuth();

  const [position, setPosition] = useState(0);
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(true);
  const [snapPointsMode, setSnapPointsMode] = useState("percent");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const snapPoints = [50];

  const handleSearch = (query) => {
    setQuery(query);
    const formattedQuery = query.toLowerCase();
    console.log("f query", formattedQuery);
    if (formattedQuery === "" || formattedQuery === " ") {
      console.log("here ");
      setData(ogData); //set OG data
      return;
    }
    const filteredData = filter(data, (presta) => {
      return contains(presta, formattedQuery);
    });
    setData(filteredData);
  };

  const contains = ({ attributes: { commentaire, createdAt } }, query) => {
    if (
      commentaire?.toLowerCase().includes(query) ||
      createdAt?.toLowerCase().includes(query)
    ) {
      console.log("hit");
      return true;
    }
    return false;
  };

  const addVersement = async () => {
    try {
      const postData = {
        data: {
          montant,
          abonne: item?.id,
        },
      };

      await axios.post(`${baseUrl}/api/encaissement-abonnes`, postData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      console.log("Successfully created a new ABONNE");
      updateAbonneSolde();
      setModalVisible(false);
      setIsModalVisible(true);
      setOpen(false);
      clearText();
    } catch (err) {
      console.error("Failed to CREATE ABONNE", err);
    }
  };

  const updateAbonneSolde = async () => {
    try {
      let newSolde = parseInt(item?.attributes?.Solde) + parseInt(montant);
      const postData = {
        data: {
          montant,
          Solde: String(newSolde),
        },
      };
      await axios.put(`${baseUrl}/api/abonnes/${item?.id}`, postData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      console.log("Successfully update ABONNE SOLDE");
    } catch (err) {
      console.error("Failed to update ABONNE SOLDE", err);
    }
  };

  const addPrestation = async () => {
    try {
      const postData = {
        data: {
          commentaire: "normal",
          abonne: item?.id,
        },
      };
      await axios.post(`${baseUrl}/api/prestation-abonnes`, postData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      console.log("Successfully created a new ABONNE PRESTATION");
      setModalVisible(false);
      setIsModalVisible(true);
    } catch (err) {
      console.error("Failed to CREATE ABONNE PRESTATION", err);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log("item forcast", item);

      const getListPrestasAbonnes = async () => {
        try {
          const { data } = await axios.get(
            `${baseUrl}/api/prestation-abonnes?populate=*&filters[abonne][id][$eqi]=${item?.id}`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );
          console.log("Successfully got the prestas for ABONNE $$", data?.data);
          setData(data?.data);
          setOgData(data?.data);
          setAbonnePrestas(data?.meta?.pagination?.total);
        } catch (err) {
          console.error("Failed to get prestas for abonne", err);
        }
      };
      getListPrestasAbonnes();
    }, [])
  );

  const clearText = () => {
    setMontant("");
  };

  return (
    <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}>
      <View style={styles.container}>
        <ActionModal
          isVisible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={addPrestation}
          modalTitle="Confirmez vous la prestation?"
          modalText={`En validant vous confirmez une nouvelle prestation pour l'abonné ${item?.attributes?.NomComplet} Aujourd'hui`}
        />
        <ResponseDialog
          title={"Nouvelle Prestation Abonné"}
          message={`Une nouvelle dépense a été ajoutée pour l'abonné ${item?.attributes?.NomComplet} .`}
          actionButtonText={"Fermer"}
          color={Colors.baseColor}
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
        />
        <View style={styles.header}>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <YStack>
              <View style={styles.dashTextBox}>
                <Text style={{ color: "darkgrey" }}>Nom Abonné(e)</Text>
                <Text style={styles.username}>
                  {" "}
                  {item?.attributes?.NomComplet}
                </Text>
              </View>
              <View>
                <Text style={{ color: "darkgrey" }}>Catégorie Lavage</Text>
                <Text style={styles.username}>
                  {" "}
                  {
                    item?.attributes?.category_lavage?.data?.attributes?.name
                  }{" "}
                </Text>
              </View>
            </YStack>
          </View>
          <View style={{ flex: 1, alignItems: "flex-end", padding: Spacing }}>
            <YStack>
              <View style={styles.dashTextBox}>
                <Text style={{ color: "darkgrey" }}>Type Lavage</Text>
                <Text style={styles.username}>
                  {item?.attributes?.type_lavage?.data?.attributes?.title}
                </Text>
              </View>
              <View>
                <Text style={{ color: "darkgrey" }}>Solde</Text>
                <Text style={styles.username}> {item?.attributes?.Solde} </Text>
              </View>
            </YStack>
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={{ color: "darkgrey" }}>Details Abonnés</Text>
        </View>

        <View style={styles.dayInfoContainer}>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <View style={[styles.boxContainer]}>
              <View style={styles.iconGroup}>
                <View style={styles.iconOverlapGroup}>
                  <View style={styles.ellipse} />
                  <Entypo name="plus" color={Colors.baseColor} size={30} />
                </View>
              </View>
              <View style={styles.boxInfoVertical}>
                <Text style={styles.boxInfoVerticalTitle}>
                  Nouvelle Prestation
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <View style={[styles.boxContainer]}>
              <View style={styles.iconGroup}>
                <View style={styles.iconOverlapGroup}>
                  <View style={styles.ellipse} />
                  <FontAwesome5
                    name="hand-holding-usd"
                    size={24}
                    color={Colors.baseColor}
                  />
                </View>
              </View>
              <View style={styles.boxInfoVertical}>
                <Text style={styles.boxInfoVerticalTitle}>Versement</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View style={[styles.sectionTitle, { marginTop: 16 }]}>
          <Text style={{ color: "darkgrey" }}>
            Liste des Prestations du Mois:
          </Text>
          <Text style={{ fontWeight: "bold", marginRight: "7%" }}>
            {" "}
            {countAbonnePrestas} Prestation(s)
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
              placeholder="Rechercher par le nom, montant, immatriculation ou type paiement"
              placeholderTextColor="gray"
              onChangeText={(text) => {
                handleSearch(text);
              }}
            />
          }
          data={data}
          renderItem={(item) => <ListCardPrestaAbonne item={item} />}
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
            <YStack width={"80%"} style={{alignSelf: "center"}}>
              <Label htmlFor="montant">Montant du Versement</Label>
              <Input
                size="$4"
                id="montant"
                placeholder="Montant"
                value={montant}
                onChangeText={setMontant}
                style={styles.shadowStyle}
              />
              <Button
                color={Colors.background}
                backgroundColor={Colors.baseColor}
                onPress={addVersement}
                marginTop={10}
              >
                Enregistrer
              </Button>
            </YStack>
          </Sheet.Frame>
        </Sheet>
      </View>
    </SafeAreaView>
  );
};

export default DetailsAbonneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing,
    marginHorizontal:8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    padding: Spacing,
  },
  username: {
    color: "black",
    fontWeight: "600",
    fontSize: 18,
    marginTop: 4,
  },

  // DAY DASHBOARD STYLES
  dayInfoContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 8,
    paddingHorizontal: Spacing,
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
  // Outside title text
  sectionTitle: {
    display: "flex",
    flexDirection: "row",
    marginHorizontal: 8,
    padding: Spacing,
    justifyContent: "space-between",
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
  shadowStyle: {
    shadowColor: "#ff2e2e",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.17,
    shadowRadius: 2.05,
    elevation: 4,
    backgroundColor: "white",
  },
  dashTextBox: {
    paddingBottom: 5,
  },
});
