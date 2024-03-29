import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    SafeAreaView,
    Platform
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from "@shopify/flash-list";
import ListCardAbonne from '../Components/ListCardAbonne';
import { Button, XGroup, XStack, YStack } from 'tamagui'
import { TextInput } from 'react-native-element-textinput';
import filter from "lodash.filter"
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../Util/AuthContext';
import axios from 'axios';
import { baseUrl } from '../Util/BaseUrl';
import Colors from '../Util/static/Colors';


const AbonneScreen = () => {

    const navigation = useNavigation();
    const [data, setData] = useState([]);
    const [abonneCount, setAbonneCount] = useState(0);
    const [abonnePrestaCount, setAbonnePrestaCount] = useState(0);
    const [ogData, setOgData] = useState([]);
    const [query, setQuery] = useState("");
    const [user, setUser] = useAuth();

    const handleSearch = (query) => {
        setQuery(query);
        const formattedQuery = query.toLowerCase();
        console.log("f query", formattedQuery)
        if (formattedQuery === "" || formattedQuery === " ") {
            console.log("here ")
            setData(ogData);
            return
        }
        const filteredData = filter(data, (presta) => {
            return contains(presta, formattedQuery);
        })
        setData(filteredData);
    }

    const contains = ({ attributes: { NomComplet, article, Tel } }, query) => {
        if (NomComplet?.toLowerCase().includes(query) || article?.toLowerCase().includes(query) || Tel?.toLowerCase().includes(query)) {
            console.log("hit")
            return true;
        }
        return false;
    }

    useFocusEffect(
        React.useCallback(() => {
            const getAbonnes = async () => {
                try {
                    const { data } = await axios.get(`${baseUrl}/api/abonnes?populate=*`, {
                        headers: { Authorization: `Bearer ${user?.token}` },
                    });
                    console.log('Successfully got the prestas $$', data?.data);
                    setData(data?.data);
                    setOgData(data?.data);
                    setAbonneCount(data?.meta?.pagination?.total)
                } catch (err) {
                    console.error('Failed to get prestas', err);
                }
            }
            const getListPrestasAbonnesOfMonth = async () => {
                try {
                    const today = new Date();
                    const year = today.getFullYear();
                    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // Note: month is 0-indexed, so we add 1
                    const startOfMonth = `${year}-${month}-01T00:00:00.000Z`;

                    // To get the end of the month, we can use the start of the next month and subtract 1 millisecond
                    const nextMonth = month === '12' ? '01' : (parseInt(month) + 1).toString().padStart(2, '0');
                    const nextYear = month === '12' ? year + 1 : year;
                    const endOfMonth = `${nextYear}-${nextMonth}-01T00:00:00.000Z`;
                    console.log("month end ", endOfMonth)
                    const { data } = await axios.get(`${baseUrl}/api/prestation-abonnes?populate=*&filters[createdAt][$gt]=${startOfMonth}&filters[createdAt][$lte]=${endOfMonth}`, {
                        headers: { Authorization: `Bearer ${user?.token}` },
                    });
                    console.log('Successfully got the prestas for ABONNE IN MONTH $$', data?.data);
                    setAbonnePrestaCount(data?.meta?.pagination?.total);
                } catch (err) {
                    console.error('Failed to get prestas for abonne MONTH', err);
                }
            }
            getAbonnes();
            getListPrestasAbonnesOfMonth();
        }, [])
    );

    return (
        <LinearGradient
            style={styles.container}
            colors={["white", "white", "white"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}>
                <View style={styles.header}>

                    <TouchableOpacity
                        style={{ bottom: -8, }}
                        onPress={() => navigation.navigate("NewAbonneScreen")}
                    >
                        <Text style={{ marginRight: "7%", textDecorationLine: 'underline', color: Colors.baseColor }}>Ajouter Abonné</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.sectionTitle}>
                    <Text style={{ color: "darkgrey" }}>Chiffres Abonnés</Text>
                    {/* <Text style={{ marginRight: "7%" }}>Ajouter dépense</Text> */}
                </View>

                <View style={styles.dayInfoContainer}>
                    <View style={[styles.boxContainer, { width: "57%" }]}>
                        <View style={styles.iconGroup}>
                            <View style={styles.iconOverlapGroup}>
                                <View style={styles.ellipse} />
                                <Entypo name="arrow-down" color={Colors.baseColor} size={30} />
                            </View>
                        </View>
                        <View style={styles.boxInfoVertical}>
                            <Text style={styles.boxInfoVerticalTitle}>Nombre de prestations abonnés du mois</Text>
                            <Text style={styles.boxInfoVerticalContent}>{abonnePrestaCount}</Text>
                        </View>
                    </View>
                    <View style={[styles.boxContainer, { width: "35%" }]}>
                        <View style={styles.iconGroup}>
                            <View style={styles.iconOverlapGroup}>
                                <View style={styles.ellipse} />
                                <Entypo name="arrow-up" color={Colors.baseColor} size={30} />
                            </View>
                        </View>
                        <View style={styles.boxInfoVertical}>
                            <Text style={styles.boxInfoVerticalTitle}>Nombre Abonnés</Text>
                            <Text style={styles.boxInfoVerticalContent}>{abonneCount}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.sectionTitle, { marginTop: 16 }]}>
                    <Text style={{ color: "darkgrey" }}>Liste des Abonnés:</Text>
                    {/* <Text style={{ fontWeight: "bold", marginRight: "7%" }}> 17 Abonnés</Text> */}
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
                    renderItem={(item) => <ListCardAbonne item={item} action={{ clickable: true, destination: "DetailsAbonneScreen" }} />}
                    estimatedItemSize={20}
                    contentContainerStyle={{ paddingHorizontal: 9.5, paddingBottom: 100 }}
                    onEndReachedThreshold={0.2}
                />
            </SafeAreaView>
        </LinearGradient>
    );
};

export default AbonneScreen;

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
        // fontFamily: 'DM Sans-Regular',
        fontSize: 13,
        fontWeight: '400',
        letterSpacing: 0,
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
        // lineHeight: 1,
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