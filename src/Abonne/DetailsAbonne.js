import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Platform,
    Button,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { boxStyle } from '../Util/BaseStyles';
import { FlashList } from "@shopify/flash-list";
import ListCardPrestaAbonne from '../Components/ListCardPrestaAbonne';
import { XGroup, XStack, YStack, Sheet, Label, Input, AlertDialog } from 'tamagui'
import { TextInput } from 'react-native-element-textinput';
import filter from "lodash.filter"
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../Util/AuthContext';
import axios from 'axios';
import { baseUrl } from '../Util/BaseUrl';
import { useRoute } from '@react-navigation/native';

const DetailsAbonneScreen = () => {

    const navigation = useNavigation();
    const route = useRoute();
    const { item } = route.params;
    const [data, setData] = useState([]);
    const [ogData, setOgData] = useState([]);
    const [abonne, setAbonne] = useState();
    const [query, setQuery] = useState("");
    const [montant, setMontant] = useState('');
    const [user, setUser] = useAuth();

    const [position, setPosition] = useState(0)
    const [open, setOpen] = useState(false)
    const [modal, setModal] = useState(true)
    const [innerOpen, setInnerOpen] = useState(false)
    const [snapPointsMode, setSnapPointsMode] = useState('percent')
    const [mixedFitDemo, setMixedFitDemo] = useState(false)


    const snapPoints = [50, 25]

    const handleSearch = (query) => {
        setQuery(query);
        const formattedQuery = query.toLowerCase();
        console.log("f query", formattedQuery)
        if (formattedQuery === "" || formattedQuery === " ") {
            console.log("here ")
            setData();//set OG data
            return
        }
        const filteredData = filter(data, (presta) => {
            return contains(presta, formattedQuery);
        })
        setData(filteredData);
    }

    const contains = ({ name, price, payment }, query) => {
        if (name.toLowerCase().includes(query) || price.toLowerCase().includes(query) || payment.toLowerCase().includes(query)) {
            console.log("hit")
            return true;
        }
        return false;
    }

    const addVersement = async () => {
        try {
            const postData = {
                data: {
                    NomComplet: nom,
                    Tel: tel,
                    Email: email,
                    DescriptoionAbonement: description,
                    category_lavage: category,
                    type_lavage: typeLavage,
                    Description: description,
                    montant: montant,
                    article
                }
            };

            if (category === 1) {
                postData.data.aReirer = false;
            } else {
                postData.data.aReirer = null;
            }

            await axios.post(`${baseUrl}/api/abonnes`, postData, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            console.log('Successfully created a new ABONNE');
            setModalVisible(true);
            clearText();

        } catch (err) {
            console.error('Failed to CREATE ABONNE', err);
        }
    }

    useFocusEffect(
        React.useCallback(() => {
            console.log("item forcast", item)
            // const getAbonne = async () => {
            //     try {
            //         const { data } = await axios.get(`${baseUrl}/api/abonnes/${item?.id}?populate=*`, {
            //             headers: { Authorization: `Bearer ${user?.token}` },
            //         });
            //         console.log('Successfully getAboone $$', data?.data);
            //         setAbonne(data?.data);
            //     } catch (err) {
            //         console.error('Failed to get for this abonne', err);
            //     }
            // }

            const getListPrestasAbonnes = async () => {
                try {
                    const { data } = await axios.get(`${baseUrl}/api/prestation-abonnes?populate=*&filters[abonne][id][$eqi]=${item?.id}`, {
                        headers: { Authorization: `Bearer ${user?.token}` },
                    });
                    console.log('Successfully got the prestas for ABONNE $$', data?.data);
                    setData(data?.data);
                    setOgData(data?.data)
                } catch (err) {
                    console.error('Failed to get prestas for abonne', err);
                }
            }
            getListPrestasAbonnes();
        }, [])
    );



    return (
        <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}>
            <View style={styles.header}>
                {/* <Image style={styles.avatar} source={AppImages.userImage} /> */}
                <View style={{ flex: 1, marginHorizontal: 8 }}>
                    <YStack>
                        <View style={styles.dashTextBox}>
                            <Text style={{ color: "darkgrey" }}>Nom Abonné(e)</Text>
                            <Text style={styles.username}> {"Aloe"} {item?.attributes?.NomComplet}</Text>
                        </View>
                        <View >
                            <Text style={{ color: "darkgrey" }}>Catégorie Lavage</Text>
                            <Text style={styles.username}> {item?.attributes?.category_lavage?.data?.attributes?.name} </Text>
                        </View>
                    </YStack>
                </View>
                <View style={{ flex: 1, marginHorizontal: 8, alignItems: "flex-end" }}>
                    <YStack>
                        <View style={styles.dashTextBox}>
                            <Text style={{ color: "darkgrey" }}>Type Lavage</Text>
                            <Text style={styles.username}>{item?.attributes?.type_lavage?.data?.attributes?.title}</Text>
                        </View>
                        <View >
                            <Text style={{ color: "darkgrey" }}>Solde</Text>
                            <Text style={styles.username}> {item?.attributes?.solde} </Text>
                        </View>
                    </YStack>
                </View>

            </View>

            <View style={styles.sectionTitle}>
                <Text style={{ color: "darkgrey" }}>Details Abonnés</Text>
            </View>

            <View style={styles.dayInfoContainer}>
                <AlertDialog style={[{ margin: 9 }, styles.shadowStyle]} native>
                    <AlertDialog.Trigger asChild>
                        <XStack>
                            <View style={[styles.boxContainer]}>
                                <View style={styles.iconGroup}>
                                    <View style={styles.iconOverlapGroup}>
                                        <View style={styles.ellipse} />
                                        <Entypo name="plus" color="orange" size={30} />
                                    </View>
                                </View>
                                <View style={styles.boxInfoVertical}>
                                    <Text style={styles.boxInfoVerticalTitle}>Nouvelle Prestation</Text>
                                </View>
                            </View>
                        </XStack>
                    </AlertDialog.Trigger>

                    <AlertDialog.Portal>
                        <AlertDialog.Overlay
                            key="overlay"
                            animation="quick"
                            opacity={0.5}
                            enterStyle={{ opacity: 0 }}
                            exitStyle={{ opacity: 0 }}
                        />
                        <AlertDialog.Content
                            bordered
                            elevate
                            key="content"
                            animation={[
                                'quick',
                                {
                                    opacity: {
                                        overshootClamping: true,
                                    },
                                },
                            ]}
                            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
                            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
                            x={0}
                            scale={1}
                            opacity={1}
                            y={0}
                        >
                            <YStack space>
                                <AlertDialog.Title>Confirmez vous la prestation?</AlertDialog.Title>
                                <AlertDialog.Description>
                                    En validant vous confirmez une nouvelle prestation pour l'abonné Aloe Black Aujourd'hui
                                </AlertDialog.Description>

                                <XStack space="$3" justifyContent="flex-end">
                                    <AlertDialog.Cancel asChild>
                                        <Button title="Annuler">Annuler</Button>
                                    </AlertDialog.Cancel>
                                    <AlertDialog.Action asChild>
                                        <Button theme="active" title="Valider">Valider</Button>
                                    </AlertDialog.Action>
                                </XStack>
                            </YStack>
                        </AlertDialog.Content>
                    </AlertDialog.Portal>
                </AlertDialog>
                <TouchableOpacity onPress={() => setOpen(true)}>
                    <View style={[styles.boxContainer]}>
                        <View style={styles.iconGroup}>
                            <View style={styles.iconOverlapGroup}>
                                <View style={styles.ellipse} />
                                <FontAwesome5 name="hand-holding-usd" size={24} color="black" />
                            </View>
                        </View>
                        <View style={styles.boxInfoVertical}>
                            <Text style={styles.boxInfoVerticalTitle}>Versement</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View style={[styles.sectionTitle, { marginTop: 16 }]}>
                <Text style={{ color: "darkgrey" }}>Liste des Prestations du Mois:</Text>
                <Text style={{ fontWeight: "bold", marginRight: "7%" }}> 15 Prestations</Text>
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
                    <YStack>
                        <Label htmlFor="montant">
                            Montant du Versement
                        </Label>
                        <Input size="$4" id="montant" placeholder="Montant" value={montant} onChange={setMontant} style={styles.shadowStyle} />
                        <Button
                            title='Enregistrer'
                            color="#ff2e2e"

                        />
                    </YStack>
                </Sheet.Frame>
            </Sheet>
        </SafeAreaView>
    );
};

export default DetailsAbonneScreen;

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
        lineHeight: 1,
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
    shadowStyle: {
        shadowColor: "#ff2e2e",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.17,
        shadowRadius: 2.05,
        elevation: 4,
        backgroundColor: "white"
    },
    dashTextBox: {
        paddingBottom: 5
    }
});