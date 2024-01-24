import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    SafeAreaView
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';



const PrestationClientScreen = () => {

    const navigate = useNavigation();

    return (
        <LinearGradient
            style={styles.container}
            colors={["#ffffff", "#FF2E2E"]}
            start={{ x: 0.5, y: 1 }}
            end={{ x: 0.5, y: 0 }}
        >
            <SafeAreaView>
                <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => navigate.goBack()}>
                            <Entypo name="chevron-left" color="#000" size={30} />
                        </TouchableOpacity>
                        <Text style={styles.headerText}>PrestationClientScreen</Text>
                    </View>
                </View>
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
});