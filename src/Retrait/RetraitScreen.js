import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Platform
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { boxStyle } from '../Util/BaseStyles';
import { FlashList } from "@shopify/flash-list";
import ListCard from '../Components/ListCard';
import { Button, XGroup, XStack, YStack } from 'tamagui'
import { TextInput } from 'react-native-element-textinput';
import filter from "lodash.filter"

const PRESTA_LIST = [
    { name: "Ousmane Tall", price: "2500", image: "", onPress: "", type: "simple", payment: "Cash", category: "" },
    { name: "Mango Fall", price: "5000", image: "", onPress: "", type: "Complet", payment: "Impaye" },
    { name: "Bougah Jean", price: "2500", image: "", onPress: "", type: "simple", payment: "OM" },
    { name: "Alassane Niang", price: "2500", image: "", onPress: "", type: "simple", payment: "Wave" },
]

const RetraitScreen = () => {


    const navigation = useNavigation();
    const [data, setData] = useState(PRESTA_LIST);
    const [query, setQuery] = useState("");

    const handleSearch = (query) => {
        setQuery(query);
        const formattedQuery = query.toLowerCase();
        console.log("f query", formattedQuery)
        if(formattedQuery === "" || formattedQuery === " "){
            console.log("here ")
            setData(PRESTA_LIST);
            return
        }
        const filteredData = filter(data, (presta) => {
            return contains(presta, formattedQuery);
        })
        setData(filteredData);
    }

    const contains = ({name, price, payment}, query) => {
        if(name.toLowerCase().includes(query) || price.toLowerCase().includes(query) || payment.toLowerCase().includes(query)){
            console.log("hit")
            return true;
        }
        return false;
    }

    return (
        <LinearGradient
            style={styles.container}
            colors={["white", "white", "white"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}>

                {/* <View style={styles.sectionTitle}>
                    <Text style={{ color: "darkgrey" }}>Chiffres Abonnés</Text>
                </View> */}

                {/* <View style={styles.dayInfoContainer}>
                    <View style={[styles.boxContainer, { width: "90%" }]}>
                        <View style={styles.iconGroup}>
                            <View style={styles.iconOverlapGroup}>
                                <View style={styles.ellipse} />
                                <Entypo name="cross" color="orange" size={30} />
                            </View>
                        </View>
                        <View style={styles.boxInfoVertical}>
                            <Text style={styles.boxInfoVerticalTitle}>Total des </Text>
                            <Text style={styles.boxInfoVerticalContent}>110 200 F</Text>
                        </View>
                    </View>
                </View> */}

                <View style={[styles.sectionTitle, { marginTop: 16 }]}>
                    <Text style={{ color: "darkgrey" }}>A retirer:</Text>
                    <Text style={{ fontWeight: "bold", marginRight: "7%" }}> 5 tapis</Text>
                </View>

                <FlashList
                    ListHeaderComponent={<TextInput
                        value={query}
                        style={styles.input}
                        inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={styles.placeholderStyle}
                        textErrorStyle={styles.textErrorStyle}
                        label="Rechercher dans la liste"
                        placeholder="Rechercher par le nom, montant, ou type paiement"
                        placeholderTextColor="gray"
                        onChangeText={text => {
                            handleSearch(text);
                        }}
                    />}
                    data={data}
                    renderItem={(item) => <ListCard item={item} />}
                    estimatedItemSize={20}
                    contentContainerStyle={{ paddingHorizontal: 9.5, paddingBottom: 100 }}
                    // onEndReached={() => {
                    //     // Since FlatList is a pure component, data reference should change for a render
                    //     const elems = [...data];
                    //     elems.push(..._generateArray(elems.length, 6));
                    //     setData(elems)
                    // }}
                    onEndReachedThreshold={0.2}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

export default RetraitScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    pointsCount: {
        color: "white",
        fontSize: 12,

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
        justifyContent: "flex-end",
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
        fontFamily: 'DM Sans-Regular',
        fontSize: 13,
        fontWeight: '400',
        letterSpacing: 0,
        lineHeight: 'normal',
        marginTop: -1,
        opacity: 0.4,
        position: 'relative',
    },
    boxInfoVerticalContent: {
        color: '#222222',
        fontFamily: 'DM Sans-Bold',
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0,
        lineHeight: 'normal',
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

    input: {
        height: 50,
        paddingHorizontal: "6%",
        marginHorizontal: "3%",
        borderRadius: 20,
        backgroundColor: 'white',
        shadowColor: "#ff2e2e",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.17,
        shadowRadius: 3.05,
        elevation: 4
      },
      inputStyle: { fontSize: 16 },
      labelStyle: { fontSize: 14 },
      placeholderStyle: { fontSize: 16 },
      textErrorStyle: { fontSize: 16 },
});