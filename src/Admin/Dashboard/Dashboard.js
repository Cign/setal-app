import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    SafeAreaView,
    Platform
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from "@shopify/flash-list";
import ListCard from '../../Components/ListCard';
import { YStack, Sheet, Label, Input, Button, Tabs, Separator, SizableText, isWeb, ScrollView } from 'tamagui'
import DatePicker from '../../Util/DatePicker';
import filter from "lodash.filter"

const PRESTA_LIST = [
    { name: "Ousmane Tall", price: "2500", image: "", onPress: "", type: "simple", payment: "Cash", category: "" },
    { name: "Mango Fall", price: "5000", image: "", onPress: "", type: "Complet", payment: "Impaye" },
    { name: "Bougah Jean", price: "2500", image: "", onPress: "", type: "simple", payment: "OM" },
    { name: "Alassane Niang", price: "2500", image: "", onPress: "", type: "simple", payment: "Wave" },
    { name: "Ndiogou Cisse", price: "5000", image: "", onPress: "", type: "Complet", payment: "Cash" },
    { name: "Fallou Ba", price: "2500", image: "", onPress: "", type: "simple", payment: "Cash" },
    { name: "Kader Lo", price: "2500", image: "", onPress: "", type: "simple", payment: "Cash" },
    { name: "Ibrahim Kante", price: "5000", image: "", onPress: "", type: "Complet", payment: "Wave" },
    { name: "Amadou Ba", price: "7500", image: "", onPress: "", type: "Complet +", payment: "Wave" }
]

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
    var formattedDate = year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;

    return formattedDate;
}

