import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { FlashList } from "@shopify/flash-list";
import ListCard from "../../Components/ListCard";
import ListCardDepense from "../../Components/ListCardDepense";
import {
  Input,
  Tabs,
  Separator,
  SizableText,
  ScrollView,
  XStack,
  ToggleGroup,
  Paragraph,
} from "tamagui";
import DatePicker from "../../Util/DatePicker";
import filter from "lodash.filter";
import TabCard from "../../Components/TabCard";
import { useAuth } from "../../Util/AuthContext";
import {
  getTodaysRangeDate,
  getWeeksRangeDate,
  getMonthRangeDate,
} from "../../Util/DateUtil";
import axios from "axios";
import { baseUrl } from "../../Util/BaseUrl";
import Spacing from "../../Util/static/Spacing";
import Colors from "../../Util/static/Colors";
import { BarChart, PieChart } from "react-native-gifted-charts";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

export const formatDateForSearch = (date) => {
  // Your date string
  var dateString = "2024-01-26T16:45:00.000Z";

  // Create a Date object from the string
  var dateObject = new Date(dateString);

  // Get the date components
  var year = dateObject.getFullYear();
  var month = dateObject.getMonth() + 1; // Note: Months are zero-indexed, so add 1
  var day = dateObject.getDate();

  // Format the date as a string (you can adjust the format as needed)
  var formattedDate =
    year +
    "-" +
    (month < 10 ? "0" : "") +
    month +
    "-" +
    (day < 10 ? "0" : "") +
    day;

  return formattedDate;
};

