import React from 'react';
import { Modal, StyleSheet, Text, View, Button } from 'react-native';

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
            <Button title="Annuler" onPress={onClose} />
            <Button title="Valider" onPress={onConfirm} />
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
    justifyContent: 'space-between',
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
});

export default CustomModal;
