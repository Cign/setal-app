import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    TouchableWithoutFeedback, Keyboard,
    KeyboardAvoidingView, Platform
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import SInput from '../Components/SInput';
import DropdownList from '../Components/DropdownList';
import { TextInput } from 'react-native-element-textinput';
import { Button, Form, H4, Spinner, Input, SizeTokens, TextArea, XStack, YStack, Label, ToggleGroup, styled } from 'tamagui'

const MyToggleGroupItem = styled(ToggleGroup.Item, {
    variants: {
      active: {
        true: {
          backgroundColor: 'red'
        },
      },
    },
  })


const NewPrestationScreen = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [value, setValue] = useState('');
    const [email, setEmail] = useState('');
    const [marque, setMarque] = useState('');
    const [category, setCategory] = useState('');
    const [typeLavage, setTypeLavage] = useState([]);
    const [imatriculation, setImatriculation] = useState('');
    const [montant, setMontant] = useState('');
    const [modePaiement, setModePaiement] = useState('');
    const [tel, setTel] = useState('');

    const [status, setStatus] = useState('off')

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

    const navigate = useNavigation();
    const [nom, setNom] = useState("")

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} >
            <View style={{ flex: 1, backgroundColor: "white" }}>
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
                                Client
                            </Label>
                            <Input flex={1} size="$4" id="name" placeholder="Nom et Prénom du Client" value={nom} onChange={setNom} style={styles.shadowStyle} />
                        </XStack>
                        <XStack>
                            <Label width={80} htmlFor="tel">
                                Tél.
                            </Label>
                            <Input flex={1} size="$4" id="tel" placeholder="Numéro de téléphone" value={tel} onChange={setTel} style={styles.shadowStyle} />
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
                                <MyToggleGroupItem  value="tapis" aria-label="Left aligned">
                                    <FontAwesome5 name="scroll" size={24} color="black" />
                                </MyToggleGroupItem>
                                <MyToggleGroupItem value="voiture" aria-label="Center aligned">
                                    <FontAwesome5 name="car" size={24} color="black" />
                                </MyToggleGroupItem>
                                <MyToggleGroupItem value="interieur" aria-label="Right aligned">
                                    <FontAwesome5 name="home" size={24} color="black" />
                                </MyToggleGroupItem>
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
                                    <MyToggleGroupItem value="simple" aria-label="Left aligned">
                                        <Text>Simple</Text>
                                    </MyToggleGroupItem>
                                    <MyToggleGroupItem value="semi" aria-label="Left aligned">
                                        <Text>Semi</Text>
                                    </MyToggleGroupItem>
                                    <MyToggleGroupItem value="complet" aria-label="Center aligned">
                                        <Text>Complet</Text>
                                    </MyToggleGroupItem>
                                    <MyToggleGroupItem value="moteur" aria-label="Right aligned">
                                        <Text>Moteur</Text>
                                    </MyToggleGroupItem>
                                </ToggleGroup>
                            </ScrollView>
                        </XStack>
                        <XStack>
                            <Label width={80} htmlFor="marque">
                                Véhicule
                            </Label>
                            <Input flex={1} size="$4" id="marque" placeholder="Marque et Immatriculation" value={marque} onChange={setMarque} style={styles.shadowStyle} />
                        </XStack>
                        <XStack>
                            <Label width={80} htmlFor="montant">
                                Montant
                            </Label>
                            <Input flex={1} size="$4" id="montant" placeholder="Montant Prestation" value={montant} type="number" onChange={setMontant} style={styles.shadowStyle} />
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
                                    <MyToggleGroupItem value="OM" aria-label="Left aligned"  style={{backgroundColor: "red"}}>
                                        <FontAwesome5 name="scroll" size={24} color="black" />
                                    </MyToggleGroupItem>
                                    <MyToggleGroupItem value="Wave" aria-label="Center aligned" active={true}>
                                        <MaterialCommunityIcons name="penguin" size={24} color="black" />
                                    </MyToggleGroupItem>
                                    <MyToggleGroupItem value="Cash" aria-label="Right aligned">
                                        <FontAwesome5 name="money-bill" size={24} color="black" />
                                    </MyToggleGroupItem>
                                    <MyToggleGroupItem value="Autre" aria-label="Right aligned">
                                        <FontAwesome5 name="bitcoin" size={24} color="black" />
                                    </MyToggleGroupItem>
                                    <MyToggleGroupItem value="Impayé" aria-label="Right aligned">
                                        <FontAwesome5 name="exclamation-triangle" size={24} color="black" />
                                    </MyToggleGroupItem>
                                </ToggleGroup>
                            </ScrollView>
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
                    <Button disabled={false} size={"$4"} style={{width: "80%"}} onClick={() => { console.log("Real Button") }}>Enregistrer</Button>
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