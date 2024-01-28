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
                                Abonné
                            </Label>
                            <Input flex={1} size="$4" id="name" placeholder="Nom et Prénom de l'Abonné" value={nom} onChange={setNom} style={styles.shadowStyle} />
                        </XStack>
                        <XStack>
                            <Label width={80} htmlFor="tel">
                                Tél.
                            </Label>
                            <Input flex={1} size="$4" id="tel" placeholder="Numéro de téléphone" value={tel} onChange={setTel} style={styles.shadowStyle} />
                        </XStack>

                        <XStack>
                            <Label width={80} htmlFor="email">
                                Email
                            </Label>
                            <Input flex={1} size="$4" id="email" placeholder="Adresse email" value={email} onChange={setEmail} type={"email"} style={styles.shadowStyle} />
                        </XStack>
                        <XStack>
                            <Label width={80} htmlFor="desc">
                                Description
                            </Label>
                            <TextArea placeholder="Décrire l'abonnement..." flex={1} size="$4" id="desc" value={email} onChange={setEmail}  style={styles.shadowStyle}  />
                        </XStack>
                    </YStack>
                    <Button disabled={false} size={"$4"} style={{width: "80%"}} onClick={() => { console.log("Real Button") }}>Enregistrer</Button>
                </Form>
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