const Dashboard = () => {
  const ref = useRef(null);
  const onDateChange = (selectedDate, isFirstDate) => {
    const date = formatDateForSearch(selectedDate);
    console.log("Formatted date: ", date);
    if (isFirstDate) setDateDebut(date);
    else setDateFin(date);
  };

  const navigate = useNavigation();
  const [data, setData] = useState([]);
  const [depList, setDepList] = useState([]);
  const [ogDepList, setOgDepList] = useState([]);
  const [weekData, setWeekData] = useState([]);
  const [prestaCountByCat, setPrestaCountByCat] = useState([]);
  const [weekDataGraph, setWeekDataGraph] = useState([]);
  const [ogData, setOgData] = useState([]);
  const [user, setUser] = useAuth();
  const [depenses, setDepenses] = useState(0);
  const [recettes, setRecettes] = useState(0);
  const [encaissements, setEncaissement] = useState(0);
  const [totalPrestations, setTotalPrestations] = useState(0);
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [range, setRange] = useState(2);
  const [query, setQuery] = useState("");

  const barData = [
    { value: 250, label: "M" },
    { value: 500, label: "T", frontColor: "#177AD5" },
    { value: 745, label: "W", frontColor: "#177AD5" },
    { value: 320, label: "T" },
    { value: 600, label: "F", frontColor: "#177AD5" },
    { value: 256, label: "S" },
    { value: 900, label: "S" },
  ];

  const handleChangeText = (query) => {
    setQuery(query);
    const formattedQuery = query.trim().toLowerCase();

    if (!formattedQuery) {
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
      return true;
    }
    return false;
  };

  const isTablet = Dimensions.get("screen").width > 719;

  const ListHeaderComponent = () => {
    return (
      <View>
        <View
          style={[
            {
              flexGrow: 1,
              flexDirection: "row",
              alignContent: "center",
              justifyContent: "flex-start",
              marginBottom: 6,
            },
            styles.fieldContainer,
          ]}
        >
          <View
            style={{
              justifyContent: "center",
              flexDirection: "row",
              marginRight: 5,
            }}
          >
            <Ionicons
              style={{ alignSelf: "center" }}
              name="calendar"
              size={24}
              color="#828595"
            />
            <DatePicker
              value={dateDebut}
              onChange={(date) => onDateChange(date, true)}
              format={"YYYY-MM-DD"}
            />
          </View>
          <View style={{ justifyContent: "center", flexDirection: "row" }}>
            <Ionicons
              style={{ alignSelf: "center" }}
              name="calendar"
              size={24}
              color="#828595"
            />
            <DatePicker
              value={dateFin}
              onChange={(date) => onDateChange(date, false)}
              format={"YYYY-MM-DD"}
            />
          </View>
        </View>
        <Input
          value={query}
          style={styles.input}
          inputStyle={styles.inputStyle}
          labelStyle={styles.labelStyle}
          placeholderStyle={styles.placeholderStyle}
          textErrorStyle={styles.textErrorStyle}
          label="Rechercher dans la liste"
          placeholder="Rechercher par le nom, montant, ou type paiement"
          placeholderTextColor="gray"
          onChangeText={handleChangeText}
        />
      </View>
    );
  };

  const HorizontalTabs = () => {
    return (
      <Tabs
        defaultValue="tab1"
        orientation="horizontal"
        flexDirection="column"
        borderRadius="$4"
        borderWidth="$0.25"
        overflow="hidden"
        borderColor="$borderColor"
        height={100}
      >
        <Tabs.List
          separator={<Separator vertical />}
          disablePassBorderRadius="bottom"
          aria-label="Manage your account"
        >
          <Tabs.Tab flex={1} value="tab1">
            <SizableText fontFamily="$body">Recettes</SizableText>
          </Tabs.Tab>
          <Tabs.Tab flex={1} style={{ minHeight: 2 }} value="tab2">
            <SizableText fontFamily="$body">Dépenses</SizableText>
          </Tabs.Tab>
        </Tabs.List>
        <Separator />
        <TabsContent value="tab1">
          {/* <FlashList
                        StickyHeaderComponent={
                            <ListHeaderComponent />
                        }
                        data={data}
                        renderItem={(item) => <ListCard item={item} />}
                        estimatedItemSize={20}
                        contentContainerStyle={{ paddingHorizontal: 9.5, paddingBottom: 100 }}
                        onEndReached={() => {
                            // Since FlatList is a pure component, data reference should change for a render
                            const elems = [...data];
                            elems.push(..._generateArray(elems.length, 6));
                            setData(elems)
                        }}
                        onEndReachedThreshold={0.2}
                    /> */}
          <Text>Hola</Text>
        </TabsContent>

        <Tabs.Content value="tab2">
          <ScrollView style={{ flexGrow: 1 }}>
            <FlashList
              data={data}
              renderItem={(item) => <ListCard item={item} />}
              estimatedItemSize={20}
              contentContainerStyle={{
                paddingHorizontal: 9.5,
                paddingBottom: 100,
              }}
              onEndReached={() => {
                // Since FlatList is a pure component, data reference should change for a render
              }}
            />
          </ScrollView>
          {/* <Text>Hola</Text> */}
        </Tabs.Content>
      </Tabs>
    );
  };

  const TabsContent = (props) => {
    return (
      <Tabs.Content
        backgroundColor="$background"
        key="tab3"
        padding="$2"
        borderColor="$background"
        borderRadius="$2"
        borderTopLeftRadius={0}
        borderTopRightRadius={0}
        borderWidth="$2"
        {...props}
      >
        {props.children}
      </Tabs.Content>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      let dateDebutLocal;
      let dateFinLocal;

      switch (range) {
        case 1:
          console.log("Value is 1");
          let dates = getTodaysRangeDate();
          dateDebutLocal = dates.dateDebut;
          dateFinLocal = dates.dateFin;
          break;
        case 3:
          console.log("Value is 3");
          let month = getMonthRangeDate();
          dateDebutLocal = month.dateDebut;
          dateFinLocal = month.dateFin;
          break;
        default:
          console.log("Value is 2");
          let week = getWeeksRangeDate();
          dateDebutLocal = week.dateDebut;
          dateFinLocal = week.dateFin;
      }
      const getDashboardData = async () => {
        setDateDebut(dateDebutLocal);
        setDateFin(dateFinLocal);

        try {
          const { data } = await axios.get(
            `${baseUrl}/api/prestations/adminDashboard?dateDebut=${dateDebutLocal}&dateFin=${dateFinLocal}`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );

          setRecettes(data?.recettes);
          setDepenses(data?.depenses);
          setEncaissement(data?.caAndCount?.totalCA);
          setTotalPrestations(data?.caAndCount?.countPrestations);
        } catch (err) {
          console.error("Failed to get prestas", err);
        }
      };
      const getPrestationsListRange = async () => {
        try {
          const { data } = await axios.get(
            `${baseUrl}/api/prestations?populate=*&filters[createdAt][$gte]=${dateDebutLocal}&filters[createdAt][$lte]=${dateFinLocal}`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );
          console.log("Successfully got the prestas RANGE$$", data?.meta);
          setData(data?.data);
          setOgData(data?.data);
        } catch (err) {
          console.error("Failed to get prestas from DASH", err);
        }
      };
      const getDepensesListRange = async () => {
        try {
          const { data } = await axios.get(
            `${baseUrl}/api/depenses?populate=*&filters[createdAt][$gte]=${dateDebutLocal}&filters[createdAt][$lte]=${dateFinLocal}`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );
          console.log("Successfully got the DEP RANGE$$", data?.meta);
          setDepList(data?.data);
          setOgDepList(data?.data);
        } catch (err) {
          console.error("Failed to get DEP from DASH", err);
        }
      };
      const getWeeklyData = async () => {
        try {
          const { data } = await axios.get(
            `${baseUrl}/api/prestations/weeklySales`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );
          setWeekData(data);
          console.info(" to get WEEK", data?.weeklySales[0]);
          let output = [];
          let values = [1, 2, 3, 4, 5, 6, 7];
          for (let i = 0; i < data?.weeklySales[0].length; i++) {
            let obj = { label: "", value: "", frontColor: Colors.baseColor };
            obj.value = values[i]; //data?.weeklySales[1][i] for real data
            obj.label = data?.weeklySales[0][i];

            output.push(obj);
          }
          setWeekDataGraph(output);
          console.info(" to GO WEEK", output);
        } catch (err) {
          console.error("Failed to get Week", err);
        }
      };
      const getPrestaCountByCat = async () => {
        try {
          const { data } = await axios.get(
            `${baseUrl}/api/prestations/adminDashboard/countPrestationsByCategoryLavage`,
            {
              headers: { Authorization: `Bearer ${user?.token}` },
            }
          );
          setPrestaCountByCat(data);
        } catch (err) {
          console.error("Failed to get COUNT BY CAT", err);
        }
      };
      getDashboardData();
      getPrestationsListRange();
      getWeeklyData();
      getDepensesListRange();
      getPrestaCountByCat();
    }, [range])
  );

  const PrestationsListScreen = () => {
    return (
      <View style={{ height: 400 }}>
        <FlashList
          ref={ref}
          ListHeaderComponent={<ListHeaderComponent />}
          data={data}
          renderItem={(item) => <ListCard item={item} />}
          estimatedItemSize={50}
          contentContainerStyle={{ paddingHorizontal: 9.5, paddingBottom: 130 }}
          onEndReached={() => {
            // Since FlatList is a pure component, data reference should change for a render
            const elems = [...data];
            if (elems.length < ogData.length) {
              elems.push(ogData?.slice(elems.length, 6));
              setData(elems);
            }
          }}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={
            <Text style={{ justifyContent: "center", alignSelf: "center" }}>
              Aucune prestation enregistrée aujourd'hui
            </Text>
          }
        />
      </View>
    );
  };

  const DepensesListScreen = () => {
    return (
      <View style={{ height: 400 }}>
        <FlashList
          data={depList}
          renderItem={(item) => <ListCardDepense item={item} />}
          estimatedItemSize={50}
          contentContainerStyle={{ paddingHorizontal: 0.5, paddingBottom: 130 }}
          onEndReached={() => {
            // Since FlatList is a pure component, data reference should change for a render
            const elems = [...depList];
            if (elems.length < ogDepList.length) {
              elems.push(ogDepList?.slice(elems.length, 6));
              setDepList(elems);
            }
          }}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={
            <Text style={{ justifyContent: "center", alignSelf: "center" }}>
              Aucune prestation enregistrée aujourd'hui
            </Text>
          }
        />
      </View>
    );
  };

  const renderLegend = (text, color) => {
    return (
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <View
          style={{
            height: 18,
            width: 18,
            borderRadius: 4,
            backgroundColor: color || "white",
          }}
        />
        <Text style={{ color: "black", fontSize: 16, marginRight: 6 }}>
          {text || ""}
        </Text>
      </View>
    );
  };

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "first", title: "Prestations" },
    { key: "second", title: "Dépenses" },
  ]);
  const renderScene = SceneMap({
    first: PrestationsListScreen,
    second: DepensesListScreen,
  });

  return (
    <SafeAreaView
      style={{
        ...StyleSheet.absoluteFillObject,
        flex: 1,
        paddingHorizontal: 30,
      }}
    >
      <ScrollView
        style={{
          flex: 1,
          paddingHorizontal: Spacing,
        }}
      >
        <View style={styles.header}>
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text style={{ color: "darkgrey" }}>Bienvenu(e)</Text>
            <Text style={styles.username}>
              {" "}
              {"Ali"} {" " + "Thiam"}
            </Text>
          </View>

          <TouchableOpacity style={{ bottom: -8 }} onPress={() => setUser(null)}>
            <View style={styles.fPointsContainer}>
              <View style={styles.charContainer}>
                <Text style={{ fontWeight: "bold", color: "white" }}>
                  {"⎋"}
                </Text>
              </View>
              <View style={{ gap: 4, marginEnd: 16 }}>
                <View style={styles.pointsCountContainer}>
                  <Text style={styles.pointsCount}>Déconnexion</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            padding: 50,
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center",
            flex: 1,
          }}
        >
          <View>
            <Text style={{ marginBottom: 3 }}>
              Nombre de prestations de la semaine par jour
            </Text>
            <BarChart
              barWidth={20}
              noOfSections={3}
              barBorderRadius={4}
              frontColor="lightgray"
              data={weekDataGraph}
              yAxisThickness={0}
              xAxisThickness={0}
              renderTooltip={(item, index) => {
                return (
                  <View
                    style={{
                      marginBottom: 20,
                      marginLeft: -2,
                      backgroundColor: "#fff",
                      paddingHorizontal: 6,
                      paddingVertical: 4,
                      borderRadius: 4,
                    }}
                  >
                    <Text>{item.value}</Text>
                  </View>
                );
              }}
            />
          </View>
          <View>
            <Text style={{ marginBottom: 3 }}>
              Nombre de prestations de la semaine par catégorie{" "}
            </Text>
            <View style={{ flexDirection: "row" }}>
              {prestaCountByCat.map((item, index) =>
                renderLegend(item.label, item.color)
              )}
            </View>
            <PieChart
              data={prestaCountByCat}
              showText
              textColor="black"
              radius={100}
              textSize={18}
              focusOnPress
              showValuesAsLabels
              showTextBackground
              textBackgroundRadius={20}
            />
          </View>
        </View>

        <View style={styles.sectionTitle}>
          <Text style={{ color: "darkgrey" }}>Chiffres:</Text>
          <XStack>
            <ScrollView
              horizontal={true}
              bounces={true}
              directionalLockEnabled={true}
              style={{ padding: 2 }}
            >
              <ToggleGroup
                orientation={"horizontal"}
                id={"id"}
                type={"single"}
                size={"$4"}
                onValueChange={setRange}
                style={styles.shadowStyle}
                marginRight={20}
              >
                <ToggleGroup.Item value={1} aria-label="Left aligned">
                  <Text>Aujourd'hui</Text>
                </ToggleGroup.Item>
                <ToggleGroup.Item value={2} aria-label="Left aligned">
                  <Text>Cette Semaine</Text>
                </ToggleGroup.Item>
                <ToggleGroup.Item value={3} aria-label="Center aligned">
                  <Text>Ce Mois</Text>
                </ToggleGroup.Item>
              </ToggleGroup>
            </ScrollView>
          </XStack>
        </View>

        <View style={styles.dayInfoContainer}>
          <TabCard title={"Recettes"} number={recettes} icon={"arrow-down"} />
          <TabCard title={"Dépenses"} number={depenses} icon={"arrow-up"} />
          <TabCard
            title={"Total Prestations"}
            number={totalPrestations}
            icon={"gauge"}
          />
          <TabCard
            title={"Encaissements"}
            number={encaissements}
            icon={"arrow-down"}
          />
          {!isTablet && (
            <XStack height={20} alignItems="center">
              <Paragraph>Recettes: {recettes}</Paragraph>
              <Separator alignSelf="stretch" vertical marginHorizontal={15} />
              <Paragraph>Dépenses: {depenses}</Paragraph>
              <Separator alignSelf="stretch" vertical marginHorizontal={15} />
              <Paragraph>Total Prestations: {totalPrestations}</Paragraph>
              <Separator alignSelf="stretch" vertical marginHorizontal={15} />
              <Paragraph>Encaissements: {encaissements}</Paragraph>
            </XStack>
          )}
        </View>

        <View style={[styles.sectionTitle, { marginTop: 16 }]}>
          <Text style={{ color: "darkgrey" }}>Liste des Prestations:</Text>
        </View>

        {/* <FlashList
          ListHeaderComponent={<ListHeaderComponent />}
          data={data}
          renderItem={(item) => <ListCard item={item} />}
          estimatedItemSize={50}
          contentContainerStyle={{ paddingHorizontal: 9.5, paddingBottom: 100 }}
          onEndReached={() => {
            // Since FlatList is a pure component, data reference should change for a render
            const elems = [...data];
            if (elems.length < ogData.length) {
              elems.push(ogData?.slice(elems.length, 6));
              setData(elems);
            }
          }}
          onEndReachedThreshold={0.2}
          ListEmptyComponent={
            <Text style={{ justifyContent: "center", alignSelf: "center" }}>
              Aucune prestation enregistrée aujourd'hui
            </Text>
          }
        /> */}

        <View style={{ height: 500, padding: Spacing }}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: 360 }}
            renderTabBar={(props) => (
              <TabBar
                indicatorStyle={{
                  backgroundColor: Colors.background,
                  borderRadius: 10,
                }}
                style={{
                  backgroundColor: Colors.baseColor,
                  borderRadius: 10,
                  marginVertical: 10,
                }}
                {...props}
                labelStyle={{ fontWeight: "bold" }}
              />
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  svg: {
    position: "absolute",
    width: Dimensions.get("window").width,
    // top: -170,
  },
  bodyContainer: {
    marginTop: 15,
    flex: 1,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    flex: 1,
    textAlign: "center",
    marginEnd: 30,
  },
  CircleShapeView: {
    //To make Circle Shape
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    backgroundColor: "#FF00FF",
  },
  OvalShapeView: {
    //To make Oval Shape
    marginTop: 20,
    width: 100,
    height: 100,
    backgroundColor: "#ED2525",
    borderRadius: 50,
    transform: [{ scaleX: 2 }],
  },
  SquareShapeView: {
    //To make Square Shape
    width: 100,
    height: 100,
    backgroundColor: "#14ff5f",
  },
  RectangleShapeView: {
    //To make Rectangle Shape
    marginTop: 20,
    width: 120 * 2,
    height: 120,
    backgroundColor: "#14ff5f",
  },
  TriangleShapeView: {
    //To make Triangle Shape
    width: 0,
    height: 0,
    borderLeftWidth: 60,
    borderRightWidth: 60,
    borderBottomWidth: 120,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "#606070",
  },
  windowBg: {
    backgroundColor: "rgb(120, 240, 182)",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  mapBgMask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(23, 27, 34, 0.6)",
    width: "100%",
    zIndex: 1000,
  },
  fPointsContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(52, 54, 12, 0.3)",
    borderRadius: 20,
    padding: 4,
    gap: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  pointsCountContainer: {
    flexDirection: "row",

    justifyContent: "center",
  },
  pointsCount: {
    color: "white",
    fontSize: 12,
  },
  fPointTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 8,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "rgba(128, 128, 128, 0.3)",
    alignSelf: "center",
    marginLeft: 30,
  },
  charContainer: {
    width: 30,
    height: 30,
    padding: 8,
    backgroundColor: "rgba(128, 128, 128, 0.4)",
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(231, 236, 243, 0.4)",
  },
  username: {
    color: "black",
    fontWeight: "600",
    fontSize: 18,
    marginTop: 4,
  },
  responsiveContainer: {
    width: "100%",
    maxWidth: 600,
    alignSelf: "center",
  },
  inputContainer: {
    flex: 1,
    padding: 8,
  },
  proceedBtnContainer: {
    position: "absolute",
    left: 16,
    right: 16,
    alignItems: "center",
  },
  proceedButton: {
    width: "100%",
    maxWidth: 600,
    paddingVertical: 16,
    marginTop: 24,
    marginBottom: 8,
    elevation: 8,
    ...Platform.select({
      default: {
        shadowColor: "rgb(82, 176, 167)",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
      },
      web: { boxShadow: "0px 8px 10.32px rgba(82, 176, 167, 0.44)" },
    }),
  },
  proceedText: {
    color: "black",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  activeTicketTxt: {
    fontSize: 18,
    fontWeight: "bold",
    paddingTop: 24,
    paddingBottom: 8,
  },
  notesInput: {
    minHeight: 100,
    flexDirection: "row",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "grey",
    marginTop: 16,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "white",
    ...Platform.select({
      default: { textAlignVertical: "top" },
      web: { verticalAlign: "top" },
    }),
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
    fontSize: 13,
    fontWeight: "400",
    letterSpacing: 0,
    lineHeight: 1,
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
});
