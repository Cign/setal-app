import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableWithoutFeedback, Keyboard,
    KeyboardAvoidingView, Platform
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { Button, Form, Input, TextArea, XStack, YStack, Label, ToggleGroup } from 'tamagui'
import axios from "axios";
import { baseUrl } from '../Util/BaseUrl';
import { useAuth } from '../Util/AuthContext';
import SuccessModal from '../Util/SuccessModal';

const NewPrestationScreen = () => {
    const [email, setEmail] = useState('');
    const [article, setArticle] = useState('');
    const [category, setCategory] = useState('');
    const [typeLavage, setTypeLavage] = useState([]);
    const [montant, setMontant] = useState('');
    const [description, setDescription] = useState('');
    const [tel, setTel] = useState('');
    const [nom, setNom] = useState("");
    const [user, setUser] = useAuth();
    const [status, setStatus] = useState('off')
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

    const createAbonne = async () => {
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

    const clearText = () => {
        setEmail('');
        setCategory('');
        setTypeLavage([]);
        setImatriculation('');
        setMontant('');
        setTel('');
        setEncaissement('');
        setStatus('off');
        setNom('');
    }


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
            <View style={{ flex: 1, backgroundColor: "white" }}>
                <KeyboardAvoidingView>
                <SuccessModal visible={isModalVisible} onClose={() => setModalVisible(false)} />
                    <Form
                        alignItems="center"
                        minWidth={300}
                        gap="$2"
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
                            margin="$3"
                            padding="$2"
                        >
                            <XStack>
                                <Label width={80} htmlFor="name">
                                    Abonné
                                </Label>
                                <Input flex={1} size="$4" id="name" placeholder="Nom et Prénom de l'Abonné" value={nom} onChangeText={setNom} style={styles.shadowStyle} />
                            </XStack>
                            <XStack>
                                <Label width={80} htmlFor="tel">
                                    Tél.
                                </Label>
                                <Input flex={1} size="$4" id="tel" placeholder="Numéro de téléphone" value={tel} onChangeText={setTel} style={styles.shadowStyle} />
                            </XStack>
                            <XStack>
                                <Label width={80} htmlFor="email">
                                    Email
                                </Label>
                                <Input flex={1} size="$4" id="email" placeholder="Adresse email" value={email} onChangeText={setEmail} type={"email"} style={styles.shadowStyle} />
                            </XStack>
                            <XStack>
                                <Label width={80} htmlFor="article">
                                    Article
                                </Label>
                                <Input flex={1} size="$4" id="emaarticleil" placeholder="Article à nettoyer" value={article} onChangeText={setArticle} style={styles.shadowStyle} />
                            </XStack>
                            <XStack>
                                <Label width={80} htmlFor="montant">
                                    Montant
                                </Label>
                                <Input flex={1} size="$4" id="montant" placeholder="Montant Prestation" value={montant} type="number" onChangeText={setMontant} style={styles.shadowStyle} />
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
                                <Label width={80} htmlFor="desc">
                                    Description
                                </Label>
                                <TextArea placeholder="Décrire l'abonnement..." flex={1} size="$4" id="desc" value={description} onChangeText={setDescription} style={styles.shadowStyle} />
                            </XStack>
                        </YStack>
                        <Button size={"$4"} style={{ width: "80%" }} onPress={createAbonne}>Enregistrer</Button>
                    </Form>
                </KeyboardAvoidingView>
            </View>
        </TouchableWithoutFeedback>
    );
};

export default NewPrestationScreen;

// renderHeader = <SearchBar onChangetext={handleSearch}
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