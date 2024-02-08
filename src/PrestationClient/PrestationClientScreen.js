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
import { useFocusEffect } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { FlashList } from "@shopify/flash-list";
import ListCard from '../Components/ListCard';
import { YStack, Sheet, Label, Input, Button } from 'tamagui'
import { useAuth } from '../Util/AuthContext';
import { baseUrl } from '../Util/BaseUrl';
import axios from 'axios';
import Colors from '../Util/static/Colors';
import SuccessModal from '../Util/SuccessModal';

const PrestationClientScreen = () => {
    const [data, setData] = useState([]);
    const [dashboardData, setDashboardData] = useState({});
    const [countData, setCountData] = useState([]);
    const [montantDepense, setMontantDepense] = useState("");
    const [objetDepense, setObjetDepense] = useState("");
    const [position, setPosition] = useState(0)
    const [open, setOpen] = useState(false)
    const [modal, setModal] = useState(true)
    const [snapPointsMode, setSnapPointsMode] = useState('percent')
    const [user, setUser] = useAuth();
    const [isModalVisible, setModalVisible] = useState(false);
    const snapPoints = [50]

    const clearText = () => {
        setMontantDepense('');
        setObjetDepense('');
    }

    useFocusEffect(
        React.useCallback(() => {
            const getPrestationsListByUserId = async () => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const tomorrow = new Date(today);
                tomorrow.setDate(tomorrow.getDate() + 1);

                try {
                    console.log('Trying hard', user);
                    // #: $contains
                    // for today: /api/prestations?populate=*&filters[employe][id][$eqi]=1&filters[createdAt][$gte]=2024-02-05T00:00:00Z&filters[createdAt][$lte]=2024-02-06T00:00:00Z #&filters[date_gte]=${today.toISOString()}&filters[date_gte]=${tomorrow.toISOString()}
                    const { data } = await axios.get(`${baseUrl}/api/prestations?populate=*&filters[employe][id][$eqi]=${user?.id}`, {
                        headers: { Authorization: `Bearer ${user?.token}` },
                    });
                    console.log('Successfully got the prestas META$$', data?.meta);
                    setData(data?.data);
                    setCountData(data?.meta?.pagination?.total)
                } catch (err) {
                    console.error('Failed to get prestas', err);
                }
            }
            const getDashData = async () => {
                // /api/prestations/:id/todaysRecetteAndExpenses
                try {
                    console.log('Trying hard', user);
                    // #: $contains
                    // for today: /api/prestations?populate=*&filters[employe][id][$eqi]=1&filters[createdAt][$gte]=2024-02-05T00:00:00Z&filters[createdAt][$lte]=2024-02-06T00:00:00Z #&filters[date_gte]=${today.toISOString()}&filters[date_gte]=${tomorrow.toISOString()}
                    const { data } = await axios.get(`${baseUrl}/api/prestations/${user?.id}/todaysRecetteAndExpenses`, {
                        headers: { Authorization: `Bearer ${user?.token}` },
                    });
                    console.log('Successfully got DASH DATA', data);
                    setDashboardData(data)
                } catch (err) {
                    console.error('Failed to get prestas', err);
                }
            }
            getPrestationsListByUserId();
            getDashData();
        }, [])
    );

    const addDepense = async () => {
        try {
            const postData = {
                data: {
                    objet: objetDepense,
                    montant: montantDepense,
                    users_permissions_user: user?.id,
                }
            };

            await axios.post(`${baseUrl}/api/depenses`, postData, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            console.log('Successfully created a new DEPENSE');
            setModalVisible(true);
            clearText();
            setOpen(false)
        } catch (err) {
            console.error('Failed to CREATE DEPENSE', err);
        }
    }

    

    return (
        <LinearGradient
            style={styles.container}
            colors={["white", "white", "white"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flex: 1 }}>
                <SuccessModal visible={isModalVisible} onClose={() => setModalVisible(false)} />
                <View style={styles.header}>
                    {/* <Image style={styles.avatar} source={AppImages.userImage} /> */}
                    <View style={{ flex: 1, marginHorizontal: 8 }}>
                        <Text style={{ color: "darkgrey" }}>Bienvenu(e)</Text>
                        <Text style={styles.username}>{user?.username}</Text>
                    </View>

                    <TouchableOpacity
                        style={{ bottom: -8, }}
                        onPress={() => setUser(null)}
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
                        <Text style={{ marginRight: "7%", textDecorationLine: 'underline', color: Colors.baseColor }}>Ajouter dépense</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.dayInfoContainer}>
                    <View style={styles.boxContainer}>
                        <View style={styles.iconGroup}>
                            <View style={styles.iconOverlapGroup}>
                                <View style={styles.ellipse} />
                                <Entypo name="arrow-down" color={Colors.baseColor} size={30} />
                            </View>
                        </View>
                        <View style={styles.boxInfoVertical}>
                            <Text style={styles.boxInfoVerticalTitle}>Recettes</Text>
                            <Text style={styles.boxInfoVerticalContent}>{dashboardData?.todaysTotalRecettes}</Text>
                        </View>
                    </View>
                    <View style={styles.boxContainer}>
                        <View style={styles.iconGroup}>
                            <View style={styles.iconOverlapGroup}>
                                <View style={styles.ellipse} />
                                <Entypo name="arrow-up" color={Colors.baseColor} size={30} />
                            </View>
                        </View>
                        <View style={styles.boxInfoVertical}>
                            <Text style={styles.boxInfoVerticalTitle}>Dépenses</Text>
                            <Text style={styles.boxInfoVerticalContent}>{dashboardData?.todaysTotalDepenses}</Text>
                        </View>
                    </View>
                </View>

                <View style={[styles.sectionTitle, { marginTop: 16 }]}>
                    <Text style={{ color: "darkgrey" }}>Liste des Prestations du jour:</Text>
                    <Text style={{ fontWeight: "bold", marginRight: "7%" }}> {countData} Prestation(s)</Text>
                </View>

                <FlashList
                    data={data}
                    renderItem={(item) => <ListCard item={item} />}
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
                            <Label htmlFor="objet">
                                Objet:
                            </Label>
                            <Input size="$4" id="objet" placeholder="Objet de la Dépense" value={objetDepense} onChangeText={setObjetDepense} style={styles.shadowStyle} />
                            <Label htmlFor="objet">
                                Montant:
                            </Label>
                            <Input size="$4" id="montant" placeholder="Montant de la Dépense" value={montantDepense} onChangeText={setMontantDepense} style={styles.shadowStyle} />
                            <Button
                                title='Enregistrer'
                                backgroundColor={Colors.baseColor}
                                color={'#fff'}
                                style={{ marginTop: 10 }}
                                onPress={addDepense}
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

export default PrestationClientScreen;

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
        // lineHeight: 1,
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