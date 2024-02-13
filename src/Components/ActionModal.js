import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button } from "tamagui"
import Colors from '../Util/static/Colors';

const CustomModal = ({ isVisible, onClose, onConfirm, modalTitle, modalText }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>{modalTitle}</Text>
          <Text style={styles.modalText}>{modalText}</Text>
          <View style={styles.buttonContainer}>
            <Button
              size={"$3"}
              style={{ marginRight: 6, marginVertical: 10 }}
              focusStyle={{ outlineColor: Colors.baseColor }}
              backgroundColor={Colors.background}
              minWidth={90}
              variant='outlined'
              onPress={onClose}
            >
              Non
            </Button>
            <Button
              size={"$3"}
              color="#fff"
              onPress={onConfirm}
              backgroundColor={Colors.baseColor}
              style={{ marginVertical: 10, marginHorizontal: 6 }}
              minWidth={90}
            >
              Oui
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 15,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
}
);

export default CustomModal;
