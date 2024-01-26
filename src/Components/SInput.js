import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-element-textinput';

const SInput = ({
    value,
    onChangeText,
    placeholder,
    placeholderTextColor,
    secureTextEntry,
    inputStyle,
    labelStyle,
    placeholderStyle,
    textErrorStyle,
    label
}) => {
    const [isSecure, setIsSecure] = useState(secureTextEntry);

    return (
        <View>
            <TextInput
                value={value}
                style={[styles.input, inputStyle]}
                inputStyle={[styles.inputStyle, inputStyle]}
                labelStyle={[styles.labelStyle, labelStyle]}
                label={label}
                placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
                textErrorStyle={[styles.textErrorStyle, textErrorStyle]}
                placeholder={placeholder}
                placeholderTextColor={placeholderTextColor || 'gray'}
                onChangeText={onChangeText}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    input: {
        height: 55,
        paddingHorizontal: 12,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
        borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 10,
    width: '100%',
    padding: 16,
    },
    inputStyle: { fontSize: 16 },
    labelStyle: { fontSize: 14 },
    placeholderStyle: { fontSize: 16 },
    textErrorStyle: { fontSize: 16 },
    labelStyle: {
        fontSize: 14,
      },
});

export default SInput;
