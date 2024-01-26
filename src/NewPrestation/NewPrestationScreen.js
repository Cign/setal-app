import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import SInput from '../Components/SInput';
import DropdownList from '../Components/DropdownList';
import { TextInput } from 'react-native-element-textinput';
import FormHeading from '../Components/Heading';



const NewPrestationScreen = () => {
    const [selectedOption, setSelectedOption] = useState(null);
    const [value, setValue] = useState('');
    const [email, setEmail] = useState('');
    const [marque, setMarque] = useState('');
    const [category, setCategory] = useState('');
    const [typeLavage, setTypeLavage] = useState('');
    const [imatriculation, setImatriculation] = useState('');
    const [montant, setMontant] = useState('');
    const [modePaiement, setModePaiement] = useState('');
    const [tel, setTel] = useState('');

    const data = ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'];

    const handleSelect = (item) => {
        setSelectedOption(item);
    };

    const navigate = useNavigation();
    const [nom, setNom] = useState("")

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView style={styles.form}>
                {/* <FormHeading title="Nouvelle Prestation" /> */}
                <TextInput placeholder="Nom du Client" value={nom} inputStyle={styles.inputStyle}
                    labelStyle={styles.labelStyle}
                    placeholderStyle={styles.placeholderStyle}
                    textErrorStyle={styles.textErrorStyle} style={styles.input} />
                <TextInput placeholder="Numéro de Téléphone" label="Tel" value={tel} inputStyle={{ marginBottom: "2%" }} />
                <TextInput placeholder="Catégorie de Lavage" label="Catégorie" value={category} inputStyle={{ marginBottom: "2%" }} />
                <TextInput placeholder="Type de Lavage" label="Type" value={typeLavage} inputStyle={{ marginBottom: "2%" }} />
                <TextInput placeholder="Marque Véhicule" label="Marque" value={marque} inputStyle={{ marginBottom: "2%" }} />
                <TextInput placeholder="Immatriculation du Véhicule" label="Immatriculation" value={imatriculation} inputStyle={{ marginBottom: "2%" }} />
                <TextInput placeholder="Montant Prestation" label="Montant" value={montant} inputStyle={{ marginBottom: "2%" }} />
                <TextInput placeholder="Mode de Paiement" label="Paiement" value={modePaiement} inputStyle={{ marginBottom: "2%" }} />

            </ScrollView>

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
});