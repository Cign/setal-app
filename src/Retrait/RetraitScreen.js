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
import { TextInput } from 'react-native-element-textinput';
import filter from "lodash.filter";
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../Util/AuthContext';
import axios from 'axios';
import { baseUrl } from '../Util/BaseUrl';
import SuccessModal from '../Util/SuccessModal';
import { XStack, YStack, Sheet, H5, Paragraph, Button } from 'tamagui'
import Colors from '../Util/static/Colors';

const RetraitScreen = () => {
    const navigation = useNavigation();
    const [data, setData] = useState({});
    const [ogData, setOgData] = useState({});
    const [countRetrait, setCountRetrait] = useState(0);
    const [query, setQuery] = useState("");
    const [position, setPosition] = useState(0)
    const [open, setOpen] = useState(false)
    const [modal, setModal] = useState(true)
    const [innerOpen, setInnerOpen] = useState(false)
    const [snapPointsMode, setSnapPointsMode] = useState('percent')
    const [mixedFitDemo, setMixedFitDemo] = useState(false)
    const [prestaToUpdate, setPrestaToUpdate] = useState({})
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [user, setUser] = useAuth();
    const snapPoints = [50]

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

    const contains = ({ attributes: { NomCompletClient, montant, Description } }, query) => {
        console.log("nomcomplet", Description)
        if (NomCompletClient?.toLowerCase().includes(query) || montant?.toLowerCase().includes(query) || Description?.toLowerCase().includes(query)) {
            console.log("hit")
            return true;
        }
        return false;
    }

    const openModal = (item) => {
        setPrestaToUpdate(item?.item)
        setOpen(true)
    }

    useFocusEffect(
        React.useCallback(() => {
            const getRetraits = async () => {
                try {
                    console.log('Trying hard', user);
                    const { data } = await axios.get(`${baseUrl}/api/prestations?populate=*&filters[aRetirer]=false`, {
                        headers: { Authorization: `Bearer ${user?.token}` },
                    });
                    console.log('Successfully got the prestas RETRAIT $$', data?.data);
                    setData(data?.data);
                    setOgData(data?.data);
                    setCountRetrait(data?.meta?.pagination?.total)
                } catch (err) {
                    console.error('Failed to get RETRAIT', err);
                }
            }
            getRetraits();
        }, [])
    );

    const confirmRetrait = async () => {
        // set the value at montant field on the coresponding prestation id
        try {
            const postData = {
                data: {
                    aRetirer: true,
                }
            };

            await axios.put(`${baseUrl}/api/prestations/${prestaToUpdate?.id}`, postData, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            console.log('Successfully UPDATED a new PRESTATION');
            setOpen(false);
            setIsModalVisible(true);
            setPrestaToUpdate({})
        } catch (err) {
            console.error('Failed to UPDATE PRESTA', err);
        }
    }

    return (
        <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}>
            <SuccessModal visible={isModalVisible} onClose={() => setIsModalVisible(false)} />
            <View style={[styles.sectionTitle, { marginTop: 16 }]}>
                <Text style={{ color: "darkgrey" }}>A retirer:</Text>
                <Text style={{ fontWeight: "bold", marginRight: "7%" }}> {countRetrait} tapis</Text>
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
                        onChangeText={text => {
                            handleSearch(text);
                        }}
                    />}
                data={data}
                renderItem={(item) => <ListCard item={item} onPressAction={() => openModal(item)} />}
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
                        <H5>Confirmer le retrait </H5>
                        <Paragraph>
                            Le client {prestaToUpdate?.attributes?.NomCompletClient} à retiré son tapis ?
                        </Paragraph>
                        <XStack >
                            <Button
                                size={"$3"}
                                style={{ marginRight: 6, marginVertical: 10 }}
                                focusStyle={{ outlineColor: Colors.baseColor }}
                                backgroundColor={Colors.background}
                                minWidth={90}
                                variant='outlined'
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
        </SafeAreaView>
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
        // fontFamily: 'DM Sans-Regular',
        fontSize: 13,
        fontWeight: '400',
        letterSpacing: 0,
        // lineHeight: 'normal',
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