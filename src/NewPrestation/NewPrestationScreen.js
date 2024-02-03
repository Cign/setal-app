import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableWithoutFeedback, Keyboard,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Util/AuthContext';
import { Button, Form, H4, Spinner, Input, SizeTokens, TextArea, XStack, YStack, Label, ToggleGroup, styled } from 'tamagui'
import Colors from '../Util/static/Colors';
import axios from "axios";
import { baseUrl } from '../Util/BaseUrl';
import SuccessModal from '../Util/SuccessModal';


const NewPrestationScreen = () => {

    const [user, setUser] = useAuth();
    const [email, setEmail] = useState('');
    const [marque, setMarque] = useState('');
    const [category, setCategory] = useState('');
    const [typeLavage, setTypeLavage] = useState([]);
    const [imatriculation, setImatriculation] = useState('');
    const [montant, setMontant] = useState('');
    const [modePaiement, setModePaiement] = useState('');
    const [tel, setTel] = useState('');
    const [encaissement, setEncaissement] = useState('');
    const [status, setStatus] = useState('off')
    const navigate = useNavigation();
    const [nom, setNom] = useState("")
    const [isModalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (status === 'submitting') {
            const timer = setTimeout(() => setStatus('off'), 2000)
            return () => {
                clearTimeout(timer)
            }
        }
        console.log("Categor ", category)
        console.log("Type la ", typeLavage)
    }, [status, category])

    const createPrestation = async () => {
        try {
            const postData = {
                data: {
                    NomCompletClient: nom,
                    tel: tel,
                    category_lavage: category,
                    type_lavage: typeLavage,
                    Description: marque,
                    montant: montant,
                    mode_paiement: modePaiement,
                    Versement: encaissement,
                    aPaye: !(modePaiement === 5),
                    employe: user?.id,
                }
            };

            if (category === 1) {
                postData.data.aReirer = false;
              } else {
                postData.data.aReirer = null;
              }

            console.log("DDAATTAA", encaissement)

            await axios.post(`${baseUrl}/api/prestations`, postData, {
                headers: { Authorization: `Bearer ${user?.token}` },
            });
            console.log('Successfully created a new PRESTATION');
            setModalVisible(true);
            clearText();

        } catch (err) {
            console.error('Failed to CREATE PRESTA', err);
        }
    }

    const clearText = () => {
        setEmail('');
        setMarque('');
        setCategory('');
        setTypeLavage([]);
        setImatriculation('');
        setMontant('');
        setModePaiement('');
        setTel('');
        setEncaissement('');
        setStatus('off');
        setNom('');
    }
    

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
            <View style={{ flex: 1, backgroundColor: "white" }}>
            <SuccessModal visible={isModalVisible} onClose={() => setModalVisible(false)} />
                <Form
                    alignItems="center"
                    minWidth={300}
                    gap="$1"
                    onSubmit={() => setStatus('submitting')}
                    borderRadius="$4"
                    backgroundColor="$background"
                    borderColor="$borderColor"
                    padding="$2"
                    style={{ backgroundColor: "white" }}
                >
                    {/* <H4>{status[0].toUpperCase() + status.slice(1)}</H4> */}
                    <YStack
                        width={300}
                        minHeight={250}
                        overflow="hidden"
                        space="$2"
                        margin="$1"
                        padding="$2"
                    >
                        <XStack>
                            <Label width={80} htmlFor="name">
                                Client
                            </Label>
                            <Input flex={1} size="$4" id="name" placeholder="Nom et Prénom du Client" value={nom} onChangeText={setNom} style={styles.shadowStyle} />
                        </XStack>
                        <XStack>
                            <Label width={80} htmlFor="tel">
                                Tél.
                            </Label>
                            <Input flex={1} size="$4" id="tel" placeholder="Numéro de téléphone" value={tel} onChangeText={setTel} style={styles.shadowStyle} />
                        </XStack>
                        <XStack>
                            <Label width={80} justifyContent="flex-end" size={"$4"} htmlFor={"cat"}>
                                {'Catégorie'}
                            </Label>

                            <ToggleGroup
                                orientation={"horizontal"}
                                id={"cat"}
                                type={"single"}
                                size={"$3"}
                                disableDeactivation={true}
                                onValueChange={setCategory}
                                style={styles.shadowStyle} >
                                <ToggleGroup.Item value={1} aria-label="Left aligned">
                                    <FontAwesome5 name="scroll" size={24} color="black" />
                                </ToggleGroup.Item>
                                <ToggleGroup.Item value={2} aria-label="Center aligned">
                                    <FontAwesome5 name="car" size={24} color="black" />
                                </ToggleGroup.Item>
                                <ToggleGroup.Item value={3} aria-label="Right aligned">
                                    <FontAwesome5 name="home" size={24} color="black" />
                                </ToggleGroup.Item>
                                <ToggleGroup.Item value={4} aria-label="Right aligned">
                                    <FontAwesome5 name="motorcycle" size={24} color="black" />
                                </ToggleGroup.Item>
                            </ToggleGroup>

                        </XStack>
                        <XStack>
                            <Label width={80} justifyContent="flex-end" size={"$4"} htmlFor={"type"}>
                                {'Type'}
                            </Label>
                            <ScrollView horizontal={true} bounces={true} directionalLockEnabled={true} style={{ padding: 2 }}>
                                <ToggleGroup
                                    orientation={"horizontal"}
                                    id={"id"}
                                    type={"multiple"}
                                    size={"$3"}
                                    onValueChange={setTypeLavage}
                                    style={styles.shadowStyle} >
                                    <ToggleGroup.Item value={1} aria-label="Left aligned">
                                        <Text>Simple</Text>
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item value={3} aria-label="Left aligned">
                                        <Text>Semi</Text>
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item value={2} aria-label="Center aligned">
                                        <Text>Complet</Text>
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item value={5} aria-label="Right aligned">
                                        <Text>Moteur</Text>
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item value={4} aria-label="Right aligned">
                                        <Text>Polissage</Text>
                                    </ToggleGroup.Item>
                                </ToggleGroup>
                            </ScrollView>
                        </XStack>
                        <XStack>
                            <Label width={80} htmlFor="marque">
                                Véhicule
                            </Label>
                            <Input flex={1} size="$4" id="marque" placeholder="Marque et Immatriculation" value={marque} onChangeText={setMarque} style={styles.shadowStyle} />
                        </XStack>
                        <XStack>
                            <Label width={80} htmlFor="montant">
                                Montant
                            </Label>
                            <Input flex={1} size="$4" id="montant" placeholder="Montant Prestation" value={montant} type="number" onChangeText={setMontant} style={styles.shadowStyle} />
                        </XStack>
                        <XStack>
                            <Label width={80} justifyContent="flex-end" size={"$4"} htmlFor={"pay"}>
                                {'Paiement'}
                            </Label>
                            <ScrollView horizontal={true} bounces={true} directionalLockEnabled={true} style={{ padding: 2 }}>
                                <ToggleGroup
                                    orientation={"horizontal"}
                                    id={"pay"}
                                    type={"single"}
                                    size={"$3"}
                                    disableDeactivation={true}
                                    onValueChange={setModePaiement}
                                    style={styles.shadowStyle}
                                >
                                    <ToggleGroup.Item value={1} aria-label="Left aligned" >
                                        <FontAwesome5 name="om" size={24} color="black" />
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item value={2} aria-label="Center aligned">
                                        <MaterialCommunityIcons name="penguin" size={24} color="black" />
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item value={3} aria-label="Right aligned">
                                        <FontAwesome5 name="money-bill" size={24} color="black" />
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item value={4} aria-label="Right aligned">
                                        <FontAwesome5 name="bitcoin" size={24} color="black" />
                                    </ToggleGroup.Item>
                                    <ToggleGroup.Item value={5} aria-label="Right aligned">
                                        <FontAwesome5 name="exclamation-triangle" size={24} color="black" />
                                    </ToggleGroup.Item>
                                </ToggleGroup>
                            </ScrollView>
                        </XStack>
                        <XStack>
                            <Label width={80} htmlFor="encaissement">
                                Encaissé
                            </Label>
                            <Input flex={1} size="$4" id="encaissement" placeholder="Somme encaissée" value={encaissement} type="number" onChangeText={setEncaissement} style={styles.shadowStyle} />
                        </XStack>
                    </YStack>
                    {/* <FormHeading title="Nouvelle Prestation" /> */}
                    {/* <TextInput placeholder="Nom du Client" value={nom} inputStyle={styles.inputStyle}
                        labelStyle={styles.labelStyle}
                        placeholderStyle={styles.placeholderStyle}
                        textErrorStyle={styles.textErrorStyle} style={styles.input} />
                    <TextInput placeholder="Numéro de Téléphone" label="Tel" value={tel} inputStyle={{ marginBottom: "2%" }} />
                    <TextInput placeholder="Catégorie de Lavage" label="Catégorie" value={category} inputStyle={{ marginBottom: "2%" }} />
                    <TextInput placeholder="Type de Lavage" label="Type" value={typeLavage} inputStyle={{ marginBottom: "2%" }} />
                    <TextInput placeholder="Marque Véhicule" label="Marque" value={marque} inputStyle={{ marginBottom: "2%" }} />
                    <TextInput placeholder="Immatriculation du Véhicule" label="Immatriculation" value={imatriculation} inputStyle={{ marginBottom: "2%" }} />
                    <TextInput placeholder="Montant Prestation" label="Montant" value={montant} inputStyle={{ marginBottom: "2%" }} />
                    <TextInput placeholder="Mode de Paiement" label="Paiement" value={modePaiement} inputStyle={{ marginBottom: "2%" }} /> */}
                    <Button size={"$4"} style={{ width: "80%" }} onPress={createPrestation} color={Colors.baseColor}>Enregistrer</Button>
                </Form>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default NewPrestationScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        flex: 1,
        gap: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 26,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    title: {
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 20,
        marginBottom: 4,
    },
    sub: {
        textAlign: 'center',
        color: 'black',
        fontSize: 14,
        width: '100%',
    },
    mb: {
        marginBottom: 1,
    },
    link: {
        color: 'rgb(23, 111, 211)',
    },
    avatar: {
        height: 50,
        width: 50,
        backgroundColor: 'rgb(23, 111, 211)',
        borderRadius: 25,
        alignSelf: 'center',
        padding: 6,
        cursor: 'pointer',
        shadowColor: '#000',
        shadowOffset: { width: 12.5, height: 12.5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    input: {
        height: 55,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    inputStyle: { fontSize: 16 },
    labelStyle: { fontSize: 14 },
    placeholderStyle: { fontSize: 16 },
    textErrorStyle: { fontSize: 16 },
    button: {
        marginTop: 12,
        backgroundColor: '#FF2E2E',
        borderRadius: 10,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        shadowRadius: 20,
        alignItems: "center"
    },
    buttonText: {
        color: '#fff',
        textTransform: 'uppercase',
        fontWeight: 'bold',
    },
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
    }
});