const Dashboard = () => {

    const _generateArray = (start, size) => {

        return PRESTA_LIST.slice(start, size);
    }
    const onDateChange = (selectedDate, isFirstDate) => {
        const date = formatDateForSearch(selectedDate);
        console.log("Formatted date: ", date);
        isFirstDate ? setDateDebut(date) : setDateFin(date);
    };

    const navigate = useNavigation();
    const [data, setData] = useState(_generateArray(0, 1));
    const [montantDepense, setMontantDepense] = useState(0);
    const [objetDepense, setObjetDepense] = useState(0);
    const [position, setPosition] = useState(0)
    const [open, setOpen] = useState(false)
    const [modal, setModal] = useState(true)
    const [snapPointsMode, setSnapPointsMode] = useState('percent')
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const snapPoints = [50, 25];
    const [query, setQuery] = useState("");

    const handleChangeText = (query) => {
        setQuery(query);
        const formattedQuery = query.trim().toLowerCase();

        if (!formattedQuery) {
            setData(PRESTA_LIST);
            return
        }
        const filteredData = filter(data, (presta) => {
            return contains(presta, formattedQuery);
        })
        setData(filteredData);
    }

    const contains = ({ name, price, payment }, query) => {
        return [name, price, payment].some(prop => prop.toLowerCase().includes(query));
    }

    const ListHeaderComponent = () => {
        return (
            <View>
                <View style={[{ flexGrow: 1, flexDirection: "row", alignContent: "center", justifyContent: "space-around", marginBottom: 6 }, styles.fieldContainer]}>
                    <View style={{ justifyContent: "center", flexDirection: "row", marginRight: 2 }}>
                        <Ionicons
                            style={{ alignSelf: "center" }}
                            name="calendar"
                            size={24}
                            color="#828595"
                        />
                        <DatePicker value={dateDebut} onChange={(date) => onDateChange(date, true)} format={"YYYY-MM-DD"} />
                    </View>
                    <View style={{ justifyContent: "center", flexDirection: "row" }}>
                        <Ionicons
                            style={{ alignSelf: "center" }}
                            name="calendar"
                            size={24}
                            color="#828595"
                        />
                        <DatePicker value={dateFin} onChange={(date) => onDateChange(date, false)} format={"YYYY-MM-DD"} />
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
        )
    }

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
                    <Tabs.Tab flex={1} style={{ minHeight: 2, }} value="tab2">
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
                            contentContainerStyle={{ paddingHorizontal: 9.5, paddingBottom: 100 }}
                            onEndReached={() => {
                                // Since FlatList is a pure component, data reference should change for a render
                                const elems = [...data];
                                elems.push(..._generateArray(elems.length, 2));
                                setData(elems)
                            }}
                        />
                    </ScrollView>
                    {/* <Text>Hola</Text> */}
                </Tabs.Content>
            </Tabs>
        )
    }

    const TabsContent = (props) => {
        return (
            <Tabs.Content
                backgroundColor="$background"
                key="tab3"
                padding="$2"
                // alignItems="center"
                // justifyContent="center"
                // flex={1}
                borderColor="$background"
                borderRadius="$2"
                borderTopLeftRadius={0}
                borderTopRightRadius={0}
                borderWidth="$2"
                {...props}
            >
                {props.children}
            </Tabs.Content>
        )
    }

    return (
        <LinearGradient
            style={styles.container}
            colors={["white", "white", "white"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}>
                <View style={styles.header}>
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                        <Text style={{ color: "darkgrey" }}>Bienvenu(e)</Text>
                        <Text style={styles.username}> {"Ali"} {" " + "Thiam"}</Text>
                    </View>

                    <TouchableOpacity
                        style={{ bottom: -8, }}
                        onPress={() => {
                        }}
                    >
                        <View style={styles.fPointsContainer}>
                            <View style={styles.charContainer}>
                                <Text style={{ fontWeight: "bold", color: "white" }}>{"⎋"}</Text>
                            </View>
                            <View style={{ gap: 4, marginEnd: 16 }}>
                                <View style={styles.pointsCountContainer}>
                                    <Text style={styles.pointsCount}>Déconnexion</Text>
                                </View>
                            </View>
                        </View>
                        {/* <View style={styles.fPointTriangle} /> */}
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionTitle}>
                    <Text style={{ color: "darkgrey" }}>Chiffres du jour</Text>
                    <TouchableOpacity onPress={() => setOpen(true)}>
                        <Text style={{ marginRight: "7%" }}>Ajouter dépense</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dayInfoContainer}>
                    <View style={styles.boxContainer}>
                        <View style={styles.iconGroup}>
                            <View style={styles.iconOverlapGroup}>
                                <View style={styles.ellipse} />
                                <Entypo name="arrow-down" color="orange" size={30} />
                            </View>
                        </View>
                        <View style={styles.boxInfoVertical}>
                            <Text style={styles.boxInfoVerticalTitle}>Recettes</Text>
                            <Text style={styles.boxInfoVerticalContent}>107200</Text>
                        </View>
                    </View>
                    <View style={styles.boxContainer}>
                        <View style={styles.iconGroup}>
                            <View style={styles.iconOverlapGroup}>
                                <View style={styles.ellipse} />
                                <Entypo name="arrow-up" color="orange" size={30} />
                            </View>
                        </View>
                        <View style={styles.boxInfoVertical}>
                            <Text style={styles.boxInfoVerticalTitle}>Dépenses</Text>
                            <Text style={styles.boxInfoVerticalContent}>107000</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.dayInfoContainer}>
                    <View style={styles.boxContainer}>
                        <View style={styles.iconGroup}>
                            <View style={styles.iconOverlapGroup}>
                                <View style={styles.ellipse} />
                                <Entypo name="arrow-down" color="orange" size={30} />
                            </View>
                        </View>
                        <View style={styles.boxInfoVertical}>
                            <Text style={styles.boxInfoVerticalTitle}>Recettes</Text>
                            <Text style={styles.boxInfoVerticalContent}>107200</Text>
                        </View>
                    </View>
                    <View style={styles.boxContainer}>
                        <View style={styles.iconGroup}>
                            <View style={styles.iconOverlapGroup}>
                                <View style={styles.ellipse} />
                                <Entypo name="arrow-up" color="orange" size={30} />
                            </View>
                        </View>
                        <View style={styles.boxInfoVertical}>
                            <Text style={styles.boxInfoVerticalTitle}>Dépenses</Text>
                            <Text style={styles.boxInfoVerticalContent}>107000</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.sectionTitle, { marginTop: 16 }]}>
                    <Text style={{ color: "darkgrey" }}>Liste des Prestations du jour:</Text>
                    <Text style={{ fontWeight: "bold", marginRight: "7%" }}> 12 Prestations</Text>
                </View>

                <FlashList
                    ListHeaderComponent={<ListHeaderComponent />}
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
                        <YStack>
                            <Label htmlFor="montant">
                                Objet de la Dépense:
                            </Label>
                            <Input size="$4" id="montant" placeholder="Objet" value={objetDepense} onChange={setObjetDepense} style={styles.shadowStyle} />
                            <Label htmlFor="montant">
                                Montant de la Dépense:
                            </Label>
                            <Input size="$4" id="montant" placeholder="Montant" value={montantDepense} onChange={setMontantDepense} style={styles.shadowStyle} />
                            <Button
                                title='Enregistrer'
                                backgroundColor="#ff2e2e"
                                color={'cyan'}
                                style={{ marginTop: 6 }}
                            >
                                Enregistrer
                            </Button>
                        </YStack>
                    </Sheet.Frame>
                </Sheet>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default Dashboard;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    CircleShapeView: {
        //To make Circle Shape
        width: 150,
        height: 150,
        borderRadius: 150 / 2,
        backgroundColor: '#FF00FF',
    },
    OvalShapeView: {
        //To make Oval Shape
        marginTop: 20,
        width: 100,
        height: 100,
        backgroundColor: '#ED2525',
        borderRadius: 50,
        transform: [{ scaleX: 2 }],
    },
    SquareShapeView: {
        //To make Square Shape
        width: 100,
        height: 100,
        backgroundColor: '#14ff5f',
    },
    RectangleShapeView: {
        //To make Rectangle Shape
        marginTop: 20,
        width: 120 * 2,
        height: 120,
        backgroundColor: '#14ff5f',
    },
    TriangleShapeView: {
        //To make Triangle Shape
        width: 0,
        height: 0,
        borderLeftWidth: 60,
        borderRightWidth: 60,
        borderBottomWidth: 120,
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#606070',
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
        alignItems: "center"
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
        justifyContent: "space-around"
    },
    boxContainer: {
        alignItems: 'center',
        backgroundColor: '#ffffff',
        borderColor: '#2222221a',
        borderRadius: 20,
        borderWidth: 1,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        padding: 16,
        position: 'relative',
        width: 150,
        gap: 16,
        shadowColor: "#ff2e2e",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
    },
    iconGroup: {
        height: 40,
        position: 'relative',
        width: 40,
    },
    iconOverlapGroup: {
        borderRadius: 20,
        height: 40,
        position: 'relative',
        justifyContent: "center",
        alignItems: "center"
    },
    ellipse: {
        backgroundColor: '#e6492d',
        borderRadius: 20,
        height: 40,
        opacity: 0.08,
        position: 'absolute',
        top: 0,
        left: 0,
        width: 40,
    },
    boxImage: {
        height: 24,
        position: 'absolute',
        top: 8,
        left: 8,
        width: 24,
    },
    boxInfoVertical: {
        alignItems: 'flex-start',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        position: 'relative',
    },
    boxInfoVerticalTitle: {
        color: '#222222',
        fontSize: 13,
        fontWeight: '400',
        letterSpacing: 0,
        lineHeight: 1,
        marginTop: -1,
        opacity: 0.4,
        position: 'relative',
    },
    boxInfoVerticalContent: {
        color: '#222222',
        // fontFamily: 'DM Sans-Bold',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0,
        // lineHeight: 'normal',
        position: 'relative',
    },

    // Outside title text
    sectionTitle: {
        display: "flex",
        flexDirection: "row",
        marginLeft: "6%",
        marginVertical: "2%",
        justifyContent: "space-between"
    },
});